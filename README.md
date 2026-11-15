# Shiva Mobile Repairing — starter website + Android-ready web app

This is a starter project for a responsive Hindi/English repair-booking website. It can also be packaged as an Android app later (for example, with a trusted Capacitor build workflow). It is **not yet a deployed production service**.

## Requirements
- Node.js 20.9+
- A Supabase project

## Run locally
1. Install Node.js.
2. In this folder run `npm install`.
3. Copy `.env.example` to `.env.local`.
4. Add your Supabase Project URL and anon/public key to `.env.local`.
5. In Supabase SQL Editor, run `supabase/schema.sql`.
6. Run `npm run dev` and open `http://localhost:3000`.

Without Supabase environment values the form displays a setup message and does not save data.

## Important security and launch notes
- The SQL enables Row Level Security and only permits public INSERTs. Public visitors cannot read other customers' requests.
- Never put a Supabase `service_role` key in browser code or share it in chat.
- This starter does not yet include customer OTP login, dealer dashboard, admin dashboard, live order tracking, payment collection/verification, push notifications, or maps integration.
- UPI is currently a preference field only; it does not process or verify payments.
- Before launch, add a secure admin-only workflow and test RLS policies. Do not expose customer details in a public dashboard.
- Admin contact shown on the site: 8468837117. The phone number is contact information, not an authentication secret.

## Deploy
Deploy the Next.js project to a hosting provider such as Vercel, add the two `NEXT_PUBLIC_SUPABASE_*` environment variables, and connect a domain you own. Domain availability for `shivamobilerepairing.in` / `.com` has not been checked or purchased.
