import { createClient } from "@supabase/supabase-js";
// import env from "react-dotenv";

const supabaseUrl = "https://dmozfnxzbakyxnlzgqkm.supabase.co";
export const supabase = createClient(
  supabaseUrl,
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyNjEyNDcxMywiZXhwIjoxOTQxNzAwNzEzfQ.lyRaKWSvbKhVZNHwN_kI93fGMoPnNZCE6d4Tsoz2hto"
);
