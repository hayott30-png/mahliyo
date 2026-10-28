-- ====================================================================
-- TÜRKAI & MAHLİYO AI — SUPABASE POSTGRESQL MIGRATION
-- Migration: 001_initial_schema.sql
-- Description: Core tables, RLS policies, indexes, and triggers
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. User Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE, -- References auth.users(id) when Supabase Auth is enabled
    display_name TEXT NOT NULL DEFAULT 'Turk Tili O''rganuvchisi',
    native_language TEXT NOT NULL DEFAULT 'uz',
    current_cefr_level TEXT NOT NULL DEFAULT 'A1' CHECK (current_cefr_level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
    total_xp INTEGER NOT NULL DEFAULT 0,
    streak_days INTEGER NOT NULL DEFAULT 1,
    last_active_date DATE DEFAULT CURRENT_DATE,
    audio_speed NUMERIC(3, 2) NOT NULL DEFAULT 1.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 3. Lessons Table
CREATE TABLE IF NOT EXISTS public.lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cefr_level TEXT NOT NULL CHECK (cefr_level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
    unit_order INTEGER NOT NULL,
    title_uz TEXT NOT NULL,
    title_tr TEXT NOT NULL,
    description_uz TEXT NOT NULL,
    grammar_notes_uz TEXT NOT NULL,
    vocabulary_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    example_dialogues_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(cefr_level, unit_order)
);

-- 4. Exercises Table
CREATE TABLE IF NOT EXISTS public.exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    question_type TEXT NOT NULL CHECK (question_type IN ('multiple_choice', 'fill_blank', 'sentence_order', 'translation')),
    prompt_uz TEXT NOT NULL,
    context_tr TEXT,
    options_json JSONB, -- Array of strings for multiple choice
    correct_answer TEXT NOT NULL,
    explanation_uz TEXT,
    points INTEGER NOT NULL DEFAULT 10,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 5. Lesson Progress Table
CREATE TABLE IF NOT EXISTS public.lesson_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    is_completed BOOLEAN NOT NULL DEFAULT false,
    score_percentage INTEGER NOT NULL DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(profile_id, lesson_id)
);

-- 6. Speaking Attempts Table
CREATE TABLE IF NOT EXISTS public.speaking_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    cefr_level TEXT NOT NULL CHECK (cefr_level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
    prompt_tr TEXT NOT NULL,
    prompt_uz TEXT NOT NULL,
    transcript_text TEXT NOT NULL,
    accuracy_score INTEGER NOT NULL CHECK (accuracy_score BETWEEN 0 AND 100),
    grammar_score INTEGER NOT NULL CHECK (grammar_score BETWEEN 0 AND 100),
    vocabulary_score INTEGER NOT NULL CHECK (vocabulary_score BETWEEN 0 AND 100),
    fluency_score INTEGER NOT NULL CHECK (fluency_score BETWEEN 0 AND 100),
    overall_score INTEGER NOT NULL CHECK (overall_score BETWEEN 0 AND 100),
    suggested_correction TEXT,
    feedback_uz TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 7. Writing Attempts Table
CREATE TABLE IF NOT EXISTS public.writing_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    cefr_level TEXT NOT NULL CHECK (cefr_level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
    topic_title TEXT NOT NULL,
    submitted_text TEXT NOT NULL,
    word_count INTEGER NOT NULL DEFAULT 0,
    overall_score INTEGER NOT NULL CHECK (overall_score BETWEEN 0 AND 100),
    rubric_feedback JSONB NOT NULL DEFAULT '{}'::jsonb,
    grammar_corrections JSONB NOT NULL DEFAULT '[]'::jsonb,
    feedback_uz TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 8. Tutor Conversations Table (Mahliyo AI)
CREATE TABLE IF NOT EXISTS public.tutor_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    scenario_id TEXT NOT NULL DEFAULT 'general',
    scenario_title TEXT NOT NULL DEFAULT 'Umumiy Suhbat',
    cefr_level TEXT NOT NULL DEFAULT 'A1',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 9. Tutor Messages Table
CREATE TABLE IF NOT EXISTS public.tutor_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES public.tutor_conversations(id) ON DELETE CASCADE,
    sender TEXT NOT NULL CHECK (sender IN ('user', 'mahliyo')),
    text_tr TEXT NOT NULL,
    text_uz TEXT,
    encouragement TEXT,
    corrections JSONB DEFAULT '[]'::jsonb,
    detected_errors JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 10. Learner Error Patterns Table
CREATE TABLE IF NOT EXISTS public.learner_error_patterns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    error_category TEXT NOT NULL, -- e.g. 'vowel_harmony', 'case_endings', 'verb_conjugation'
    example_wrong TEXT NOT NULL,
    example_correct TEXT NOT NULL,
    occurrence_count INTEGER NOT NULL DEFAULT 1,
    last_detected_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    is_resolved BOOLEAN NOT NULL DEFAULT false
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_lessons_cefr ON public.lessons(cefr_level, unit_order);
CREATE INDEX IF NOT EXISTS idx_exercises_lesson ON public.exercises(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_profile ON public.lesson_progress(profile_id);
CREATE INDEX IF NOT EXISTS idx_speaking_attempts_profile ON public.speaking_attempts(profile_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_writing_attempts_profile ON public.writing_attempts(profile_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tutor_messages_conversation ON public.tutor_messages(conversation_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_learner_errors_profile ON public.learner_error_patterns(profile_id, error_category);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.speaking_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.writing_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutor_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutor_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learner_error_patterns ENABLE ROW LEVEL SECURITY;

-- Lessons and Exercises: Public read for all learners
CREATE POLICY "Lessons are viewable by all users" ON public.lessons
    FOR SELECT USING (is_published = true);

CREATE POLICY "Exercises are viewable by all users" ON public.exercises
    FOR SELECT USING (true);

-- User-specific tables: Only accessible by the profile owner
CREATE POLICY "Users can manage their own profile" ON public.profiles
    FOR ALL USING (auth.uid() = user_id OR auth.uid() IS NULL);

CREATE POLICY "Users can manage their lesson progress" ON public.lesson_progress
    FOR ALL USING (
        profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid() OR auth.uid() IS NULL)
    );

CREATE POLICY "Users can view their speaking attempts" ON public.speaking_attempts
    FOR ALL USING (
        profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid() OR auth.uid() IS NULL)
    );

CREATE POLICY "Users can view their writing attempts" ON public.writing_attempts
    FOR ALL USING (
        profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid() OR auth.uid() IS NULL)
    );

CREATE POLICY "Users can manage their tutor conversations" ON public.tutor_conversations
    FOR ALL USING (
        profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid() OR auth.uid() IS NULL)
    );

CREATE POLICY "Users can manage their tutor messages" ON public.tutor_messages
    FOR ALL USING (
        conversation_id IN (
            SELECT id FROM public.tutor_conversations
            WHERE profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid() OR auth.uid() IS NULL)
        )
    );

CREATE POLICY "Users can manage error patterns" ON public.learner_error_patterns
    FOR ALL USING (
        profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid() OR auth.uid() IS NULL)
    );
