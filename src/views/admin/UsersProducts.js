import { CCard, CCardBody, CCol, CRow } from "@coreui/react";
import React, { useState } from "react";

import UsersTable from "src/components/Tables/UsersTable";
import { SelectProductModal } from "src/components/Modals";
import { getProductByIDUser } from "src/state/querys/Product";
import { createUserProduct, updateUserProduct } from "src/state/querys/Users";

const UsersProducts = () => {
  const [showModal, setShowModal] = useState(false);
  const [productsSelected, setProductsSelected] = useState([]);
  const [userID, setUserID] = useState("");

  const handleClient = (IDUser) => {
    getProductByIDUser(IDUser).then((products) => {
      setProductsSelected(
        products.map((product) => ({
          ProductID: product.ProductID.ID,
          Price: product.ProductID.BasePrice,
          ID: product.ID,
        }))
      );
      setUserID(IDUser);
      setShowModal(true);
    });
  };
  const onFinish = () => {
    Promise.all(
      productsSelected.map((product) =>
        product.ID
          ? updateUserProduct({ ...product, UserID: userID })
          : createUserProduct({ ...product, UserID: userID })
      )
    ).then(() => {
      setShowModal(false);
      setProductsSelected([]);
      setUserID("");
    });
  };
  return (
    <>
      <h1 className="pt-3 ">clientes</h1>
      <CRow>
        <CCol xs="12" sm="6" lg="12">
          <CCard>
            <CCardBody>
              <UsersTable handleClient={handleClient} />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <SelectProductModal
        show={showModal}
        setShow={() => setShowModal(false)}
        onFinish={onFinish}
        setProductsSelected={setProductsSelected}
        productsSelected={productsSelected}
      />
    </>
  );
};

export default UsersProducts;
