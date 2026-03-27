-- Custom Enums
CREATE TYPE subscription_status_enum AS ENUM ('active', 'inactive');
CREATE TYPE draw_status_enum AS ENUM ('simulated', 'published');

-- 3. Charities Table
CREATE TABLE public.charities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    total_raised NUMERIC DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 1. Profiles Table
-- NOTE: id references auth.users(id) from Supabase Auth
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    selected_charity_id UUID REFERENCES public.charities(id) ON DELETE SET NULL,
    subscription_status subscription_status_enum DEFAULT 'inactive',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 2. Scores Table
CREATE TABLE public.scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    score_value INTEGER CHECK (score_value >= 1 AND score_value <= 45) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 4. Draws Table
CREATE TABLE public.draws (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    month DATE NOT NULL, -- e.g. 2026-03-01 for March 2026
    winning_numbers INTEGER[] NOT NULL,
    status draw_status_enum DEFAULT 'simulated',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Trigger Function: Enforce max 5 scores per user
CREATE OR REPLACE FUNCTION enforce_max_scores_per_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Delete older scores for the specific user if they exceed 5 in total
    DELETE FROM public.scores
    WHERE user_id = NEW.user_id
      AND id NOT IN (
          SELECT id
          FROM public.scores
          WHERE user_id = NEW.user_id
          ORDER BY created_at DESC
          LIMIT 5
      );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach the trigger to the scores table
CREATE TRIGGER trg_limit_user_scores
    AFTER INSERT ON public.scores
    FOR EACH ROW
    EXECUTE FUNCTION enforce_max_scores_per_user();
