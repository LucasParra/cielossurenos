import React, { useEffect, useState } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormGroup,
  CInput,
  CLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from "@coreui/react";
import _ from "lodash";
import {
  createOffice,
  deleteOffice,
  getOffices,
  updateOffice,
} from "src/state/querys/Office";
import { OfficesTable } from "src/components/Tables";
import { useKeySelector } from "src/hook/general";
import { CChartBar } from "@coreui/react-chartjs";
import { getClientsCountOffice } from "src/state/querys/Users";
import { DeleteModal } from "src/components/Modals";

const Offices = () => {
  const { colors } = useKeySelector(["colors"]);
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const [offices, setOffices] = useState([]);
  const [charData, setCharData] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [office, setOffice] = useState({});

  const componentDidMount = (limit = 1) => {
    setLoading(true);
    getOffices(limit)
      .then((snapshot) =>
        Promise.all(
          snapshot.map((office) =>
            getClientsCountOffice(office.ID, 1).then((count) => ({
              count,
              Name: office.Name,
            }))
          )
        ).then((response) => {
          setCharData(response);
          setOffices(
            snapshot.map((office) => ({
              ...office,
              nombre: office.Name,
            }))
          );
          setLoading(false);
        })
      )
      .catch(console.error);
  };
  const handleDeleteOffice = () =>
    deleteOffice(office.ID).then(() => {
      setLoading(false);
      setOffice({});
      componentDidMount();
      setShowDeleteModal(false);
    });

  const handleCreateOffice = () => {
    if (!office?.Name) return setValidated(true);

    if (!office.ID)
      return createOffice(office).then(() => {
        setOffice({});
        componentDidMount();
        setShowModal(false);
        setValidated(false);
      });

    updateOffice(office.ID, _.omit({ ...office }, "ID", "nombre")).then(() => {
      setOffice({});
      componentDidMount();
      setShowModal(false);
      setValidated(false);
    });
  };

  useEffect(componentDidMount, []);
  return (
    <>
      <CRow className="align-items-center" style={{ marginBottom: 16 }}>
        <CCol col="2" xs="2" sm="2" md="2" className="mb-3 mb-xl-0">
          <CButton
            onClick={() => setShowModal(true)}
            style={{
              backgroundColor: colors.primary,
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            Crear Sucursal
          </CButton>
        </CCol>
      </CRow>
      <CRow>
        <CCol xs="12" lg="6">
          <CCard>
            <CCardHeader
              style={{
                backgroundColor: colors.primary,
                color: "#fff",
                fontWeight: "bold",
              }}
            >
              Sucursales
            </CCardHeader>
            <CCardBody>
              <OfficesTable
                offices={offices}
                onPageChange={componentDidMount}
                loading={loading}
                onPressEdit={(item) => {
                  setOffice(item);
                  setShowModal(true);
                }}
                onPressDeleted={(item) => {
                  setShowDeleteModal(true);
                  setOffice(item);
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs="12" lg="6">
          <CCard>
            <CCardHeader
              style={{
                backgroundColor: colors.primary,
                color: "#fff",
                fontWeight: "bold",
              }}
            >
              Usuarios Por Sucursal
            </CCardHeader>
            <CCardBody>
              <CChartBar
                datasets={[
                  {
                    label: "Sucursales",
                    backgroundColor: colors.primary,
                    data: charData.map(({ count }) => count),
                  },
                ]}
                labels={charData.map(({ Name }) => Name)}
                options={{
                  tooltips: {
                    enabled: true,
                  },
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <DeleteModal
        show={showDeleteModal}
        setShow={() => {
          setShowDeleteModal(false);
          setOffice({});
        }}
        onFinish={handleDeleteOffice}
      />
      <CModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
        }}
        size="sm"
      >
        <CModalHeader>
          <CModalTitle
            style={{
              fontWeight: "bold",
              width: "100%",
              textAlign: "center",
            }}
          >{`${office.ID ? "Editar" : "Crear"}  Sucursal`}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol xs="12">
              <CForm className={validated ? "was-validated" : ""}>
                <CLabel
                  htmlFor="product"
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  Nombre
                </CLabel>
                <CInput
                  id="product"
                  placeholder="ingresa el nombre de la sucursal"
                  value={office.Name}
                  onChange={({ target: { value } }) =>
                    setOffice({ ...office, Name: value })
                  }
                  required
                />
              </CForm>
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CRow style={{ width: "100%" }}>
            <CCol col="6">
              <CButton
                color="success"
                onClick={handleCreateOffice}
                style={{ fontWeight: "bold", width: "100%" }}
              >
                {office.ID ? "Editar" : "Crear"}
              </CButton>
            </CCol>
            <CCol col="6">
              <CButton
                color="secondary"
                onClick={() => {
                  setOffice({});
                  setShowModal(false);
                }}
                style={{ fontWeight: "bold", width: "100%" }}
              >
                Cancelar
              </CButton>
            </CCol>
          </CRow>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default Offices;
