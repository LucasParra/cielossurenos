import _ from "lodash";
import { supabase } from "src/config/configSupabase";
import { createAddress, updateAddress } from "./Address";
import { createClientOffice, updateOfficeToClient } from "./Office";
import { createTask } from "./Tasks";
import { getTechnicalZone } from "./Zones";

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

const getUserByEmail = (email) =>
  supabase
    .from("User")
    .select("*,RolID(*),ZoneID:UserAddress(AddressID(AddressZoneID))")
    .eq("Email", email)
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
    .select("*,UserAddress!inner(Address(*,AddressZoneID(*)))")
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
    });
const getClients = (limit) =>
  supabase
    .from("User")
    .select("*")
    .eq("RolID", 2)
    .limit(limit * 5 + 1)
    .then(({ data }) => data)
    .catch(console.error);

const getUsersClients = (limit, value) =>
  supabase
    .from("User")
    .select("*")
    .eq("RolID", 2)
    .ilike("Rut", `%${value}%`)
    .limit(limit * 5 + 1)
    .then(({ data }) => data)
    .catch(console.error);

const getClientsCount = (stateID, nameState) =>
  supabase
    .from("User")
    .select("*", { count: "exact" })
    .eq("RolID", 2)
    .eq("StateID", stateID)
    .then(({ count }) => ({ count, name: nameState, stateID }))
    .catch(console.error);

const getClientsCountOffice = (officeID, stateID) =>
  supabase
    .from("OfficeUser")
    .select("User!inner(*),Office!inner(*)", { count: "exact" })
    .eq("User.RolID", 2)
    .eq("User.StateID", stateID)
    .eq("Office.ID", officeID)
    .then(({ count }) => count)
    .catch(console.error);

const createUserFinishTask = (user, products, address, officeID) => {
  createUser(user).then((newUserID) => {
    Promise.all([
      products.map((product) =>
        createUserProduct({ ...product, UserID: newUserID })
      ),
      createTask({
        TypeID: 1,
        AssignedID: user.TechnicianID,
        ClientID: newUserID,
      }),
      createClientOffice(newUserID, officeID),
      address.map((addres) => {
        createAddress(addres).then((newaddressID) => {
          createUserAddress({
            AddressID: newaddressID,
            UserID: newUserID,
          });
        });
      }),
    ]);
  });
};
const updateUserFinishTask = (user, products, address, officeID) =>
  updateUserID(user).then(() => {
    Promise.all([
      products.map((product) =>
        product.ID
          ? updateUserProduct({ ...product, UserID: user.ID })
          : createUserProduct({ ...product, UserID: user.ID })
      ),
      updateOfficeToClient(user.ID, officeID),
      address.map((addres) => {
        addres.ID
          ? updateAddress(addres).then((newaddressID) => {
              updateUserAddress({
                AddressID: newaddressID,
                UserID: user.ID,
              });
            })
          : createAddress(addres).then((newaddressID) => {
              createUserAddress({
                AddressID: newaddressID,
                UserID: user.ID,
              });
            });
      }),
    ]);
  });

const getUserBySearch = (textSearch, limit = 1) =>
  supabase
    .from("User")
    .select("*,Address(*)")
    .or(
      `Names.like.%${textSearch}%,LastName.like.%${textSearch}%,Rut.ilike.%${textSearch}%`
    )
    .eq("RolID", 2)
    .limit(limit * 5 + 1)
    .then((snapshot) => snapshot.data)
    .catch(console.error);

const unsubscribedProcessUser = (UserID, ZoneID) =>
  getTechnicalZone(ZoneID).then((result) => {
    const technical = result[_.random(0, result.length - 1)];
    updateUserID({ ID: UserID, StateID: 5 }).then(() => {
      createTask({
        TypeID: 16,
        AssignedID: technical.User.ID,
        ClientID: UserID,
        StateID: 3,
      });
    });
  });

const subscribedProcessUser = (UserID, ZoneID) =>
  getTechnicalZone(ZoneID).then((result) => {
    const technical = result[_.random(0, result.length - 1)];
    updateUserID({ ID: UserID, StateID: 6 }).then(() => {
      createTask({
        TypeID: 17,
        AssignedID: technical.User.ID,
        ClientID: UserID,
        StateID: 3,
      });
    });
  });

const getUserStates = () =>
  supabase
    .from("UserState")
    .select("*")
    .then((snapshot) => snapshot.data)
    .catch(console.error);

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
  getUserByEmail,
  getClientsCount,
  getClientsCountOffice,
  createUserFinishTask,
  updateUserFinishTask,
  getUsersClients,
  getUserBySearch,
  unsubscribedProcessUser,
  subscribedProcessUser,
  getUserStates,
};
