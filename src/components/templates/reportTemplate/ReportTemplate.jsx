import React from "react";
import { CCallout, CCol, CInput, CRow } from "@coreui/react";
import moment from "moment";
import { PaymentsTable } from "src/components/molecules/paymentsTable";

const ReportTemplate = (props) => {
  const {
    newContractsTodayCount,
    reconnectionTodayCount,
    disconnectionTodayCount,
    facilityTodayCount,
    setDate,
    paymentsToday,
  } = props;

  return (
    <>
      <h1 className="pt-3" align="center">
        Reporte Diario
      </h1>
      <CRow alignHorizontal="center">
        <CCol xl={3}>
          <CInput
            id="FechCon"
            type="date"
            placeholder=""
            required
            value={moment().format("YYYY-MM-DD")}
            onChange={({ target: { value } }) => {
              setDate(moment(value).format("YYYY-MM-DD"));
            }}
          />
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          <CCallout color="info" className="bg-white">
            <small className="text-muted">Nuevos Contratos</small>
            <br />
            <strong className="h4">{newContractsTodayCount}</strong>
          </CCallout>
        </CCol>
        <CCol>
          <CCallout color="info" className="bg-white">
            <small className="text-muted">Reconexiones</small>
            <br />
            <strong className="h4">{reconnectionTodayCount}</strong>
          </CCallout>
        </CCol>
        <CCol>
          <CCallout color="info" className="bg-white">
            <small className="text-muted">Instalaciones</small>
            <br />
            <strong className="h4">{facilityTodayCount}</strong>
          </CCallout>
        </CCol>
        <CCol>
          <CCallout color="info" className="bg-white">
            <small className="text-muted">Desconexiones</small>
            <br />
            <strong className="h4">{disconnectionTodayCount}</strong>
          </CCallout>
        </CCol>
      </CRow>
      <PaymentsTable payments={paymentsToday} />
    </>
  );
};

export default ReportTemplate;
