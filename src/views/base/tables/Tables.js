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
} from "@coreui/react";

// import users from "../../users/users";
import { supabase } from "src/config/configSupabase";
import { UserForm } from "src/components/Forms";
import _ from "lodash";
import CIcon from "@coreui/icons-react";

const fields = [
  "ID",
  "LastName",
  "Names",
  "Rut",
  "JobID",
  // "AddressName",
  // "AddressNumber",
  // "AddressBlockNumber",
  // "AddressFloorNumber",
  // "AddressApartmentNumber",
  "PhoneNumber",
  "JobPhoneNumber",
  "AddressZoneID",
  "AddressArea",
  "UnsuscribeReason",
  "SellerID",
  "TechnicianID",
  "A_N_BOCAS",
  "A_COEFICIE",
  "StateID",
  "A_REPACTAD",
  "A_RECONNCET",
  "A_FE_RECON",
  "A_CONDONAD",
  "A_PROMOCIO",
  "A_FE_PROMO",
  "A_D_PLAZO",
  "D_8",
  "FechCon",
  "AltaAdm",
  "BajaAdm",
  "AltaTec",
  "BajaTec",
  "A_FE_REPAC",
  "estado",
  "editar",
];

const Tables = () => {
  const [creatingUser, setCreatingUser] = useState(false);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearchUser = (value, limit = 1) => {
    setSearchText(value);
    if (value === undefined || value === "") return componentDidMount();

    setLoading(true);
    supabase
      .from("User")
      .select("*")
      .or(
        `Names.ilike.%${value}%,LastName.ilike.%${value}%,Rut.ilike.%${value}%`
      )
      .limit(limit * 5 + 1)
      .then((snapshot) => {
        setUsers(snapshot.data);
        setLoading(false);
      })
      .catch(console.error);
  };
  const componentDidMount = (limit = 1) => {
    setLoading(true);
    supabase
      .from("User")
      .select("*,Address(*)")
      .limit(limit * 5 + 1)
      .then((snapshot) => {
        setUsers(snapshot.data);
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
      default:
        return "primary";
    }
  };
  const changeStateUser = (state, userID) =>
    supabase
      .from("User")
      .update({ StateID: state === "1" ? "2" : "1" })
      .eq("ID", userID)
      .then(() => handleSearchUser(searchText));

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
            <CButton
              onClick={() => setCreatingUser(true)}
              style={{ marginBottom: 10 }}
              size="md"
              color="primary"
            >
              <CIcon color="white" name="cil-plus" />
              Crear Usuario
            </CButton>
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
                    if (searchText === "") return componentDidMount(number);
                    else return handleSearchUser(searchText, number);
                  }}
                  loading={loading}
                  pagination
                  tableFilter={{
                    placeholder: "nombre,rut o apellido",
                    label: "Filtrar",
                  }}
                  onTableFilterChange={debounceFilter}
                  scopedSlots={{
                    editar: (item) => (
                      <CRow>
                        <CCol
                          col="2"
                          xs="2"
                          sm="2"
                          md="2"
                          className="mb-2 mb-xl-0"
                        >
                          <CButton
                            color="primary"
                            onClick={() => {
                              setCreatingUser(true);
                              setUser(item);
                            }}
                          >
                            <CIcon
                              name="cil-pencil"
                              style={{ paddingLeft: 10 }}
                              customClasses="c-sidebar-nav-icon"
                            />
                          </CButton>
                        </CCol>
                        <CCol
                          col="2"
                          xs="2"
                          sm="2"
                          md="2"
                          className="mb-2 mb-xl-0"
                          style={{ marginLeft: 20 }}
                        >
                          <CButton
                            color={item.StateID === "1" ? "danger" : "success"}
                            onClick={() => {
                              changeStateUser(item.StateID, item.ID);
                            }}
                          >
                            <CIcon
                              name="cil-user"
                              style={{ paddingLeft: 10 }}
                              customClasses="c-sidebar-nav-icon"
                            />
                          </CButton>
                        </CCol>
                      </CRow>
                    ),
                    estado: (item) => (
                      <td>
                        <CBadge color={getBadge(item.StateID)}>
                          {item.StateID === "1"
                            ? "Activado"
                            : item.StateID === "2"
                            ? "De baja"
                            : "Indefinido"}
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
    </>
  );
};

export default Tables;
