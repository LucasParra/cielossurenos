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
  CTextarea,
  CFormGroup,
} from "@coreui/react";
import _ from "lodash";
import ProductTable from "src/components/Tables/ProductsTable";
import TechniciansTable from "src/components/Tables/TechniciansTable";
import {
  createUser,
  createUserAddress,
  createUserProduct,
  getUserByEmail,
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
import { clean, format, validate } from "rut.js";
import { getProductByIDUser } from "src/state/querys/Product";
import { createTask } from "src/state/querys/Tasks";
import OfficesTable from "../Tables/OfficesTable";
import {
  createClientOffice,
  getOfficesToUserID,
  updateOfficeToClient,
} from "src/state/querys/Office";
import Zones from "src/views/base/tables/Zones";
import { createZone, getAdminZone, getZones } from "src/state/querys/Zones";
import { supabase } from "src/config/configSupabase";
import { useKeySelector } from "src/hook/general";

const initUser = {
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
  Conections: 0,
  Birthday: new Date(),
  RolID: 2,
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
  const { user: userSession } = useKeySelector(["user"]);
  const [formUser, setFormUser] = useState(initUser);
  const [formsAddress, setFormsAddress] = useState(initAddress);
  const [newZone, setNewZone] = useState("");
  const [noteTask, setNoteTask] = useState("");
  const [formsProducts, setFormsProducts] = useState([]);
  const [modalProduct, setModalProduct] = useState(false);
  const [validated, setValidated] = useState(false);
  const [modalTechnicians, setModalTechnicians] = useState(false);
  const [zones, setZones] = useState([]);
  const [modalOffice, setModalOffice] = useState(false);
  const [officeID, setOfficeID] = useState("");
  const [validatedRut, setValidatedRut] = useState(false);
  const [userCreatorRolID, setUserCreatorRolID] = useState(false);

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

    if (userSession.RolID.ID === 7) {
      getAdminZone(userSession.ZoneID[0].AddressID.AddressZoneID).then(
        (response) => {
          const task = {
            TypeID: user.ID ? 9 : 8,
            AssignedID: response[0].User.ID,
            ClientID: userSession.ID,
            StateID: 3,
            Note: noteTask,
            Data: {
              User: _.omit(
                { ...formUser, StateID: userCreatorRolID === 7 ? "4" : "1" },
                "apellidos",
                "nombres",
                "contacto"
              ),
              Products: formsProducts,
              Address: formsAddress,
              OfficeID: officeID,
            },
            LastData: {
              User: user,
              Products: formsProducts,
              Address: formsAddress,
            },
          };
          createTask(task).then(() => {
            setFormUser(initUser);
            setFormsAddress(initAddress);
            onClose();
            setValidated(false);
          });
        }
      );

      return null;
    }

    if (user.ID) {
      return updateUserID(
        _.omit(
          { ...formUser, StateID: userCreatorRolID === 7 ? "4" : "1" },
          "apellidos",
          "nombres",
          "contacto"
        )
      ).then(() => {
        Promise.all([
          formsProducts.map((product) =>
            product.ID
              ? updateUserProduct({ ...product, UserID: user.ID })
              : createUserProduct({ ...product, UserID: user.ID })
          ),
          updateOfficeToClient(user.ID, officeID),
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
      return createUser({
        ...formUser,
        StateID: userCreatorRolID === 7 ? "4" : "1",
      }).then((newUserID) => {
        Promise.all([
          formsProducts.map((product) =>
            createUserProduct({ ...product, UserID: newUserID })
          ),
          createTask({
            TypeID: 1,
            AssignedID: formUser.TechnicianID,
            // DeadLine:.toDate(),
            ClientID: newUserID,
          }),
          createClientOffice(newUserID, officeID),
          formsAddress.map((address, index) => {
            createAddress(address).then((newaddressID) => {
              createUserAddress({
                AddressID: newaddressID,
                UserID: newUserID,
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
  };
  const handleGetZones = () => getZones().then(setZones);
  const userEffect = () => {
    handleGetZones();
    if (!user.Names) {
      setFormsProducts([]);
      setFormsAddress(initAddress);
      setOfficeID("");
      return setFormUser(initUser);
    }
    getAddressByUserID(user.ID).then((address) =>
      address.length === 0
        ? setFormsAddress(initAddress)
        : setFormsAddress(address.map(({ Address }) => ({ ...Address })))
    );

    getProductByIDUser(user.ID).then((products) =>
      setFormsProducts(
        products.map(({ ID, Name, BasePrice }) => ({
          ID,
          Name,
          BasePrice,
        }))
      )
    );
    getOfficesToUserID(user.ID).then(setOfficeID);
    setFormUser(user);
  };
  const componentDidMount = () => {
    const {
      user: { email },
    } = supabase.auth.session();
    getUserByEmail(email).then((response) =>
      setUserCreatorRolID(response[0].RolID)
    );
  };
  useEffect(componentDidMount, []);
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
                        ? validate(format(formUser.Rut))
                          ? "Este rut ya existe en la base de datos"
                          : "rut invalido"
                        : "Rut"}
                    </CLabel>
                    <CInput
                      id="Rut"
                      value={format(formUser.Rut)}
                      onBlur={({ target: { value } }) =>
                        !user.Names && !validate(value)
                          ? setValidatedRut(true)
                          : getUserByRut(
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
                        if (value === "") setValidatedRut(false);

                        setFormUser({ ...formUser, Rut: value });
                      }}
                    />
                  </CCol>
                  <CCol style={{ marginBottom: 8 }} xs="12" sm="6">
                    <CLabel htmlFor="EmailID">Correo</CLabel>
                    <CInput
                      id="Email"
                      value={formUser.Email}
                      placeholder="correoEjemplo@gmail.com"
                      required
                      onChange={({ target: { value } }) =>
                        setFormUser({ ...formUser, Email: value })
                      }
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
                    <CLabel htmlFor="TechnicianID">Sucursal</CLabel>
                    <CButton
                      variant="outline"
                      color="success"
                      onClick={() => setModalOffice(true)}
                      block
                    >
                      Sucursales
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
                  <CCol style={{ marginBottom: 8 }} xs="12" sm="3">
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
                  <CCol style={{ marginBottom: 8 }} xs="12" sm="3">
                    <CLabel htmlFor="FechCon">Fecha de nacimiento</CLabel>
                    <CInput
                      id="FechCon"
                      type="date"
                      placeholder=""
                      required
                      value={moment(formUser.Birthday).format("YYYY-MM-DD")}
                      onChange={({ target: { value } }) =>
                        setFormUser({
                          ...formUser,
                          Birthday: moment(value).toDate(),
                        })
                      }
                    />
                  </CCol>
                  {userSession?.RolID?.ID === 7 && (
                    <CCol style={{ marginBottom: 8 }} xs="12" sm="12">
                      <CFormGroup>
                        <CLabel htmlFor="priceBase">
                          Nota para el administrador
                        </CLabel>
                        <CTextarea
                          id="name"
                          value={noteTask}
                          onChange={({ target: { value } }) =>
                            setNoteTask(value)
                          }
                        />
                      </CFormGroup>
                    </CCol>
                  )}
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
                      <h3>direccion {index === 0 ? "" : index + 1} : </h3>
                    </CCol>
                    <CCol style={{ marginBottom: 8 }} xs="12" sm="9">
                      <CLabel htmlFor="AddressName">Direccion</CLabel>
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
                      <CLabel htmlFor="AddressNumber">Numero</CLabel>
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
                        Numero de Block
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
                        Numero de piso
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
                        Numero de departamento
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
                      <CLabel htmlFor="zone">
                        Crear una nueva zona (opcional)
                      </CLabel>
                      <CInput
                        id="zone"
                        placeholder="Escribe una nueva zona"
                        value={newZone}
                        required
                        onChange={({ target: { value } }) => setNewZone(value)}
                        style={{ marginBottom: 8 }}
                      />
                      <CButton
                        variant="outline"
                        color="success"
                        onClick={() =>
                          newZone !== "" &&
                          createZone({ Name: newZone }).then(() => {
                            setNewZone("");
                            handleGetZones();
                          })
                        }
                        style={{ marginBottom: 8 }}
                      >
                        Crear Zona
                      </CButton>
                      <br />
                      <CLabel htmlFor="zone">Selecciona la Zona</CLabel>
                      <CSelect
                        custom
                        name="zone"
                        id="zone"
                        value={data.AddressZoneID}
                        onChange={({ target: { value } }) => {
                          const newAddress = [..._.clone(formsAddress)];
                          newAddress[index].AddressZoneID = value;
                          setFormsAddress(newAddress);
                        }}
                      >
                        <option value="0">Selecciona Zona o Localidad</option>
                        {zones.map((zone) => (
                          <option
                            value={zone.ID}
                          >{`Zona ${zone.ID} | ${zone.Name}`}</option>
                        ))}
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
      {/* modal Office */}
      <CModal show={modalOffice} onClose={setModalOffice}>
        <CModalHeader closeButton>
          <CModalTitle>Selecciona la sucursal del usuario</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <OfficesTable setOfficeID={setOfficeID} officeID={officeID} />
        </CModalBody>
        <CModalFooter>
          <CButton color="success" onClick={() => setModalOffice(false)}>
            Aceptar
          </CButton>
        </CModalFooter>
      </CModal>
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
