import { freeSet } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import {
  CButton,
  CCol,
  CDataTable,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CInput,
  CInputGroup,
  CLabel,
  CRow,
  CSelect,
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import { supabase } from "src/config/configSupabase";
import { createDiscount, updateDiscount } from "src/state/querys/Discount";
import moment from "moment";

const fields = ["ID", "tipoDescuento", "cantidad", "editar", "eliminar"];

const Discounts = ({ userID }) => {
  const [discounts, setDiscounts] = useState([]);
  const [discountType, setDiscountType] = useState([]);
  const [temporality, setTemporality] = useState(new Date());
  const [type, setType] = useState("$");
  const [discount, setDiscount] = useState(0);
  const [typeSelected, setTypeSelected] = useState("0");
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState("");

  const componentDidMount = (limit = 1) => {
    setLoading(true);
    Promise.all([
      supabase
        .from("Discount")
        .select("*,DiscountType(Name),User(Names,LastName)")
        .limit(limit * 2 + 1)
        .eq("ClientID", userID)
        .then((snapshot) => snapshot.data),
      supabase.from("DiscountType").then((snapshot) => snapshot.data),
    ]).then((response) => {
      const discounts = response[0];
      const discountTypes = response[1];
      setDiscountType(discountTypes);
      setDiscounts(
        discounts.map((discount) => ({
          ...discount,
          tipoDescuento: discount.DiscountType.Name,
          cantidad: `${!discount.IsPercentage ? "$" : ""}${discount.Discount}${
            discount.IsPercentage ? "%" : ""
          }`,
        }))
      );
      setLoading(false);
    });
  };
  const handleAddDiscount = () =>
    createDiscount({
      TypeID: typeSelected,
      ClientID: userID,
      Discount: discount,
      IsPercentage: type === "%",
      Temporality: temporality,
    }).then(() => {
      componentDidMount();
      setTypeSelected("0");
      setDiscount(0);
      setTemporality(new Date());
    });

  const handleEditDiscount = () =>
    updateDiscount(
      {
        TypeID: typeSelected,
        ClientID: userID,
        Discount: discount,
        IsPercentage: type === "%",
        Temporality: temporality,
      },
      edit
    ).then(() => {
      componentDidMount();
      setTypeSelected("0");
      setTemporality(new Date());
      setDiscount(0);
    });

  const deleteDiscount = (ID) =>
    supabase
      .from("Discount")
      .delete()
      .match({ ID })
      .then(() => {
        setLoading(false);
        componentDidMount();
      });

  useEffect(componentDidMount, []);
  return (
    <>
      <CRow style={{ margin: 10, marginBottom: 20 }}>
        <CCol col="2">
          <CLabel htmlFor="DiscountType">Tipo de descuento</CLabel>
          <CSelect
            custom
            size="xl"
            name="DiscountType"
            id="DiscountType"
            value={typeSelected}
            onChange={({ target: { value } }) => setTypeSelected(value)}
          >
            <option value="0">Selecciona una opcion</option>
            {discountType.map((type) => (
              <option key={type.ID} value={type.ID}>
                {type.Name}
              </option>
            ))}
          </CSelect>
        </CCol>
        <CCol col="2">
          <CLabel htmlFor="DiscountType">Descuento</CLabel>
          <CInputGroup>
            <CDropdown className="input-group-prepend">
              <CDropdownToggle caret color="secondary">
                {type}
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem value="$" onClick={() => setType("$")}>
                  $
                </CDropdownItem>
                <CDropdownItem value="%" onClick={() => setType("%")}>
                  %
                </CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
            <CInput
              id="Discount"
              name="Discount"
              value={discount}
              onChange={({ target: { value } }) =>
                setDiscount(type === "$" ? value : value <= 100 ? value : 0)
              }
            />
          </CInputGroup>
        </CCol>
        {typeSelected === "1" && (
          <CCol style={{ marginBottom: 8 }} xs="12" sm="3">
            <CLabel htmlFor="FechCon">Fecha Expiracion</CLabel>
            <CInput
              id="expiration"
              type="date"
              placeholder=""
              required
              value={moment(temporality).format("YYYY-MM-DD")}
              onChange={({ target: { value } }) =>
                setTemporality(moment(value).toDate())
              }
            />
          </CCol>
        )}
        <CCol col="2">
          <CButton
            color={"success"}
            style={{ marginTop: 28 }}
            onClick={() => {
              if (edit === "") {
                handleAddDiscount();
              } else {
                handleEditDiscount();
              }
            }}
          >
            {edit !== "" ? "Editar Descuento" : "Añadir Descuento"}
          </CButton>
        </CCol>
        {edit !== "" && (
          <CCol col="2">
            <CButton
              color={"danger"}
              style={{ marginTop: 28 }}
              onClick={() => {
                componentDidMount();
                setTypeSelected("0");
                setDiscount(0);
                setEdit("");
              }}
            >
              Cancelar edicion
            </CButton>
          </CCol>
        )}
      </CRow>
      <CRow>
        <CDataTable
          items={discounts}
          fields={fields}
          itemsPerPage={2}
          onPageChange={componentDidMount}
          pagination
          loading={loading}
          scopedSlots={{
            eliminar: (item) => (
              <td className="py-2">
                <CRow className="align-items-center">
                  <CCol col="2" xs="2" sm="2" md="2" className="mb-2 mb-xl-0">
                    <CButton
                      color="danger"
                      onClick={() => deleteDiscount(item.ID)}
                    >
                      <CIcon content={freeSet.cilTrash} size="xl" />
                    </CButton>
                  </CCol>
                </CRow>
              </td>
            ),
            editar: (item) => (
              <td className="py-2">
                <CRow className="align-items-center">
                  <CCol col="2" xs="2" sm="2" md="2" className="mb-2 mb-xl-0">
                    <CButton
                      color="info"
                      onClick={() => {
                        setEdit(item.ID);
                        setType(item.IsPercentage ? "%" : "$");
                        setDiscount(item.Discount);
                        setTypeSelected(item.TypeID);
                      }}
                    >
                      <CIcon content={freeSet.cilPencil} size="xl" />
                    </CButton>
                  </CCol>
                </CRow>
              </td>
            ),
          }}
        />
      </CRow>
    </>
  );
};

export default Discounts;
