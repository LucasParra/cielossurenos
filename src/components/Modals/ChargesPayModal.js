import {
  CButton,
  CCol,
  CForm,
  CInput,
  CLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from "@coreui/react";
import React, { useEffect, useState } from "react";

const ChargesPayModal = ({ onFinish, show, setShow, nameEdit }) => {
  const [name, setName] = useState(nameEdit || "");
  const [validated, setValidated] = useState(false);

  useEffect(() => setName(nameEdit || ""), [nameEdit]);
  return (
    <CModal show={show} onClose={setShow} size="sm">
      <CForm className={validated ? "was-validated" : ""}>
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
            required
            onChange={({ target: { value } }) => setName(value)}
          />
        </CModalBody>
        <CModalFooter>
          <CRow style={{ width: "100%" }}>
            <CCol col="6">
              <CButton
                color="success"
                onClick={() => {
                  if (name === "") return setValidated(true);

                  onFinish(name);
                  setValidated(false);
                }}
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
      </CForm>
    </CModal>
  );
};

export default ChargesPayModal;
