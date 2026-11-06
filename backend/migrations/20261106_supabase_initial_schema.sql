BEGIN;

-- ==========================================
-- 1. USERS TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- 2. DEVELOPER PROFILES TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS developer_profiles (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,

    github_username VARCHAR(100),
    bio TEXT,

    headline VARCHAR(160),
    location VARCHAR(120),

    skills JSONB NOT NULL DEFAULT '[]'::jsonb,
    education JSONB NOT NULL DEFAULT '[]'::jsonb,

    links JSONB NOT NULL DEFAULT
        '{"github":null,"linkedin":null,"portfolio":null}'::jsonb,

    projects JSONB NOT NULL DEFAULT '[]'::jsonb,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_developer_profiles_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- ==========================================
-- 3. RESUMES TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS resumes (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL,

    file_url TEXT NOT NULL,
    original_filename VARCHAR(255),
    file_size BIGINT,
    extracted_text TEXT,

    analysis_score NUMERIC(5,2),

    analysis_latency_ms BIGINT,
    input_tokens BIGINT,
    output_tokens BIGINT,
    total_tokens BIGINT,

    estimated_cost_usd NUMERIC(12,8),
    analysis_model VARCHAR(100),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_resumes_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_resumes_analysis_score
        CHECK (
            analysis_score IS NULL
            OR analysis_score BETWEEN 0 AND 100
        )
);

-- ==========================================
-- 4. INTERVIEWS TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS interviews (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL,

    interview_type VARCHAR(50) NOT NULL,
    score NUMERIC(5,2),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_interviews_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_interviews_score
        CHECK (
            score IS NULL
            OR score BETWEEN 0 AND 100
        )
);

-- ==========================================
-- 5. INDEXES
-- ==========================================

CREATE INDEX IF NOT EXISTS idx_resumes_user_id
ON resumes(user_id);

CREATE INDEX IF NOT EXISTS idx_interviews_user_id
ON interviews(user_id);

CREATE INDEX IF NOT EXISTS idx_resumes_created_at
ON resumes(created_at DESC);

COMMIT;