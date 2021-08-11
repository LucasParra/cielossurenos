import React, { useEffect, useState } from "react";
import { CCol, CDataTable, CRow, CSwitch } from "@coreui/react";
import { getTechnicians } from "src/state/querys/Users";

const TechniciansTable = ({ setTechnicianID, TechnicianID }) => {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(false);
  const fields = ["Names", "LastName", "opciones"];
  const techniciansEffect = (limit) => {
    setLoading(true);
    getTechnicians().then((techniciansApi) => {
      setTechnicians(techniciansApi);
      setLoading(false);
    });
  };

  useEffect(techniciansEffect, []);
  return (
    <CDataTable
      items={technicians}
      fields={fields}
      itemsPerPage={5}
      onPageChange={techniciansEffect}
      loading={loading}
      pagination
      scopedSlots={{
        opciones: (item, index) => (
          <td className="py-2">
            <CRow className="align-items-center" key={item.ID}>
              <CCol col="2" xs="2" sm="2" md="2" className="mb-2 mb-xl-0">
                <CSwitch
                  className={"mx-1"}
                  variant={"3d"}
                  color={"success"}
                  value={TechnicianID === item.ID}
                  onChange={() => setTechnicianID(item.ID)}
                />
              </CCol>
            </CRow>
          </td>
        ),
      }}
    />
  );
};

export default TechniciansTable;