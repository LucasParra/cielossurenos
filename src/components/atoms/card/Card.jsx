import React from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CLabel,
  CRow,
} from "@coreui/react";

const Card = (props) => {
  const { children, titleHeader, size = 12 } = props;
  return (
    <CCol lg={size}>
      <CCard>
        <CCardHeader>
          <CLabel style={{ fontSize: 20, fontWeight: "bold" }}>
            {titleHeader}
          </CLabel>
        </CCardHeader>
        <CCardBody>
          <CRow>{children}</CRow>
        </CCardBody>
      </CCard>
    </CCol>
  );
};

export default Card;
