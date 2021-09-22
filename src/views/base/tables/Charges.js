import React, { useEffect, useState } from "react";
import { freeSet } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import {
  CBadge,
  CButton,
  CCol,
  CDataTable,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from "@coreui/react";
import { supabase } from "src/config/configSupabase";
import {
  chargeMount,
  createCharge,
  deleteCharge,
  updateCharge,
} from "src/state/querys/Charges";
import moment from "moment";

const fields = [
  "ID",
  "nombre",
  "cargo",
  "restante",
  "estado",
  "editar",
  "eliminar",
];

const Charges = ({ isVisible, setModalVisible, userID }) => {
  const [charges, setCharges] = useState([]);
  const [amount, setAmount] = useState(0);
  const [ispayment, setIspayment] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState("");
  const componentDidMount = () => {
    setLoading(true);
    Promise.all([
      supabase
        .from("Charge")
        .select("*")
        .eq("ClientID", userID)
        .then((snapshot) => snapshot.data),
    ]).then((response) => {
      const chargesApi = response[0];
      setCharges(
        chargesApi.map((charge) => ({
          ID: charge.ID,
          nombre: charge.Name,
          cargo: new Intl.NumberFormat("es-CL", {
            currency: "CLP",
            style: "currency",
          }).format(charge.Charge),
          ...charge,
        }))
      );
      setLoading(false);
    });
  };
  const handleAddCharge = () =>
    createCharge({
      Name: name,
      Created_at: moment().toDate(),
      Charge: amount,
      ClientID: userID,
      State: false,
      Remaining: 0,
    }).then(() => {
      componentDidMount();
      setName(0);
      setAmount(0);
    });

  const handleEditcharge = () =>
    updateCharge(
      {
        Name: name,
        Created_at: moment().toDate(),
        Charge: amount,
        ClientID: userID,
      },
      edit
    ).then(() => {
      componentDidMount();
      setName(0);
      setAmount(0);
      setEdit("");
    });

  useEffect(componentDidMount, []);
  return (
    <CModal
      show={isVisible}
      onClose={() => {
        setModalVisible(false);
      }}
      size="lg"
    >
      <CModalHeader closeButton>
        <CRow>
          <CCol col="10">
            <CModalTitle>Cargos</CModalTitle>
          </CCol>
        </CRow>
      </CModalHeader>
      <CModalBody>
        <CRow>
          <CCol col="2">
            <CButton color="danger" onClick={() => setIspayment(false)}>
              Crear Cargo
            </CButton>
          </CCol>
          <CCol col="2">
            <CButton
              color="success"
              onClick={() => {
                setIspayment(true);
                setAmount(0);
              }}
            >
              Crear Pago
            </CButton>
          </CCol>
        </CRow>
        <CRow style={{ margin: 10 }} className="align-items-center">
          <CCol col="2">
            <CLabel htmlFor="amount">Monto</CLabel>
            <div className="controls">
              <CInputGroup className="input-prepend">
                <CInputGroupPrepend>
                  <CInputGroupText>$</CInputGroupText>
                </CInputGroupPrepend>
                <CInput
                  id="amount"
                  size="16"
                  type="number"
                  onChange={({ target: { value } }) =>
                    setAmount(parseInt(value))
                  }
                  value={amount}
                />
              </CInputGroup>
            </div>
          </CCol>
          {!ispayment && (
            <CCol col="2">
              <CLabel htmlFor="name">Nombre</CLabel>
              <CInput
                id="name"
                name="name"
                value={name}
                onChange={({ target: { value } }) => setName(value)}
              />
            </CCol>
          )}
          <CCol col="2" style={{ paddingTop: 30 }}>
            <CButton
              color={"success"}
              onClick={() => {
                if (ispayment)
                  return chargeMount(userID, amount, componentDidMount).then(
                    () => {
                      setAmount(0);
                      componentDidMount();
                    }
                  );

                if (edit === "") {
                  handleAddCharge();
                } else {
                  handleEditcharge();
                }
              }}
            >
              {!ispayment
                ? edit !== ""
                  ? "Editar Cargo"
                  : "Añadir Cargo"
                : "Crear Pago"}
            </CButton>
          </CCol>
        </CRow>
        <CRow>
          <CDataTable
            items={charges}
            fields={fields}
            itemsPerPage={5}
            loading={loading}
            scopedSlots={{
              eliminar: (item) => (
                <td className="py-2">
                  <CRow className="align-items-center">
                    <CCol col="2" xs="2" sm="2" md="2" className="mb-2 mb-xl-0">
                      <CButton
                        color="danger"
                        onClick={() =>
                          deleteCharge(item.ID).then(() => {
                            setLoading(false);
                            componentDidMount();
                          })
                        }
                      >
                        <CIcon content={freeSet.cilTrash} size="xl" />
                      </CButton>
                    </CCol>
                  </CRow>
                </td>
              ),

              estado: (item) => (
                <td>
                  <CBadge color={item.State ? "success" : "danger"}>
                    {item.State ? "Pagado" : "Deuda"}
                  </CBadge>
                </td>
              ),
              restante: (item) => (
                <td>
                  {new Intl.NumberFormat("es-CL", {
                    currency: "CLP",
                    style: "currency",
                  }).format(item.Remaining)}
                </td>
              ),
              editar: (item) => (
                <td className="py-2">
                  <CRow className="align-items-center">
                    <CCol col="2" xs="2" sm="2" md="2" className="mb-2 mb-xl-0">
                      <CButton
                        color="primary"
                        onClick={() => {
                          setIspayment(false);
                          setName(item.nombre);
                          setAmount(item.cargo);
                          setEdit(item.ID);
                        }}
                      >
                        <CIcon content={freeSet.cilPencil} size="xl" />
                      </CButton>

                      {/* <CButton
                        color="primary"
                        onClick={() => {
                          chargeMount(userID);
                          // setEdit(item.ID);
                        }}
                      >
                        <CIcon content={freeSet.cilCheck} size="xl" />
                      </CButton> */}
                    </CCol>
                  </CRow>
                </td>
              ),
            }}
          />
        </CRow>
      </CModalBody>
      <CModalFooter>
        <CButton
          color="primary"
          onClick={() => {
            setModalVisible(!isVisible);
          }}
        >
          Aceptar
        </CButton>{" "}
        <CButton
          color="secondary"
          onClick={() => {
            // setProduct({
            //   Name: "",
            //   BasePrice: 0,
            // });
            setModalVisible(!isVisible);
          }}
        >
          Cancelar
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default Charges;
