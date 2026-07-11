-- ============================================================
-- Dashboard: SRS (ôn tập ngắt quãng) + streak (chuỗi ngày học)
-- Cách chạy: psql -U <user> -d elearning -f 003_dashboard.sql
-- ============================================================

CREATE TABLE IF NOT EXISTS srs_state (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vocabulary_id INTEGER NOT NULL REFERENCES vocabulary(id) ON DELETE CASCADE,
    interval INTEGER NOT NULL DEFAULT 1,
    ef REAL NOT NULL DEFAULT 2.5,
    reps INTEGER NOT NULL DEFAULT 0,
    next_review TIMESTAMP NOT NULL DEFAULT NOW(),
    last_rating INTEGER,
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (user_id, vocabulary_id)
);
CREATE INDEX IF NOT EXISTS idx_srs_state_user_id ON srs_state(user_id);
CREATE INDEX IF NOT EXISTS idx_srs_state_next_review ON srs_state(next_review);


CREATE TABLE IF NOT EXISTS study_activity (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    activity_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (user_id, activity_date)
);
CREATE INDEX IF NOT EXISTS idx_study_activity_user_id ON study_activity(user_id);
