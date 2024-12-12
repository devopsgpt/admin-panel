import { SUPABASE_ANON_KEY, SUPABASE_URL } from '@/config/global';
import { createClient } from '@supabase/supabase-js';

export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
