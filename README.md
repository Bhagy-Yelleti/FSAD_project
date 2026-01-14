## 🚀Placement Interaction System
FSAD-PS14 | Full Stack Application Development Project

A modern, full-stack, role-based web application designed to manage and track college placement records efficiently.
Built with a clean architecture, Docker-first portability, and a cute, modern UI (not your average boring CRUD app).

## 📌 About the Project

The Placement Interaction System is a centralized platform that connects students, employers, placement officers, and administrators to streamline the placement process.

It allows:

Employers to post jobs

Students to apply and track application status

Placement officers to monitor placement progress

Admins to manage users and view analytics

This project is developed as part of the FSAD (Full Stack Application Development) Software Development Project.

## 🎯 Problem Statement

Traditional placement management systems rely heavily on manual processes, spreadsheets, and fragmented communication, which leads to inefficiency and lack of transparency.

This system provides a digital, role-based, and scalable solution to manage placements effectively.

## 🧠 Objectives

Automate the placement workflow

Enable transparent job application tracking

Provide role-based access control

Maintain structured placement records

Ensure portability and easy deployment

Deliver a clean and user-friendly interface

## 👥 User Roles & Functionalities
## 🔑 Admin

Manage all users

Approve or block employers

View overall placement statistics

## 🎓 Student

Register and log in

Create and update profile

Upload resume

Browse job postings

Apply for jobs

Track application status
(Applied / Shortlisted / Selected / Rejected)

## 🏢 Employer

Register and log in

Post job openings

View applicants

Update application status

## 🧑‍💼 Placement Officer

Monitor student placements

View placement progress

Generate placement reports

## ✨ Key Features

🔐 Secure authentication using JWT

👤 Role-based access control (RBAC)

📄 Resume upload support

📊 Placement tracking dashboards

🎨 Modern, cute, and responsive UI

🗄️ Relational database design

🐳 Dockerized setup (run anywhere)

⚙️ Auto database migration and seeding

## 🎨 UI & UX Highlights

Soft pastel color palette

Rounded cards and buttons

Gradient headers and navigation

Status badges with colors

Smooth hover and transition animations

Clean layouts instead of cluttered tables

Responsive design for all devices

The UI is designed to look like a real startup product, not just an academic prototype.

## 🛠️ Tech Stack
## Frontend

React (Vite)

Tailwind CSS

shadcn/ui

Lucide Icons

Framer Motion

## Backend

Node.js

Express.js

Prisma ORM

## Database

PostgreSQL

Infrastructure

Docker

Docker Compose

Environment variables (.env)

## 🗂️ Project Structure
placement-system/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── Dockerfile
│   └── server.js
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── Dockerfile
│   └── index.html
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md

## 🗄️ Database Design (Overview)

## Main entities:

Users

Students

Employers

Jobs

Applications

## Relationships:

One user → one role

One employer → many jobs

One student → many applications

One job → many applications

Implemented using Prisma ORM with proper foreign keys and constraints.

## 🚀 Setup & Installation
## 🔧 Prerequisites

Docker

Docker Compose

No need to install Node.js or PostgreSQL manually.

## ▶️ Run the Application (ONE COMMAND)
docker-compose up


This command will:

Start the backend server

Start the frontend application

Start the PostgreSQL database

Run database migrations

Seed sample data

## 🌍 Portability Guarantee

✔️ Runs on Replit
✔️ Runs on local machine
✔️ Runs on any system with Docker

No environment-specific setup required.

## 🔐 Environment Variables

Create a .env file using .env.example:

DATABASE_URL=postgresql://user:password@db:5432/placement_db
JWT_SECRET=your_secret_key

## 🧪 Sample Data

The application seeds:

Sample users for each role

Sample job postings

Sample applications

This allows easy demo and testing.