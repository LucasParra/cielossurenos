import React, { useEffect, useState } from "react";
import { CCol, CDataTable, CRow, CSwitch } from "@coreui/react";
import { getOffices } from "src/state/querys/Office";

const OfficesTable = ({ setOfficeID, officeID }) => {
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(false);
  const fields = ["ID", "nombre", "opciones"];
  const officesEffects = () => {
    setLoading(true);
    getOffices().then((Offices) => {
      setOffices(Offices.map((office) => ({ ...office, nombre: office.Name })));
      setLoading(false);
    });
  };

  useEffect(officesEffects, []);
  return (
    <CDataTable
      items={offices}
      fields={fields}
      itemsPerPage={5}
      onPageChange={officesEffects}
      loading={loading}
      pagination
      scopedSlots={{
        opciones: (item) => (
          <td className="py-2">
            <CRow className="align-items-center" key={item.ID}>
              <CCol col="2" xs="2" sm="2" md="2" className="mb-2 mb-xl-0">
                <CSwitch
                  className={"mx-1"}
                  variant={"3d"}
                  color={"success"}
                  value={officeID === item.ID}
                  checked={officeID === item.ID}
                  onChange={() => setOfficeID(item.ID)}
                />
              </CCol>
            </CRow>
          </td>
        ),
      }}
    />
  );
};

export default OfficesTable;
