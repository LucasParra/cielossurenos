import { supabase } from "src/config/configSupabase";

const getTechnicians = () =>
  supabase
    .from("User")
    .select("*")
    .eq("RolID", 1)
    .then((snapshot) => snapshot.data)
    .catch(console.error);

const createUser = (userData) =>
  supabase
    .from("User")
    .insert(userData)
    .then((snapshot) => snapshot.data[0].ID);

const createUserAddress = (userAddressData) =>
  supabase.from("UserAddress").insert(userAddressData);

const createUserProduct = (userProductData) =>
  supabase.from("UserProduct").insert(userProductData);

export { getTechnicians, createUser, createUserAddress, createUserProduct };
