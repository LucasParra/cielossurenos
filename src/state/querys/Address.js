import { supabase } from "src/config/configSupabase";

const createAddress = (addressData) =>
  supabase
    .from("Address")
    .insert(addressData)
    .then((snapshot) => snapshot.data[0].ID);

const updateAddress = (addressData) =>
  supabase.from("Address").update(addressData).eq("ID", addressData.ID);

const getAddressByUserID = (UserID) =>
  supabase
    .from("UserAddress")
    .select("*,Address (*)")
    .eq("UserID", UserID)
    .then((snapshot) => snapshot.data)
    .catch(console.error);

export { createAddress, getAddressByUserID, updateAddress };
