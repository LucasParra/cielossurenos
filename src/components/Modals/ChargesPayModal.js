import {
  CButton,
  CCol,
  CInput,
  CLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from "@coreui/react";
import React, { useCallback, useEffect, useState } from "react";

const ChargesPayModal = ({ onFinish, show, setShow, nameEdit }) => {
  const [name, setName] = useState(nameEdit || "");

  useEffect(() => setName(nameEdit || ""), [nameEdit]);
  return (
    <CModal show={show} onClose={setShow} size="sm">
      <CModalHeader>
        <CModalTitle
          style={{
            fontWeight: "bold",
            width: "100%",
            textAlign: "center",
          }}
        >
          {`${nameEdit ? "Editar" : "Crear"} `} Cargo
        </CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CLabel
          htmlFor="name"
          style={{
            fontWeight: "bold",
          }}
        >
          Nombre
        </CLabel>
        <CInput
          id="name"
          name="name"
          value={name}
          onChange={({ target: { value } }) => setName(value)}
        />
      </CModalBody>
      <CModalFooter>
        <CRow style={{ width: "100%" }}>
          <CCol col="6">
            <CButton
              color="success"
              onClick={() => onFinish(name)}
              style={{ fontWeight: "bold", width: "100%" }}
            >
              {`${nameEdit ? "Editar" : "Crear"}`}
            </CButton>
          </CCol>
          <CCol col="6">
            <CButton
              onClick={() => setShow(false)}
              color="secondary"
              style={{ fontWeight: "bold", width: "100%" }}
            >
              Cancelar
            </CButton>
          </CCol>
        </CRow>
      </CModalFooter>
    </CModal>
  );
};

export default ChargesPayModal;
