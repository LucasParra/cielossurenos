import { freeSet } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CDataTable,
} from "@coreui/react";
import React from "react";
import { ButtonOptionTable } from "../buttons";

const fields = [
  "ID",
  { key: "Name", label: "nombre" },
  { key: "BasePrice", label: "precio" },
  "editar",
  "eliminar",
];

const ProductsTable = ({
  products,
  setProduct,
  setShowDeleteModal,
  loading,
  onPageChange,
  setModalVisible,
}) => {
  return (
    <CDataTable
      items={products}
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
              setProduct(item);
              setModalVisible(true);
            }}
          />
        ),
        eliminar: (item) => (
          <ButtonOptionTable
            color="danger"
            icon={freeSet.cilTrash}
            onPress={() => {
              setProduct(item);
              setShowDeleteModal(true);
            }}
          />
        ),
      }}
    />
  );
};

export default ProductsTable;
