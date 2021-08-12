import { supabase } from "src/config/configSupabase";

const getTechnicians = () =>
  supabase
    .from("User")
    .select("*")
    .eq("RolID", 1)
    .then((snapshot) => snapshot.data)
    .catch(console.error);

const getUserByRut = (rut) =>
  supabase
    .from("User")
    .select("*")
    .eq("Rut", rut)
    .then((snapshot) => snapshot.data)
    .catch(console.error);

const createUser = (userData) =>
  supabase
    .from("User")
    .insert(userData)
    .then((snapshot) => snapshot.data[0].ID);

const createUserAddress = (userAddressData) =>
  supabase
    .from("UserAddress")
    .insert(userAddressData)
    .then((snapshot) => snapshot.data[0].ID);

const createUserProduct = (userProductData) =>
  supabase
    .from("UserProduct")
    .insert(userProductData)
    .then((snapshot) => snapshot.data[0].ID);

export {
  getTechnicians,
  createUser,
  createUserAddress,
  createUserProduct,
  getUserByRut,
};
