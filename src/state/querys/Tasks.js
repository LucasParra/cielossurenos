const { supabase } = require("src/config/configSupabase");

const createTask = (taskData) =>
  supabase
    .from("Task")
    .insert(taskData)
    .then((snapshot) => snapshot.data[0].ID);

const getTypesTasks = () =>
  supabase
    .from("TaskType")
    .select("*")
    .then(({ data }) => data);

const getTaskByUserID = (UserID) =>
  supabase
    .from("Task")
    .select("*,TypeID(Name)")
    .order("ID", { ascending: true })
    .eq("ClientID", UserID)
    .then((snapshot) => snapshot.data)
    .catch(console.error);

const updateTask = (updateTask) =>
  supabase.from("Task").update(updateTask).eq("ID", updateTask.ID);

export { createTask, getTypesTasks, getTaskByUserID, updateTask };
