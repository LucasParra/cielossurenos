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
  CListGroup,
  CListGroupItem,
  CBadge,
  CSwitch,
} from "@coreui/react";
import _ from "lodash";
import SelecteProductsTable from "src/components/Tables/SelecteProductsTable";
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
import { useKeySelector } from "src/hook/general";
import { createZone, getZones } from "src/state/querys/Zones";
import { getProductByIDUser } from "src/state/querys/Product";
import {
  createClientOffice,
  getOfficesToUserID,
  updateOfficeToClient,
} from "src/state/querys/Office";
import { SelectOfficesTable } from "src/components/Tables";
import { createTask } from "src/state/querys/Tasks";

const initUser = {
  Names: "",
  LastName: "",
  Rut: "",
  PhoneNumber: "",
  JobPhoneNumber: "",
  RolID: 2,
  StateID: "1",
  FechCon: new Date(),
  AltaAdm: new Date(),
  BajaAdm: new Date(),
  AltaTec: new Date(),
  BajaTec: new Date(),
  Connections: null,
  Business: false,
};
const initAddress = [
  {
    AddressName: "",
    AddressNumber: 0,
    AddressBlockNumber: 0,
    AddressFloorNumber: 0,
    AddressApartmentNumber: 0,
    AddressZoneID: null,
    AddressArea: "",
  },
];
const FormUser = ({ user, onClose }) => {
  const { colors, user: userSession } = useKeySelector(["colors", "user"]);
  const [formUser, setFormUser] = useState(initUser);
  const [formsAddress, setFormsAddress] = useState(initAddress);
  const [formsProducts, setFormsProducts] = useState([]);
  const [modalProduct, setModalProduct] = useState(false);
  const [modalOffice, setModalOffice] = useState(false);
  const [modalTechnicians, setModalTechnicians] = useState(false);
  const [newZone, setNewZone] = useState("");
  const [validated, setValidated] = useState(false);
  const [validatedRut, setValidatedRut] = useState(false);
  const [office, setOffice] = useState("");
  const [technician, setTechnician] = useState({});
  const [zones, setZones] = useState([]);

  const handleCreateUser = () => {
    if (validatedRut) return;

    const { Names, LastName, Rut, PhoneNumber, Connections } = formUser;
    const { AddressName, AddressZoneID } = formsAddress;

    if (
      Names === "" ||
      LastName === "" ||
      Rut === "" ||
      PhoneNumber === "" ||
      Connections === 0 ||
      AddressName === "" ||
      AddressZoneID === "" ||
      (!user.ID ? !technician?.nombre : false) ||
      formsProducts.length === 0
    )
      return setValidated(true);

    if (user.ID) {
      updateUserID(
        _.omit(
          { ...formUser, StateID: userSession.RolID.ID === 7 ? "4" : "1" },
          "apellidos",
          "nombres",
          "contacto",
          "Address"
        )
      ).then(() => {
        Promise.all([
          formsProducts.map((product) =>
            product.ID
              ? updateUserProduct(
                  _.omit({ ...product, UserID: user.ID }, "label")
                )
              : createUserProduct(
                  _.omit({ ...product, UserID: user.ID }, "label")
                )
          ),
          updateOfficeToClient(user.ID, office.ID),
          formsAddress.map((address, index) => {
            address.ID
              ? updateAddress(address).then((newaddressID) => {
                  updateUserAddress({
                    AddressID: newaddressID,
                    UserID: user.ID,
                  });

                  if (index + 1 === formsAddress.length) {
                    setFormsProducts([]);
                    setTechnician({});
                    setFormsAddress(initAddress);
                    setOffice({});
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
                    setFormsProducts([]);
                    setTechnician({});
                    setFormsAddress(initAddress);
                    setOffice({});
                    setValidated(false);
                    onClose();
                  }
                });
          }),
        ]);
      });
    } else {
      createUser({
        ...formUser,
        StateID: userSession.RolID.ID === 7 ? "4" : "1",
      }).then((newUserID) =>
        Promise.all([
          formsProducts.map((product) =>
            createUserProduct(
              _.omit({ ...product, UserID: newUserID }, "label")
            )
          ),
          createTask({
            TypeID: 1,
            AssignedID: technician.ID,
            ClientID: newUserID,
          }),
          createClientOffice(newUserID, office.ID),
          formsAddress.map((address, index) => {
            createAddress(address).then((newaddressID) => {
              createUserAddress({
                AddressID: newaddressID,
                UserID: newUserID,
              });
              if (index + 1 === formsAddress.length) {
                setFormsProducts([]);
                setTechnician({});
                setFormsAddress(initAddress);
                onClose();
                setOffice({});
                setValidated(false);
              }
            });
          }),
        ])
      );
    }
  };
  const handleGetZones = () => getZones().then(setZones);
  const userEffect = () => {
    handleGetZones();
    if (!user?.Names) {
      setFormsProducts([]);
      setTechnician({});
      setFormsAddress(initAddress);
      setOffice({});
      setValidated(false);
      return setFormUser(initUser);
    }
    getAddressByUserID(user?.ID).then((address) =>
      address.length === 0
        ? setFormsAddress(initAddress)
        : setFormsAddress(address.map(({ Address }) => ({ ...Address })))
    );

    getProductByIDUser(user?.ID).then((products) =>
      setFormsProducts(
        products.map((product) => ({
          UserID: user.ID,
          ProductID: product.ProductID.ID,
          ID: product.ID,
          Price:
            product.Price === 0 ? product.ProductID.BasePrice : product.Price,
          label: product.ProductID.Name,
        }))
      )
    );
    getOfficesToUserID(user.ID).then((officeRef) => {
      setOffice({
        ID: officeRef.OfficeID.ID,
        Name: officeRef.OfficeID.Name,
        nombre: officeRef.OfficeID.Name,
      });
    });
    setFormUser(user);
  };

  useEffect(userEffect, [user]);
  return (
    <>
      <CForm className={validated ? "was-validated" : ""}>
        <CRow>
          <CCol xs="12" sm="6">
            <CCard>
              <CCardHeader
                style={{
                  background: colors.primary,
                  textAlign: "center",
                }}
              >
                <CLabel
                  style={{
                    fontWeight: "bold",
                    color: "#fff",
                    fontSize: 16,
                  }}
                >
                  Usuario
                </CLabel>
              </CCardHeader>
              <CCardBody>
                <CRow>
                  <CCol style={{ marginBottom: 8 }} xs="12" sm="6">
                    <CLabel
                      style={{ fontSize: 14, fontWeight: "bold" }}
                      htmlFor="Names"
                    >
                      Nombres
                    </CLabel>
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
                    <CLabel
                      style={{ fontSize: 14, fontWeight: "bold" }}
                      htmlFor="LastName"
                    >
                      Apellidos
                    </CLabel>
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
                      style={{
                        color: validatedRut ? "red" : "#000",
                        fontSize: 14,
                        fontWeight: "bold",
                      }}
                    >
                      {validatedRut
                        ? "Este rut ya existe en la base de datos"
                        : "Rut"}
                    </CLabel>
                    <CInput
                      id="Rut"
                      value={
                        format(formUser.Rut) === "-" ? "" : format(formUser.Rut)
                      }
                      onBlur={() => {
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
                        );
                      }}
                      placeholder=" Ejemplo:18.123.678-3"
                      required
                      maxLength={12}
                      onChange={({ target: { value } }) => {
                        setFormUser({ ...formUser, Rut: value });
                      }}
                    />
                  </CCol>
                  <CCol style={{ marginBottom: 8 }} xs="12" sm="6">
                    <CLabel
                      style={{ fontSize: 14, fontWeight: "bold" }}
                      htmlFor="JobID"
                    >
                      Numero de telefono
                    </CLabel>
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
                    <CLabel
                      style={{ fontSize: 14, fontWeight: "bold" }}
                      htmlFor="JobID"
                    >
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
                    <CLabel
                      style={{ fontSize: 14, fontWeight: "bold" }}
                      htmlFor="D_8"
                    >
                      Conexiones
                    </CLabel>
                    <CInput
                      id="D_8"
                      required
                      value={formUser.Connections}
                      onChange={({ target: { value } }) =>
                        setFormUser({
                          ...formUser,
                          Connections: value === "" ? 0 : parseInt(value),
                        })
                      }
                    />
                  </CCol>
                  <CCol style={{ marginBottom: 8 }} xs="12" sm="3">
                    <CLabel
                      style={{ fontSize: 14, fontWeight: "bold" }}
                      htmlFor="FechCon"
                    >
                      Fecha Contratacion
                    </CLabel>

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
                    <CLabel
                      style={{ fontSize: 14, fontWeight: "bold" }}
                      htmlFor="FechCon"
                    >
                      Fecha de nacimiento
                    </CLabel>
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
                  <CCol xs="12" sm="2" style={{ paddingTop: 16 }}>
                    <CLabel
                      htmlFor="business"
                      style={{ fontSize: 14, fontWeight: "bold" }}
                    >
                      Empresa :
                    </CLabel>
                  </CCol>
                  <CCol xs="12" sm="7" style={{ paddingTop: 16 }}>
                    <CSwitch
                      className="mr-1"
                      variant={"3d"}
                      color={"success"}
                      value={formUser.Business}
                      shape="pill"
                      onChange={({ target: { checked } }) =>
                        setFormUser({
                          ...formUser,
                          Business: checked,
                        })
                      }
                    />
                  </CCol>

                  <CCol
                    style={{ marginBottom: 8 }}
                    xs="12"
                    sm={user.ID ? "6" : "4"}
                  >
                    <CButton
                      variant="outline"
                      style={{ backgroundColor: colors.primary }}
                      onClick={() => setModalProduct(!modalProduct)}
                      block
                    >
                      <CLabel
                        style={{
                          fontSize: 16,
                          fontWeight: "bold",
                          margin: 0,
                          color: "#fff",
                        }}
                      >
                        Seleccionar Productos
                      </CLabel>
                    </CButton>
                  </CCol>
                  {!user.ID && (
                    <CCol style={{ marginBottom: 8 }} xs="12" sm="4">
                      <CButton
                        variant="outline"
                        onClick={() => setModalTechnicians(true)}
                        block
                        style={{ backgroundColor: colors.primary }}
                      >
                        <CLabel
                          style={{
                            fontSize: 16,
                            fontWeight: "bold",
                            margin: 0,
                            color: "#fff",
                          }}
                        >
                          Seleccionar Tecnico
                        </CLabel>
                      </CButton>
                    </CCol>
                  )}
                  <CCol
                    style={{ marginBottom: 8 }}
                    xs="12"
                    sm={user.ID ? "6" : "4"}
                  >
                    <CButton
                      variant="outline"
                      style={{ backgroundColor: colors.primary }}
                      onClick={() => setModalOffice(true)}
                      block
                    >
                      <CLabel
                        style={{
                          fontSize: 16,
                          fontWeight: "bold",
                          margin: 0,
                          color: "#fff",
                        }}
                      >
                        Seleccionar Sucursal
                      </CLabel>
                    </CButton>
                  </CCol>

                  <CCol
                    style={{ marginBottom: 8 }}
                    xs="12"
                    sm={user.ID ? "6" : "4"}
                  >
                    <CLabel
                      style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        margin: 0,
                        color: validated
                          ? formsProducts.length === 0
                            ? "red"
                            : "#000"
                          : "#000",
                      }}
                    >
                      Productos :
                    </CLabel>
                    <CListGroup>
                      {formsProducts.map((product) => (
                        <CListGroupItem
                          className="justify-content-between"
                          key={product.ID}
                        >
                          <CLabel
                            style={{
                              fontSize: 14,
                              fontWeight: "bold",
                              margin: 0,
                            }}
                          >
                            {product.label}
                          </CLabel>
                          <CBadge
                            className="float-right"
                            shape="pill"
                            color="primary"
                            style={{ backgroundColor: colors.primary }}
                          >
                            {new Intl.NumberFormat("es-CL", {
                              currency: "CLP",
                              style: "currency",
                            }).format(product.Price)}
                          </CBadge>
                        </CListGroupItem>
                      ))}
                    </CListGroup>
                  </CCol>
                  {!user.ID && (
                    <CCol style={{ marginBottom: 8 }} xs="12" sm="4">
                      <CLabel
                        style={{
                          fontSize: 16,
                          fontWeight: "bold",
                          margin: 0,
                          color: validated
                            ? !technician?.nombre
                              ? "red"
                              : "#000"
                            : "#000",
                        }}
                      >
                        Tecnico :
                      </CLabel>
                      <CListGroup>
                        {technician?.nombre && (
                          <CListGroupItem className="justify-content-between">
                            <CLabel
                              style={{
                                fontSize: 14,
                                fontWeight: "bold",
                                margin: 0,
                              }}
                            >
                              {`${technician.nombre} ${technician.apellido}`}
                            </CLabel>
                          </CListGroupItem>
                        )}
                      </CListGroup>
                    </CCol>
                  )}
                  <CCol
                    style={{ marginBottom: 8 }}
                    xs="12"
                    sm={user.ID ? "6" : "4"}
                  >
                    <CLabel
                      style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        margin: 0,
                        color: validated
                          ? !office?.Name
                            ? "red"
                            : "#000"
                          : "#000",
                      }}
                    >
                      Sucursal :
                    </CLabel>
                    <CListGroup>
                      {office?.Name && (
                        <CListGroupItem className="justify-content-between">
                          <CLabel
                            style={{
                              fontSize: 14,
                              fontWeight: "bold",
                              margin: 0,
                            }}
                          >
                            {office?.Name}
                          </CLabel>
                        </CListGroupItem>
                      )}
                    </CListGroup>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol xs="12" sm="6">
            <CCard>
              <CCardHeader
                style={{
                  background: colors.primary,
                  textAlign: "center",
                }}
              >
                <CLabel
                  style={{
                    fontWeight: "bold",
                    color: "#fff",
                    fontSize: 16,
                  }}
                >
                  Direccion
                </CLabel>
              </CCardHeader>
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
                      <CLabel
                        htmlFor="AddressName"
                        style={{ fontSize: 14, fontWeight: "bold" }}
                      >
                        Direccion
                      </CLabel>
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
                      <CLabel
                        htmlFor="AddressNumber"
                        style={{ fontSize: 14, fontWeight: "bold" }}
                      >
                        Numero
                      </CLabel>
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
                      <CLabel
                        htmlFor="AddressBlockNumber"
                        style={{ fontSize: 14, fontWeight: "bold" }}
                      >
                        numero de block
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
                      <CLabel
                        htmlFor="AddressFloorNumber"
                        style={{ fontSize: 14, fontWeight: "bold" }}
                      >
                        numero de piso
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
                      <CLabel
                        htmlFor="AddressApartmentNumber"
                        style={{ fontSize: 14, fontWeight: "bold" }}
                      >
                        numero de Apartamento
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
                      <CLabel
                        htmlFor="zone"
                        style={{ fontSize: 14, fontWeight: "bold" }}
                      >
                        Crear una nueva zona (opcional)
                      </CLabel>
                      <CInput
                        id="zone"
                        placeholder="Escribe una nueva zona"
                        value={newZone}
                        onChange={({ target: { value } }) => setNewZone(value)}
                        style={{ marginBottom: 8 }}
                      />
                      <CButton
                        variant="outline"
                        onClick={() =>
                          newZone !== "" &&
                          createZone({ Name: newZone }).then(() => {
                            setNewZone("");
                            handleGetZones();
                          })
                        }
                        style={{
                          marginBottom: 8,
                          backgroundColor: colors.primary,
                        }}
                      >
                        <CLabel
                          style={{
                            fontSize: 16,
                            fontWeight: "bold",
                            color: "#fff",
                            margin: 0,
                          }}
                        >
                          Crear zona
                        </CLabel>
                      </CButton>
                      <br />
                      <CLabel
                        htmlFor="zone"
                        style={{ fontSize: 14, fontWeight: "bold" }}
                      >
                        Selecciona la Zona
                      </CLabel>
                      <CSelect
                        custom
                        name="zone"
                        id="zone"
                        value={data.AddressZoneID}
                        required
                        onChange={({ target: { value } }) => {
                          const newAddress = [..._.clone(formsAddress)];
                          newAddress[index].AddressZoneID = parseInt(value);
                          setFormsAddress(newAddress);
                        }}
                      >
                        {zones.map((zone) => (
                          <option
                            value={zone.ID}
                          >{`Zona ${zone.ID} | ${zone.Name}`}</option>
                        ))}
                      </CSelect>
                    </CCol>
                  </CRow>
                ))}
              </CCardBody>
            </CCard>
          </CCol>
          <CCol xs="12" sm="12">
            <CButton
              variant="outline"
              style={{ backgroundColor: colors.primary, borderRadius: 15 }}
              onClick={(e) => handleCreateUser(e)}
              size="lg"
              block
            >
              <CLabel
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  margin: 0,
                  color: "#fff",
                }}
              >
                {`${!user.ID ? "Crear" : "Editar"} Usuario`}
              </CLabel>
            </CButton>
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
            setTechnicianID={(value) => setTechnician(value)}
            TechnicianID={technician}
            isAllData={true}
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
          <SelecteProductsTable
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
      {/* modal Office */}
      <CModal show={modalOffice} onClose={setModalOffice}>
        <CModalHeader closeButton>
          <CModalTitle>Selecciona la sucursal del usuario</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <SelectOfficesTable setOffice={setOffice} office={office} />
        </CModalBody>
        <CModalFooter>
          <CButton color="success" onClick={() => setModalOffice(false)}>
            Aceptar
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default FormUser;
