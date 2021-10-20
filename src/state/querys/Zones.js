const { supabase } = require("src/config/configSupabase");

const createZone = (data) =>
  supabase
    .from("Zones")
    .insert(data)
    .then((snapshot) => snapshot.data[0].ID);

const updateZone = (ID, data) =>
  supabase.from("Zones").update(data).eq("ID", ID);

const getZones = () =>
  supabase
    .from("Zones")
    .select("*")
    .then((snapshot) => snapshot.data)
    .catch(console.error);

export { createZone, updateZone, getZones };
