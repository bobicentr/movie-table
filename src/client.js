import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://vebqimlusmxpdlrmwrlz.supabase.co'
const supabaseKey = 'sb_publishable_IGZOx-plKDsDczkYjZbv4Q_YEbXuYfq' // <-- Проверь этот ключ (см. ниже)

// ВАЖНО: export делает переменную доступной для import в App.jsx
export const supabase = createClient(supabaseUrl, supabaseKey)