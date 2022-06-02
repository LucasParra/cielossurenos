import { useEffect, useState } from "react";

import { getTaskByUserID } from "src/state/querys/Tasks";

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

  return { useGetTaskByUserID };
};

export { useTask };
