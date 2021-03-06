import CIcon from "@coreui/icons-react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CForm,
  CInput,
  CLabel,
  CModal,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from "@coreui/react";
import React, { useCallback, useEffect, useState } from "react";
import { freeSet } from "@coreui/icons";
import { supabase } from "src/config/configSupabase";
import { createZone, updateZone } from "src/state/querys/Zones";
import _ from "lodash";

const fields = ["ID", "nombre", "editar", "eliminar"];

const Zones = () => {
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [zonesSelected, setZonesSelected] = useState({});
  const [zones, setZones] = useState([]);
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState("");
  const [validated, setValidated] = useState(false);
  const [searchText, setSearchText] = useState("");

  const handleSearchZones = (text, limit) => {
    setSearchText(text);
    if (text === undefined || text === "") return componentDidMount();
    setLoading(true);
    supabase
      .from("Zones")
      .select("*")
      .or(`Name.ilike.%${text}%`)
      .limit(limit * 5 + 1)
      .then((snapshot) => {
        setZones(
          snapshot.data.map((zone) => ({
            ...zone,
            nombre: zone.Name,
          }))
        );
        setLoading(false);
      })
      .catch(console.error);
  };

  const componentDidMount = (limit = 1) => {
    setLoading(true);
    supabase
      .from("Zones")
      .select("*")
      .limit(limit * 5 + 1)
      .then((snapshot) => {
        setZones(
          snapshot.data.map((zone) => ({
            ...zone,
            nombre: zone.Name,
          }))
        );
        setLoading(false);
      })
      .catch(console.error);
  };
  const deleteZone = () =>
    supabase
      .from("Zones")
      .delete()
      .match({ ID: zonesSelected.ID })
      .then(() => {
        setLoading(false);
        setZonesSelected();
        componentDidMount();
        setDeleteModal(false);
        setValidated(false);
      });

  const handleCrateZone = () =>
    createZone({ Name: name }).then(() => {
      setName("");
      componentDidMount();
    });
  const handleUpdateZone = () =>
    updateZone(zonesSelected.ID, { Name: name }).then(() => {
      setName("");
      setZonesSelected({});
      componentDidMount();
      setEdit(false);
      setValidated(false);
    });
  useEffect(componentDidMount, []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceFilter = useCallback(_.debounce(handleSearchZones, 1000), []);
  return (
    <CForm className={validated ? "was-validated" : ""}>
      <CRow>
        <CCol xs="12" lg="12">
          <CCard>
            <CCardHeader>Zonas</CCardHeader>
            <CCardBody>
              <CRow style={{ marginBottom: 18 }}>
                <CCol col="2">
                  <CLabel htmlFor="name">Nombre</CLabel>
                  <CInput
                    id="name"
                    name="name"
                    value={name}
                    required
                    onChange={({ target: { value } }) => setName(value)}
                  />
                </CCol>
                <CCol col="2" style={{ paddingTop: 30 }}>
                  <CButton
                    color={!edit ? "success" : "primary"}
                    onClick={() =>
                      name === ""
                        ? setValidated(true)
                        : !edit
                        ? handleCrateZone()
                        : handleUpdateZone()
                    }
                  >
                    {`${!edit ? "Crear" : "Editar"} Zona`}
                  </CButton>
                </CCol>
                {edit && (
                  <CCol col="2" style={{ paddingTop: 30 }}>
                    <CButton
                      color={"danger"}
                      onClick={() => {
                        setEdit(false);
                        setZonesSelected({});
                        setName("");
                      }}
                    >
                      Cancelar Edicion
                    </CButton>
                  </CCol>
                )}
              </CRow>
              <CDataTable
                items={zones}
                fields={fields}
                itemsPerPage={5}
                loading={loading}
                tableFilter={{
                  placeholder: "Nombre",
                  label: "Filtrar",
                }}
                onPageChange={(number) => {
                  if (!searchText !== "") return componentDidMount(number);
                  else return handleSearchZones(searchText, number);
                }}
                onTableFilterChange={debounceFilter}
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
                              setZonesSelected(item);
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
                              setZonesSelected(item);
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
          setZonesSelected();
          setDeleteModal(!deleteModal);
        }}
        size="sm"
      >
        <CModalHeader closeButton>
          <CModalTitle>Eliminar Sucursal</CModalTitle>
        </CModalHeader>
        <CModalFooter>
          <CButton color="danger" onClick={deleteZone}>
            Si
          </CButton>
          <CButton
            onClick={() => {
              setZonesSelected();
              setDeleteModal(!deleteModal);
            }}
            color="secondary"
          >
            No
          </CButton>
        </CModalFooter>
      </CModal>
    </CForm>
  );
};

export default Zones;
