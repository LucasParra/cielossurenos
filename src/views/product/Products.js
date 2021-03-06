import React, { useEffect, useState } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
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
import { countProductUsed, getProducts } from "src/state/querys/Product";
import { CChartDoughnut } from "@coreui/react-chartjs";
import { colorsChart } from "src/utils";

const initProduct = {
  Name: "",
  BasePrice: null,
  StateID: 1,
};
const Products = () => {
  const { user, colors } = useKeySelector(["user", "colors"]);
  const [products, setProducts] = useState([]);
  const [noteTask, setNoteTask] = useState("");
  const [lastProduct, setLastProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [validated, setValidated] = useState(false);
  const [productChart, setProductChart] = useState([]);
  const [product, setProduct] = useState(initProduct);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const componentDidMount = (limit = 1) => {
    setLoading(true);
    getProducts(limit)
      .then((data) =>
        Promise.all(
          data.map(({ ID, Name }) =>
            countProductUsed(ID).then((count) => ({ count, name: Name }))
          )
        ).then((result) => {
          setProductChart(result);
          setProducts(data);
          setLoading(false);
        })
      )
      .catch(console.error);
  };
  const createProduct = () => {
    if (product.Name === "" || product.BasePrice === null) {
      return setValidated(true);
    }

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
        setValidated(false);
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
          setValidated(false);
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
        setValidated(false);
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
        setProduct(initProduct);
        setValidated(false);
      });

  useEffect(componentDidMount, []);
  return (
    <CForm className={validated ? "was-validated" : ""}>
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
        <CCol xs="12" lg="6">
          <CCard>
            <CCardHeader
              style={{
                backgroundColor: colors.primary,
                color: "#fff",
                fontWeight: "bold",
              }}
            >
              Productos
            </CCardHeader>
            <CCardBody>
              <ProductsTable
                products={products}
                setProduct={setProduct}
                onPageChange={componentDidMount}
                setShowDeleteModal={setShowDeleteModal}
                setModalVisible={setModalVisible}
                loading={loading}
              />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs="12" lg="6">
          <CCard>
            <CCardHeader
              style={{
                backgroundColor: colors.primary,
                color: "#fff",
                fontWeight: "bold",
              }}
            >
              Grafica de los Productos mas utilizados
            </CCardHeader>
            {productChart.length > 0 && (
              <CCardBody>
                <CChartDoughnut
                  datasets={[
                    {
                      backgroundColor: colorsChart,
                      data: productChart.map(({ count }) => count),
                    },
                  ]}
                  labels={productChart.map(({ name }) => name)}
                  options={{
                    tooltips: {
                      enabled: true,
                    },
                  }}
                />
              </CCardBody>
            )}
          </CCard>
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
    </CForm>
  );
};

export default Products;
