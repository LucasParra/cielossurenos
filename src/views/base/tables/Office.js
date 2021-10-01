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
import { createOffice, updateOffice } from "src/state/querys/Office";
// import { queryClientToOffice } from "src/state/querys/Users";

const fields = ["ID", "nombre", "editar", "eliminar"];

const Office = () => {
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [officeSelected, setOfficeSelected] = useState({});
  const [office, setOffice] = useState([]);
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState("");

  const componentDidMount = (limit = 1) => {
    setLoading(true);
    supabase
      .from("Office")
      .select("*")
      .limit(limit * 5 + 1)
      .then((snapshot) => {
        setOffice(
          snapshot.data.map((office) => ({
            ...office,
            nombre: office.Name,
          }))
        );
        setLoading(false);
      })
      .catch(console.error);
  };
  const deleteOffice = () =>
    supabase
      .from("Office")
      .delete()
      .match({ ID: officeSelected.ID })
      .then(() => {
        setLoading(false);
        setOfficeSelected();
        componentDidMount();
        setDeleteModal(false);
      });

  const handleCreateOffice = () =>
    createOffice({ Name: name }).then(() => {
      setName("");
      componentDidMount();
    });
  const handleUpdateOffice = () =>
    updateOffice(officeSelected.ID, { Name: name }).then(() => {
      setName("");
      setOfficeSelected({});
      componentDidMount();
      setEdit(false);
    });
  useEffect(componentDidMount, []);
  return (
    <>
      <CRow>
        <CCol xs="12" lg="12">
          <CCard>
            <CCardHeader>Sucursales </CCardHeader>
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
                  {/* <CButton
                    color={"primary"}
                    onClick={() => queryClientToOffice()}
                  >
                    clientesasos
                  </CButton> */}
                  <CButton
                    color={!edit ? "success" : "primary"}
                    onClick={() =>
                      !edit ? handleCreateOffice() : handleUpdateOffice()
                    }
                  >
                    {`${!edit ? "Crear" : "Editar"} Sucursal`}
                  </CButton>
                </CCol>
                {edit && (
                  <CCol col="2" style={{ paddingTop: 30 }}>
                    <CButton
                      color={"danger"}
                      onClick={() => {
                        setEdit(false);
                        setOfficeSelected({});
                        setName("");
                      }}
                    >
                      Cancelar Edicion
                    </CButton>
                  </CCol>
                )}
              </CRow>
              <CDataTable
                items={office}
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
                              setOfficeSelected(item);
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
                              setOfficeSelected(item);
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
          setOfficeSelected();
          setDeleteModal(!deleteModal);
        }}
        size="sm"
      >
        <CModalHeader closeButton>
          <CModalTitle>Eliminar Sucursal</CModalTitle>
        </CModalHeader>
        <CModalFooter>
          <CButton color="danger" onClick={deleteOffice}>
            Si
          </CButton>
          <CButton
            onClick={() => {
              setOfficeSelected();
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

export default Office;
