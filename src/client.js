import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://vebqimlusmxpdlrmwrlz.supabase.co'
const supabaseKey = 'sb_publishable_IGZOx-plKDsDczkYjZbv4Q_YEbXuYfq'

export const supabase = createClient(supabaseUrl, supabaseKey)