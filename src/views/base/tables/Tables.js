import React, { useEffect, useState } from "react";
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
import CIcon from "@coreui/icons-react";

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
const fields = [
  "ID",
  "LastName",
  "Names",
  "Rut",
  "JobID",
  "AddressName",
  "AddressNumber",
  "AddressBlockNumber",
  "AddressFloorNumber",
  "AddressApartmentNumber",
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
  "editar",
];

const Tables = () => {
  const [creatingUser, setCreatingUser] = useState(false);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const handleSearchUser = (value) => {
    if (value === "") return componentDidMount();

    setLoading(true);
    supabase
      .from("User")
      .select("*")
      .ilike("Names", `%${value}%`)
      .limit(5)
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
      .select("*")
      .limit(limit * 5 + 1)
      .then((snapshot) => {
        setUsers(snapshot.data);
        setLoading(false);
      })
      .catch(console.error);
  };
  useEffect(componentDidMount, []);
  return (
    <>
      <CRow>
        <CCol xs="12" lg="12">
          {creatingUser ? (
            <CButton
              color="primary"
              style={{ marginBottom: 10 }}
              onClick={() => setCreatingUser(false)}
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
                    console.log(number);
                    componentDidMount(number);
                  }}
                  loading={loading}
                  pagination
                  tableFilter
                  onTableFilterChange={handleSearchUser}
                  scopedSlots={{
                    editar: (item) => (
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
                    ),
                    status: (item) => (
                      <td>
                        <CBadge color={getBadge(item.status)}>
                          {item.status}
                        </CBadge>
                      </td>
                    ),
                  }}
                />
              </CCardBody>
            </CCard>
          </div>
          <div style={{ display: !creatingUser ? "none" : "block" }}>
            <UserForm user={user} />
          </div>
        </CCol>
      </CRow>
    </>
  );
};

export default Tables;
