# Arcer Registry & Credentialing Portal

A high-performance, automated platform for managing, verifying, and distributing secure student credentials and digital certificates. Built for scale, security, and instantaneous public verification.

[![Next.js](https://img.shields.io/badge/Built_with-Next.js_14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Powered_by-Supabase-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Styled_with-Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Security](https://img.shields.io/badge/Security-Enterprise_Grade-blue?style=for-the-badge&logo=security)](https://arcer.com)

---

## Architecture Overview

Arcer Registry is engineered to transform manual graduate logging into an automated, graphically driven credentialing engine. It serves two distinct ecosystems:

1.  **Public Verification Portal**: A fast, responsive directory where employers can instantly search for graduates, filter by specific academic cohorts (e.g., "Class of May 2024"), and verify digital certificates via mathematically generated QR Codes.
2.  **Administrative Command Center**: A secure, isolated dashboard allowing administrators to manage records, publish company-wide announcements, and trigger massive automated certificate generation pipelines.

## Core Capabilities

### Automated Certificate Engine

The platform features a built-in rendering pipeline capable of processing hundreds of students simultaneously.

- **Bulk CSV Ingestion**: Administrators can drag-and-drop a `.csv` matrix of student data. The system automatically provisions secure database records for the entire cohort.
- **On-the-fly Image Generation**: The system mathematically overlays each student's name, module trajectory, and unique QR code onto a master certificate template (`certificate-bg.png`).
- **Memory Zipping**: The platform captures high-resolution `.png` snapshots of every generated certificate and bundles them into a fully compressed `.zip` archive downloaded directly to the administrator's local machine.

### Modern Public Registry & Cohort Filtering

- Employers can utilize advanced URL-driven filtering mechanisms to search the registry by specific graduation **Years** and **Months**.
- QR codes scanned from printed certificates route directly to a visually polished Verification Portal (`/verify/[id]`), providing cryptographic assurance of a student's graduation status.
- The verification system establishes a "return flow" allowing employers to immediately discover other top-tier graduates from the newly verified student's exact cohort.

### Integrated Bulletin Board

- A local-first news feed directly built into the registry.
- Admins can construct rich-text announcements with responsive multi-image global galleries natively utilizing Supabase Storage Buckets.

---

## Security Infrastructure

Security and data integrity are the absolute foundation of the Arcer Registry. The system has been hardened against common web vulnerabilities and data scraping:

### 1. Zero-Trust Client Architecture

- **React Server Components (RSC)**: All database interactions (queries, inserts, verifications) are explicitly executed on the Node.js backend using Next.js 14 App Router.
- **Hidden Credentials**: Database keys and administrative logic **never ship to the browser**. An attacker utilizing "Inspect Element" or monitoring network payloads will only ever receive pre-rendered HTML fragments, rendering the database architecture completely invisible and un-hackable from the client side.

### 2. Route Protection & Interceptors

- The Administrative layout (`/admin/(dashboard)`) routes are protected by a strict Next.js Server middleware interceptor (`isAdmin()`). Any request lacking a cryptographically signed JSON Web Token (JWT) mapped to the `admin_users` table is immediately ejected before a single pixel is rendered.

### 3. Client-Side Rendering Sandbox

- The automated Certificate Generator deliberately utilizes the user's localized browser memory (RAM) to render the graphical `.png` certificates and bundle the `.zip` file. This prevents immense load on the primary server and ensures sensitive student data processing never crosses unnecessary network boundaries.

---

## Technical Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database & Auth**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS + `framer-motion`
- **UI Components**: Shadcn UI + Radix Primitives
- **Data Parsing**: PapaParse (CSV) + JSZip

---

> **Proprietary Notice**
> This repository and its accompanying graphic assets are the proprietary intellectual property of Arcer. Unauthorized duplication, distribution, or public mirroring of this codebase is strictly prohibited.
