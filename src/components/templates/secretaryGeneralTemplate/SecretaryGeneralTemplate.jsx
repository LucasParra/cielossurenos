import { CCardHeader } from "@coreui/react";
import React from "react";

import { useKeySelector } from "src/hook/general";
import { nameStateSpanish } from "src/utils";
import { GraphDoughnut } from "src/components/molecules/graphDoughnut";

const SecretaryGeneralTemplate = (props) => {
  const { tasks, clients } = props;

  const { colors } = useKeySelector(["colors"]);

  const TitleHeader = ({ label }) => (
    <CCardHeader
      align="center"
      style={{
        backgroundColor: colors.primary,
        color: "#fff",
        fontWeight: "bold",
      }}
    >
      {label}
    </CCardHeader>
  );

  return (
    <>
      <h1 className="pt-3" align="center">
        TOTAL CLIENTES
      </h1>
      <GraphDoughnut
        data={clients.map((client) => client.count)}
        labels={clients.map((client) => nameStateSpanish(client.stateID))}
        title={<TitleHeader label="Grafica de clientes" />}
        total={`Total : ${clients
          .map((client) => client.count)
          .reduce(
            (previousValue, currentValue) => previousValue + currentValue,
            0
          )}`}
      />
      <h1 className="pt-3" align="center">
        TAREAS
      </h1>
      <GraphDoughnut
        data={tasks.map((task) => task.Task.length)}
        labels={tasks.map((task) => task.Name)}
        title={<TitleHeader label="Grafica de tareas por estado" />}
        total={`Total : ${tasks
          .map((task) => task.Task.length)
          .reduce(
            (previousValue, currentValue) => previousValue + currentValue,
            0
          )}`}
      />
    </>
  );
};

export default SecretaryGeneralTemplate;
