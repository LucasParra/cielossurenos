import {
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";
import React from "react";
import SelecteProductsTable from "../Tables/SelecteProductsTable";

const SelectProductModal = ({
  show,
  setShow,
  onFinish,
  productsSelected,
  setProductsSelected,
}) => {
  return (
    <CModal show={show} onClose={setShow} size="lg">
      <CModalHeader closeButton>
        <CModalTitle>
          Selecciona los productos que quieres asignar a este usuario
        </CModalTitle>
      </CModalHeader>
      <CModalBody>
        <SelecteProductsTable
          type={"select"}
          productsSelected={productsSelected}
          setProductsSelected={setProductsSelected}
        />
      </CModalBody>
      <CModalFooter>
        <CButton color="success" onClick={onFinish}>
          Aceptar
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default SelectProductModal;
