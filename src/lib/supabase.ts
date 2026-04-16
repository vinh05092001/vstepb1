import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Avoid throwing hard errors if not provided, just return a dummy proxy or nullish 
// so the UI can still run (even if DB calls fail) while waiting for the user to add keys.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

/*
Expected SQL Schema Reference:

CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  streak INT DEFAULT 0,
  last_active_date DATE,
  total_xp INT DEFAULT 0
);

CREATE TABLE speaking_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  part INT,
  score INT,
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE writing_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  type TEXT,
  score INT,
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE vocabulary_progress (
  user_id UUID REFERENCES profiles(id),
  word TEXT,
  status TEXT, -- 'learning', 'reviewing', 'mastered'
  next_review TIMESTAMP WITH TIME ZONE,
  PRIMARY KEY (user_id, word)
);
*/
