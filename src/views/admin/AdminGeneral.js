import { CCard, CCardBody, CCardHeader, CCol, CRow } from "@coreui/react";
import React, { useEffect, useState } from "react";
import { getClientsCount, getUserStates } from "src/state/querys/Users";
import _ from "lodash";
import { CChartDoughnut } from "@coreui/react-chartjs";
import { useKeySelector } from "src/hook/general";
import { nameStateSpanish } from "src/utils";
import { getStateTask } from "src/state/querys/Tasks";

const AdminGeneral = () => {
  const { colors } = useKeySelector(["colors"]);
  const [clients, setClients] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const componentDidMount = () => {
    getStateTask().then(setTasks);
    setLoading(true);
    getUserStates().then((states) =>
      Promise.all(
        states.map((state) => getClientsCount(state.ID, state.Name))
      ).then(setClients)
    );
    setLoading(false);
  };
  useEffect(componentDidMount, []);
  return (
    <>
      {loading ? (
        <div class="d-flex justify-content-center ">
          <div
            class="spinner-grow text-info"
            role="status"
            style={{ width: "5rem", height: "5rem" }}
          >
            <span class="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <h1 className="pt-3" align="center">
            TOTAL CLIENTES
          </h1>
          <CRow>
            <CCol xs="12" sm="6" lg="12">
              <CCard style={{ borderRadius: 24 }}>
                <CCardHeader
                  align="center"
                  style={{
                    backgroundColor: colors.primary,
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                >
                  Grafica de clientes
                </CCardHeader>
                <CCardBody>
                  <CChartDoughnut
                    datasets={[
                      {
                        backgroundColor: [
                          "#41B883",
                          "red",
                          "#FA8900",
                          "#28D2ED",
                          "#ffce56",
                          "#038BA1",
                        ],
                        data: clients.map((client) => client.count),
                      },
                    ]}
                    labels={clients.map((client) =>
                      nameStateSpanish(client.stateID)
                    )}
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
          <h1 className="pt-3" align="center">
            TAREAS
          </h1>
          <CRow>
            <CCol xs="12" sm="6" lg="12">
              <CCard style={{ borderRadius: 24 }}>
                <CCardHeader
                  align="center"
                  style={{
                    backgroundColor: colors.primary,
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                >
                  Grafica de tareas por estado
                </CCardHeader>
                <CCardBody>
                  <CChartDoughnut
                    datasets={[
                      {
                        backgroundColor: [
                          "#41B883",
                          "red",
                          "#FA8900",
                          "#28D2ED",
                          "#ffce56",
                          "#038BA1",
                        ],
                        data: tasks.map((task) => task.Task.length),
                      },
                    ]}
                    labels={tasks.map((task) => task.Name)}
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
          {/* <h1 className="pt-3" align="center">
            CLIENTES POR SUCURSAL
          </h1>
          <CRow>
            {offices.map((office) => (
              <CCol xs="12" sm="6" lg="3" key={office.Name}>
                <CCard>
                  <CCardHeader
                    align="center"
                    style={{
                      backgroundColor: colors.primary,
                      color: "#fff",
                      fontWeight: "bold",
                    }}
                  >
                    {office.Name}
                  </CCardHeader>
                  <CCardBody>
                    <CChartDoughnut
                      datasets={[
                        {
                          backgroundColor: ["#41B883", "#E46651"],
                          data: [office.active, office.inactive],
                        },
                      ]}
                      labels={["Activos", "Inactivos"]}
                      options={{
                        tooltips: {
                          enabled: true,
                        },
                      }}
                    />
                  </CCardBody>
                </CCard>
              </CCol>
            ))}
          </CRow> */}
          {/* <h1 className="pt-3" align="center">
            TAREAS PENDIENTES POR ZONA
          </h1>
          <CRow>
            {Object.keys(tasks).map((key) => {
              let taskOrderType = _.groupBy(tasks[key], "Tipo");
              return (
                <CCol xs="12" sm="6" md="6">
                  <CCard>
                    <CCardHeader
                      align="center"
                      style={{
                        backgroundColor: colors.primary,
                        color: "#fff",
                        fontWeight: "bold",
                      }}
                    >
                      {key}
                    </CCardHeader>
                    <CCardBody>
                      {Object.keys(taskOrderType).map((keyType) => (
                        <CCard className="mb-0">
                          <CCardHeader
                            id="headingOne"
                            style={{
                              backgroundColor: colors.primary,
                              color: "#fff",
                              fontWeight: "bold",
                            }}
                          >
                            <CButton
                              block
                              className="text-left m-0 p-0"
                              onClick={() =>
                                setAccordion(
                                  accordion === `${key}-${keyType}`
                                    ? null
                                    : `${key}-${keyType}`
                                )
                              }
                            >
                              <h5
                                className="m-0 p-0"
                                style={{
                                  color: "#fff",
                                  fontWeight: "bold",
                                }}
                              >
                                {keyType}
                              </h5>
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
          </CRow> */}
        </>
      )}
    </>
  );
};

export default AdminGeneral;
