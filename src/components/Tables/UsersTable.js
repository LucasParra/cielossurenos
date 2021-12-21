import React, { useCallback, useEffect, useState } from "react";

import { freeSet } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { CButton, CCol, CDataTable, CRow } from "@coreui/react";
import { format } from "rut.js";
import _ from "lodash";

import { getUsersClients } from "src/state/querys/Users";

const fields = ["nombre", "rut", "numero_de_contacto", "productos"];

const UsersTable = ({ handleClient }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  const usersEffect = (value, limit = 1) => {
    setSearchText(
      /^[0-9]*$/.test(value) ? format(value).replace(/\./g, "") : value
    );
    setLoading(true);
    getUsersClients(limit, value).then((usersResponse) => {
      setUsers(
        usersResponse.map((user) => ({
          ID: user.ID,
          nombre: `${user.Names} ${user.LastName}`,
          rut: user.Rut,
          numero_de_contacto: user.PhoneNumber,
        }))
      );
      setLoading(false);
    });
  };
  const debounceFilter = useCallback(_.debounce(usersEffect, 1000), []);

  useEffect(usersEffect, []);
  return (
    <CDataTable
      items={users}
      fields={fields}
      itemsPerPage={5}
      onPageChange={(number) => usersEffect(searchText, number)}
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
        productos: (item) => (
          <td className="py-2">
            <CRow className="align-items-center" key={item.ID}>
              <CCol col="2" xs="2" sm="2" md="2" className="mb-2 mb-xl-0">
                <CButton
                  color="secondary"
                  onClick={() => handleClient(item.ID)}
                >
                  <CIcon content={freeSet.cilListRich} size="lg" />
                </CButton>
              </CCol>
            </CRow>
          </td>
        ),
      }}
    />
  );
};

export default UsersTable;
