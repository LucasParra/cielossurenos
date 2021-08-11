import React from "react";
import { useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormGroup,
  CInput,
  CLabel,
  CSelect,
  CRow,
  CButton,
  CForm,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from "@coreui/react";
import _ from "lodash";
import ProductTable from "src/components/Tables/ProductsTable";
import TechniciansTable from "src/components/Tables/TechniciansTable";
import {
  createUser,
  createUserAddress,
  createUserProduct,
} from "src/state/querys/Users";
import moment from "moment";
import { createAddress } from "src/state/querys/Address";

const Forms = () => {
  const [formUser, setFormUser] = useState({
    Names: "",
    LastName: "",
    Rut: "",
    JobID: 0,
    PhoneNumber: "",
    JobPhoneNumber: "",
    TechnicianID: 0,
    StateID: "",
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
    Conections: 0,
  });
  const [formsAddress, setFormsAddress] = useState([
    {
      AddressName: "",
      AddressNumber: 0,
      AddressBlockNumber: 0,
      AddressFloorNumber: 0,
      AddressApartmentNumber: 0,
      AddressZoneID: 0,
      AddressArea: "",
    },
  ]);
  const [formsProducts, setFormsProducts] = useState([]);
  const [modalProduct, setModalProduct] = useState(false);
  const [modalTechnicians, setModalTechnicians] = useState(false);

  const handleCreateUser = () => {
    createUser(formUser).then((newUserID) => {
      formsProducts.map((product) =>
        createUserProduct({ ...product, UserID: newUserID })
      );
      formsAddress.map((address) => {
        createAddress(address).then((newaddressID) => {
          createUserAddress({ AddressID: newaddressID, UserID: newUserID });
        });
      });
      setFormUser({
        Names: "",
        LastName: "",
        Rut: "",
        JobID: 0,
        PhoneNumber: "",
        JobPhoneNumber: "",
        TechnicianID: 0,
        StateID: "",
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
        Conections: 0,
      });
    });
    return null;
  };

  return (
    <>
      <CForm>
        <CRow>
          <CCol xs="12" sm="6">
            <CCard>
              <CCardHeader>Usuario</CCardHeader>
              <CCardBody>
                <CRow>
                  <CCol style={{ marginBottom: 8 }} xs="12" sm="6">
                    <CLabel htmlFor="Names">Nombres</CLabel>
                    <CInput
                      id="Names"
                      placeholder="Ingresa tus nombres"
                      required
                      onChange={({ target: { value } }) =>
                        setFormUser({ ...formUser, Names: value })
                      }
                    />
                  </CCol>
                  <CCol style={{ marginBottom: 8 }} xs="12" sm="6">
                    <CLabel htmlFor="LastName">Apellidos</CLabel>
                    <CInput
                      id="LastName"
                      placeholder="Ingresa tus apellidos"
                      required
                      onChange={({ target: { value } }) =>
                        setFormUser({ ...formUser, LastName: value })
                      }
                    />
                  </CCol>
                  <CCol style={{ marginBottom: 8 }} xs="12" sm="6">
                    <CLabel htmlFor="Rut">Rut</CLabel>
                    <CInput
                      id="Rut"
                      placeholder=" Ejemplo:18.123.678-3"
                      required
                      onChange={({ target: { value } }) =>
                        setFormUser({ ...formUser, Rut: value })
                      }
                    />
                  </CCol>
                  <CCol style={{ marginBottom: 8 }} xs="12" sm="6">
                    <CLabel htmlFor="JobID">Numero de telefono</CLabel>
                    <CInput
                      id="PhoneNumber"
                      placeholder="964410376"
                      required
                      onChange={({ target: { value } }) =>
                        setFormUser({ ...formUser, PhoneNumber: value })
                      }
                    />
                  </CCol>
                  <CCol style={{ marginBottom: 8 }} xs="12" sm="6">
                    <CLabel htmlFor="JobID">
                      Numero de telefono comercial
                    </CLabel>
                    <CInput
                      id="JobPhoneNumber"
                      placeholder="964410376"
                      onChange={({ target: { value } }) =>
                        setFormUser({ ...formUser, JobPhoneNumber: value })
                      }
                    />
                  </CCol>
                  <CCol style={{ marginBottom: 8 }} xs="12" sm="3">
                    <CLabel htmlFor="JobID">Ocupacion</CLabel>
                    <CInput
                      id="JobID"
                      placeholder=""
                      onChange={({ target: { value } }) =>
                        setFormUser({ ...formUser, JobID: parseInt(value) })
                      }
                    />
                  </CCol>
                  <CCol style={{ marginBottom: 8 }} xs="12" sm="3">
                    <CLabel htmlFor="TechnicianID">TechnicianID</CLabel>
                    <CButton
                      variant="outline"
                      color="success"
                      onClick={() => setModalTechnicians(true)}
                      block
                    >
                      Tecnicos
                    </CButton>
                    {/* <CInput
                      id="TechnicianID"
                      placeholder=""
                      required
                      onChange={({ target: { value } }) =>
                        setFormUser({ ...formUser, TechnicianID: value })
                      }
                    /> */}
                  </CCol>
                  <CCol style={{ marginBottom: 8 }} xs="12" sm="3">
                    <CLabel htmlFor="StateID">StateID</CLabel>
                    <CInput
                      id="StateID"
                      placeholder=""
                      required
                      onChange={({ target: { value } }) =>
                        setFormUser({ ...formUser, StateID: value })
                      }
                    />
                  </CCol>
                  <CCol style={{ marginBottom: 8 }} xs="12" sm="3">
                    <CLabel htmlFor="A_REPACTAD">A_REPACTAD</CLabel>
                    <CInput
                      id="A_REPACTAD"
                      placeholder=""
                      required
                      onChange={({ target: { value } }) =>
                        setFormUser({
                          ...formUser,
                          A_REPACTAD: parseInt(value),
                        })
                      }
                    />
                  </CCol>
                  <CCol style={{ marginBottom: 8 }} xs="12" sm="3">
                    <CLabel htmlFor="A_RECONNCET">A_RECONNCET</CLabel>
                    <CInput
                      id="A_RECONNCET"
                      placeholder=""
                      required
                      onChange={({ target: { value } }) =>
                        setFormUser({ ...formUser, A_RECONNCET: value })
                      }
                    />
                  </CCol>
                  <CCol style={{ marginBottom: 8 }} xs="12" sm="3">
                    <CLabel htmlFor="A_FE_RECON">A_FE_RECON</CLabel>
                    <CInput
                      id="A_FE_RECON"
                      placeholder=""
                      required
                      onChange={({ target: { value } }) =>
                        setFormUser({ ...formUser, A_FE_RECON: value })
                      }
                    />
                  </CCol>
                  <CCol style={{ marginBottom: 8 }} xs="12" sm="3">
                    <CLabel htmlFor="A_CONDONAD">A_CONDONAD</CLabel>
                    <CInput
                      id="A_CONDONAD"
                      placeholder=""
                      required
                      onChange={({ target: { value } }) =>
                        setFormUser({ ...formUser, A_CONDONAD: value })
                      }
                    />
                  </CCol>
                  <CCol style={{ marginBottom: 8 }} xs="12" sm="3">
                    <CLabel htmlFor="A_PROMOCIO">A_PROMOCIO</CLabel>
                    <CInput
                      id="A_PROMOCIO"
                      placeholder=""
                      required
                      onChange={({ target: { value } }) =>
                        setFormUser({ ...formUser, A_PROMOCIO: value })
                      }
                    />
                  </CCol>
                  <CCol style={{ marginBottom: 8 }} xs="12" sm="3">
                    <CLabel htmlFor="A_FE_PROMO">A_FE_PROMO</CLabel>
                    <CInput
                      id="A_FE_PROMO"
                      placeholder=""
                      required
                      onChange={({ target: { value } }) =>
                        setFormUser({ ...formUser, A_FE_PROMO: value })
                      }
                    />
                  </CCol>
                  <CCol style={{ marginBottom: 8 }} xs="12" sm="3">
                    <CLabel htmlFor="A_D_PLAZO">A_D_PLAZO</CLabel>
                    <CInput
                      id="A_D_PLAZO"
                      placeholder=""
                      required
                      onChange={({ target: { value } }) =>
                        setFormUser({ ...formUser, A_D_PLAZO: value })
                      }
                    />
                  </CCol>
                  <CCol style={{ marginBottom: 8 }} xs="12" sm="3">
                    <CLabel htmlFor="D_8">D_8</CLabel>
                    <CInput
                      id="D_8"
                      placeholder=""
                      required
                      onChange={({ target: { value } }) =>
                        setFormUser({ ...formUser, D_8: value })
                      }
                    />
                  </CCol>
                  <CCol style={{ marginBottom: 8 }} xs="12" sm="3">
                    <CLabel htmlFor="D_8">Conections</CLabel>
                    <CInput
                      id="D_8"
                      placeholder=""
                      required
                      onChange={({ target: { value } }) =>
                        setFormUser({ ...formUser, Conections: value })
                      }
                    />
                  </CCol>
                  <CCol style={{ marginBottom: 8 }} xs="12" sm="3">
                    <CLabel htmlFor="FechCon">FechCon</CLabel>
                    <CInput
                      id="FechCon"
                      type="date"
                      placeholder=""
                      required
                      onChange={({ target: { value } }) =>
                        setFormUser({
                          ...formUser,
                          FechCon: moment(value).toDate(),
                        })
                      }
                    />
                  </CCol>
                  <CCol style={{ marginBottom: 8 }} xs="12" sm="3">
                    <CLabel htmlFor="AltaAdm">AltaAdm</CLabel>
                    <CInput
                      id="AltaAdm"
                      type="date"
                      placeholder=""
                      required
                      onChange={({ target: { value } }) =>
                        setFormUser({
                          ...formUser,
                          AltaAdm: moment(value).toDate(),
                        })
                      }
                    />
                  </CCol>
                  <CCol style={{ marginBottom: 8 }} xs="12" sm="3">
                    <CLabel htmlFor="BajaAdm">BajaAdm</CLabel>
                    <CInput
                      id="BajaAdm"
                      type="date"
                      placeholder=""
                      required
                      onChange={({ target: { value } }) =>
                        setFormUser({
                          ...formUser,
                          BajaAdm: moment(value).toDate(),
                        })
                      }
                    />
                  </CCol>
                  <CCol style={{ marginBottom: 8 }} xs="12" sm="3">
                    <CLabel htmlFor="AltaTec">AltaTec</CLabel>
                    <CInput
                      id="AltaTec"
                      type="date"
                      placeholder=""
                      required
                      onChange={({ target: { value } }) =>
                        setFormUser({
                          ...formUser,
                          AltaTec: moment(value).toDate(),
                        })
                      }
                    />
                  </CCol>
                  <CCol style={{ marginBottom: 8 }} xs="12" sm="3">
                    <CLabel htmlFor="BajaTec">BajaTec</CLabel>
                    <CInput
                      id="BajaTec"
                      type="date"
                      placeholder=""
                      required
                      onChange={({ target: { value } }) =>
                        setFormUser({
                          ...formUser,
                          BajaTec: moment(value).toDate(),
                        })
                      }
                    />
                  </CCol>
                  <CCol style={{ marginBottom: 8 }} xs="12" sm="3">
                    <CLabel htmlFor="A_FE_REPAC">A_FE_REPAC</CLabel>
                    <CInput
                      id="A_FE_REPAC"
                      type="date"
                      placeholder=""
                      required
                      onChange={({ target: { value } }) =>
                        setFormUser({
                          ...formUser,
                          A_FE_REPAC: moment(value).toDate(),
                        })
                      }
                    />
                  </CCol>

                  <CCol style={{ marginBottom: 8 }} xs="12" sm="12">
                    <CButton
                      variant="outline"
                      color="info"
                      onClick={() => setModalProduct(!modalProduct)}
                      size="lg"
                      block
                    >
                      Productos
                    </CButton>
                  </CCol>
                </CRow>

                {/* <CFormGroup>
                  <CLabel htmlFor="Names">Nombres</CLabel>
                  <CInput
                    id="Names"
                    placeholder="Ingresa tus nombres"
                    required
                  />
                  <CLabel htmlFor="LastName">Apellidos</CLabel>
                  <CInput
                    id="LastName"
                    placeholder="Ingresa tus apellidos"
                    required
                  />
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="dni">Rut</CLabel>
                  <CInput
                    id="dni"
                    placeholder=" Ejemplo:18.123.678-3"
                    required
                  />
                </CFormGroup>
                {addressList.map((currentAddress, i) => (
                  <CFormGroup>
                    <CCol style={{marginBottom8}} xs="14" md="14">
                      <CLabel htmlFor="address">Dirección</CLabel>
                      <CInput
                        id="address"
                        placeholder="Ingresa tu dirección"
                        value={currentAddress.address}
                        onChange={(e) => handleInputChange(e, i)}
                        required
                      />
                      {addressList.length !== 1 && (
                        <CButton
                          className="mr10"
                          onClick={() => handleRemoveClick(i)}
                          type="button"
                          color="secondary"
                          variant="ghost"
                        >
                          Eliminar
                        </CButton>
                      )}
                      {addressList.length - 1 === i &&
                        currentAddress.address.length > 0 && (
                          <CButton
                            onClick={handleAddClick}
                            type="button"
                            color="secondary"
                            variant="ghost"
                            value="Input"
                          >
                            Añadir
                          </CButton>
                        )}
                    </CCol>
                  </CFormGroup>
                ))}
                <CFormGroup row className="my-0">
                  <CCol style={{marginBottom8}} xs="9">
                    <CFormGroup>
                      <CLabel htmlFor="phone-number">
                        Número de Teléfono 1
                      </CLabel>
                      <CInput
                        id="phone1"
                        placeholder="Ejemplo: 934532244"
                        required
                      />
                    </CFormGroup>
                  </CCol>
                  <CCol style={{marginBottom8}} xs="9">
                    <CFormGroup>
                      <CLabel htmlFor="phone-number">
                        Número de Teléfono 2
                      </CLabel>
                      <CInput
                        id="phone2"
                        placeholder="Ejemplo: 934532244"
                        required
                      />
                    </CFormGroup>
                  </CCol>
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="email">Correo</CLabel>
                  <CInput id="correo" placeholder="Ingresa tu email" required />
                </CFormGroup>
                <CFormGroup row>
                  <CLabel htmlFor="zone">Zona Horaria</CLabel>
                  <CCol style={{marginBottom8}} xs="8" md="8">
                    <CSelect custom name="zone" id="zone">
                      <option value="0">Selecciona Zona o Localidad</option>
                      <option value="1">Zone 1</option>
                      <option value="2">Zone 2</option>
                      <option value="3">Zone 3</option>
                      <option value="4">Zone 4</option>
                      <option value="5">Zone 5</option>
                      <option value="6">Zone 6</option>
                      <option value="7">Zone 7</option>
                      <option value="8">Zone 8</option>
                      <option value="9">Zone 9</option>
                      <option value="10">Zone 10</option>
                    </CSelect>
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CLabel htmlFor="sucursal">Sucursal</CLabel>
                  <CCol style={{marginBottom8}} xs="12" md="8">
                    <CSelect custom name="select" id="select">
                      <option disabled>Selecciona Sucursal</option>
                      <option disabled>Viña del Mar</option>
                      <option disabled>Temuco</option>
                    </CSelect>
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol style={{marginBottom8}} xs="12" md="6">
                    <CLabel htmlFor="ccyear">
                      Fecha de Ingreso o Antiguedad
                    </CLabel>
                    <CInput
                      type="date"
                      id="date-input"
                      name="date-input"
                      placeholder="date"
                      required
                    />
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol style={{marginBottom8}} xs="12" md="6">
                    <CLabel htmlFor="ccyear">Fecha de nacimiento</CLabel>
                    <CInput
                      type="date"
                      id="date-input"
                      name="date-input"
                      placeholder="date"
                      required
                    />
                  </CCol>
                </CFormGroup>
                <CButton
                  onClick={() => setModalProduct(!modalProduct)}
                  className="mr-1"
                >
                  Productos
                </CButton>
                <CCol style={{marginBottom8}} xs="12" md="5">
                  <CButton
                    type="submit"
                    className="btn btn-primary"
                    onClick={(e) => handleSubmit(e)}
                    color="primary"
                  >
                    Crear
                  </CButton>
                </CCol> */}
              </CCardBody>
            </CCard>
          </CCol>
          <CCol xs="12" sm="6">
            <CCard>
              <CCardHeader>Direccion</CCardHeader>
              <CCardBody
                style={{
                  overflowY: "scroll",
                  position: "relative",
                  maxHeight: 595,
                }}
              >
                {formsAddress.map((data, index) => (
                  <CRow>
                    <CCol style={{ marginBottom: 8 }} xs="12" sm="9">
                      <h3>direccion {index + 1} : </h3>
                    </CCol>
                    <CCol style={{ marginBottom: 8 }} xs="12" sm="9">
                      <CLabel htmlFor="AddressName">AddressName</CLabel>
                      <CInput
                        id="AddressName"
                        placeholder=""
                        required
                        onChange={({ target: { value } }) => {
                          const newAddress = [..._.clone(formsAddress)];
                          newAddress[index].AddressName = value;
                          setFormsAddress(newAddress);
                        }}
                      />
                    </CCol>
                    <CCol style={{ marginBottom: 8 }} xs="12" sm="3">
                      <CLabel htmlFor="AddressNumber">AddressNumber</CLabel>
                      <CInput
                        id="AddressNumber"
                        placeholder="0"
                        required
                        onChange={({ target: { value } }) => {
                          const newAddress = [..._.clone(formsAddress)];
                          newAddress[index].AddressNumber = value;
                          setFormsAddress(newAddress);
                        }}
                      />
                    </CCol>
                    <CCol style={{ marginBottom: 8 }} xs="12" sm="4">
                      <CLabel htmlFor="AddressBlockNumber">
                        AddressBlockNumber
                      </CLabel>
                      <CInput
                        id="AddressBlockNumber"
                        placeholder="0"
                        required
                        onChange={({ target: { value } }) => {
                          const newAddress = [..._.clone(formsAddress)];
                          newAddress[index].AddressBlockNumber = value;
                          setFormsAddress(newAddress);
                        }}
                      />
                    </CCol>
                    <CCol style={{ marginBottom: 8 }} xs="12" sm="4">
                      <CLabel htmlFor="AddressFloorNumber">
                        AddressFloorNumber
                      </CLabel>
                      <CInput
                        id="AddressFloorNumber"
                        placeholder="0"
                        required
                        onChange={({ target: { value } }) => {
                          const newAddress = [..._.clone(formsAddress)];
                          newAddress[index].AddressFloorNumber = value;
                          setFormsAddress(newAddress);
                        }}
                      />
                    </CCol>
                    <CCol style={{ marginBottom: 8 }} xs="12" sm="4">
                      <CLabel htmlFor="AddressApartmentNumber">
                        AddressApartmentNumber
                      </CLabel>
                      <CInput
                        id="AddressApartmentNumber"
                        placeholder="0"
                        required
                        onChange={({ target: { value } }) => {
                          const newAddress = [..._.clone(formsAddress)];
                          newAddress[index].AddressApartmentNumber = value;
                          setFormsAddress(newAddress);
                        }}
                      />
                    </CCol>
                    <CCol style={{ marginBottom: 8 }} xs="12" sm="12">
                      <CLabel htmlFor="zone">Zona Horaria</CLabel>
                      <CSelect custom name="zone" id="zone">
                        <option value="0">Selecciona Zona o Localidad</option>
                        <option value="1">Zone 1</option>
                        <option value="2">Zone 2</option>
                        <option value="3">Zone 3</option>
                        <option value="4">Zone 4</option>
                        <option value="5">Zone 5</option>
                        <option value="6">Zone 6</option>
                        <option value="7">Zone 7</option>
                        <option value="8">Zone 8</option>
                        <option value="9">Zone 9</option>
                        <option value="10">Zone 10</option>
                      </CSelect>
                    </CCol>
                    {formsAddress.length === index + 1 && (
                      <>
                        <CCol xs="12" sm="2">
                          <CButton
                            variant="outline"
                            color="success"
                            onClick={() =>
                              setFormsAddress([
                                ...formsAddress,
                                {
                                  AddressName: "",
                                  AddressNumber: 0,
                                  AddressBlockNumber: 0,
                                  AddressFloorNumber: 0,
                                  AddressApartmentNumber: 0,
                                  AddressZoneID: 0,
                                  AddressArea: "",
                                },
                              ])
                            }
                          >
                            Añadir
                          </CButton>
                        </CCol>
                        <CCol xs="12" sm="2">
                          {formsAddress.length !== 1 && (
                            <CButton
                              variant="outline"
                              color="danger"
                              onClick={() =>
                                setFormsAddress(
                                  formsAddress.filter(
                                    (address, indexAddres) =>
                                      indexAddres !== index
                                  )
                                )
                              }
                            >
                              Eliminar
                            </CButton>
                          )}
                        </CCol>
                      </>
                    )}
                  </CRow>
                ))}
              </CCardBody>
            </CCard>
          </CCol>
          <CCol xs="12" sm="12">
            <CCard>
              <CCardBody>
                <CButton
                  variant="outline"
                  color="success"
                  onClick={(e) => handleCreateUser(e)}
                  size="lg"
                  block
                >
                  Crear
                </CButton>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CForm>

      {/* modal technicians */}
      <CModal show={modalTechnicians} onClose={setModalTechnicians}>
        <CModalHeader closeButton>
          <CModalTitle>Selecciona el tecnico encargado</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <TechniciansTable
            setTechnicianID={(value) =>
              setFormUser({ ...formUser, TechnicianID: value })
            }
            TechnicianID={formUser.TechnicianID}
          />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalTechnicians(false)}>
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>
      {/* modal product */}
      <CModal show={modalProduct} onClose={setModalProduct} size="lg">
        <CModalHeader closeButton>
          <CModalTitle>
            Selecciona los productos que quieres asignar a este usuario
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <ProductTable
            type={"select"}
            productsSelected={formsProducts}
            setProductsSelected={setFormsProducts}
          />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalProduct(false)}>
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default Forms;
