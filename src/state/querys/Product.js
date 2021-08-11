import { supabase } from "src/config/configSupabase";

const getProducts = (limit) =>
  supabase
    .from("Product")
    .select("*")
    .limit(limit * 5 + 1)
    .then((snapshot) => snapshot.data)
    .catch(console.error);

export { getProducts };
