import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://saymwotjlpvoeihirauf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNheW13b3RqbHB2b2VpaGlyYXVmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxOTg2MTI1MywiZXhwIjoyMDM1NDM3MjUzfQ.rYDxXvLe1LqfLoem5bXmDUdkGqHucUO8WSIuShITJu0';

export const supabase = createClient(supabaseUrl, supabaseKey);
