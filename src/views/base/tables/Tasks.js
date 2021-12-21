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
import { useKeySelector } from "src/hook/general";
import {
  createUserFinishTask,
  updateUserFinishTask,
} from "src/state/querys/Users";
import {
  createCharge,
  createPay,
  updateCharge,
} from "src/state/querys/Charges";
import { createDiscount, updateDiscount } from "src/state/querys/Discount";
const fields = [
  "ID",
  "tipo",
  "fecha_agendada",
  "estado",
  "cliente",
  "cambiar_estado",
];
const chile = new Intl.NumberFormat("es-CL", {
  currency: "CLP",
  style: "currency",
});
const Tasks = () => {
  const { user } = useKeySelector(["user"]);
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [details, setDetails] = useState([]);
  const [taskSelected, setTaskSelected] = useState({});
  const [tasks, setTasks] = useState([]);
  const componentDidMount = () => {
    setLoading(true);
    supabase
      .from("Task")
      .select("*,TypeID(Name,ID),ClientID(*)")
      .order("ID", { ascending: false })
      .or("StateID.eq.2,StateID.eq.3")
      .eq("AssignedID", user.ID)
      .then((snapshot) => {
        setTasks(
          _.groupBy(
            snapshot.data.map((task) => ({
              ...task,
              tipo: task.TypeID.Name,
              fecha_agendada: task.DeadLine,
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

  const changeStateTask = (dataTask, type, data) => {
    if (dataTask.StateID === 1) return null;
    if (type === 6 || type === 7) {
      if (data.ID) {
        supabase
          .from("Product")
          .upsert(data)
          .then(() => {});
      } else {
        supabase
          .from("Product")
          .insert(data)
          .then(() => {});
      }
    }
    if (type === 8 || type === 9) {
      if (data.User.ID) {
        updateUserFinishTask(
          _.omit(data.User, "Address"),
          data.Products,
          data.Address,
          data.OfficeID
        );
      } else {
        createUserFinishTask(
          data.User,
          data.Products,
          data.Address,
          data.OfficeID
        );
      }
    }
    if (type === 10 || type === 11) {
      if (data?.ID) {
        updateCharge(_.omit(data, "ID"), data.ID);
      } else {
        createCharge(data);
      }
    }
    if (type === 12) {
      Promise.all([data.map(({ ID }) => createPay(ID))]);
    }
    if (type === 13 || type === 14) {
      if (data.ID) {
        updateDiscount(_.omit(data, "ID"), data.ID);
      } else {
        createDiscount(_.omit(data, "ID"));
      }
    }
    supabase
      .from("Task")
      .update(dataTask)
      .eq("ID", dataTask.ID)
      .then(() => {
        setLoading(false);
        componentDidMount();
        setDeleteModal(false);
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
          <CCol xs="12" lg="12" key={date}>
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
                    cliente: (item) => (
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
                    estado: (item) => (
                      <td>
                        <CBadge color={getBadge(item.StateID)}>
                          {item.StateID === 2 ? "Finalizada" : "En Proceso..."}
                        </CBadge>
                      </td>
                    ),
                    cambiar_estado: (item) => (
                      <td className="py-2">
                        {item.StateID !== 2 && (
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
                                  changeStateTask(
                                    {
                                      ID: item.ID,
                                      StateID: item.StateID === 2 ? 3 : 2,
                                    },
                                    item.TypeID.ID,
                                    item.Data
                                  )
                                }
                              >
                                <CIcon content={freeSet.cilCheck} size="xl" />
                              </CButton>
                            </CCol>
                            {user?.RolID.ID === 8 && (
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
                        )}
                      </td>
                    ),
                    details: (item, index) => (
                      <CCollapse show={details.includes(item.ID)}>
                        <CCardBody>
                          <CRow>
                            <CCol lg="4">
                              <h4>
                                {`Nombre: ${item.ClientID.Names} ${item.ClientID.LastName}`}
                              </h4>
                              <h4>{`Rut: ${item.ClientID.Rut}`}</h4>
                              <h4>{`Contacto:${item.ClientID.PhoneNumber}`}</h4>
                            </CCol>
                            {user?.RolID.ID === 8 && (
                              <CCol lg="3">
                                <h4>Nota</h4>
                                <h6>{item.Note}</h6>
                              </CCol>
                            )}
                            {(item.TypeID.ID === 8 || item.TypeID.ID === 9) && (
                              <CCol lg="3">
                                <h4>Cliente</h4>
                                <h6>{`Nombre: ${item.Data.User.Names} ${item.Data.User.LastName}`}</h6>
                                <h6>{`Rut: ${item.Data.User.Rut}`}</h6>
                              </CCol>
                            )}
                            {(item.TypeID.ID === 10 ||
                              item.TypeID.ID === 11) && (
                              <CCol lg="3">
                                <h4>Cargo</h4>
                                <h6>Nombre :{item.Data.Name}</h6>
                                <h6>
                                  {`Monto : ${chile
                                    .format(item.Data.Charge)
                                    .replace("$", "")}`}
                                </h6>
                              </CCol>
                            )}
                            {(item.TypeID.ID === 8 || item.TypeID.ID === 9) && (
                              <CCol lg="2">
                                <h4>Productos</h4>
                                {item.Data.Products.map((product) => (
                                  <>
                                    <h6>Producto ID: {product.ProductID}</h6>
                                    <h6>
                                      {`Precio: ${chile
                                        .format(product.Price)
                                        .replace("$", "")}`}
                                    </h6>
                                  </>
                                ))}
                              </CCol>
                            )}

                            {(item.TypeID.ID === 6 || item.TypeID.ID === 7) && (
                              <CCol lg="3">
                                <h4>Producto</h4>
                                <h6>{`Nombre: ${item.Data.Name}`}</h6>
                                <h6>{`Precio Base: ${item.Data.BasePrice}`}</h6>
                              </CCol>
                            )}
                            {(item.TypeID.ID === 13 ||
                              item.TypeID.ID === 14) && (
                              <CCol lg="3">
                                <h4>Descuento</h4>
                                <h6>{`Tipo de descuento: ${item.Data.TypeID}`}</h6>
                                <h6>{`Descuento: ${
                                  item.Data.IsPercentage
                                    ? `${item.Data.Discount}%`
                                    : chile
                                        .format(item.Data.Discount)
                                        .replace("$", "")
                                }`}</h6>
                              </CCol>
                            )}
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
    </>
  );
};

export default Tasks;
