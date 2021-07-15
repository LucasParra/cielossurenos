import { createClient } from "@supabase/supabase-js";
import env from "react-dotenv";

export const supabase = createClient(
  "https://dmozfnxzbakyxnlzgqkm.supabase.co",
  env.supabaseKey
);
