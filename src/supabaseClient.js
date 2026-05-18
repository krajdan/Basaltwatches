import { createClient } from '@supabase/supabase-js';

// Klistra in dina egna nycklar här från Supabase (Project Settings -> API)
const supabaseUrl = 'https://nugorixcdqzeppxtnykf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51Z29yaXhjZHF6ZXBweHRueWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwODk2OTIsImV4cCI6MjA5NDY2NTY5Mn0.MUCP_QmaRfpSHIY3rzc5ihq3LU9IjubLgbwriO6TG_I';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);