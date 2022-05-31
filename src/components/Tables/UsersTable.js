import React, { useCallback, useEffect, useState } from "react";

import { freeSet } from "@coreui/icons";
import { CDataTable } from "@coreui/react";
import _ from "lodash";

import { getUsersClients } from "src/state/querys/Users";
import { ButtonOptionTable } from "../buttons";

const fields = ["nombre", "rut", "numero_de_contacto", "productos"];

const UsersTable = ({ handleClient }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  const usersEffect = (value = "", limit = 1) => {
    setLoading(true);
    setSearchText(value);
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
  const debounceFilter = useCallback(
    (value, limit) => _.debounce(usersEffect(value, limit), 1000),
    []
  );

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
        placeholder: "rut",
        label: "Filtrar",
      }}
      striped
      onTableFilterChange={debounceFilter}
      scopedSlots={{
        productos: (item) => (
          <ButtonOptionTable
            color="secondary"
            icon={freeSet.cilListRich}
            onPress={() => handleClient(item.ID)}
          />
        ),
      }}
    />
  );
};

export default UsersTable;
