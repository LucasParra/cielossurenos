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
  CInputRadio,
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
import { CreateClient } from "src/components/Cards";
import {
  getUserBySearch,
  unsubscribedProcessUser,
  updateUserID,
} from "src/state/querys/Users";
import { DeleteModal } from "src/components/Modals";
import { finishTaskProcessUnSubscribe } from "src/state/querys/Tasks";

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
  { key: "estado" },
  "editar",
  "datos",
  { key: "unsubscribed", label: "opciones" },
];

const Tables = () => {
  const history = useHistory();
  const { user: userSession, colors } = useKeySelector(["user", "colors"]);
  const [creatingUser, setCreatingUser] = useState(false);
  const [chargesAutomaticModal, setChargesAutomaticModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalVisibleDiscounts, setModalVisible] = useState(false);
  const [modalVisibleCharges, setModalVisibleCharges] = useState(false);
  const [stateFilterSelected, setStateFilterSelected] = useState(1);
  const [showModalUnsubscribedConfirm, setShowModalUnsubscribedConfirm] =
    useState(false);
  const [unsubscribedSelected, setUnsubscribedSelected] = useState();
  const [showModalSubscribedConfirm, setShowModalSubscribedConfirm] =
    useState(false);

  const handleSearchUser = (value, limit) => {
    setSearchText(
      /^[0-9]*$/.test(value) ? format(value).replace(/\./g, "") : value
    );
    if (value === undefined || value === "") return componentDidMount();
    setLoading(true);
    getUserBySearch(value, limit).then((usersApi) => {
      setUsers(
        usersApi
          .filter(({ StateID }) => StateID !== "4")
          .map((user) => ({
            ...user,
            nombres: user.Names,
            apellidos: user.LastName,
            contacto: user.PhoneNumber,
          }))
      );
      setLoading(false);
    });
  };
  const componentDidMount = (limit = 1) => {
    setLoading(true);
    let refUser = supabase
      .from("User")
      .select("*,Address(*)")
      .limit(limit * 5 + 1);

    if (stateFilterSelected !== 0) refUser.eq("StateID", stateFilterSelected);

    refUser
      .then((snapshot) => {
        setUsers(
          snapshot.data
            .filter(({ StateID }) => StateID !== "4")
            .map((user) => ({
              ...user,
              nombres: user.Names,
              apellidos: user.LastName,
              contacto: user.PhoneNumber,
              estado: getStateName(user.StateID),
            }))
        );
        setLoading(false);
      })
      .catch(console.error);
  };

  const onFinishUnsubscribedProcess = () => {
    unsubscribedProcessUser(
      unsubscribedSelected,
      userSession.ZoneID[0].AddressID.AddressZoneID
    ).then(() => {
      setUnsubscribedSelected({});
      setShowModalUnsubscribedConfirm(false);
      componentDidMount();
    });
  };
  const onFinishSubscribed = () =>
    updateUserID({ ID: unsubscribedSelected, StateID: 1 }).then(() => {
      finishTaskProcessUnSubscribe(unsubscribedSelected);
      setUnsubscribedSelected({});
      setShowModalSubscribedConfirm(false);
      componentDidMount();
    });

  const getBadge = (status) => {
    switch (status) {
      case "1":
        return "success";
      case "2":
        return "danger";
      case "3":
        return "info";
      case "5":
        return "danger";
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
      case "5":
        return "Proceso de baja";
      default:
        return "Indefinido";
    }
  };

  const debounceFilter = useCallback(_.debounce(handleSearchUser, 1000), []);

  useEffect(componentDidMount, [stateFilterSelected]);
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
                  style={{
                    marginBottom: 10,
                    backgroundColor: colors.primary,
                    color: "#fff",
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
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
            <CCard style={{ borderRadius: 20 }}>
              <CCardHeader
                style={{
                  backgroundColor: colors.primary,
                  color: "#fff",
                  fontSize: 16,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Usuarios
              </CCardHeader>
              <CCardBody>
                <CRow alignHorizontal="end">
                  <CCol xs="12" lg="1">
                    <CFormGroup variant="checkbox">
                      <CInputRadio
                        className="form-check-input"
                        id="stateAllUser"
                        name="radioFilterState"
                        value={0}
                        style={{ width: 16, height: 16 }}
                        onClick={() => setStateFilterSelected(0)}
                      />
                      <CLabel
                        variant="checkbox"
                        htmlFor="stateAllUser"
                        style={{ fontWeight: "bold", fontSize: 16 }}
                      >
                        Todos
                      </CLabel>
                    </CFormGroup>
                  </CCol>
                  <CCol xs="12" lg="1">
                    <CFormGroup variant="checkbox">
                      <CInputRadio
                        className="form-check-input"
                        id="stateActiveUser"
                        name="radioFilterState"
                        value={1}
                        style={{ width: 16, height: 16 }}
                        onClick={() => setStateFilterSelected(1)}
                      />
                      <CLabel
                        variant="checkbox"
                        htmlFor="stateActiveUser"
                        style={{ fontWeight: "bold", fontSize: 16 }}
                      >
                        Activos
                      </CLabel>
                    </CFormGroup>
                  </CCol>
                  <CCol xs="12" lg="1">
                    <CFormGroup variant="checkbox">
                      <CInputRadio
                        className="form-check-input"
                        id="stateUnsubscribedUser"
                        name="radioFilterState"
                        value={2}
                        style={{ width: 16, height: 16 }}
                        onClick={() => setStateFilterSelected(3)}
                      />
                      <CLabel
                        variant="checkbox"
                        htmlFor="stateUnsubscribedUser"
                        style={{ fontWeight: "bold", fontSize: 16 }}
                      >
                        Moroso
                      </CLabel>
                    </CFormGroup>
                  </CCol>
                  <CCol xs="12" lg="2">
                    <CFormGroup variant="checkbox">
                      <CInputRadio
                        className="form-check-input"
                        id="stateUnsubscribedUser"
                        name="radioFilterState"
                        value={5}
                        style={{ width: 16, height: 16 }}
                        onClick={() => setStateFilterSelected(5)}
                      />
                      <CLabel
                        variant="checkbox"
                        htmlFor="stateUnsubscribedUser"
                        style={{ fontWeight: "bold", fontSize: 16 }}
                      >
                        En desconexion
                      </CLabel>
                    </CFormGroup>
                  </CCol>
                </CRow>
                <CDataTable
                  items={users}
                  fields={fields}
                  sorter
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
                  selectable
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
                    unsubscribed: (item) => (
                      <td>
                        {item.StateID === "3" && (
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
                                color="danger"
                                onClick={() => {
                                  setUnsubscribedSelected(item.ID);
                                  setShowModalUnsubscribedConfirm(true);
                                }}
                              >
                                <CIcon
                                  content={freeSet.cilArrowBottom}
                                  size="l"
                                />
                              </CButton>
                            </CCol>
                          </CRow>
                        )}
                        {item.StateID === "5" && (
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
                                color="success"
                                onClick={() => {
                                  setUnsubscribedSelected(item.ID);
                                  setShowModalSubscribedConfirm(true);
                                }}
                              >
                                <CIcon content={freeSet.cilArrowTop} size="l" />
                              </CButton>
                            </CCol>
                          </CRow>
                        )}
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
      <DeleteModal
        show={showModalUnsubscribedConfirm}
        setShow={() => {
          setUnsubscribedSelected({});
          setShowModalUnsubscribedConfirm(false);
        }}
        onFinish={onFinishUnsubscribedProcess}
      />
      <DeleteModal
        show={showModalSubscribedConfirm}
        setShow={() => {
          setUnsubscribedSelected({});
          setShowModalSubscribedConfirm(false);
        }}
        onFinish={onFinishSubscribed}
      />
    </>
  );
};

export default Tables;
