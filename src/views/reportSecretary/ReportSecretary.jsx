import React, { useState } from "react";
import moment from "moment";

import { Loading } from "src/components/atoms/loading";
import {
  ReportTemplate,
  useReportTemplate,
} from "src/components/templates/reportTemplate";

const ReportSecretary = () => {
  const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
  const {
    newContractsTodayCount,
    reconnectionTodayCount,
    disconnectionTodayCount,
    facilityTodayCount,
    isLoading,
    paymentsToday,
  } = useReportTemplate(date);

  if (!isLoading) return <Loading />;

  return (
    <ReportTemplate
      newContractsTodayCount={newContractsTodayCount}
      reconnectionTodayCount={reconnectionTodayCount}
      disconnectionTodayCount={disconnectionTodayCount}
      facilityTodayCount={facilityTodayCount}
      setDate={setDate}
      paymentsToday={paymentsToday}
    />
  );
};

export default ReportSecretary;
