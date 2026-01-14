
import { createClient } from "@supabase/supabase-js";

// Supabase configuration using provided credentials
const supabaseUrl = "https://akmmxloinjgtghpzarcs.supabase.co";
// The long JWT is the actual 'anon' key used for client-side authentication
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrbW14bG9pbmpndGdocHphcmNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzNjQ5ODAsImV4cCI6MjA4Mzk0MDk4MH0.NJSD5MpRpmgtB38zberAq8SEN-v_-gJcQ4bcR1HGVV8";

export const supabase = createClient(supabaseUrl, supabaseKey);
