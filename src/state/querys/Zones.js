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

const getAdminZone = (ZoneID) =>
  supabase
    .from("UserAddress")
    .select("User!inner(*),Address!inner(*)")
    .eq("User.RolID", 8)
    .eq("Address.AddressZoneID", ZoneID)
    .then((snapshot) => snapshot.data)
    .catch(console.error);

const getTechnicalZone = (ZoneID) =>
  supabase
    .from("UserAddress")
    .select("User!inner(*),Address!inner(*)")
    .eq("User.RolID", 1)
    .eq("Address.AddressZoneID", ZoneID)
    .then((snapshot) => snapshot.data)
    .catch(console.error);

const getAddressNames = (AddressName) =>
  supabase
    .from("UserAddress")
    .select("User!inner(*),Address!inner(*)")
    .eq("User.RolID", 2)
    .ilike("Address.AddressName", `%${AddressName}%`)
    .then((snapshot) => snapshot.data)
    .catch(console.error);

export {
  createZone,
  updateZone,
  getZones,
  getAdminZone,
  getTechnicalZone,
  getAddressNames,
};
