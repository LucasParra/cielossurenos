import { supabase } from "src/config/configSupabase";
import { createClientOffice } from "./Office";

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

const updateUserID = (userData) =>
  supabase.from("User").update(userData).eq("ID", userData.ID);

const updateUserAddress = (userAddressData) =>
  supabase
    .from("UserAddress")
    .update(userAddressData)
    .eq("ID", userAddressData.ID);

const updateUserProduct = (userProductData) =>
  supabase
    .from("UserProduct")
    .update(userProductData)
    .eq("ID", userProductData.ID);

const getUserByID = (ID) =>
  supabase
    .from("User")
    .select("*")
    .eq("ID", ID)
    .then((snapshot) => snapshot.data[0])
    .catch(console.error);

const queryUserToClient = () =>
  supabase
    .from("User")
    .select("*")
    .range(0, 1000)
    .is("RolID", null)
    .then((snapshot) => {
      console.log(snapshot.data);
      // snapshot.data.map((user) => {
      //   updateUserID({ ...user, RolID: 2 }).then((response) =>
      //     console.log(response)
      //   );
      // });
    });
const getClients = (limit) =>
  supabase
    .from("User")
    .select("*")
    .eq("RolID", 2)
    .limit(limit * 5 + 1)
    .then(({ data }) => data)
    .catch(console.error);

// const queryClientToOffice = () =>
//   supabase
//     .from("User")
//     .select("*")
//     .range(4001, 5000)
//     .eq("RolID", 2)
//     .then((snapshot) => {
//       // snapshot.data.map((user) =>
//       //   createClientOffice(user.ID).then(() => console.log("hola"))
//       // );
//     });

export {
  getTechnicians,
  createUser,
  createUserAddress,
  createUserProduct,
  getUserByRut,
  updateUserID,
  updateUserProduct,
  updateUserAddress,
  getUserByID,
  queryUserToClient,
  getClients,
  // queryClientToOffice,
};
