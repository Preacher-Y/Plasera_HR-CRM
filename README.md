# Plasera HR - HR Management System

A clean, production-grade HR Management web application built as part of the Plasera Software Developer Intern technical assessment. It covers the full lifecycle of employee management, from onboarding to leave approvals, with a responsive UI and a real PostgreSQL backend.

**Live Demo:** [https://plasera-hr.netlify.app](https://plasera-hr.netlify.app)

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Deployment](#deployment)
- [Demo Credentials](#demo-credentials)
- [Assumptions](#assumptions)
- [Known Limitations](#known-limitations)
- [Future Improvements](#future-improvements)
- [AI Usage](#ai-usage)

---

## Project Overview

Plasera HR is a lightweight but complete HR Management System designed for small-to-medium organizations. It gives HR administrators a single place to manage their workforce, adding employees, organizing departments, tracking leave requests, and monitoring organization-level activity from a central dashboard.

The goal was not to build a feature-rich enterprise platform, but to build something genuinely useful, well-designed, and maintainable. Every feature is complete end-to-end: the UI is polished, the backend validates correctly, the database schema is relational and normalized, and the codebase is organized well enough that a new developer could navigate it without a guide.

---

## Features

### Dashboard
- KPI cards: total employees, active employees, employees on leave, total departments, pending leave requests
- Department distribution bar chart (employee count per department)
- Leave status pie chart (approved / pending / rejected breakdown)
- Recent activity feed showing the latest system events

### Employee Management
- Paginated employee list with desktop table and mobile card views
- Search by name, email, or job title (server-side)
- Filter by department and employment status
- Create, view, edit, and delete employees
- Status lifecycle management: Active → Inactive → Terminated
- Prevents deletion of employees who are still managing subordinates
- Auto-generated employee ID on creation

### Employee Profile
- Detailed view: personal info, employment details, department, manager, and direct reports
- Employment history timeline (joined, promoted, transferred, deactivated, reactivated)
- Leave request history with status indicators

### Department Management
- View all departments as cards with employee count and department head
- Create, edit, and delete departments
- Assign a department head from existing employees
- Department detail page showing all members

### Leave Management
- Submit leave requests with type, date range, and reason
- Supported types: Annual, Sick, Personal, Maternity, Paternity, Unpaid, Other
- Overlap validation prevents conflicting leave requests
- Approve or reject requests with an optional reviewer comment
- Filter leave requests by status

### Search & Filtering
- Server-side search and filtering across employees and leave requests
- Filters persist through URL parameters

### Authentication
- Email and password login with bcrypt validation and a server-side pepper
- JWT stored in an httpOnly cookie (`__session`), 7-day expiry
- Protected routes redirect unauthenticated users to the login page
- Logout clears the session cookie

### Responsive Design
- Sidebar collapses to an overlay on mobile and docks on desktop
- Employee list switches between table (desktop) and card grid (mobile)
- All forms, modals, and detail pages are fully mobile-friendly

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, SSR) |
| Language | TypeScript 5 |
| Database | PostgreSQL via [Neon](https://neon.tech) (serverless) |
| ORM | Prisma 5 |
| Auth | Custom JWT (`jose`) + `bcryptjs` |
| UI Components | shadcn/ui |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| Charts | Recharts |
| Forms | React Hook Form + Zod |
| Notifications | Sonner (toast) |
| Fonts | Asul (headings), Montserrat (UI) |
| Deployment | Netlify |

---

## Project Structure

```
src/
├── app/
│   ├── (dashboard)/            # Protected route group
│   │   ├── dashboard/          # Overview page
│   │   ├── employees/          # List, new, [id], [id]/edit
│   │   ├── departments/        # List, new, [id]
│   │   ├── leave/              # List, new, [id]
│   │   └── layout.tsx          # Sidebar + header shell
│   ├── login/                  # Public login page
│   └── api/                    # API route handlers
│       ├── auth/               # login, logout
│       ├── employees/          # CRUD + status patch
│       ├── departments/        # CRUD
│       ├── leave/              # CRUD + approve/reject
│       └── dashboard/          # Aggregated stats
├── components/
│   ├── layout/                 # Sidebar, header, content-wrapper
│   ├── dashboard/              # KPI cards, charts, activity feed
│   ├── employees/              # Table, card, form, filters, profile sections
│   ├── departments/            # Department form, banner
│   ├── leave/                  # Leave form and list
│   └── ui/                     # Shared primitives (button, dialog, badge, etc.)
├── lib/
│   ├── auth/                   # JWT sign/verify, cookie helpers, requireAuth guard
│   ├── services/               # Business logic (employee, department, leave, dashboard)
│   ├── validations/            # Zod schemas
│   └── utils.ts                # Class merging utility
├── hooks/                      # Custom React hooks
├── types/                      # Shared TypeScript types
└── proxy.ts                    # Route protection (Next.js 16 — replaces middleware.ts)

prisma/
├── schema.prisma               # Database models
└── seed.ts                     # Sample data (40 employees, 7 departments, 10 leaves)
```

---

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm
- A [Neon](https://neon.tech) PostgreSQL database (free tier works)

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/plasera-hr.git
cd plasera-hr
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

See the [Environment Variables](#environment-variables) section for what each variable does.

### 4. Set up the database

Run migrations to create all tables:

```bash
npx prisma migrate deploy
```

Optionally, seed the database with sample data (40 employees, 7 departments, 10 leave requests):

```bash
npx prisma db seed
```

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You will be redirected to the login page.

---

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | Pooled Neon connection string (used by Prisma at runtime) | `postgresql://user:pass@host-pooler.region.aws.neon.tech/db?sslmode=require` |
| `DATABASE_URL_UNPOOLED` | Direct (unpooled) Neon connection string (used for migrations) | `postgresql://user:pass@host.region.aws.neon.tech/db?sslmode=require` |
| `JWT_SECRET` | Secret key used to sign and verify JWT tokens — must be at least 32 characters | `a-long-random-string-here` |
| `BCRYPT_PEPPER` | A server-side string appended to all passwords before bcrypt hashing | `another-random-string` |

All four variables are required. The application will not start correctly without them.

---

## Database Setup

The database schema is managed by Prisma and contains six models:

| Model | Purpose |
|---|---|
| `User` | Authentication accounts (email, hashed password, role) |
| `Employee` | Core employee record with personal and employment details |
| `Department` | Organizational departments with an optional head |
| `LeaveRequest` | Employee leave requests with approval workflow |
| `EmploymentHistory` | Append-only log of employment events (joins, promotions, transfers) |
| `ActivityLog` | Audit trail of all significant actions in the system |

`Employee` and `Department` have a many-to-one relationship. `Employee` is self-referential for the manager hierarchy. `LeaveRequest` and `EmploymentHistory` are children of `Employee`.

To inspect your database schema visually:

```bash
npx prisma studio
```

---

## Deployment

The application is deployed on Netlify at [https://plasera-hr.netlify.app](https://plasera-hr.netlify.app).

To deploy your own instance on Netlify (the other supported platform):

1. Push the repository to GitHub
2. Import it in [Netlify](https://netlify.com)
3. Add the four environment variables in the Netlify project settings
4. Deploy — the build command (`npm run build`) runs `prisma generate` automatically before building Next.js

The database is hosted on Neon and is accessible from both local development and production without any additional configuration.

---

## Demo Credentials

The seed script creates accounts for all 40 employees. Any of them can be used to log in.

| Email | Password |
|---|---|
| `alice.johnson@company.com` | `ChangeMe123!` |
| `bob.smith@company.com` | `ChangeMe123!` |
| `carol.white@company.com` | `ChangeMe123!` |

All seeded accounts share the same default password: **`ChangeMe123!`**

The full list of employee emails is visible in the employee list after logging in, or in `prisma/seed.ts`.

---

## Assumptions

- **Single role for now.** The schema and JWT payload include a `role` field (ADMIN / VIEWER), but all authenticated users currently have full access. The infrastructure is in place to add role-based restrictions without schema changes.
- **No self-service portal.** The application is designed for HR administrators, not for employees to manage their own records. Leave requests can be submitted on behalf of any employee from the admin interface.
- **Soft deactivation, not hard delete.** Employees are never truly deleted unless explicitly removed — they can be set to Inactive or Terminated. Deletion is blocked if the employee is still listed as a manager.
- **Avatar initials instead of photo uploads.** Employee avatars are generated from initials rather than requiring file uploads, which avoids the need for object storage in a prototype context.
- **Netlify over Vercel.** The brief recommends Vercel, but Netlify was used for deployment. Both platforms work identically for Next.js applications. this is a personal preference

---

## Known Limitations

- **No email notifications.** Leave approvals and rejections are visible in the UI but do not trigger email alerts to the employee.
- **No file attachments.** Leave requests and employee profiles do not support document uploads (e.g., medical certificates).
- **Basic search only.** Search is a `contains` query on name, email, and job title. There is no fuzzy matching or ranked relevance.
- **Single tenant.** The system is designed for a single organization. There is no multi-tenancy or organization isolation.

---

## Future Improvements

Given more time, the next priorities would be:


1. **Email notifications** : notify employees when their leave request status changes
2. **Leave balance tracking** : track entitlements per employee and deduct automatically on approval
3. **Payroll overview** : add salary fields and a basic payroll summary module
4. **Employee photo uploads** : integrate object storage (e.g., Cloudflare R2) for profile images
5. **Reporting & exports** : CSV/PDF exports for employee lists and leave reports
6. **Audit log UI** : expose the existing `ActivityLog` table as a filterable admin view
7. **Advanced analytics** : headcount trends over time, leave frequency by department, turnover rate
8. **Onboarding checklist** : structured onboarding task list when adding a new employee
9. **SSO / OAuth** : add Google or Microsoft sign-in for organizations already using those identity providers

---

## AI Usage

Claude (Anthropic) was used extensively throughout the development of this project as a development assistant. Here is an honest account of how it was used and how the output was handled:

**What AI was used for:**
- Scaffolding the initial Next.js project structure and Prisma schema based on the requirements
- Generating boilerplate for API route handlers and service functions
- Writing Zod validation schemas aligned to the Prisma models
- Designing the Tailwind CSS theme and component layout structure
- Generating the seed data (employee names, departments, leave requests)
- Debugging TypeScript type errors and Prisma query issues
- Drafting this README

**How the output was validated:**
- Every generated component and API route was reviewed, tested, and often rewritten to fix logic errors or align with the actual data model
- The authentication implementation (JWT signing, bcrypt pepper logic, cookie management) was written with close attention to security best practices and verified line by line
- The Prisma schema was designed collaboratively and iteratively — the AI suggested a starting point, but the final model reflects decisions made after understanding the relational requirements
- All features were manually tested in the browser before being considered complete

The final codebase reflects understanding of the choices made. The architecture, data model, and implementation approach can be explained and defended in full.
