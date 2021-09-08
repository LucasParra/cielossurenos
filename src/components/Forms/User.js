import React, { useEffect } from "react";
import { useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
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
  CInvalidFeedback,
} from "@coreui/react";
import _ from "lodash";
import ProductTable from "src/components/Tables/ProductsTable";
import TechniciansTable from "src/components/Tables/TechniciansTable";
import {
  createUser,
  createUserAddress,
  createUserProduct,
  getUserByRut,
  updateUserAddress,
  updateUserID,
  updateUserProduct,
} from "src/state/querys/Users";
import moment from "moment";
import {
  createAddress,
  getAddressByUserID,
  updateAddress,
} from "src/state/querys/Address";
import { clean, format } from "rut.js";
import { getProductByIDUser } from "src/state/querys/Product";
import { createTask } from "src/state/querys/Tasks";

const initUser = {
  Names: "",
  LastName: "",
  Rut: "",
  JobID: "",
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
  Conections: 0,
};
const initAddress = [
  {
    AddressName: "",
    AddressNumber: 0,
    AddressBlockNumber: 0,
    AddressFloorNumber: 0,
    AddressApartmentNumber: 0,
    AddressZoneID: 0,
    AddressArea: "",
  },
];
const UserForm = ({ user, onClose }) => {
  const [formUser, setFormUser] = useState(initUser);
  const [formsAddress, setFormsAddress] = useState(initAddress);
  const [formsProducts, setFormsProducts] = useState([]);
  const [modalProduct, setModalProduct] = useState(false);
  const [validated, setValidated] = useState(false);
  const [modalTechnicians, setModalTechnicians] = useState(false);
  const [validatedRut, setValidatedRut] = useState(false);

  const handleCreateUser = () => {
    if (validatedRut) return;

    const { Names, LastName, Rut, PhoneNumber, Conections } = formUser;
    const { AddressName } = formsAddress;

    if (
      Names === "" ||
      LastName === "" ||
      Rut === "" ||
      PhoneNumber === "" ||
      Conections === 0 ||
      AddressName === ""
    )
      return setValidated(true);

    if (user.ID) {
      updateUserID({ ...formUser }).then(() => {
        Promise.all([
          formsProducts.map((product) =>
            product.ID
              ? updateUserProduct({ ...product, UserID: user.ID })
              : createUserProduct({ ...product, UserID: user.ID })
          ),
          formsAddress.map((address, index) => {
            address.ID
              ? updateAddress(address).then((newaddressID) => {
                  updateUserAddress({
                    AddressID: newaddressID,
                    UserID: user.ID,
                  });

                  if (index + 1 === formsAddress.length) {
                    setFormUser(initUser);
                    setFormsAddress(initAddress);
                    setValidated(false);
                    onClose();
                  }
                })
              : createAddress(address).then((newaddressID) => {
                  createUserAddress({
                    AddressID: newaddressID,
                    UserID: user.ID,
                  });

                  if (index + 1 === formsAddress.length) {
                    setFormUser(initUser);
                    setFormsAddress(initAddress);
                    onClose();
                    setValidated(false);
                  }
                });
          }),
        ]);
      });
    } else
      return createUser(formUser).then((newUserID) => {
        Promise.all([
          formsProducts.map((product) =>
            createUserProduct({ ...product, UserID: newUserID })
          ),
          createTask({
            TypeID: 1,
            AssignedID: formUser.TechnicianID,
            // DeadLine:moment().toDate(),
            ClientID: newUserID,
          }),
          formsAddress.map((address, index) => {
            createAddress(address).then((newaddressID) => {
              createUserAddress({
                AddressID: newaddressID,
                UserID: newUserID,
              });

              if (index + 1 === formsAddress.length) {
                setFormUser(initUser);
                setFormsAddress(initAddress);
                setValidated(false);
              }
            });
          }),
        ]);
      });
    return null;
  };
  const userEffect = () => {
    if (!user.Names) {
      setFormsProducts([]);
      setFormsAddress(initAddress);
      return setFormUser(initUser);
    }
    getAddressByUserID(user.ID).then((address) =>
      address.length === 0
        ? setFormsAddress(initAddress)
        : setFormsAddress(address.map(({ Address }) => ({ ...Address })))
    );
    getProductByIDUser(user.ID).then(setFormsProducts);
    setFormUser(user);
  };
  useEffect(userEffect, [user]);

  return (
    <>
      <CForm className={validated ? "was-validated" : ""}>
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
                      value={formUser.Names}
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
                      value={formUser.LastName}
                      placeholder="Ingresa tus apellidos"
                      required
                      onChange={({ target: { value } }) =>
                        setFormUser({ ...formUser, LastName: value })
                      }
                    />
                  </CCol>
                  <CCol style={{ marginBottom: 8 }} xs="12" sm="6">
                    <CLabel
                      htmlFor="Rut"
                      style={{ color: validatedRut ? "red" : "#000" }}
                    >
                      {validatedRut
                        ? "Este rut ya existe en la base de datos"
                        : "Rut"}
                    </CLabel>
                    <CInput
                      id="Rut"
                      value={format(formUser.Rut)}
                      onBlur={() =>
                        !user.Names &&
                        getUserByRut(
                          `${clean(formUser.Rut).substr(
                            0,
                            clean(formUser.Rut).length - 1
                          )}-${clean(formUser.Rut).substr(
                            clean(formUser.Rut).substr(
                              0,
                              clean(formUser.Rut).length - 1
                            ).length,
                            clean(formUser.Rut).length - 1
                          )}`
                        ).then((response) =>
                          setValidatedRut(response.length > 0)
                        )
                      }
                      placeholder=" Ejemplo:18.123.678-3"
                      required
                      maxLength={12}
                      onChange={({ target: { value } }) => {
                        setFormUser({ ...formUser, Rut: value });
                      }}
                    />
                  </CCol>
                  <CCol style={{ marginBottom: 8 }} xs="12" sm="6">
                    <CLabel htmlFor="JobID">Numero de telefono</CLabel>
                    <CInput
                      id="PhoneNumber"
                      value={formUser.PhoneNumber}
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
                      value={formUser.JobPhoneNumber}
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
                      value={formUser.JobID}
                      onChange={({ target: { value } }) =>
                        setFormUser({ ...formUser, JobID: value })
                      }
                    />
                  </CCol>
                  <CCol style={{ marginBottom: 8 }} xs="12" sm="3">
                    <CLabel htmlFor="TechnicianID">Tecnico</CLabel>
                    <CButton
                      variant="outline"
                      color="success"
                      onClick={() => setModalTechnicians(true)}
                      block
                    >
                      Tecnicos
                    </CButton>
                  </CCol>

                  <CCol style={{ marginBottom: 8 }} xs="12" sm="3">
                    <CLabel htmlFor="D_8">Conexiones</CLabel>
                    <CInput
                      id="D_8"
                      placeholder=""
                      required
                      value={formUser.Conections}
                      onChange={({ target: { value } }) => {
                        if (value > 0 || value === "")
                          return setFormUser({
                            ...formUser,
                            Conections: value,
                          });
                      }}
                    />
                  </CCol>
                  <CCol style={{ marginBottom: 8 }} xs="12" sm="4">
                    <CLabel htmlFor="FechCon">Fecha Contratacion</CLabel>
                    <CInput
                      id="FechCon"
                      type="date"
                      placeholder=""
                      required
                      value={moment(formUser.FechCon).format("YYYY-MM-DD")}
                      onChange={({ target: { value } }) =>
                        setFormUser({
                          ...formUser,
                          FechCon: moment(value).toDate(),
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
                      Seleccionar Productos
                    </CButton>
                  </CCol>
                </CRow>
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
                        value={data.AddressName}
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
                        value={data.AddressNumber}
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
                        value={data.AddressBlockNumber}
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
                        value={data.AddressFloorNumber}
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
                        value={data.AddressApartmentNumber}
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
                  {!user.Names ? "Crear" : "Editar"}
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
          <CButton color="success" onClick={() => setModalTechnicians(false)}>
            Aceptar
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
          <CButton color="success" onClick={() => setModalProduct(false)}>
            Aceptar
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default UserForm;
