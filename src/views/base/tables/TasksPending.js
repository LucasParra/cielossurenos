import React, { useEffect } from "react";
import { CCol, CRow, CSelect } from "@coreui/react";
import { supabase } from "src/config/configSupabase";
import _ from "lodash";
import { useKeySelector } from "src/hook/general";

import { useState } from "react";
import TasksTable from "src/components/Tables/TasksTable";
import { getTechnicalZone } from "src/state/querys/Zones";

const TaskPending = () => {
  const { user } = useKeySelector(["user"]);

  const [tasks, setTasks] = useState({});
  const [technicals, setTechnicals] = useState([]);
  const [filterTechnicalID, setFilterTechnicalID] = useState("");

  const taskEffect = () => {
    let fetchTask = supabase
      .from("Task")
      .select(
        "*,TypeID(Name,ID),AssignedID!inner(*),ClientID(*,Address:UserAddress!inner(AddressID(AddressName,AddressNumber)))"
      )
      .order("ID", { ascending: false })
      .or("StateID.eq.2,StateID.eq.3")
      .eq("AssignedID.RolID", 1);

    if (filterTechnicalID !== "")
      fetchTask.eq("AssignedID.ID", filterTechnicalID);

    fetchTask
      .then((snapshot) => setTasks(_.groupBy(snapshot.data, "Priority")))
      .catch(console.error);
  };
  const componentDidMount = () => {
    if (user?.ZoneID) {
      return getTechnicalZone(user?.ZoneID[0].AddressID.AddressZoneID).then(
        setTechnicals
      );
    }
  };
  useEffect(taskEffect, [filterTechnicalID]);
  useEffect(componentDidMount, []);
  return (
    <>
      <CRow style={{ marginBottom: 22 }}>
        <CCol xs="12" lg="2">
          <h6
            style={{
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            Filtrar por tecnico:
          </h6>
        </CCol>
        <CCol xs="12" lg="4">
          <CSelect
            name="select-technical"
            id="select-technical"
            size="sm"
            value={filterTechnicalID}
            onChange={({ target: { value } }) => setFilterTechnicalID(value)}
          >
            <option value="">Todos</option>
            {technicals.map(({ User }) => (
              <option
                value={User.ID}
              >{`${User.Names} ${User.LastName}`}</option>
            ))}
          </CSelect>
        </CCol>
      </CRow>
      <TasksTable tasks={tasks} taskEffect={componentDidMount} />
    </>
  );
};

export default TaskPending;
