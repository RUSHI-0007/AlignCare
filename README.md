# Aligncare Rehab

Modern, dynamic web platform for physiotherapy and cancer rehab, built with Next.js App Router, Tailwind CSS, Supabase, and AI webhook integrations.

## Prerequisites

- Node.js 18+ 
- Supabase Project (PostgreSQL)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env.local` and fill in your Supabase variables.
4. Set up the database by running `src/core/db/schema.sql` in your Supabase SQL Editor.
5. Run the development server:
   ```bash
   npm run dev
   ```
6. Open [http://localhost:3000](http://localhost:3000)

## Features

- **Client App (`/`)**: 3D Animated cinematic hero, dynamic multi-step booking wizard with calendar and timezone selection.
- **Admin Dashboard (`/admin/dashboard`)**: Secure metrics view, timeline rendering, easy walk-in appointment additions, and patient records table.
- **AI Agent Webhook (`/api/webhooks/ai-agent`)**: Headless endpoint for AI assistants to query real-time availability and confirm bookings on behalf of users. Securely verified via `WEBHOOK_SECRET` HMAC SHA-256 signatures.

## Deployment

The application is configured for seamless deployment to Vercel. 
Environment variables required in Vercel settings:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `WEBHOOK_SECRET` (used for authenticating AI booking bots)
