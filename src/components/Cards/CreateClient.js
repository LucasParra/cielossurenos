import React from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CInput,
  CLabel,
  CRow,
} from "@coreui/react";
import { useFormik } from "formik";
import moment from "moment";

import { useKeySelector } from "src/hook/general";

const CreateClient = () => {
  const { colors } = useKeySelector(["colors"]);

  const formik = useFormik({
    initialValues: {
      Names: "",
      LastName: "",
      Rut: "",
      JobID: "",
      Email: "",
      PhoneNumber: "",
      JobPhoneNumber: "",
      TechnicianID: 0,
      StateID: "1",
      A_REPACTAD: 0,
      A_RECONNCET: "",
      A_FE_RECON: "",
      A_CONDONAD: 0,
      A_PROMOCIO: "",
      A_FE_PROMO: "",
      A_D_PLAZO: "",
      D_8: "",
      FechCon: new Date(),
      AltaAdm: new Date(),
      BajaAdm: new Date(),
      AltaTec: new Date(),
      BajaTec: new Date(),
      A_FE_REPAC: new Date(),
      Connections: 0,
      Birthday: new Date(),
      RolID: 2,
    },

    onSubmit: (values) => {
      console.log(values);
    },
  });
  console.log(formik);
  return (
    <CRow>
      <CCol xs="12" md="6" className="mb-4">
        <CCard style={{ borderRadius: 20 }}>
          <CCardHeader
            style={{
              textAlign: "center",
              backgroundColor: colors.primary,
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            Datos de cliente
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol style={{ marginBottom: 8 }} xs="12" sm="6">
                <CLabel
                  htmlFor="Rut"
                  style={{ textAlign: "center", fontWeight: "bold" }}
                >
                  Nombres
                </CLabel>
                <CInput
                  id="Names"
                  placeholder="Ingresar los nombres"
                  required
                  name="Names"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.Names}
                />
              </CCol>
              <CCol style={{ marginBottom: 8 }} xs="12" sm="6">
                <CLabel
                  htmlFor="LastName"
                  style={{ textAlign: "center", fontWeight: "bold" }}
                >
                  Apellidos
                </CLabel>
                <CInput
                  id="Rut"
                  placeholder="Ingresar los apellidos"
                  required
                  name="LastName"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.LastName}
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol style={{ marginBottom: 8 }} xs="12" sm="3">
                <CLabel
                  htmlFor="Rut"
                  style={{ textAlign: "center", fontWeight: "bold" }}
                >
                  Rut
                </CLabel>
                <CInput
                  id="Rut"
                  placeholder="18.123.678-3"
                  required
                  maxLength={12}
                  name="Rut"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.Rut}
                />
              </CCol>
              <CCol style={{ marginBottom: 8 }} xs="12" sm="5">
                <CLabel
                  htmlFor="Email"
                  style={{ textAlign: "center", fontWeight: "bold" }}
                >
                  Correo
                </CLabel>
                <CInput
                  id="Email"
                  placeholder="Ingresar email"
                  name="Email"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.Email}
                />
              </CCol>
              <CCol style={{ marginBottom: 8 }} xs="12" sm="4">
                <CLabel
                  htmlFor="JobPhoneNumber"
                  style={{ textAlign: "center", fontWeight: "bold" }}
                >
                  Ocupacion
                </CLabel>
                <CInput
                  id="JobID"
                  placeholder="Ingresar ocupacion"
                  name="JobID"
                  type="numeric"
                  onChange={formik.handleChange}
                  value={formik.values.JobID}
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol style={{ marginBottom: 8 }} xs="12" sm="4">
                <CLabel
                  htmlFor="PhoneNumber"
                  style={{ textAlign: "center", fontWeight: "bold" }}
                >
                  Numero de telefono
                </CLabel>
                <CInput
                  id="PhoneNumber"
                  placeholder="Ingresar numero"
                  name="PhoneNumber"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.PhoneNumber}
                />
              </CCol>
              <CCol style={{ marginBottom: 8 }} xs="12" sm="4">
                <CLabel
                  htmlFor="JobPhoneNumber"
                  style={{ textAlign: "center", fontWeight: "bold" }}
                >
                  Numero comercial
                </CLabel>
                <CInput
                  id="JobPhoneNumber"
                  placeholder="Ingresar numero"
                  name="JobPhoneNumber"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.JobPhoneNumber}
                />
              </CCol>
              <CCol style={{ marginBottom: 8 }} xs="12" sm="4">
                <CLabel
                  htmlFor="Birthday"
                  style={{ textAlign: "center", fontWeight: "bold" }}
                >
                  Fecha de nacimiento
                </CLabel>
                <CInput
                  id="Birthday"
                  name="Birthday"
                  type="date"
                  placeholder=""
                  required
                  value={moment(formik.values.Birthday).format("YYYY-MM-DD")}
                  onChange={formik.handleChange}
                />
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs="12" md="6" className="mb-4">
        <CCard style={{ borderRadius: 20 }}>
          <CCardHeader
            style={{
              textAlign: "center",
              backgroundColor: colors.primary,
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            Direccion
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol style={{ marginBottom: 8 }} xs="12" sm="10">
                <CLabel
                  htmlFor="Rut"
                  style={{ textAlign: "center", fontWeight: "bold" }}
                >
                  Direccion
                </CLabel>
                <CInput
                  id="Names"
                  placeholder="Ingresar la direccion"
                  required
                  name="Names"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.Names}
                />
              </CCol>
              <CCol style={{ marginBottom: 8 }} xs="12" sm="2">
                <CLabel
                  htmlFor="Rut"
                  style={{ textAlign: "center", fontWeight: "bold" }}
                >
                  Numero
                </CLabel>
                <CInput
                  id="Names"
                  required
                  name="Names"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.Names}
                />
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs="12" md="6" className="mb-4">
        <CCard style={{ borderRadius: 20 }}>
          <CCardHeader
            style={{
              textAlign: "center",
              backgroundColor: colors.primary,
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            Producto
          </CCardHeader>
          <CCardBody></CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default CreateClient;
