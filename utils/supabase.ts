
import { createClient } from "@supabase/supabase-js";

// Credentials provided by the user
const supabaseUrl = "https://akmmxloinjgtghpzarcs.supabase.co";
const supabaseKey = "sb_publishable_rGVoByv1rlYLPhOrpTSxNA_sCTE3Q9O";

export const supabase = createClient(supabaseUrl, supabaseKey);
