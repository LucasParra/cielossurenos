import React, { useCallback, useEffect, useState } from "react";
import { CCol, CDataTable, CRow, CSwitch } from "@coreui/react";
import { getClients } from "src/state/querys/Users";
import _ from "lodash";
import { supabase } from "src/config/configSupabase";

const ClientsTable = ({ setClientID, ClientID }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const fields = ["Names", "LastName", "Rut", "opciones"];

  const clientEffect = (limit = 1) => {
    setLoading(true);
    getClients(limit).then((clientsApi) => {
      setClients(clientsApi);
      setLoading(false);
    });
  };
  const handleSearchUser = (value, limit = 1) => {
    setSearchText(value);
    if (value === undefined || value === "") return clientEffect();

    setLoading(true);
    supabase
      .from("User")
      .select("*")
      .or(
        `Names.ilike.%${value}%,LastName.ilike.%${value}%,Rut.ilike.%${value}%`
      )
      .limit(limit * 5 + 1)
      .then((snapshot) => {
        setClients(
          snapshot.data.map((user) => ({
            ...user,
          }))
        );
        setLoading(false);
      })
      .catch(console.error);
  };

  useEffect(clientEffect, []);
  const debounceFilter = useCallback(_.debounce(handleSearchUser, 1000), []);
  return (
    <CDataTable
      items={clients}
      fields={fields}
      itemsPerPage={5}
      tableFilter={{
        placeholder: "nombre,rut o apellido",
        label: "Filtrar",
      }}
      onPageChange={(number) => {
        if (searchText === "") return clientEffect(number);
        else return handleSearchUser(searchText, number);
      }}
      loading={loading}
      striped
      onTableFilterChange={debounceFilter}
      pagination
      scopedSlots={{
        opciones: (item) => (
          <td className="py-2" key={item.ID}>
            <CRow className="align-items-center" key={item.ID}>
              <CCol col="2" xs="2" sm="2" md="2" className="mb-2 mb-xl-0">
                <CSwitch
                  className={"mx-1"}
                  variant={"3d"}
                  color={"success"}
                  value={ClientID === item.ID}
                  checked={ClientID === item.ID}
                  onChange={() => setClientID(item.ID)}
                />
              </CCol>
            </CRow>
          </td>
        ),
      }}
    />
  );
};

export default ClientsTable;
