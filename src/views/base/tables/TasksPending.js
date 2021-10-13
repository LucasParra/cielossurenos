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
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import { freeSet } from "@coreui/icons";
import { supabase } from "src/config/configSupabase";
import { createTask, getTypesTasks } from "src/state/querys/Tasks";
import TechniciansTable from "src/components/Tables/TechniciansTable";
import ClientsTable from "src/components/Tables/ClientsTables";
import { getChargeUserID } from "src/state/querys/Charges";

const fields = [
  "ID",
  "tipo",
  "AssignedID",
  "expiracion",
  "estado",
  "cliente",
  "aprobar",
];

const TaskPending = () => {
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [modalTechnicians, setModalTechnicians] = useState(false);
  const [modalClient, setModalClient] = useState(false);
  const [details, setDetails] = useState([]);
  const [taskSelected, setTaskSelected] = useState({});
  const [taskForm, setTaskForm] = useState({
    TypeID: "",
    AssignedID: "",
    ClientID: "",
    StateID: 1,
  });
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
      .select("*,TypeID(Name),ClientID(*)")
      .limit(limit * 5 + 1)
      .order("ID", { ascending: true })
      .eq("StateID", 1)
      .then((snapshot) => {
        setTasks(
          snapshot.data.map((task) => ({
            ...task,
            tipo: task.TypeID.Name,
            expiracion: task.DeadLine,
          }))
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
              <CCol xs="3" lg="3">
                <h4>Tipo</h4>
                <CSelect
                  custom
                  size="xl"
                  name="DiscountType"
                  id="DiscountType"
                  value={taskForm.TypeID}
                  onChange={({ target: { value } }) =>
                    setTaskForm({ ...taskForm, TypeID: parseInt(value) })
                  }
                >
                  <option value={""}>selecciona un tipo</option>
                  {types.map((type) => (
                    <option key={type.ID} value={type.ID}>
                      {type.Name}
                    </option>
                  ))}
                </CSelect>
              </CCol>
              <CCol xs="3" lg="3">
                <h4>Tecnico Encargado</h4>
                <CButton
                  color="info"
                  onClick={() => setModalTechnicians(true)}
                  style={{ marginBottom: 10 }}
                >
                  Tecnico
                </CButton>
              </CCol>
              <CCol xs="3" lg="3">
                <h4>Usuario asignado</h4>
                <CButton
                  color="info"
                  onClick={() => setModalClient(true)}
                  style={{ marginBottom: 10 }}
                >
                  Cliente
                </CButton>
              </CCol>
              <CCol xs="3" lg="3" style={{ paddingTop: 10 }}>
                <CButton
                  color="success"
                  onClick={() =>
                    createTask(taskForm).then(() => {
                      setTaskForm({
                        TypeID: "",
                        AssignedID: "",
                        ClientID: "",
                        StateID: 1,
                      });
                      componentDidMount();
                    })
                  }
                  style={{ marginBottom: 10 }}
                >
                  Crear
                </CButton>
              </CCol>
            </CRow>
          </CCollapse>
        </CCol>
      </CRow>
      <CRow>
        <CCol xs="12" lg="12">
          <CCard>
            <CCardHeader>Tareas Pendiente Aprobacion</CCardHeader>
            <CCardBody>
              <CDataTable
                items={tasks}
                fields={fields}
                itemsPerPage={5}
                onPageChange={componentDidMount}
                loading={loading}
                pagination
                scopedSlots={{
                  cliente: (item, index) => (
                    <td className="py-2">
                      <CButton
                        color={!details.includes(index) ? "info" : "secondary"}
                        onClick={() => toggleDetails(index)}
                      >
                        <CIcon content={freeSet.cilUser} size="xl" />
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
                  details: (item, index) => (
                    <CCollapse show={details.includes(index)}>
                      <CCardBody>
                        <h4>
                          {`Nombre: ${item.ClientID.Names} ${item.ClientID.LastName}`}
                        </h4>
                        <h4>{`Rut: ${item.ClientID.Rut}`}</h4>
                        <h4>{`Contacto:${item.ClientID.PhoneNumber}`}</h4>
                      </CCardBody>
                    </CCollapse>
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
              getChargeUserID(value).then((data) =>
                setTaskForm({
                  ...taskForm,
                  ClientID: value,
                  StateID: data.length !== 0 ? 1 : 3,
                })
              )
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
