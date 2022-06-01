import React from "react";
import { Loading } from "src/components/atoms/loading";

import {
  ClientInformationTemplate,
  useClientInformationTemplate,
} from "src/components/templates/clientInformationTemplate";

const ClientInformation = () => {
  const { isLoading, tasksHistory } = useClientInformationTemplate();

  if (!isLoading) return <Loading />;

  console.log(tasksHistory);
  return <ClientInformationTemplate tasksHistory={tasksHistory} />;
};

export default ClientInformation;
