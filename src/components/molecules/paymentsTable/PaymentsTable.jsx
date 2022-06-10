import React from "react";
import { CDataTable } from "@coreui/react";

import { Card } from "src/components/atoms/card";

const fieldsPaymentsTable = [
  { key: "amount", label: "Monto" },
  { key: "label", label: "Tipo" },
];

const PaymentsTable = (props) => {
  const { payments } = props;

  return (
    <Card header="Pagos">
      <CDataTable
        items={payments}
        fields={fieldsPaymentsTable}
        itemsPerPage={10}
        pagination
      />
    </Card>
  );
};

export default PaymentsTable;
