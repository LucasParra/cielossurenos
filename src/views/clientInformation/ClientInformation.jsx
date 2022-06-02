import React from "react";
import _ from "lodash";

import { Loading } from "src/components/atoms/loading";

import {
  ClientInformationTemplate,
  useClientInformationTemplate,
} from "src/components/templates/clientInformationTemplate";

const ClientInformation = () => {
  const { isLoading, tasks } = useClientInformationTemplate();

  if (!isLoading) return <Loading />;

  const tasksHistory = tasks
    .filter((task) => task.StateID === 2)
    .map((task) =>
      _.pick(
        {
          ...task,
          TypeID: task?.TypeID?.Name,
          StateID: "Finalizada",
        },
        ["ID", "DeadLine", "StateID", "TypeID"]
      )
    );
  const tasksProcess = _.groupBy(
    tasks.filter((task) => task.StateID === 1),
    "Priority"
  );

  return (
    <ClientInformationTemplate
      tasksHistory={tasksHistory}
      tasksProcess={tasksProcess}
    />
  );
};

export default ClientInformation;
