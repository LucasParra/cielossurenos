import {
  CButton,
  CCol,
  CModal,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from "@coreui/react";
import React from "react";

const DeleteModal = ({ show, setShow, onFinish }) => {
  return (
    <CModal show={show} color="danger" onClose={() => setShow(false)} size="sm">
      <CModalHeader>
        <CModalTitle
          style={{
            fontWeight: "bold",
            width: "100%",
            textAlign: "center",
          }}
        >
          Estas seguro?
        </CModalTitle>
      </CModalHeader>
      <CModalFooter>
        <CRow style={{ width: "100%" }}>
          <CCol col="6">
            <CButton
              color="danger"
              onClick={onFinish}
              style={{ fontWeight: "bold", width: "100%" }}
            >
              Si
            </CButton>
          </CCol>
          <CCol col="6">
            <CButton
              onClick={() => setShow(false)}
              color="secondary"
              style={{ fontWeight: "bold", width: "100%" }}
            >
              No
            </CButton>
          </CCol>
        </CRow>
      </CModalFooter>
    </CModal>
  );
};

export default DeleteModal;
