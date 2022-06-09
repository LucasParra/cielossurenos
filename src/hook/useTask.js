import { useEffect, useState } from "react";

import { getStateTask, getTaskByUserID } from "src/state/querys/Tasks";

const useTask = () => {
  const useGetTaskByUserID = (userID) => {
    const [task, setTask] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchAndSet = async () => {
        const tasksSupabase = await getTaskByUserID(userID);
        setTask(tasksSupabase);
        setLoading(false);
      };
      fetchAndSet();
    }, [userID]);
    return [task, loading];
  };

  const useGetTasksOfState = () => {
    const [task, setTask] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchAndSet = async () => {
        const tasksSupabase = await getStateTask();
        setTask(tasksSupabase);
        setLoading(false);
      };
      fetchAndSet();
    }, []);
    return [task, loading];
  };

  return { useGetTaskByUserID, useGetTasksOfState };
};

export { useTask };
