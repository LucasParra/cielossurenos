const { supabase } = require("src/config/configSupabase");

const createOffice = (data) =>
  supabase
    .from("Office")
    .insert(data)
    .then((snapshot) => snapshot.data[0].ID);

const updateOffice = (ID, data) =>
  supabase.from("Office").update(data).eq("ID", ID);

const updateOfficeToClient = (UserID, officeID) =>
  supabase
    .from("OfficeUser")
    .update({ OfficeID: officeID })
    .eq("UserID", UserID)
    .then((snapshot) => snapshot.data)
    .catch(console.error);

const createClientOffice = (UserID, officeID) =>
  supabase
    .from("OfficeUser")
    .insert({ OfficeID: officeID, UserID: UserID })
    .then((snapshot) => snapshot.data[0].ID);

const getOffices = () =>
  supabase
    .from("Office")
    .select("*")
    .then((snapshot) => snapshot.data);

const getOfficesToUserID = (UserID) =>
  supabase
    .from("OfficeUser")
    .select("*")
    .eq("UserID", UserID)
    .then((snapshot) => snapshot.data[0]?.OfficeID);

export {
  createOffice,
  updateOffice,
  createClientOffice,
  getOffices,
  updateOfficeToClient,
  getOfficesToUserID,
};
