import { CCol } from "@coreui/react";
import React from "react";
import { Card } from "src/components/atoms/card";

import TasksTable from "src/components/Tables/TasksTable";

const TasksTableNew = (props) => {
  const { tasks } = props;
  return (
    <Card header="Tareas en proceso">
      <CCol>
        <TasksTable tasks={tasks} taskEffect={() => {}} />
      </CCol>
    </Card>
  );
};

export default TasksTableNew;
