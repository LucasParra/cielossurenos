const { supabase } = require("src/config/configSupabase");

const createCharge = (chargesData) =>
  supabase
    .from("Charge")
    .insert(chargesData)
    .then((snapshot) => snapshot.data)
    .catch(console.error);

const deleteCharge = (ID) =>
  supabase
    .from("Charge")
    .delete()
    .match({ ID })
    .then((snapshot) => snapshot.data);

const updateCharge = (chargesData, ID) =>
  supabase
    .from("Charge")
    .update(chargesData)
    .eq("ID", ID)
    .then((snapshot) => snapshot.data)
    .catch(console.error);

export { createCharge, deleteCharge, updateCharge };
