import React from "react";
import { CCol } from "@coreui/react";
import { CChartDoughnut } from "@coreui/react-chartjs";

import { Card } from "src/components/atoms/card";

const GraphDoughnut = (props) => {
  const { title, data, labels, total } = props;
  return (
    <Card header={title} footer={total}>
      <CCol>
        <CChartDoughnut
          datasets={[
            {
              backgroundColor: [
                "#41B883",
                "red",
                "#FA8900",
                "#28D2ED",
                "#ffce56",
                "#038BA1",
              ],
              data: data,
            },
          ]}
          labels={labels}
          options={{
            tooltips: {
              enabled: true,
            },
          }}
        />
      </CCol>
    </Card>
  );
};

export default GraphDoughnut;
