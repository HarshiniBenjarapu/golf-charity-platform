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
    prize_pool NUMERIC DEFAULT 0,
    match_5_pool NUMERIC DEFAULT 0,
    match_4_pool NUMERIC DEFAULT 0,
    match_3_pool NUMERIC DEFAULT 0,
    rollover_from_previous NUMERIC DEFAULT 0,
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

-- Enable RLS on all tables
ALTER TABLE public.charities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draws ENABLE ROW LEVEL SECURITY;

-- 1. Charities: Everyone can read
CREATE POLICY "Public charities are viewable by everyone" 
ON public.charities FOR SELECT USING (true);

-- 2. Profiles: Users can read/write their own
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 3. Scores: Users can read/write their own
CREATE POLICY "Users can view own scores" 
ON public.scores FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own scores" 
ON public.scores FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own scores" 
ON public.scores FOR DELETE USING (auth.uid() = user_id);

-- 4. Draws: Everyone can read published
CREATE POLICY "Published draws are viewable by everyone" 
ON public.draws FOR SELECT USING (status = 'published');

-- Profile Synchronization Trigger
-- This function creates a profile entry when a new user signs up in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- 5. Winners Table (for PRD verification flow)
CREATE TABLE public.winners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    draw_id UUID REFERENCES public.draws(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    match_type INTEGER CHECK (match_type IN (3, 4, 5)) NOT NULL,
    prize_amount NUMERIC NOT NULL,
    proof_url TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'paid')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

ALTER TABLE public.winners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own winnings" 
ON public.winners FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own winners proof" 
ON public.winners FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all winners" 
ON public.winners FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Add role to profiles if not exists
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';
