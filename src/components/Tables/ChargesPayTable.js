import { freeSet } from "@coreui/icons";
import { CDataTable } from "@coreui/react";
import React from "react";
import { ButtonOptionTable } from "../buttons";

const fields = ["ID", "nombre", "editar", "eliminar"];
const ChargesPayTable = ({
  charges,
  onPageChange,
  loading,
  onPressEdit,
  onPressDeleted,
}) => {
  return (
    <CDataTable
      items={charges}
      fields={fields}
      itemsPerPage={5}
      onPageChange={onPageChange}
      loading={loading}
      pagination
      scopedSlots={{
        editar: (item) => (
          <ButtonOptionTable
            color="info"
            icon={freeSet.cilPencil}
            onPress={() => {
              onPressEdit(item);
            }}
          />
        ),
        eliminar: (item) => (
          <ButtonOptionTable
            color="danger"
            icon={freeSet.cilTrash}
            onPress={() => {
              onPressDeleted(item);
            }}
          />
        ),
      }}
    />
  );
};

export default ChargesPayTable;
