import React, { useCallback, useEffect, useState } from "react";
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CButton,
  CModalFooter,
  CFormGroup,
  CLabel,
  CInput,
  CModalBody,
  CModalTitle,
  CModalHeader,
  CModal,
} from "@coreui/react";

// import users from "../../users/users";
import { supabase } from "src/config/configSupabase";
import { UserForm } from "src/components/Forms";
import _ from "lodash";
import CIcon from "@coreui/icons-react";
import { freeSet } from "@coreui/icons";
import Discounts from "./Discounts";
import Charges from "./Charges";
import { useHistory } from "react-router";
import { chargeAutomatic } from "src/state/querys/Charges";
import { clean, format, getCheckDigit } from "rut.js";
import { useKeySelector } from "src/hook/general";

const fields = [
  "ID",
  "nombres",
  "apellidos",
  "Rut",
  // "JobID",
  // "AddressName",
  // "AddressNumber",
  // "AddressBlockNumber",
  // "AddressFloorNumber",
  // "AddressApartmentNumber",
  "contacto",
  // "JobPhoneNumber",
  // "AddressZoneID",
  // "AddressArea",
  // "UnsuscribeReason",
  // "SellerID",
  // "TechnicianID",
  // "A_N_BOCAS",
  // "A_COEFICIE",
  // "StateID",
  // "A_REPACTAD",
  // "A_RECONNCET",
  // "A_FE_RECON",
  // "A_CONDONAD",
  // "A_PROMOCIO",
  // "A_FE_PROMO",
  // "A_D_PLAZO",
  // "D_8",
  // "FechCon",
  // "AltaAdm",
  // "BajaAdm",
  // "AltaTec",
  // "BajaTec",
  // "A_FE_REPAC",
  "estado",
  "editar",
  "datos",
];

