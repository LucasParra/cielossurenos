import CIcon from "@coreui/icons-react";
import {
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

const fields = [
  "ID",
  "tipo",
  "AssignedID",
  "expiracion",
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

  useEffect(componentDidMount, []);
  return (
    <>
      <CRow>
        <CCol xs="12" lg="12">
          <CCard>
            <CCardHeader>Tareas</CCardHeader>
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
                            color={item.Finish ? "success" : "secondary"}
                            onClick={() =>
                              changeStateTask({
                                ID: item.ID,
                                Finish: !item.Finish,
                              })
                            }
                          >
                            <CIcon content={freeSet.cilCheckCircle} size="xl" />
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
    </>
  );
};

export default Tasks;
