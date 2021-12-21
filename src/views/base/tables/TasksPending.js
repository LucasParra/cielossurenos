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
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CSelect,
  CTextarea,
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import { freeSet } from "@coreui/icons";
import { supabase } from "src/config/configSupabase";
import { createTask, getTypesTasks, updateTask } from "src/state/querys/Tasks";
import TechniciansTable from "src/components/Tables/TechniciansTable";
import ClientsTable from "src/components/Tables/ClientsTables";
import { getChargeUserID } from "src/state/querys/Charges";
import _ from "lodash";

const fields = [
  "ID",
  "tipo",
  "usuario_asignado",
  "fecha_agendada",
  "estado",
  "cliente",
  "editar",
  "aprobar",
];

const initTask = {
  TypeID: "",
  AssignedID: "",
  ClientID: "",
  StateID: 1,
  Note: "",
};

const TaskPending = () => {
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [modalTechnicians, setModalTechnicians] = useState(false);
  const [modalClient, setModalClient] = useState(false);
  const [details, setDetails] = useState([]);
  const [taskSelected, setTaskSelected] = useState({});
  const [taskForm, setTaskForm] = useState(initTask);
  const [types, setTypes] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [createTaskVisible, setCreateTaskVisible] = useState(false);
  const admin = false;

  const componentDidMount = (limit = 1) => {
    if (limit === 1) {
      getTypesTasks().then(setTypes);
    }

    setLoading(true);
    supabase
      .from("Task")
      .select("*,TypeID(Name,ID),ClientID(*),AssignedID(*)")
      .order("ID", { ascending: false })
      .eq("StateID", 1)
      .then((snapshot) => {
        setTasks(
          _.groupBy(
            snapshot.data.map((task) => ({
              ...task,
              tipo: task.TypeID.Name,
              fecha_agendada: task.DeadLine,
              usuario_asignado: task.AssignedID.Names,
            })),
            "fecha_agendada"
          )
        );
        setLoading(false);
      })
      .catch(console.error);
  };
  const deleteTask = () =>
    supabase
      .from("Task")
      .delete()
      .match({ ID: taskSelected.ID })
      .then(() => {
        setLoading(false);
        setTaskSelected();
        componentDidMount();
        setDeleteModal(false);
      });

  const changeStateTask = (dataTask) =>
    supabase
      .from("Task")
      .update(dataTask)
      .eq("ID", dataTask.ID)
      .then(() => {
        setLoading(false);
        componentDidMount();
        setDeleteModal(false);
      });

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

  const getBadge = (status) => {
    switch (status) {
      case 2:
        return "success";
      default:
        return "info";
    }
  };
  useEffect(componentDidMount, []);
  return (
    <>
      <CRow style={{ paddingLeft: 20 }}>
        <CButton
          color="info"
          onClick={() => setCreateTaskVisible(!createTaskVisible)}
          style={{ marginBottom: 10 }}
        >
          Crear Tarea
        </CButton>

        <CCol xs="12" lg="12">
          <CCollapse show={createTaskVisible}>
            <CRow>
              <CCol xs="2" lg="2">
                <h4>Tipo</h4>
                <CSelect
                  custom
                  size="xl"
                  name="DiscountType"
                  id="DiscountType"
                  value={taskForm.TypeID}
                  defaultValue={taskForm.TypeID}
                  onChange={({ target: { value } }) =>
                    setTaskForm({ ...taskForm, TypeID: parseInt(value) })
                  }
                >
                  <option value={""}>selecciona un tipo</option>
                  {types
                    .filter(({ ID }) => ID < 6)
                    .map((type) => (
                      <option key={type.ID} value={type.ID}>
                        {type.Name}
                      </option>
                    ))}
                </CSelect>
              </CCol>
              <CCol xs="2" lg="">
                <h4>Tecnico</h4>
                <CButton
                  color="info"
                  onClick={() => setModalTechnicians(true)}
                  style={{ marginBottom: 10 }}
                >
                  Tecnico
                </CButton>
              </CCol>
              <CCol xs="2" lg="1">
                <h4>Usuario </h4>
                <CButton
                  color="info"
                  onClick={() => setModalClient(true)}
                  style={{ marginBottom: 10 }}
                >
                  Cliente
                </CButton>
              </CCol>
              <CCol xs="3" lg="3" style={{ marginBottom: 10 }}>
                <h4>Nota (Opcional)</h4>
                <CTextarea
                  id="name"
                  value={taskForm.Note}
                  onChange={({ target: { value } }) =>
                    setTaskForm({ ...taskForm, Note: value })
                  }
                />
              </CCol>
              <CCol xs="2" lg="2" style={{ paddingTop: 10 }}>
                <CButton
                  color="success"
                  onClick={() => {
                    taskForm?.ID
                      ? updateTask(taskForm).then(() => {
                          setTaskForm(initTask);
                          componentDidMount();
                        })
                      : createTask(taskForm).then(() => {
                          setTaskForm(initTask);
                          componentDidMount();
                        });
                  }}
                  style={{ marginBottom: 10 }}
                >
                  {taskForm?.ID ? "Editar" : "Crear"}
                </CButton>
              </CCol>
              <CCol xs="2" lg="2" style={{ paddingTop: 10 }}>
                {taskForm?.ID && (
                  <CButton
                    color="danger"
                    onClick={() => {
                      setTaskForm(initTask);
                      componentDidMount();
                    }}
                    style={{ marginBottom: 10 }}
                  >
                    Cancelar Ediccion
                  </CButton>
                )}
              </CCol>
            </CRow>
          </CCollapse>
        </CCol>
      </CRow>
      <CRow>
        {Object.keys(tasks).map((date) => (
          <CCol xs="12" lg="12" key={date}>
            <CCard>
              <CCardHeader>Tareas Pendiente : {date}</CCardHeader>
              <CCardBody>
                <CDataTable
                  items={tasks[date]}
                  fields={fields}
                  itemsPerPage={5}
                  onPageChange={componentDidMount}
                  loading={loading}
                  pagination
                  scopedSlots={{
                    cliente: (item, index) => (
                      <td className="py-2">
                        <CButton
                          color={
                            !details.includes(item.ID) ? "info" : "secondary"
                          }
                          onClick={() => toggleDetails(item.ID)}
                        >
                          <CIcon content={freeSet.cilUser} size="xl" />
                        </CButton>
                      </td>
                    ),
                    editar: (item) => (
                      <td className="py-2">
                        <CButton
                          color="info"
                          onClick={() => {
                            setTaskForm({
                              ID: item.ID,
                              TypeID: item.TypeID.ID,
                              AssignedID: item.AssignedID,
                              ClientID: item.ClientID.ID,
                              StateID: item.StateID,
                              Note: item.Note ? item.Note : "",
                            });
                          }}
                        >
                          <CIcon content={freeSet.cilPencil} size="xl" />
                        </CButton>
                      </td>
                    ),
                    estado: (item) => (
                      <td>
                        <CBadge color={getBadge(item.StateID)}>
                          Pendiente...
                        </CBadge>
                      </td>
                    ),
                    aprobar: (item) => (
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
                              color="success"
                              onClick={() =>
                                changeStateTask({
                                  ID: item.ID,
                                  StateID: 3,
                                })
                              }
                            >
                              <CIcon content={freeSet.cilCheck} size="xl" />
                            </CButton>
                          </CCol>
                          {admin && (
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
                                  setTaskSelected(item);
                                }}
                              >
                                <CIcon content={freeSet.cilTrash} size="xl" />
                              </CButton>
                            </CCol>
                          )}
                        </CRow>
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
            </CCard>
          </CCol>
        ))}
      </CRow>
      <CModal
        show={deleteModal}
        color="danger"
        onClose={() => {
          setTaskSelected();
          setDeleteModal(!deleteModal);
        }}
        size="sm"
      >
        <CModalHeader closeButton>
          <CModalTitle>Eliminar Tarea</CModalTitle>
        </CModalHeader>
        <CModalFooter>
          <CButton color="danger" onClick={deleteTask}>
            Si
          </CButton>
          <CButton
            onClick={() => {
              setTaskSelected();
              setDeleteModal(!deleteModal);
            }}
            color="secondary"
          >
            No
          </CButton>
        </CModalFooter>
      </CModal>
      {/* modal technicians */}
      <CModal
        show={modalTechnicians}
        onClose={setModalTechnicians}
        color="info"
      >
        <CModalHeader closeButton>
          <CModalTitle>Selecciona el tecnico encargado</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <TechniciansTable
            setTechnicianID={(value) =>
              setTaskForm({ ...taskForm, AssignedID: value })
            }
            TechnicianID={taskForm.AssignedID}
          />
        </CModalBody>
        <CModalFooter>
          <CButton color="info" onClick={() => setModalTechnicians(false)}>
            Aceptar
          </CButton>
        </CModalFooter>
      </CModal>
      {/* modal client */}
      <CModal
        show={modalClient}
        onClose={setModalClient}
        color="info"
        size="lg"
      >
        <CModalHeader closeButton>
          <CModalTitle>Selecciona el Cliente</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <ClientsTable
            setClientID={(value) =>
              getChargeUserID(value).then((data) => {
                return setTaskForm({
                  ...taskForm,
                  ClientID: value,
                  StateID: data.length !== 0 ? 1 : 3,
                });
              })
            }
            ClientID={taskForm.ClientID}
          />
        </CModalBody>
        <CModalFooter>
          <CButton color="info" onClick={() => setModalClient(false)}>
            Aceptar
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default TaskPending;
