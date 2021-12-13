import CIcon from "@coreui/icons-react";
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CCollapse,
  CDataTable,
  CRow,
  CWidgetIcon,
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import { getAddressByUserID } from "src/state/querys/Address";
import { getTaskPending } from "src/state/querys/Tasks";
import { getClientsCount, getClientsCountOffice } from "src/state/querys/Users";
import _ from "lodash";
import { getOffices } from "src/state/querys/Office";
import { freeSet } from "@coreui/icons";

const fields = ["ID", "Tipo", "fecha_agendada", "cliente"];

const chile = new Intl.NumberFormat("es-CL", {
  currency: "CLP",
  style: "currency",
});
const AdminInfo = () => {
  const [countCLientTotal, setCountCLientTotal] = useState(0);
  const [countCLientTotalInactive, setCountCLientTotalInactive] = useState(0);
  const [countClientOffice, setCountClientOffice] = useState([]);
  const [countClientOfficeInactive, setCountClientOfficeInactive] = useState(
    []
  );
  const [accordion, setAccordion] = useState();
  const [details, setDetails] = useState([]);
  const [tasks, setTasks] = useState({});
  const componentDidmount = () => {
    getClientsCount(1).then(setCountCLientTotal);
    getClientsCount(2).then(setCountCLientTotalInactive);
    getOffices().then((offices) => {
      Promise.all(
        offices.map((office) =>
          getClientsCountOffice(office.ID, 1).then((countClient) => ({
            count: countClient,
            ...office,
          }))
        )
      ).then(setCountClientOffice);
      Promise.all(
        offices.map((office) =>
          getClientsCountOffice(office.ID, 2).then((countClient) => ({
            count: countClient,
            ...office,
          }))
        )
      ).then(setCountClientOfficeInactive);
    });
    getTaskPending().then((tasks) => {
      Promise.all(
        tasks.map((task) =>
          getAddressByUserID(task.ClientID.ID).then((Address) => ({
            ...Address[0],
            zoneID: Address[0].Address.AddressZoneID,
            ...task,
            Tipo: task.TypeID.Name,
            fecha_agendada: task.DeadLine,
            Cliente: `${task.ClientID.Names} ${task.ClientID.LastName}`,
          }))
        )
      ).then((responseTask) => setTasks(_.groupBy(responseTask, "zoneID")));
    });
  };
  const toggleDetails = (index) => {
    const position = details.indexOf(index);
    let newDetails = details.slice();
    if (position !== -1) {
      newDetails.splice(position, 1);
    } else {
      newDetails = [...details, index];
    }
    setDetails(newDetails);
  };
  useEffect(componentDidmount, []);
  return (
    <>
      <h4 className="pt-3">Usuarios</h4>
      <CRow>
        <CCol xs="12" sm="6" lg="3">
          <CWidgetIcon
            header={chile.format(countCLientTotal).replace("$", "")}
            text="total de clientes"
            color="info"
          >
            <CIcon width={24} name="cil-user" />
          </CWidgetIcon>
        </CCol>
        {countClientOffice.map((clientOffice) => (
          <CCol xs="12" sm="6" lg="3" key={clientOffice.ID}>
            <CWidgetIcon
              header={chile.format(clientOffice.count).replace("$", "")}
              text={`Sucursal ${clientOffice.Name}`}
              color="info"
            >
              <CIcon width={24} name="cil-user" />
            </CWidgetIcon>
          </CCol>
        ))}
      </CRow>
      <CRow>
        <CCol xs="12" sm="6" lg="3">
          <CWidgetIcon
            header={chile.format(countCLientTotalInactive).replace("$", "")}
            text="total de clientes"
            color="danger"
          >
            <CIcon width={24} name="cil-user" />
          </CWidgetIcon>
        </CCol>
        {countClientOfficeInactive.map((clientOffice) => (
          <CCol xs="12" sm="6" lg="3" key={clientOffice.ID}>
            <CWidgetIcon
              header={chile.format(clientOffice.count).replace("$", "")}
              text={`Sucursal ${clientOffice.Name}`}
              color="danger"
            >
              <CIcon width={24} name="cil-user" />
            </CWidgetIcon>
          </CCol>
        ))}
      </CRow>
      <h4 className="pt-3">Tareas pendientes por zona </h4>
      <CRow>
        {Object.keys(tasks).map((key) => {
          let taskOrderType = _.groupBy(tasks[key], "Tipo");
          return (
            <CCol xs="12" sm="6" md="6">
              <CCard>
                <h4 className="pt-3 pl-3">{key}</h4>
                <CCardBody>
                  {Object.keys(taskOrderType).map((keyType) => (
                    <CCard className="mb-0">
                      <CCardHeader id="headingOne">
                        <CButton
                          block
                          color="link"
                          className="text-left m-0 p-0"
                          onClick={() =>
                            setAccordion(
                              accordion === `${key}-${keyType}`
                                ? null
                                : `${key}-${keyType}`
                            )
                          }
                        >
                          <h5 className="m-0 p-0">{keyType}</h5>
                        </CButton>
                      </CCardHeader>
                      <CCollapse show={accordion === `${key}-${keyType}`}>
                        <CCardBody>
                          <CDataTable
                            items={taskOrderType[keyType]}
                            fields={fields}
                            loading={false}
                            pagination
                            scopedSlots={{
                              cliente: (item, index) => (
                                <td className="py-2">
                                  <CButton
                                    color={
                                      !details.includes(index)
                                        ? "info"
                                        : "secondary"
                                    }
                                    onClick={() => toggleDetails(item.ID)}
                                  >
                                    <CIcon
                                      content={freeSet.cilUser}
                                      size="xl"
                                    />
                                  </CButton>
                                </td>
                              ),
                              details: (item) => (
                                <CCollapse show={details.includes(item.ID)}>
                                  <CCardBody>
                                    <CRow>
                                      <CCol lg="6">
                                        <h4>
                                          {`Nombre: ${item.ClientID.Names} ${item.ClientID.LastName}`}
                                        </h4>
                                        <h4>{`Rut: ${item.ClientID.Rut}`}</h4>
                                        <h4>{`Contacto:${item.ClientID.PhoneNumber}`}</h4>
                                      </CCol>
                                      <CCol lg="6">
                                        <h4>{`Nota`}</h4>
                                        <h5>{item.Note}</h5>
                                      </CCol>
                                    </CRow>
                                  </CCardBody>
                                </CCollapse>
                              ),
                            }}
                          />
                        </CCardBody>
                      </CCollapse>
                    </CCard>
                  ))}
                </CCardBody>
              </CCard>
            </CCol>
          );
        })}
      </CRow>
    </>
  );
};

export default AdminInfo;
