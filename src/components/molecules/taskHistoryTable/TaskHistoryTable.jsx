import React from "react";
import { CDataTable } from "@coreui/react";

import { Card } from "src/components/atoms/card";

const fieldsTaskHistoryTable = [
  "ID",
  { key: "TypeID", label: "tipo" },
  { key: "StateID", label: "estado" },
  { key: "DeadLine", label: "fecha" },
];
const TaskHistoryTable = (props) => {
  const { tasks } = props;
  return (
    <Card header="Historial de tareas">
      <CDataTable
        items={tasks}
        fields={fieldsTaskHistoryTable}
        itemsPerPage={10}
        pagination
      />
    </Card>
  );
};

export default TaskHistoryTable;
