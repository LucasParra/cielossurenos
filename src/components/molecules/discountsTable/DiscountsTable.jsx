import React from "react";
import { CDataTable } from "@coreui/react";

import { Card } from "src/components/atoms/card";

const fieldsDiscountsTable = [
  "ID",
  { key: "TypeID", label: "Tipo Descuento" },
  { key: "StateID", label: "Cantidad" },
  "Editar",
  "Eliminar",
];

const DiscountsTable = (props) => {
  const { discounts } = props;

  return (
    <Card header="Descuentos">
      <CDataTable
        items={discounts}
        fields={fieldsDiscountsTable}
        itemsPerPage={10}
        pagination
      />
    </Card>
  );
};

export default DiscountsTable;
