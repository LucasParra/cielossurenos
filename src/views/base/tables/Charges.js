import React, { useEffect, useState } from "react";
import { freeSet } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import {
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
  createCharge,
  deleteCharge,
  updateCharge,
} from "src/state/querys/Charges";
import moment from "moment";

const fields = ["ID", "nombre", "cargo", "editar", "eliminar"];

const Charges = ({ isVisible, setModalVisible, userID }) => {
  const [charges, setCharges] = useState([]);
  const [amount, setAmount] = useState(0);
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
          cargo: charge.Charge,
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
    }).then(() => {
      componentDidMount();
      setName(0);
      setAmount(0);
    });

  const handleEditcharge = (ID) =>
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
          <CCol col="12">
            <CModalTitle>Cargos</CModalTitle>
          </CCol>
        </CRow>
      </CModalHeader>
      <CModalBody>
        <CRow style={{ margin: 10 }}>
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
                  type="text"
                  onChange={({ target: { value } }) => setAmount(value)}
                  value={amount}
                />
              </CInputGroup>
            </div>
          </CCol>
          <CCol col="2">
            <CLabel htmlFor="name">Nombre</CLabel>
            <CInput
              id="name"
              name="name"
              value={name}
              onChange={({ target: { value } }) => setName(value)}
            />
          </CCol>
          <CCol col="2">
            <CButton
              color={"success"}
              onClick={() => {
                if (edit === "") {
                  handleAddCharge();
                } else {
                  handleEditcharge();
                }
              }}
            >
              {edit !== "" ? "Editar Cargo" : "Añadir Cargo"}
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
              editar: (item) => (
                <td className="py-2">
                  <CRow className="align-items-center">
                    <CCol col="2" xs="2" sm="2" md="2" className="mb-2 mb-xl-0">
                      <CButton
                        color="primary"
                        onClick={() => {
                          setName(item.nombre);
                          setAmount(item.cargo);
                          setEdit(item.ID);
                        }}
                      >
                        <CIcon content={freeSet.cilPencil} size="xl" />
                      </CButton>
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
