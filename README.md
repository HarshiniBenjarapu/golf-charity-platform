# Golf Charity Subscription Platform (GCSP)

A premium, modern web platform built to manage golf charity subscriptions, digital score tracking, and automated charity prize draws. Designed with an elegant, emotion-driven dark-theme interface utilizing Tailwind CSS.

## 🚀 Tech Stack

- **Framework**: [Next.js (App Router)](https://nextjs.org/)
- **UI & Styling**: React, [Tailwind CSS](https://tailwindcss.com/)
- **Language**: TypeScript
- **Icons**: [Lucide React](https://lucide.dev/)
- **Database & Backend**: [Supabase](https://supabase.com/) (PostgreSQL)

---

## ⚙️ Environment Variables Setup

To run this project locally, you must connect it to a Supabase project. 

1. Create a new Supabase project at [database.new](https://database.new)
2. Go to **Settings > API** in your Supabase dashboard to retrieve your keys.
3. Create a `.env.local` file in the root of the project with the following keys:

```bash
# Public keys for client-side Supabase connections (Auth, simple reads)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# Secret Service Role Key for server-side logic (Bypasses Row Level Security)
# WARNING: NEVER expose this key to the browser!
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

4. Run the SQL initialization script located at `supabase/schema.sql` in your Supabase SQL Editor.

---

## 🎯 The 'Rolling 5' Score Logic

One of the core mechanics of the platform is that users can only retain a maximum of their **5 most recent scores**.

To keep the platform highly performant and secure, this limit is strictly enforced **at the database level**:
- We utilize a custom PostgreSQL **Trigger Function** (`enforce_max_scores_per_user`).
- Every time a new score is inserted into the `scores` table, the trigger fires automatically.
- It finds all scores belonging to that specific user, orders them by insertion date (`created_at DESC`), and instantly purges any score beyond the 5th index.
- *Fallback*: There is also an application-level enforcement written in `src/app/api/scores/route.ts` which manually queries and deletes old scores before insertion if the trigger is disabled for any reason.

---

## 💰 Prize Pool Allocation Rules

Prize pools are dynamically calculated at the end of every month:
- **Charity Minimum:** A baseline 10% (minimum) of the total monthly revenue goes directly to the selected charities.
- **Jackpot Tiers:** The remaining 90% (the Net Prize Pool) is allocated into draws:
  - **40%** to the `Match-5` Tier
  - **35%** to the `Match-4` Tier
  - **25%** to the `Match-3` Tier

---

## 💻 Running the App

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Visit `http://localhost:3000/dashboard` to view the Subscriber Interface.
4. Visit `http://localhost:3000/admin` to view the Admin Draw Management Interface.
