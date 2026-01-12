import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import session from "express-session";
import MemoryStore from "memorystore";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePassword(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  const SessionStore = MemoryStore(session);
  app.use(
    session({
      secret: "placement-system-secret",
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 86400000 },
      store: new SessionStore({ checkPeriod: 86400000 }),
    })
  );

  // Authentication Middleware
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };

  // Auth Routes
  app.post(api.auth.register.path, async (req, res) => {
    try {
      const input = api.auth.register.input.parse(req.body);
      const existingUser = await storage.getUserByUsername(input.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const hashedPassword = await hashPassword(input.password);
      const user = await storage.createUser({
        ...input,
        password: hashedPassword,
      });

      // Create profile based on role
      if (input.role === "student" && input.studentDetails) {
        await storage.createStudent({
          ...input.studentDetails,
          userId: user.id,
        });
      } else if (input.role === "employer" && input.employerDetails) {
        await storage.createEmployer({
          ...input.employerDetails,
          userId: user.id,
        });
      }

      req.session.userId = user.id;
      res.status(201).json(user);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.auth.login.path, async (req, res) => {
    const input = api.auth.login.input.parse(req.body);
    const user = await storage.getUserByUsername(input.username);

    if (!user || !(await comparePassword(input.password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    req.session.userId = user.id;
    res.status(200).json(user);
  });

  app.post(api.auth.logout.path, (req, res) => {
    req.session.destroy(() => {
      res.status(200).json({ message: "Logged out" });
    });
  });

  app.get(api.auth.me.path, async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    res.json(user);
  });

  // Jobs Routes
  app.get(api.jobs.list.path, requireAuth, async (req, res) => {
    const jobs = await storage.getJobs();
    res.json(jobs);
  });

  app.post(api.jobs.create.path, requireAuth, async (req, res) => {
    const user = await storage.getUser(req.session.userId);
    if (user?.role !== "employer") {
      return res.status(403).json({ message: "Only employers can post jobs" });
    }
    
    const input = api.jobs.create.input.parse(req.body);
    const job = await storage.createJob({
      ...input,
      employerId: user.id,
    });
    res.status(201).json(job);
  });

  app.get(api.jobs.get.path, requireAuth, async (req, res) => {
    const job = await storage.getJob(Number(req.params.id));
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  });

  // Applications Routes
  app.get(api.applications.list.path, requireAuth, async (req, res) => {
    const user = await storage.getUser(req.session.userId);
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    if (user.role === "student") {
      const apps = await storage.getApplicationsByStudent(user.id);
      return res.json(apps);
    } else if (user.role === "employer") {
      const jobs = await storage.getJobsByEmployer(user.id);
      let allApps: any[] = [];
      for (const job of jobs) {
        const apps = await storage.getApplicationsByJob(job.id);
        allApps = [...allApps, ...apps];
      }
      return res.json(allApps);
    } else if (user.role === "admin" || user.role === "officer") {
      const apps = await storage.getAllApplications();
      return res.json(apps);
    }
    res.json([]);
  });

  app.post(api.applications.create.path, requireAuth, async (req, res) => {
    const user = await storage.getUser(req.session.userId);
    if (user?.role !== "student") {
      return res.status(403).json({ message: "Only students can apply" });
    }

    const input = api.applications.create.input.parse(req.body);
    // Check if already applied
    const existingApps = await storage.getApplicationsByStudent(user.id);
    const alreadyApplied = existingApps.find(a => a.jobId === input.jobId);
    if (alreadyApplied) {
        return res.status(400).json({ message: "Already applied to this job" });
    }

    const app = await storage.createApplication({
      jobId: input.jobId,
      studentId: user.id,
      status: "applied",
    });
    res.status(201).json(app);
  });

  app.patch(api.applications.updateStatus.path, requireAuth, async (req, res) => {
    const user = await storage.getUser(req.session.userId);
    if (!["employer", "admin", "officer"].includes(user?.role || "")) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const input = api.applications.updateStatus.input.parse(req.body);
    const updated = await storage.updateApplicationStatus(Number(req.params.id), input.status);
    res.json(updated);
  });

  // Stats
  app.get(api.stats.get.path, requireAuth, async (req, res) => {
    const user = await storage.getUser(req.session.userId);
    if (!["admin", "officer"].includes(user?.role || "")) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const stats = await storage.getStats();
    res.json(stats);
  });

  // Auto-seed function
  const seedDatabase = async () => {
    const admin = await storage.getUserByUsername("admin");
    if (!admin) {
      console.log("Seeding database...");
      const hashedPassword = await hashPassword("admin123");
      await storage.createUser({
        username: "admin",
        password: hashedPassword,
        role: "admin",
        name: "System Admin",
        email: "admin@college.edu",
      });
      
      const empPass = await hashPassword("emp123");
      const employer = await storage.createUser({
        username: "techcorp",
        password: empPass,
        role: "employer",
        name: "Tech Corp HR",
        email: "hr@techcorp.com",
      });
      await storage.createEmployer({
        userId: employer.id,
        companyName: "Tech Corp",
        industry: "Software",
        website: "https://techcorp.com",
        isApproved: true
      });

      const studentPass = await hashPassword("student123");
      const student = await storage.createUser({
        username: "alice",
        password: studentPass,
        role: "student",
        name: "Alice Smith",
        email: "alice@student.edu",
      });
      await storage.createStudent({
        userId: student.id,
        department: "Computer Science",
        cgpa: "3.8",
        graduationYear: 2024,
        resumeUrl: "https://example.com/resume.pdf"
      });

      const job = await storage.createJob({
        employerId: employer.id,
        title: "Junior React Developer",
        description: "We are looking for a junior developer with React skills.",
        requirements: "React, Node.js, TypeScript",
        location: "Remote",
        salary: "$60,000"
      });
      
      console.log("Database seeded!");
    }
  };

  // Run seed
  seedDatabase().catch(err => console.error("Error seeding database:", err));

  return httpServer;
}
