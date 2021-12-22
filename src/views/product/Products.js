import React, { useEffect, useState } from "react";
import {
  CButton,
  CCol,
  CFormGroup,
  CInput,
  CLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CTextarea,
} from "@coreui/react";

import { supabase } from "src/config/configSupabase";
import { useKeySelector } from "src/hook/general";
import { createTaskforAdmin } from "src/state/querys/Tasks";
import { DeleteModal } from "src/components/Modals";
import ProductsTable from "src/components/Tables/ProductsTable";
import { getProducts } from "src/state/querys/Product";

const initProduct = {
  Name: "",
  BasePrice: 0,
  StateID: 1,
};
const Products = () => {
  const { user, colors } = useKeySelector(["user", "colors"]);
  const [products, setProducts] = useState([]);
  const [noteTask, setNoteTask] = useState("");
  const [lastProduct, setLastProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [product, setProduct] = useState(initProduct);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const componentDidMount = (limit = 1) => {
    setLoading(true);
    getProducts(limit)
      .then((data) => {
        setProducts(
          data.map((product) => ({
            ...product,
            nombre: product.Name,
            precio: product.BasePrice,
          }))
        );
        setLoading(false);
      })
      .catch(console.error);
  };
  const createProduct = () => {
    if (user.RolID.ID === 7) {
      return createTaskforAdmin(user.ZoneID[0].AddressID.AddressZoneID, {
        TypeID: product.ID ? 6 : 7,
        ClientID: user.ID,
        Note: noteTask,
        Data: product,
        LastData: lastProduct,
      }).then(() => {
        setLoading(false);
        componentDidMount();
        setModalVisible(false);
        setNoteTask("");
        setLastProduct(null);
        setProduct(initProduct);
      });
    }

    if (product.ID)
      return supabase
        .from("Product")
        .upsert(product)
        .then(() => {
          setLoading(false);
          componentDidMount();
          setModalVisible(false);
          setProduct(initProduct);
        });

    setLoading(true);
    return supabase
      .from("Product")
      .insert(product)
      .then(() => {
        setLoading(false);
        componentDidMount();
        setModalVisible(false);
        setProduct(initProduct);
      });
  };
  const deleteProduct = () =>
    supabase
      .from("Product")
      .delete()
      .match({ ID: product.ID })
      .then(() => {
        setLoading(false);
        componentDidMount();
        setShowDeleteModal(false);
      });

  useEffect(componentDidMount, []);
  return (
    <>
      <CRow className="align-items-center" style={{ marginBottom: 16 }}>
        <CCol col="2" xs="2" sm="2" md="2" className="mb-3 mb-xl-0">
          <CButton
            onClick={() => setModalVisible(true)}
            style={{
              backgroundColor: colors.primary,
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            Crear Productos
          </CButton>
        </CCol>
      </CRow>
      <CRow>
        <CCol xs="12" lg="12">
          <ProductsTable
            products={products}
            setProduct={setProduct}
            onPageChange={componentDidMount}
            setShowDeleteModal={setShowDeleteModal}
            setModalVisible={setModalVisible}
            loading={loading}
          />
        </CCol>
      </CRow>
      <DeleteModal
        show={showDeleteModal}
        setShow={setShowDeleteModal}
        onFinish={deleteProduct}
      />
      <CModal
        show={modalVisible}
        onClose={() => {
          setProduct({
            Name: "",
            BasePrice: 0,
          });
          setModalVisible(!modalVisible);
        }}
        size="sm"
      >
        <CModalHeader>
          <CModalTitle
            style={{
              fontWeight: "bold",
              width: "100%",
              textAlign: "center",
            }}
          >{`${product.ID ? "Editar" : "Crear"} Producto`}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol xs="12">
              <CFormGroup>
                <CLabel
                  htmlFor="product"
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  Nombre
                </CLabel>
                <CInput
                  id="product"
                  placeholder="ingresa el nombre del producto"
                  value={product.Name}
                  onChange={({ target: { value } }) =>
                    setProduct({ ...product, Name: value })
                  }
                  required
                />
              </CFormGroup>
            </CCol>
          </CRow>
          <CRow>
            <CCol xs="12">
              <CFormGroup>
                <CLabel
                  htmlFor="priceBase"
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  Precio Base
                </CLabel>
                <CInput
                  id="priceBase"
                  value={product.BasePrice}
                  onChange={({ target: { value } }) =>
                    setProduct({ ...product, BasePrice: value })
                  }
                  placeholder="$50.000"
                  required
                />
              </CFormGroup>
            </CCol>
          </CRow>
          {user?.RolID?.ID === 7 && (
            <CRow>
              <CCol xs="12">
                <CFormGroup>
                  <CLabel htmlFor="priceBase">
                    Nota para el administrador
                  </CLabel>
                  <CTextarea
                    id="name"
                    value={noteTask}
                    onChange={({ target: { value } }) => setNoteTask(value)}
                  />
                </CFormGroup>
              </CCol>
            </CRow>
          )}
        </CModalBody>
        <CModalFooter>
          <CRow style={{ width: "100%" }}>
            <CCol col="6">
              <CButton
                color="success"
                onClick={createProduct}
                style={{ fontWeight: "bold", width: "100%" }}
              >
                {product.ID ? "Editar" : "Crear"}
              </CButton>
            </CCol>
            <CCol col="6">
              <CButton
                color="secondary"
                onClick={() => {
                  setProduct({
                    Name: "",
                    BasePrice: 0,
                  });
                  setModalVisible(!modalVisible);
                }}
                style={{ fontWeight: "bold", width: "100%" }}
              >
                Cancelar
              </CButton>
            </CCol>
          </CRow>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default Products;
