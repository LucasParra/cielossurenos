import React from "react";
import {
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CLabel,
  CRow,
} from "@coreui/react";

const Card = (props) => {
  const { children, header, footer, size = 12 } = props;

  const WrapperTitle = header;

  return (
    <CCol lg={size}>
      <CCard>
        <CCardHeader>
          {typeof titleHeader !== "string" ? (
            WrapperTitle
          ) : (
            <CLabel style={{ fontSize: 20, fontWeight: "bold" }}>
              {header}
            </CLabel>
          )}
        </CCardHeader>
        <CCardBody>
          <CRow>{children}</CRow>
        </CCardBody>
        {footer && (
          <CCardFooter>
            <CLabel style={{ fontSize: 20, fontWeight: "bold" }}>
              {footer}
            </CLabel>
          </CCardFooter>
        )}
      </CCard>
    </CCol>
  );
};

export default Card;
