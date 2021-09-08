const { supabase } = require("src/config/configSupabase");

const createTask = (taskData) =>
  supabase
    .from("Task")
    .insert(taskData)
    .then((snapshot) => snapshot.data[0].ID);

export { createTask };
