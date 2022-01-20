import React, { useEffect } from "react";
import { CRow } from "@coreui/react";
import { supabase } from "src/config/configSupabase";
import _ from "lodash";
import { useKeySelector } from "src/hook/general";

import { useState } from "react";
import TasksTable from "src/components/Tables/TasksTable";

const Tasks = () => {
  const { user } = useKeySelector(["user"]);

  const [tasks, setTasks] = useState({});

  const componentDidMount = () => {
    supabase
      .from("Task")
      .select(
        "*,TypeID(Name,ID),AssignedID(RolID),ClientID(*,Address:UserAddress!inner(AddressID(AddressName,AddressNumber)))"
      )
      .order("ID", { ascending: false })
      .or("StateID.eq.2,StateID.eq.3")
      .eq("AssignedID", user.ID)
      .then((snapshot) => {
        setTasks(_.groupBy(snapshot.data, "Priority"));
      })
      .catch(console.error);
  };

  useEffect(componentDidMount, []);
  return (
    <>
      <TasksTable tasks={tasks} taskEffect={componentDidMount} />
    </>
  );
};

export default Tasks;
