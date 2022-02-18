import React, { useEffect, useState } from "react";
import {
  CButton,
  CCol,
  CDataTable,
  CInput,
  CRow,
  CSwitch,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { getProducts } from "src/state/querys/Product";

const SelecteProductsTable = ({
  type,
  productsSelected,
  setProductsSelected,
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const fields = [
    "Nombre",
    "Precio",
    "activo",
    type === "select" && "personalizar_precio",
  ];
  const productEffect = (limit) => {
    setLoading(true);
    getProducts(limit).then((productsApi) => {
      setProducts(
        productsApi.map((product) => ({
          ...product,
          Nombre: product.Name,
          Precio: new Intl.NumberFormat("es-CL", {
            currency: "CLP",
            style: "currency",
          }).format(product.BasePrice),
        }))
      );
      setLoading(false);
    });
  };

  useEffect(productEffect, []);
  return (
    <CDataTable
      items={products}
      fields={fields}
      itemsPerPage={5}
      onPageChange={productEffect}
      loading={loading}
      pagination
      scopedSlots={{
        personalizar_precio: (item) =>
          type === "select" && (
            <td className="py-2">
              <CCol col="4" xs="4" sm="4" md="4" className="mb-2 mb-xl-0">
                <CInput
                  placeholder="10.000"
                  defaultValue={item.BasePrice}
                  onChange={({ target: { value } }) =>
                    setProductsSelected(
                      productsSelected.map((product) =>
                        product.ProductID === item.ID
                          ? { ...product, Price: parseInt(value) }
                          : { ...product }
                      )
                    )
                  }
                />
              </CCol>
            </td>
          ),
        activo: (item) => (
          <td className="py-2">
            {type === "select" ? (
              <CRow className="align-items-center" key={item.ID}>
                <CCol col="2" xs="2" sm="2" md="2" className="mb-2 mb-xl-0">
                  <CSwitch
                    className={"mx-1"}
                    variant={"3d"}
                    color={"success"}
                    value={
                      productsSelected.filter(
                        (product) => item.ID === product.ProductID
                      ).length === 1
                    }
                    checked={
                      productsSelected.filter(
                        (product) => item.ID === product.ProductID
                      ).length === 1
                    }
                    onChange={({ target: { checked } }) => {
                      checked
                        ? setProductsSelected([
                            ...productsSelected,
                            {
                              UserID: "",
                              ProductID: item.ID,
                              Price: item.BasePrice,
                              label: item.Nombre,
                            },
                          ])
                        : setProductsSelected(
                            productsSelected.filter(
                              (product) => item.ID !== product.ProductID
                            )
                          );
                    }}
                  />
                </CCol>
              </CRow>
            ) : (
              <CRow className="align-items-center">
                <CCol col="2" xs="2" sm="2" md="2" className="mb-2 mb-xl-0">
                  <CButton
                    color="primary"
                    onClick={() => {
                      //   setProduct(item);
                      //   setModalVisible(true);
                    }}
                  >
                    <CIcon
                      name="cil-pencil"
                      style={{ paddingLeft: 10 }}
                      customClasses="c-sidebar-nav-icon"
                    />
                  </CButton>
                </CCol>
                <CCol col="2" xs="2" sm="2" md="2" className="mb-2 mb-xl-0">
                  <CButton
                    color="danger"
                    onClick={() => {
                      //   setProduct(item);
                      //   setDeleteModal(true);
                    }}
                  >
                    <CIcon
                      name="cil-trash"
                      style={{ paddingLeft: 10 }}
                      customClasses="c-sidebar-nav-icon"
                    />
                  </CButton>
                </CCol>
              </CRow>
            )}
          </td>
        ),
      }}
    />
  );
};

export default SelecteProductsTable;
