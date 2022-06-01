const { supabase } = require("src/config/configSupabase");

const createRol = (data) =>
  supabase
    .from("Rol")
    .insert(data)
    .then((snapshot) => snapshot.data[0].ID);

const updateRol = (ID, data) => supabase.from("Rol").update(data).eq("ID", ID);

export { createRol, updateRol };
