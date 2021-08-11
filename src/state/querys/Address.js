import { supabase } from "src/config/configSupabase";

const createAddress = (addressData) =>
  supabase
    .from("Address")
    .insert(addressData)
    .then((snapshot) => snapshot.data[0].ID);

export { createAddress };
