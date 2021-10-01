import React, { useEffect, useState } from "react";
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CFormGroup,
  CInput,
  CLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from "@coreui/react";
import { DocsLink } from "src/reusable";

// import users from "../../users/users";
import { supabase } from "src/config/configSupabase";
import CIcon from "@coreui/icons-react";
import { freeSet } from "@coreui/icons";

const getBadge = (status) => {
  switch (status) {
    case "Active":
      return "success";
    case "Inactive":
      return "secondary";
    case "Pending":
      return "warning";
    case "Banned":
      return "danger";
    default:
      return "primary";
  }
};
const fields = ["ID", "Name", "BasePrice", "editar", "eliminar"];

const Products = () => {
  const [products, setProducts] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [product, setProduct] = useState({
    Name: "",
    BasePrice: 0,
  });
  const [loading, setLoading] = useState(false);
  const componentDidMount = (limit = 1) => {
    setLoading(true);
    supabase
      .from("Product")
      .select("*")
      .limit(limit * 5 + 1)
      .then((snapshot) => {
        setProducts(snapshot.data);
        setLoading(false);
      })
      .catch(console.error);
  };

  const createProduct = () => {
    if (product.ID)
      return supabase
        .from("Product")
        .upsert(product)
        .then(() => {
          setLoading(false);
          componentDidMount();
          setModalVisible(false);
        });

    setLoading(true);
    return supabase
      .from("Product")
      .insert(product)
      .then(() => {
        setLoading(false);
        componentDidMount();
        setModalVisible(false);
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
        setDeleteModal(false);
      });

  useEffect(componentDidMount, []);
  return (
    <>
      <CRow className="align-items-center" style={{ marginBottom: 16 }}>
        <CCol col="2" xs="2" sm="2" md="2" className="mb-3 mb-xl-0">
          <CButton block color="primary" onClick={() => setModalVisible(true)}>
            Crear Productos
          </CButton>
        </CCol>
      </CRow>

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
        <CModalHeader closeButton>
          <CModalTitle>Crear Productos</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol xs="12">
              <CFormGroup>
                <CLabel htmlFor="product">Nombre</CLabel>
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
                <CLabel htmlFor="priceBase">Precio Base</CLabel>
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
        </CModalBody>
        <CModalFooter>
          <CButton color="success" onClick={createProduct}>
            Crear
          </CButton>{" "}
          <CButton
            color="secondary"
            onClick={() => {
              setProduct({
                Name: "",
                BasePrice: 0,
              });
              setModalVisible(!modalVisible);
            }}
          >
            Cancelar
          </CButton>
        </CModalFooter>
      </CModal>
      <CModal
        show={deleteModal}
        color="danger"
        onClose={() => setDeleteModal(!deleteModal)}
        size="sm"
      >
        <CModalHeader closeButton>
          <CModalTitle>Eliminar Producto</CModalTitle>
        </CModalHeader>
        <CModalFooter>
          <CButton color="danger" onClick={deleteProduct}>
            Si
          </CButton>
          <CButton
            onClick={() => setDeleteModal(!deleteModal)}
            color="secondary"
          >
            No
          </CButton>
        </CModalFooter>
      </CModal>

      <CRow>
        <CCol xs="12" lg="12">
          <CCard>
            <CCardHeader>
              Productos
              <DocsLink name="CModal" />
            </CCardHeader>
            <CCardBody>
              <CDataTable
                items={products}
                fields={fields}
                itemsPerPage={5}
                onPageChange={componentDidMount}
                loading={loading}
                pagination
                scopedSlots={{
                  status: (item) => (
                    <td>
                      <CBadge color={getBadge(item.status)}>
                        {item.status}
                      </CBadge>
                    </td>
                  ),
                  editar: (item) => (
                    <td>
                      <CButton
                        color="info"
                        onClick={() => {
                          setProduct(item);
                          setModalVisible(true);
                        }}
                      >
                        <CIcon content={freeSet.cilPencil} size="xl" />
                      </CButton>
                    </td>
                  ),
                  eliminar: (item) => (
                    <td className="py-2">
                      <CButton
                        color="danger"
                        onClick={() => {
                          setProduct(item);
                          setDeleteModal(true);
                        }}
                      >
                        <CIcon content={freeSet.cilTrash} size="xl" />
                      </CButton>
                    </td>
                  ),
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default Products;