const Tables = () => {
  const history = useHistory();
  const { user: userSession } = useKeySelector(["user"]);
  const [creatingUser, setCreatingUser] = useState(false);
  const [chargesAutomaticModal, setChargesAutomaticModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalVisibleDiscounts, setModalVisible] = useState(false);
  const [modalVisibleCharges, setModalVisibleCharges] = useState(false);

  const handleSearchUser = (value, limit = 1) => {
    setSearchText(
      /^[0-9]*$/.test(value) ? format(value).replace(/\./g, "") : value
    );
    if (value === undefined || value === "") return componentDidMount();
    setLoading(true);
    supabase
      .from("User")
      .select("*,Address(*)")
      .or(
        `Names.ilike.%${value}%,LastName.ilike.%${value}%,Rut.ilike.%${format(
          value
        ).replace(/\./g, "")}%`
      )
      .limit(limit * 5 + 1)
      .then((snapshot) => {
        setUsers(
          snapshot.data
            .filter(({ StateID }) => StateID !== "4")
            .map((user) => ({
              ...user,
              nombres: user.Names,
              apellidos: user.LastName,
              contacto: user.PhoneNumber,
            }))
        );
        setLoading(false);
      })
      .catch(console.error);
  };
  const componentDidMount = (limit = 1) => {
    setLoading(true);
    console.log(limit);
    supabase
      .from("User")
      .select("*,Address(*)")
      .limit(limit * 5 + 1)
      .then((snapshot) => {
        setUsers(
          snapshot.data
            .filter(({ StateID }) => StateID !== "4")
            .map((user) => ({
              ...user,
              nombres: user.Names,
              apellidos: user.LastName,
              contacto: user.PhoneNumber,
            }))
        );
        setLoading(false);
      })
      .catch(console.error);
  };
  const getBadge = (status) => {
    switch (status) {
      case "1":
        return "success";
      case "2":
        return "danger";
      case "3":
        return "info";
      default:
        return "default";
    }
  };
  const getStateName = (StateID) => {
    switch (StateID) {
      case "1":
        return "Activado";
      case "2":
        return "De Baja";
      case "3":
        return "Moroso";
      default:
        return "Indefinido";
    }
  };

  const debounceFilter = useCallback(_.debounce(handleSearchUser, 1000), []);

  useEffect(componentDidMount, []);
  return (
    <>
      <CRow>
        <CCol xs="12" lg="12">
          {creatingUser ? (
            <CButton
              color="primary"
              style={{ marginBottom: 10 }}
              onClick={() => {
                setUser({});
                setCreatingUser(false);
              }}
            >
              <CIcon color="white" name="cil-arrow-left" />
              Volver
            </CButton>
          ) : (
            <CRow>
              <CCol>
                <CButton
                  onClick={() => setCreatingUser(true)}
                  style={{ marginBottom: 10 }}
                  size="md"
                  color="primary"
                >
                  Crear Usuario
                </CButton>
              </CCol>
              {userSession?.RolID?.ID === 8 && (
                <CCol>
                  <CButton
                    onClick={() => setChargesAutomaticModal(true)}
                    style={{ marginBottom: 10 }}
                    size="md"
                    color="success"
                  >
                    Crear Cobro automatico
                  </CButton>
                </CCol>
              )}
            </CRow>
          )}
          <div style={{ display: creatingUser ? "none" : "block" }}>
            <CCard>
              <CCardHeader>Usuarios</CCardHeader>
              <CCardBody>
                <CDataTable
                  items={users}
                  fields={fields}
                  itemsPerPage={5}
                  onPageChange={(number) => {
                    if (!searchText !== "") return componentDidMount(number);
                    else return handleSearchUser(searchText, number);
                  }}
                  loading={loading}
                  pagination
                  tableFilter={{
                    placeholder: "nombre,rut o apellido",
                    label: "Filtrar",
                  }}
                  striped
                  tableFilterValue={(value) =>
                    /^[0-9]*$/.test(value)
                      ? value !== ""
                        ? format(value).replace(/\./g, "")
                        : ""
                      : value
                  }
                  onTableFilterChange={debounceFilter}
                  scopedSlots={{
                    editar: (item) => (
                      <td>
                        <CRow>
                          <CCol
                            col="2"
                            xs="2"
                            sm="2"
                            md="2"
                            className="mb-2 mb-xl-0"
                            style={{ zIndex: 999 }}
                          >
                            <CButton
                              color="info"
                              onClick={() => {
                                setCreatingUser(true);
                                setUser(item);
                              }}
                            >
                              <CIcon content={freeSet.cilPencil} size="l" />
                            </CButton>
                          </CCol>
                        </CRow>
                      </td>
                    ),
                    datos: (item) => (
                      <td>
                        <CRow>
                          <CCol
                            col="2"
                            xs="2"
                            sm="2"
                            md="2"
                            className="mb-2 mb-xl-0"
                            style={{ zIndex: 999 }}
                          >
                            <CButton
                              color="secondary"
                              onClick={() =>
                                history.push(`/menu/user/${item.ID}`)
                              }
                            >
                              <CIcon content={freeSet.cilUser} size="l" />
                            </CButton>
                          </CCol>
                        </CRow>
                      </td>
                    ),
                    estado: (item) => (
                      <td>
                        <CBadge color={getBadge(item.StateID)}>
                          {getStateName(item.StateID)}
                        </CBadge>
                      </td>
                    ),
                  }}
                />
              </CCardBody>
            </CCard>
          </div>
          <div style={{ display: !creatingUser ? "none" : "block" }}>
            <UserForm
              user={user}
              onClose={() => {
                setUser({});
                componentDidMount();
                setCreatingUser(false);
              }}
            />
          </div>
        </CCol>
      </CRow>
      {!creatingUser && modalVisibleDiscounts && (
        <Discounts
          isVisible={modalVisibleDiscounts}
          setModalVisible={setModalVisible}
          userID={user.ID}
        />
      )}
      {!creatingUser && modalVisibleCharges && (
        <Charges
          isVisible={modalVisibleCharges}
          setModalVisible={setModalVisibleCharges}
          userID={user.ID}
        />
      )}

      <CModal
        show={chargesAutomaticModal}
        onClose={setChargesAutomaticModal}
        size="sm"
        color="info"
      >
        <CModalHeader style={{ justifyContent: "center" }}>
          <CModalTitle style={{ textAlign: "center" }}>
            Estas seguro?
          </CModalTitle>
        </CModalHeader>

        <CModalFooter style={{ justifyContent: "center" }}>
          <CButton
            color="success"
            onClick={() =>
              chargeAutomatic().then(() => setChargesAutomaticModal(false))
            }
          >
            Aceptar
          </CButton>
          <CButton
            color="danger"
            onClick={() => setChargesAutomaticModal(false)}
          >
            Cancelar
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default Tables;
