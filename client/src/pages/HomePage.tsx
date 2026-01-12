import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Users, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50">
      {/* Navbar */}
      <nav className="p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-display font-bold gradient-text">CampusPlace</div>
          <div className="space-x-4">
            <Link href="/auth">
              <Button variant="ghost" className="text-slate-600 hover:text-indigo-600">Login</Button>
            </Link>
            <Link href="/auth">
              <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold mb-6">
              #1 Campus Placement Platform
            </div>
            <h1 className="text-5xl lg:text-7xl font-display font-bold text-slate-900 leading-tight mb-6">
              Launch your <span className="gradient-text">career</span> straight from campus.
            </h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Connect with top employers, manage applications, and land your dream job. 
              The all-in-one placement management system for modern universities.
            </p>
            <div className="flex gap-4">
              <Link href="/auth">
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 h-14 px-8 rounded-xl text-lg shadow-xl shadow-indigo-200">
                  I'm a Student
                </Button>
              </Link>
              <Link href="/auth">
                <Button size="lg" variant="outline" className="h-14 px-8 rounded-xl text-lg border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                  I'm an Employer
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -top-10 -right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            
            <div className="relative bg-white/60 backdrop-blur-xl border border-white/40 p-8 rounded-3xl shadow-2xl">
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm">
                  <div className="bg-green-100 p-3 rounded-xl">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">Application Accepted</h3>
                    <p className="text-sm text-slate-500">Your interview is scheduled for tomorrow</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm">
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <Briefcase className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">New Job Posted</h3>
                    <p className="text-sm text-slate-500">Senior React Developer at TechCorp</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm">
                  <div className="bg-pink-100 p-3 rounded-xl">
                    <Users className="w-6 h-6 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">500+ Students Placed</h3>
                    <p className="text-sm text-slate-500">Join our success stories today</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
