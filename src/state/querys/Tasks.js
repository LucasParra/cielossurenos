import { getAdminZone } from "./Zones";

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
    .order("ID", { ascending: false })
    .eq("ClientID", UserID)
    .then((snapshot) => snapshot.data)
    .catch(console.error);

const updateTask = (updateTask) =>
  supabase.from("Task").update(updateTask).eq("ID", updateTask.ID);

const getLastTaskByUserID = (UserID) =>
  supabase
    .from("Task")
    .select("*")
    .order("ID", { ascending: false })
    .eq("ClientID", UserID)
    .or("StateID.eq.1,StateID.eq.3,TypeID.eq.4")
    .then((snapshot) => snapshot.data)
    .catch(console.error);

const finishTaskPending = (TaskID) =>
  supabase
    .from("Task")
    .update({ StateID: 2 })
    .eq("ID", TaskID)
    .then((snapshot) => snapshot.data[0].ID);

const getTaskPending = () =>
  supabase
    .from("Task")
    .select("*, ClientID(*),TypeID(Name)")
    .eq("StateID", 1)
    .then((snapshot) => snapshot.data);

const createTaskforAdmin = (addressZoneID, task) =>
  getAdminZone(addressZoneID).then((response) =>
    createTask({ ...task, AssignedID: response[0].User.ID, StateID: 3 })
  );
export {
  createTask,
  getTypesTasks,
  getTaskByUserID,
  updateTask,
  getLastTaskByUserID,
  finishTaskPending,
  getTaskPending,
  createTaskforAdmin,
};
