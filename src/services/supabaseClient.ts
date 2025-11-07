import { createClient } from '@supabase/supabase-js';

// These details are public and safe to use in a browser environment
// when you have Row Level Security enabled on your tables.
const supabaseUrl = 'https://kyoxcpyrqlbsychviulm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5b3hjcHlycWxic3ljaHZpdWxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MjU5NzYsImV4cCI6MjA3NzUwMTk3Nn0.dcBoQe3oyB8gUnUIf1ndz5NPgyV_YlLPq67A5SARlCQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
