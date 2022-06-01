import React from "react";
import { CButton, CCol, CRow } from "@coreui/react";
import CIcon from "@coreui/icons-react";

const ButtonOptionTable = ({ onPress, color, icon }) => {
  return (
    <td className="py-2">
      <CRow className="align-items-center">
        <CCol col="2" xs="2" sm="2" md="2" className="mb-2 mb-xl-0">
          <CButton color={color} onClick={onPress}>
            <CIcon content={icon} size="xl" />
          </CButton>
        </CCol>
      </CRow>
    </td>
  );
};

export default ButtonOptionTable;
