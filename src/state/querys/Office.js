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

const createClientOffice = (UserID, OfficeID) =>
  supabase
    .from("OfficeUser")
    .insert({ OfficeID, UserID })
    .then((snapshot) => snapshot.data[0].ID);

const getOffices = (limit = 1) =>
  supabase
    .from("Office")
    .select("*")
    .limit(limit * 5 + 1)
    .then((snapshot) => snapshot.data);

const getOfficesToUserID = (UserID) =>
  supabase
    .from("OfficeUser")
    .select("*")
    .eq("UserID", UserID)
    .then((snapshot) => snapshot.data[0]?.OfficeID);

const deleteOffice = (ID) => supabase.from("Office").delete().match({ ID });

export {
  createOffice,
  updateOffice,
  createClientOffice,
  getOffices,
  updateOfficeToClient,
  getOfficesToUserID,
  deleteOffice,
};
