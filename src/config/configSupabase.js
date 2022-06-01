import { createClient } from "@supabase/supabase-js";
import env from "react-dotenv";

const supabaseUrl = "https://dmozfnxzbakyxnlzgqkm.supabase.co";
export const supabase = createClient(supabaseUrl, env.SUPABASE_KEY);
