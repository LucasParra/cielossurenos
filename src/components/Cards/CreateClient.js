import React, { useState } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCarousel,
  CCarouselControl,
  CCarouselInner,
  CCarouselItem,
  CCol,
  CInput,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from "@coreui/react";
import { useKeySelector } from "src/hook/general";
import { Field, Form, Formik } from "formik";
import { SelectOfficesTable } from "../Tables";
import TechniciansTable from "../Tables/TechniciansTable";
import SelecteProductsTable from "../Tables/SelecteProductsTable";
const slides = [
  "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_1607923e7e2%20text%20%7B%20fill%3A%23555%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_1607923e7e2%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23777%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22285.9296875%22%20y%3D%22217.75625%22%3EFirst%20slide%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E",
  "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_15ba800aa20%20text%20%7B%20fill%3A%23444%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_15ba800aa20%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23666%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22247.3203125%22%20y%3D%22218.3%22%3ESecond%20slide%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E",
  "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_15ba800aa21%20text%20%7B%20fill%3A%23333%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_15ba800aa21%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23555%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22277%22%20y%3D%22218.3%22%3EThird%20slide%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E",
];
const CreateClient = () => {
  const { colors } = useKeySelector(["colors"]);
  const [formsProducts, setFormsProducts] = useState([]);
  const [showModalProduct, setShowModalProduct] = useState(false);
  const [showModalOffices, setShowModalOffices] = useState(false);
  const [showModalTechnicians, setShowModalTechnicians] = useState(false);

  return (
    <CRow alignHorizontal="center">
      <CCol xs="12" md="8" className="mb-4">
        <CCard style={{ borderRadius: 20 }}>
          <CCardBody>
            <Formik
              initialValues={{
                firstName: "",
                lastName: "",
                email: "",
              }}
              onSubmit={(values) => {
                console.log(values);
              }}
            >
              <Form>
                <CCarousel>
                  <CCarouselInner>
                    <CCarouselItem>
                      <CRow alignHorizontal="center">
                        <CCol md="12">
                          <h1 style={{ width: "100%", textAlign: "center" }}>
                            Cliente
                          </h1>
                        </CCol>
                        <CCol
                          md="12"
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >
                          <label
                            htmlFor="firstName"
                            style={{
                              fontSize: 15,
                              fontWeight: "bold",
                              marginTop: 10,
                            }}
                          >
                            Nombres
                          </label>
                          <Field
                            id="firstName"
                            style={{
                              width: 300,
                              height: 40,

                              border: `2px solid ${colors.primary}`,
                              borderRadius: 10,
                            }}
                            name="firstName"
                            placeholder="Juan Alexis"
                          />
                          <label
                            htmlFor="firstName"
                            style={{
                              fontSize: 15,
                              fontWeight: "bold",
                              marginTop: 10,
                            }}
                          >
                            Apellidos
                          </label>
                          <Field
                            id="firstName"
                            style={{
                              width: 300,
                              height: 40,
                              border: `2px solid ${colors.primary}`,
                              borderRadius: 10,
                            }}
                            name="firstName"
                            placeholder="Perez Pereira"
                          />
                          <label
                            htmlFor="firstName"
                            style={{
                              fontSize: 15,
                              fontWeight: "bold",
                              marginTop: 10,
                            }}
                          >
                            Rut
                          </label>
                          <Field
                            id="firstName"
                            style={{
                              width: 300,
                              height: 40,
                              border: `2px solid ${colors.primary}`,
                              borderRadius: 10,
                            }}
                            name="firstName"
                            placeholder="xxxxxxxx-x"
                          />
                          <label
                            htmlFor="firstName"
                            style={{
                              fontSize: 15,
                              fontWeight: "bold",
                              marginTop: 10,
                            }}
                          >
                            Correo
                          </label>
                          <Field
                            id="firstName"
                            style={{
                              width: 300,
                              height: 40,
                              border: `2px solid ${colors.primary}`,
                              borderRadius: 10,
                            }}
                            name="firstName"
                            placeholder="correo@gmail.com"
                          />
                          <label
                            htmlFor="firstName"
                            style={{
                              fontSize: 15,
                              fontWeight: "bold",
                              marginTop: 10,
                            }}
                          >
                            Numero de Contacto
                          </label>
                          <Field
                            id="firstName"
                            style={{
                              width: 300,
                              height: 40,
                              border: `2px solid ${colors.primary}`,
                              borderRadius: 10,
                            }}
                            name="firstName"
                            placeholder="965420183"
                          />
                          <label
                            htmlFor="firstName"
                            style={{
                              fontSize: 15,
                              fontWeight: "bold",
                              marginTop: 10,
                            }}
                          >
                            Numero de Contacto Comercial
                          </label>
                          <Field
                            id="firstName"
                            style={{
                              width: 300,
                              height: 40,
                              border: `2px solid ${colors.primary}`,
                              borderRadius: 10,
                            }}
                            name="firstName"
                            placeholder="965420183"
                          />
                          <label
                            htmlFor="firstName"
                            style={{
                              fontSize: 15,
                              fontWeight: "bold",
                              marginTop: 10,
                            }}
                          >
                            Ocupacion
                          </label>
                          <Field
                            id="firstName"
                            style={{
                              width: 300,
                              height: 40,
                              border: `2px solid ${colors.primary}`,
                              borderRadius: 10,
                            }}
                            name="firstName"
                            placeholder=""
                          />
                          <label
                            htmlFor="firstName"
                            style={{
                              fontSize: 15,
                              fontWeight: "bold",
                              marginTop: 10,
                            }}
                          >
                            Fecha de nacimiento
                          </label>
                          <CInput
                            id="FechCon"
                            type="date"
                            placeholder=""
                            style={{
                              width: 300,
                              height: 40,
                              border: `2px solid ${colors.primary}`,
                              borderRadius: 10,
                              marginBottom: 10,
                            }}
                            //   value={moment(formUser.Birthday).format("YYYY-MM-DD")}
                            //   onChange={({ target: { value } }) =>
                            //     setFormUser({
                            //       ...formUser,
                            //       Birthday: moment(value).toDate(),
                            //     })
                            //   }
                          />
                        </CCol>
                      </CRow>
                    </CCarouselItem>
                    <CCarouselItem>
                      <CRow alignHorizontal="center">
                        <CCol md="12">
                          <h1 style={{ width: "100%", textAlign: "center" }}>
                            Compra
                          </h1>
                        </CCol>
                        <CCol
                          md="12"
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >
                          <label
                            htmlFor="firstName"
                            style={{
                              fontSize: 15,
                              fontWeight: "bold",
                              marginTop: 10,
                            }}
                          >
                            Conexiones
                          </label>
                          <Field
                            id="firstName"
                            style={{
                              width: 300,
                              height: 40,
                              textAlign: "center",
                              border: `2px solid ${colors.primary}`,
                              borderRadius: 10,
                            }}
                            name="firstName"
                            placeholder="0"
                          />

                          <label
                            htmlFor="firstName"
                            style={{
                              fontSize: 15,
                              fontWeight: "bold",
                              marginTop: 10,
                            }}
                          >
                            Fecha de contratacion
                          </label>
                          <CInput
                            id="FechCon"
                            type="date"
                            placeholder=""
                            style={{
                              width: 300,
                              height: 40,
                              border: `2px solid ${colors.primary}`,
                              borderRadius: 10,
                              marginBottom: 10,
                            }}
                            //   value={moment(formUser.Birthday).format("YYYY-MM-DD")}
                            //   onChange={({ target: { value } }) =>
                            //     setFormUser({
                            //       ...formUser,
                            //       Birthday: moment(value).toDate(),
                            //     })
                            //   }
                          />
                          <label
                            htmlFor="firstName"
                            style={{
                              fontSize: 15,
                              fontWeight: "bold",
                              marginTop: 10,
                            }}
                          >
                            Tecnico
                          </label>
                          <CButton
                            color="secondary"
                            onClick={() => setShowModalTechnicians(true)}
                            stlye={{
                              width: 300,
                              height: 40,
                            }}
                          >
                            Seleccionar Tecnico
                          </CButton>
                          <label
                            htmlFor="firstName"
                            style={{
                              fontSize: 15,
                              fontWeight: "bold",
                              marginTop: 10,
                            }}
                          >
                            Sucursal
                          </label>
                          <CButton
                            color="secondary"
                            onClick={() => setShowModalOffices(true)}
                            stlye={{
                              width: 300,
                              height: 40,
                            }}
                          >
                            Seleccionar Sucursal
                          </CButton>
                          <label
                            htmlFor="firstName"
                            style={{
                              fontSize: 15,
                              fontWeight: "bold",
                              marginTop: 10,
                            }}
                          >
                            Productos
                          </label>
                          <CButton
                            color="secondary"
                            onClick={() => setShowModalProduct(true)}
                            stlye={{
                              width: 300,
                              height: 40,
                            }}
                          >
                            Seleccionar Productos
                          </CButton>
                        </CCol>
                      </CRow>
                    </CCarouselItem>
                    <CCarouselItem>
                      <CRow alignHorizontal="center">
                        <h1>Direccion</h1>
                      </CRow>
                      <img
                        className="d-block w-100"
                        src={slides[2]}
                        alt="slide 3"
                      />
                      <button type="submit">Submit</button>
                    </CCarouselItem>
                  </CCarouselInner>
                  <CCarouselControl
                    direction="prev"
                    style={{ background: colors.primary }}
                  />
                  <CCarouselControl
                    direction="next"
                    style={{ background: colors.primary }}
                  />
                </CCarousel>
              </Form>
            </Formik>
          </CCardBody>
        </CCard>
      </CCol>
      {/* modal Office */}
      <CModal show={showModalOffices} onClose={setShowModalOffices}>
        <CModalHeader closeButton>
          <CModalTitle>Selecciona la sucursal del usuario</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {/* <SelectOfficesTable setOfficeID={setOfficeID} officeID={officeID} /> */}
        </CModalBody>
        <CModalFooter>
          <CButton color="success" onClick={() => setShowModalOffices(false)}>
            Aceptar
          </CButton>
        </CModalFooter>
      </CModal>
      {/* modal technicians */}
      <CModal show={showModalTechnicians} onClose={setShowModalTechnicians}>
        <CModalHeader closeButton>
          <CModalTitle>Selecciona el tecnico encargado</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <TechniciansTable
          // setTechnicianID={(value) =>
          //   setFormUser({ ...formUser, TechnicianID: value })
          // }
          // TechnicianID={formUser.TechnicianID}
          />
        </CModalBody>
        <CModalFooter>
          <CButton
            color="success"
            onClick={() => setShowModalTechnicians(false)}
          >
            Aceptar
          </CButton>
        </CModalFooter>
      </CModal>
      {/* modal product */}
      <CModal show={showModalProduct} onClose={setShowModalProduct} size="lg">
        <CModalHeader closeButton>
          <CModalTitle>
            Selecciona los productos que quieres asignar a este usuario
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <SelecteProductsTable
            type={"select"}
            productsSelected={formsProducts}
            setProductsSelected={setFormsProducts}
          />
        </CModalBody>
        <CModalFooter>
          <CButton color="success" onClick={() => setShowModalProduct(false)}>
            Aceptar
          </CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  );
};

export default CreateClient;
