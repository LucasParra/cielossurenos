import React, { useEffect, useState } from "react";
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
} from "@coreui/react";
import { DocsLink } from "src/reusable";

// import users from "../../users/users";
import { supabase } from "src/config/configSupabase";

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
];

const Tables = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const componentDidMount = (limit = 0) => {
    setLoading(true);
    supabase
      .from("User")
      .select("*")
      .range(limit !== 0 ? limit - 1 * 5 : limit, limit !== 0 ? limit * 5 : 5)
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
        <CCol xs="12" lg="6">
          <CCard>
            <CCardHeader>
              Simple Table
              <DocsLink name="CModal" />
            </CCardHeader>
            <CCardBody>
              <CDataTable
                items={users}
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
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>

        <CCol xs="12" lg="6">
          <CCard>
            <CCardHeader>Striped Table</CCardHeader>
            <CCardBody>
              <CDataTable
                items={users}
                fields={fields}
                striped
                itemsPerPage={5}
                pagination
                scopedSlots={{
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
        </CCol>
      </CRow>

      <CRow>
        <CCol xs="12" lg="6">
          <CCard>
            <CCardHeader>Condensed Table</CCardHeader>
            <CCardBody>
              <CDataTable
                items={users}
                fields={fields}
                size="sm"
                itemsPerPage={5}
                pagination
                scopedSlots={{
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
        </CCol>

        <CCol xs="12" lg="6">
          <CCard>
            <CCardHeader>Bordered Table</CCardHeader>
            <CCardBody>
              <CDataTable
                items={users}
                fields={fields}
                bordered
                itemsPerPage={5}
                pagination
                scopedSlots={{
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
        </CCol>
      </CRow>

      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>Combined All Table</CCardHeader>
            <CCardBody>
              <CDataTable
                items={users}
                fields={fields}
                hover
                striped
                bordered
                size="sm"
                itemsPerPage={10}
                pagination
                scopedSlots={{
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
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>Combined All dark Table</CCardHeader>
            <CCardBody>
              <CDataTable
                items={users}
                fields={fields}
                dark
                hover
                striped
                bordered
                size="sm"
                itemsPerPage={10}
                pagination
                scopedSlots={{
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
        </CCol>
      </CRow>
    </>
  );
};

export default Tables;
