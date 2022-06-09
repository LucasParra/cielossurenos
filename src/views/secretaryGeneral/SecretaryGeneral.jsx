import React from "react";
import { Loading } from "src/components/atoms/loading";
import {
  SecretaryGeneralTemplate,
  useSecretaryGeneralTemplate,
} from "src/components/templates/secretaryGeneralTemplate";

const SecretaryGeneral = () => {
  const { tasks, clients, isLoading } = useSecretaryGeneralTemplate();

  if (!isLoading) return <Loading />;

  return <SecretaryGeneralTemplate tasks={tasks} clients={clients} />;
};

export default SecretaryGeneral;
