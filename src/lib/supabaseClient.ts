import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wtfmcudjzwsjkdhzuaht.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0Zm1jdWRqendzamtkaHp1YWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5NzI3OTEsImV4cCI6MjA2NzU0ODc5MX0.KHIpz5FNeK8X6epDSAufgtsfM9SSiD8XWX3VrfsDd3M';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 