import { useEffect, useState } from "react";
import _ from "lodash";

import { getTaskByUserID } from "src/state/querys/Tasks";

const useTask = () => {
  const useGetTaskByUserID = (userID) => {
    const [task, setTask] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchAndSet = async () => {
        const tasksSupabase = await getTaskByUserID(userID);
        setTask(
          tasksSupabase.map((task) =>
            _.pick(
              {
                ...task,
                TypeID: task?.TypeID?.Name,
                StateID: task.StateID === 2 ? "Finalizada" : "Proceso...",
              },
              ["ID", "DeadLine", "StateID", "TypeID"]
            )
          )
        );
        setLoading(false);
      };
      fetchAndSet();
    }, [userID]);
    return [task, loading];
  };

  return { useGetTaskByUserID };
};

export { useTask };
