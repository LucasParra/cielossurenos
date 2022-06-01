import React, { useEffect, useState } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
} from "@coreui/react";
import {
  countChargeByTypeID,
  createTypeCharge,
  deleteChargeType,
  getCharges,
  updateChargeType,
} from "src/state/querys/Charges";
import { ChargesPayModal, DeleteModal } from "src/components/Modals";
import { ChargesPayTable } from "src/components/Tables";
import { useKeySelector } from "src/hook/general";
import { CChartDoughnut } from "@coreui/react-chartjs";

const ChargesPay = () => {
  const { colors } = useKeySelector(["colors"]);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showModalCharge, setShowModalCharge] = useState(false);
  const [chargesSelected, setChargesSelected] = useState({});
  const [chargesChart, setChargesChart] = useState([]);
  const [charges, setCharges] = useState([]);

  const componentDidMount = (limit = 1) => {
    setLoading(true);
    getCharges(limit)
      .then((data) =>
        Promise.all(
          data.map(({ ID, Name }) =>
            countChargeByTypeID(ID).then((result) => ({
              count: result,
              charges: Name,
            }))
          )
        ).then((result) => {
          setCharges(
            data.map((charge) => ({
              ...charge,
              nombre: charge.Name,
            }))
          );
          setLoading(false);
          setChargesChart(result);
        })
      )
      .catch(console.error);
  };
  const deleteCharge = () =>
    deleteChargeType(chargesSelected.ID).then(componentWillUnmount);

  const handleCreateCharge = (Name) =>
    createTypeCharge({ Name }).then(componentWillUnmount);

  const handleUpdateCharge = (Name) =>
    updateChargeType(chargesSelected.ID, { Name }).then(componentWillUnmount);

  const componentWillUnmount = () => {
    componentDidMount();
    setLoading(false);
    setShowModalCharge(false);
    setShowDeleteModal(false);
    setChargesSelected({});
  };
  useEffect(componentDidMount, []);
  return (
    <>
      <CRow className="align-items-center" style={{ marginBottom: 16 }}>
        <CCol col="2" xs="2" sm="2" md="2" className="mb-3 mb-xl-0">
          <CButton
            onClick={() => setShowModalCharge(true)}
            style={{
              backgroundColor: colors.primary,
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            Crear Cargo
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
              Cargos
            </CCardHeader>
            <CCardBody>
              <ChargesPayTable
                charges={charges}
                onPageChange={componentDidMount}
                loading={loading}
                onPressEdit={(item) => {
                  setChargesSelected(item);
                  setShowModalCharge(true);
                }}
                onPressDeleted={(item) => {
                  setChargesSelected(item);
                  setShowDeleteModal(true);
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
              Grafica de los cargos mas utilizados
            </CCardHeader>
            {chargesChart.length > 0 && (
              <CCardBody>
                <CChartDoughnut
                  datasets={[
                    {
                      backgroundColor: ["#41B883", "#E46651"],
                      data: chargesChart.map(({ count }) => count),
                    },
                  ]}
                  labels={chargesChart.map(({ charges }) => charges)}
                  options={{
                    tooltips: {
                      enabled: true,
                    },
                  }}
                />
              </CCardBody>
            )}
          </CCard>
        </CCol>
      </CRow>
      <ChargesPayModal
        show={showModalCharge}
        setShow={() => {
          setChargesSelected({});
          setShowModalCharge(false);
        }}
        nameEdit={chargesSelected?.Name}
        onFinish={(value) =>
          !chargesSelected?.ID
            ? handleCreateCharge(value)
            : handleUpdateCharge(value)
        }
      />
      <DeleteModal
        show={showDeleteModal}
        setShow={() => {
          setChargesSelected({});
          setShowDeleteModal(false);
        }}
        onFinish={deleteCharge}
      />
    </>
  );
};

export default ChargesPay;
