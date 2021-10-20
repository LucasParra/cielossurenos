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
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import { freeSet } from "@coreui/icons";
import { supabase } from "src/config/configSupabase";
import _ from "lodash";
const fields = [
  "ID",
  "tipo",
  "AssignedID",
  "Agendada",
  "estado",
  "cliente",
  "cambiar_estado",
];

const Tasks = () => {
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [details, setDetails] = useState([]);
  const [taskSelected, setTaskSelected] = useState({});

  const [tasks, setTasks] = useState([]);
  const admin = false;

  const componentDidMount = (limit = 1) => {
    setLoading(true);
    supabase
      .from("Task")
      .select("*,TypeID(Name),ClientID(*)")
      .limit(limit * 5 + 1)
      .order("ID", { ascending: true })
      .match({ StateID: 3 })
      .then((snapshot) => {
        setTasks(
          _.groupBy(
            snapshot.data.map((task) => ({
              ...task,
              tipo: task.TypeID.Name,
              Agendada: task.DeadLine,
            })),
            "Agendada"
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
      <CRow>
        {Object.keys(tasks).map((date) => (
          <CCol xs="12" lg="6" key={date}>
            <CCard>
              <CCardHeader>Tareas: {date}</CCardHeader>
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
                            !details.includes(index) ? "info" : "secondary"
                          }
                          onClick={() => toggleDetails(index)}
                        >
                          <CIcon content={freeSet.cilUser} size="xl" />
                        </CButton>
                      </td>
                    ),
                    estado: (item) => (
                      <td>
                        <CBadge color={getBadge(item.StateID)}>
                          {item.StateID === 2 ? "Finalizada" : "En Proceso..."}
                        </CBadge>
                      </td>
                    ),
                    cambiar_estado: (item) => (
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
                              color={
                                item.StateID === 2 ? "success" : "secondary"
                              }
                              onClick={() =>
                                changeStateTask({
                                  ID: item.ID,
                                  StateID: item.StateID === 2 ? 1 : 2,
                                })
                              }
                            >
                              <CIcon content={freeSet.cilSync} size="xl" />
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
    </>
  );
};

export default Tasks;
