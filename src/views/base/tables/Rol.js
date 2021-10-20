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
import { createRol, updateRol } from "src/state/querys/Rols";

const fields = ["ID", "nombre", "editar", "eliminar"];

const Rol = () => {
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [rolSelected, setRolSelected] = useState({});
  const [rols, setRols] = useState([]);
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState("");

  const componentDidMount = (limit = 1) => {
    setLoading(true);
    supabase
      .from("Rol")
      .select("*")
      .limit(limit * 5 + 1)
      .then((snapshot) => {
        setRols(
          snapshot.data.map((rol) => ({
            ...rol,
            nombre: rol.Name,
          }))
        );
        setLoading(false);
      })
      .catch(console.error);
  };
  const deleteRol = () =>
    supabase
      .from("Rol")
      .delete()
      .match({ ID: rolSelected.ID })
      .then(() => {
        setLoading(false);
        setRolSelected();
        componentDidMount();
        setDeleteModal(false);
      });

  const handleCrateRol = () =>
    createRol({ Name: name }).then(() => {
      setName("");
      componentDidMount();
    });
  const handleUpdateRol = () =>
    updateRol(rolSelected.ID, { Name: name }).then(() => {
      setName("");
      setRolSelected({});
      componentDidMount();
      setEdit(false);
    });
  useEffect(componentDidMount, []);
  return (
    <>
      <CRow>
        <CCol xs="12" lg="12">
          <CCard>
            <CCardHeader>Roles </CCardHeader>
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
                      !edit ? handleCrateRol() : handleUpdateRol()
                    }
                  >
                    {`${!edit ? "Crear" : "Editar"} Rol`}
                  </CButton>
                </CCol>
                {edit && (
                  <CCol col="2" style={{ paddingTop: 30 }}>
                    <CButton
                      color={"danger"}
                      onClick={() => {
                        setEdit(false);
                        setRolSelected({});
                        setName("");
                      }}
                    >
                      Cancelar Edicion
                    </CButton>
                  </CCol>
                )}
              </CRow>
              <CDataTable
                items={rols}
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
                              setRolSelected(item);
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
                              setRolSelected(item);
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
          setRolSelected();
          setDeleteModal(!deleteModal);
        }}
        size="sm"
      >
        <CModalHeader closeButton>
          <CModalTitle>Eliminar Sucursal</CModalTitle>
        </CModalHeader>
        <CModalFooter>
          <CButton color="danger" onClick={deleteRol}>
            Si
          </CButton>
          <CButton
            onClick={() => {
              setRolSelected();
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

export default Rol;
