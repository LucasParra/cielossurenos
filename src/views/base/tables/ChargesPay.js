import CIcon from "@coreui/icons-react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CInput,
  CLabel,
  CModal,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import { freeSet } from "@coreui/icons";
import { supabase } from "src/config/configSupabase";
import { createTypeCharge, updateChargeType } from "src/state/querys/Charges";

const fields = ["ID", "nombre", "editar", "eliminar"];

const ChargesPay = () => {
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [chargesSelected, setChargesSelected] = useState({});
  const [charges, setCharges] = useState([]);
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState("");

  const componentDidMount = (limit = 1) => {
    setLoading(true);
    supabase
      .from("ChargeType")
      .select("*")
      .limit(limit * 5 + 1)
      .then((snapshot) => {
        setCharges(
          snapshot.data.map((charge) => ({
            ...charge,
            nombre: charge.Name,
          }))
        );
        setLoading(false);
      })
      .catch(console.error);
  };
  const deleteCharge = () =>
    supabase
      .from("ChargeType")
      .delete()
      .match({ ID: chargesSelected.ID })
      .then(() => {
        setLoading(false);
        setChargesSelected();
        componentDidMount();
        setDeleteModal(false);
      });

  const handleCrateCharge = () =>
    createTypeCharge({ Name: name }).then(() => {
      setName("");
      componentDidMount();
    });
  const handleUpdateCharge = () =>
    updateChargeType(chargesSelected.ID, { Name: name }).then(() => {
      setName("");
      setChargesSelected({});
      componentDidMount();
      setEdit(false);
    });
  useEffect(componentDidMount, []);
  return (
    <>
      <CRow>
        <CCol xs="12" lg="12">
          <CCard>
            <CCardHeader>Cargos</CCardHeader>
            <CCardBody>
              <CRow style={{ marginBottom: 18 }}>
                <CCol col="2">
                  <CLabel htmlFor="name">Nombre</CLabel>
                  <CInput
                    id="name"
                    name="name"
                    value={name}
                    onChange={({ target: { value } }) => setName(value)}
                  />
                </CCol>
                <CCol col="2" style={{ paddingTop: 30 }}>
                  <CButton
                    color={!edit ? "success" : "primary"}
                    onClick={() =>
                      !edit ? handleCrateCharge() : handleUpdateCharge()
                    }
                  >
                    {`${!edit ? "Crear" : "Editar"} Cargo`}
                  </CButton>
                </CCol>
                {edit && (
                  <CCol col="2" style={{ paddingTop: 30 }}>
                    <CButton
                      color={"danger"}
                      onClick={() => {
                        setEdit(false);
                        setChargesSelected({});
                        setName("");
                      }}
                    >
                      Cancelar Edicion
                    </CButton>
                  </CCol>
                )}
              </CRow>
              <CDataTable
                items={charges}
                fields={fields}
                itemsPerPage={5}
                onPageChange={componentDidMount}
                loading={loading}
                pagination
                scopedSlots={{
                  editar: (item) => (
                    <td className="py-2">
                      <CRow className="align-items-center">
                        <CCol
                          col="2"
                          xs="2"
                          sm="2"
                          md="2"
                          className="mb-2 mb-xl-0"
                        >
                          <CButton
                            color="info"
                            onClick={() => {
                              setChargesSelected(item);
                              setName(item.Name);
                              setEdit(true);
                            }}
                          >
                            <CIcon content={freeSet.cilPencil} size="xl" />
                          </CButton>
                        </CCol>
                      </CRow>
                    </td>
                  ),
                  eliminar: (item) => (
                    <td className="py-2">
                      <CRow className="align-items-center">
                        <CCol
                          col="2"
                          xs="2"
                          sm="2"
                          md="2"
                          className="mb-2 mb-xl-0"
                        >
                          <CButton
                            color="danger"
                            onClick={() => {
                              setDeleteModal(true);
                              setChargesSelected(item);
                            }}
                          >
                            <CIcon content={freeSet.cilTrash} size="xl" />
                          </CButton>
                        </CCol>
                      </CRow>
                    </td>
                  ),
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CModal
        show={deleteModal}
        color="danger"
        onClose={() => {
          setChargesSelected();
          setDeleteModal(!deleteModal);
        }}
        size="sm"
      >
        <CModalHeader closeButton>
          <CModalTitle>Eliminar cargo</CModalTitle>
        </CModalHeader>
        <CModalFooter>
          <CButton color="danger" onClick={deleteCharge}>
            Si
          </CButton>
          <CButton
            onClick={() => {
              setChargesSelected();
              setDeleteModal(!deleteModal);
            }}
            color="secondary"
          >
            No
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default ChargesPay;
