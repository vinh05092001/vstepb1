-- VSTEP B1 Training System Database Schema

CREATE TABLE Users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE Vocabulary (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    word TEXT NOT NULL,
    meaning TEXT NOT NULL,
    example_sentence TEXT,
    topic TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE UserVocabularyProgress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES Users(id) ON DELETE CASCADE,
    word_id UUID REFERENCES Vocabulary(id) ON DELETE CASCADE,
    review_count INT DEFAULT 0,
    difficulty TEXT, -- 'Easy', 'Medium', 'Hard'
    last_review_date TIMESTAMP WITH TIME ZONE,
    next_review_date TIMESTAMP WITH TIME ZONE,
    memory_score INT DEFAULT 0
);

CREATE TABLE SpeakingAttempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES Users(id) ON DELETE CASCADE,
    part INT CHECK (part IN (1, 2, 3)),
    question TEXT,
    transcript TEXT,
    score INT,
    feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE WritingAttempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES Users(id) ON DELETE CASCADE,
    prompt TEXT,
    essay TEXT,
    score INT,
    feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE DailyProgress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES Users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    speaking_done BOOLEAN DEFAULT FALSE,
    writing_done BOOLEAN DEFAULT FALSE,
    vocab_reviewed INT DEFAULT 0,
    streak INT DEFAULT 0,
    UNIQUE(user_id, date)
);
