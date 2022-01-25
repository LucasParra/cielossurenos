import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CCollapse,
  CInput,
  CInputGroup,
  CInputGroupAppend,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CSelect,
} from "@coreui/react";
import React, { useState } from "react";
import moment from "moment";
import _ from "lodash";
import Select from "react-select";

import { supabase } from "src/config/configSupabase";
import { useKeySelector } from "src/hook/general";
import {
  createCharge,
  createPay,
  getChargeUserID,
  updateCharge,
} from "src/state/querys/Charges";
import { createDiscount, updateDiscount } from "src/state/querys/Discount";
import {
  createUserFinishTask,
  updateUserFinishTask,
  updateUserID,
} from "src/state/querys/Users";
import {
  createCommentTask,
  getCommentsTask,
  updateTask,
} from "src/state/querys/Tasks";
import CIcon from "@coreui/icons-react";
import { freeSet } from "@coreui/icons";
import TechniciansTable from "./TechniciansTable";
import { UploadFile } from "../buttons";

const TasksTable = ({ tasks, taskEffect }) => {
  const { user } = useKeySelector(["user"]);
  const [showCollapseCommentTask, setShowCollapseCommentTask] = useState("");
  const [showCollapseInfoTask, setShowCollapseInfoTask] = useState("");

  const [deleteModal, setDeleteModal] = useState(false);
  const [showTechnicalModal, setShowTechnicalModal] = useState(false);
  const [showTechnicalPaymentModal, setShowTechnicalPaymentModal] =
    useState(false);
  const [taskSelected, setTaskSelected] = useState({});
  const [comments, setComments] = useState([]);
  const [textComment, setTextComment] = useState("");
  const [technicalSelected, setTechnicalSelected] = useState({});
  const [chargesUserTask, setChargesUserTask] = useState([]);
  const [chargesSelected, setChargesSelected] = useState([]);
  const [files, setFiles] = useState([]);

  const deleteTask = () =>
    supabase
      .from("Task")
      .delete()
      .match({ ID: taskSelected.ID })
      .then(() => {
        setTaskSelected();
        taskEffect();
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
    if (type === 16) {
      updateUserID({ ID: dataTask.ClientID, StateID: 2 }).then(() => {});
    }
    if (type === 17) {
      updateUserID({ ID: dataTask.ClientID, StateID: 1 }).then(() => {});
    }
    supabase
      .from("Task")
      .update(dataTask)
      .eq("ID", dataTask.ID)
      .then(() => {
        taskEffect();
        setDeleteModal(false);
      });
  };

  const getBadge = (status) => {
    switch (status) {
      case 2:
        return "success";
      default:
        return "info";
    }
  };
  const getColorPriority = (priority) => {
    switch (priority) {
      case "Alta":
        return "#b50909";
      case "Media":
        return "#ffbe2e";
      default:
        return "#00bde3";
    }
  };
  const commentsTaskEffect = (TaskID) => {
    if (showCollapseCommentTask === TaskID) {
      setTextComment("");
      setComments([]);
      return setShowCollapseCommentTask("");
    }
    getCommentsTask(TaskID).then((commentsApi) => {
      setComments(commentsApi);
      setShowCollapseCommentTask(
        showCollapseCommentTask === TaskID ? "" : TaskID
      );
    });
  };
  const handleCreateComments = (TaskID) =>
    createCommentTask({ TaskID, Comment: textComment, UserID: user.ID }).then(
      (newCommentID) => {
        setComments([
          ...comments,
          {
            ID: newCommentID,
            UserID: { Names: user.Names, LastName: user.LastName },
            createAt: moment().toDate(),
            TaskID,
            Comment: textComment,
          },
        ]);
        setTextComment("");
        getCommentsTask(TaskID);
      }
    );
  const handleChangePriorityTask = (TaskID, Priority) =>
    updateTask({ ID: TaskID, Priority }).then(taskEffect);

  const handleChangeTechnicalTask = (TaskID, Priority) =>
    updateTask({
      ID: technicalSelected.TaskID,
      AssignedID: technicalSelected.AssignedID,
    }).then(() => {
      setTechnicalSelected(false);
      setShowTechnicalModal(false);
      taskEffect();
    });

  const orderPriority = (priority) => {
    switch (priority) {
      case "Alta":
        return 0;
      case "Media":
        return 1;
      default:
        return 2;
    }
  };
  const onFinishPayment = () =>
    Promise.all([
      chargesSelected.map((charge) => updateCharge({ State: true }, charge.ID)),
      updateUserID({ ID: taskSelected.ClientID.ID, StateID: 1 }),
      updateTask({
        ID: taskSelected.ID,
        StateID: 2,
      }),
    ]).then(() => {
      taskEffect();
      setChargesSelected([]);
      setFiles();
      setShowTechnicalPaymentModal(false);
      setTaskSelected();
    });

  return (
    <>
      <CRow>
        {Object.keys(tasks)
          .sort((a, b) => orderPriority(a) - orderPriority(b))
          .map((priority) => (
            <CCol xs="12" lg="4">
              <CCard style={{ borderRadius: 20 }}>
                <CCardHeader
                  style={{
                    backgroundColor: getColorPriority(priority),
                    fontWeight: "bold",
                    color: "#fff",
                    fontSize: 16,
                    textAlign: "center",
                  }}
                >
                  {priority}
                </CCardHeader>
                <CCardBody>
                  {Object.keys(_.groupBy(tasks[priority], "DeadLine")).map(
                    (date) => (
                      <>
                        <CRow>
                          <h6
                            style={{
                              fontSize: 16,
                              fontWeight: "bold",
                              textAlign: "center",
                              width: "100%",
                            }}
                          >
                            {moment(date).format("DD-MM-YYYY")}
                          </h6>
                        </CRow>
                        {_.groupBy(tasks[priority], "DeadLine")[date].map(
                          (task) => (
                            <>
                              <CCol
                                xs="12"
                                lg="12"
                                style={{
                                  borderRadius: 6,
                                  border: `3px solid ${getColorPriority(
                                    priority
                                  )}`,
                                  padding: 16,
                                  marginTop: 12,
                                }}
                              >
                                <CRow>
                                  <CCol xs="7" lg="7">
                                    <h6
                                      style={{
                                        fontSize: 16,
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {`${task.ID}-${task.TypeID.Name}`}
                                    </h6>
                                    <CBadge color={getBadge(task.StateID)}>
                                      {task.StateID === 2
                                        ? "Finalizada"
                                        : "En Proceso..."}
                                    </CBadge>
                                  </CCol>

                                  <CCol xs="4" lg="4">
                                    <CSelect
                                      name={`select-priority-${task.ID}`}
                                      id={`select-priority-${task.ID}`}
                                      size="sm"
                                      style={{
                                        border: `3px solid ${getColorPriority(
                                          priority
                                        )}`,
                                      }}
                                      value={task.Priority}
                                      onChange={({ target: { value } }) =>
                                        handleChangePriorityTask(task.ID, value)
                                      }
                                    >
                                      <option value="Alta">Alta</option>
                                      <option value="Media">Media</option>
                                      <option value="Baja">Baja</option>
                                    </CSelect>
                                  </CCol>
                                </CRow>
                                <CRow style={{ marginTop: 12 }}>
                                  <CCol xs="2" lg="2">
                                    <CButton
                                      color="secondary"
                                      onClick={() =>
                                        commentsTaskEffect(task.ID)
                                      }
                                    >
                                      <CIcon
                                        content={freeSet.cilCommentBubble}
                                        size="xl"
                                      />
                                    </CButton>
                                  </CCol>
                                  <CCol xs="2" lg="2">
                                    <CButton
                                      color="info"
                                      onClick={() =>
                                        setShowCollapseInfoTask(
                                          showCollapseInfoTask === task.ID
                                            ? ""
                                            : task.ID
                                        )
                                      }
                                    >
                                      <CIcon
                                        content={freeSet.cilZoomIn}
                                        size="xl"
                                      />
                                    </CButton>
                                  </CCol>
                                  {user?.RolID.ID !== 1 &&
                                    task.AssignedID?.RolID === 1 && (
                                      <CCol xs="2" lg="2">
                                        <CButton
                                          color="warning"
                                          onClick={() => {
                                            setTechnicalSelected({
                                              AssignedID: task.AssignedID,
                                              TaskID: task.ID,
                                            });
                                            setShowTechnicalModal(true);
                                          }}
                                        >
                                          <CIcon
                                            content={freeSet.cilUser}
                                            size="xl"
                                          />
                                        </CButton>
                                      </CCol>
                                    )}
                                  {task.StateID === 3 && (
                                    <CCol xs="2" lg="2">
                                      <CButton
                                        onClick={() =>
                                          changeStateTask(
                                            {
                                              ID: task.ID,
                                              StateID:
                                                task.StateID === 2 ? 3 : 2,
                                              ClientID: task.ClientID.ID,
                                            },
                                            task.TypeID.ID,
                                            task.Data
                                          )
                                        }
                                        color="success"
                                      >
                                        <CIcon
                                          content={freeSet.cilCheck}
                                          size="xl"
                                        />
                                      </CButton>
                                    </CCol>
                                  )}
                                  {task.TypeID.ID === 16 && task.StateID === 3 && (
                                    <CCol xs="2" lg="2">
                                      <CButton
                                        onClick={() => {
                                          getChargeUserID(
                                            task.ClientID.ID
                                          ).then(setChargesUserTask);
                                          setTaskSelected(task);
                                          setShowTechnicalPaymentModal(true);
                                        }}
                                        color="success"
                                      >
                                        <CIcon
                                          content={freeSet.cilCash}
                                          size="xl"
                                        />
                                      </CButton>
                                    </CCol>
                                  )}
                                </CRow>
                                <CCollapse
                                  show={showCollapseCommentTask === task.ID}
                                >
                                  <CCardBody>
                                    {comments.map((comment) => (
                                      <CRow key={comment.ID}>
                                        <CCol xs="12" lg="1">
                                          <CIcon
                                            content={freeSet.cilUser}
                                            size="xl"
                                          />
                                        </CCol>
                                        <CCol xs="12" lg="10">
                                          <h6>{`${comment.UserID.Names} ${comment.UserID.LastName}`}</h6>
                                        </CCol>
                                        <CCol lg="2" />
                                        <CCol xs="12" lg="10">
                                          <p
                                            style={{
                                              backgroundColor: "#d7d7d799",
                                              borderRadius: 6,
                                              padding: 6,
                                            }}
                                          >
                                            {comment.Comment}
                                          </p>
                                        </CCol>
                                      </CRow>
                                    ))}

                                    <CRow>
                                      <CCol
                                        xs="12"
                                        lg="12"
                                        style={{ marginTop: 10 }}
                                      >
                                        <CCol md="12">
                                          <CInputGroup
                                            style={{
                                              border: "2px solid #9999",
                                              borderRadius: 2,
                                            }}
                                          >
                                            <CInput
                                              type="email"
                                              id="input2-group1"
                                              name="input2-group1"
                                              placeholder="Escribe un comentario"
                                              style={{
                                                border: "0px solid #9999",
                                              }}
                                              value={textComment}
                                              onChange={({
                                                target: { value },
                                              }) => setTextComment(value)}
                                            />
                                            <CInputGroupAppend>
                                              <CButton
                                                onClick={() =>
                                                  handleCreateComments(task.ID)
                                                }
                                              >
                                                <CIcon
                                                  content={freeSet.cilSend}
                                                />
                                              </CButton>
                                            </CInputGroupAppend>
                                          </CInputGroup>
                                        </CCol>
                                      </CCol>
                                    </CRow>
                                  </CCardBody>
                                </CCollapse>
                                <CCollapse
                                  show={showCollapseInfoTask === task.ID}
                                >
                                  <CCardBody>
                                    <CRow
                                      style={{
                                        backgroundColor: "#d7d7d799",
                                        borderRadius: 6,
                                        padding: 6,
                                        marginTop: 12,
                                      }}
                                    >
                                      <CCol lg="12">
                                        <h6 style={{ fontWeight: "bold" }}>
                                          {`Nombre: ${task.ClientID.Names} ${task.ClientID.LastName}`}
                                        </h6>
                                      </CCol>
                                      <CCol lg="12">
                                        <h6 style={{ fontWeight: "bold" }}>
                                          {`Contacto: ${task.ClientID.PhoneNumber}`}
                                        </h6>
                                      </CCol>
                                      <CCol lg="12">
                                        <h6 style={{ fontWeight: "bold" }}>
                                          {`Rut: ${task.ClientID.Rut}`}
                                        </h6>
                                      </CCol>
                                      <CCol lg="12">
                                        <h6 style={{ fontWeight: "bold" }}>
                                          {`Direccion: ${task.ClientID?.Address[0].AddressID?.AddressName}  ${task.ClientID?.Address[0].AddressID?.AddressNumber}`}
                                        </h6>
                                      </CCol>
                                    </CRow>
                                    {user?.RolID.ID !== 1 && (
                                      <CRow
                                        style={{
                                          backgroundColor: "#d7d7d799",
                                          borderRadius: 6,
                                          padding: 6,
                                          marginTop: 12,
                                        }}
                                      >
                                        <CCol lg="12">
                                          <h6 style={{ fontWeight: "bold" }}>
                                            {`Tecnico Encargado`}
                                          </h6>
                                        </CCol>
                                        <CCol lg="12">
                                          <h6 style={{ fontWeight: "bold" }}>
                                            {`Nombre: ${task.AssignedID.Names} ${task.AssignedID.LastName}`}
                                          </h6>
                                        </CCol>
                                        <CCol lg="12">
                                          <h6 style={{ fontWeight: "bold" }}>
                                            {`Contacto: ${task.AssignedID.PhoneNumber}`}
                                          </h6>
                                        </CCol>
                                        <CCol lg="12">
                                          <h6 style={{ fontWeight: "bold" }}>
                                            {`Rut: ${task.AssignedID.Rut}`}
                                          </h6>
                                        </CCol>
                                      </CRow>
                                    )}
                                    <CRow
                                      style={{
                                        backgroundColor: "#d7d7d799",
                                        borderRadius: 6,
                                        padding: 6,
                                        marginTop: 12,
                                      }}
                                    >
                                      <CCol lg="12">
                                        <h6 style={{ fontWeight: "bold" }}>
                                          Nota
                                        </h6>
                                      </CCol>
                                      <CCol lg="12">
                                        <p>{task.Note}</p>
                                      </CCol>
                                    </CRow>
                                    <CRow
                                      style={{
                                        backgroundColor: "#d7d7d799",
                                        borderRadius: 6,
                                        padding: 6,
                                        marginTop: 12,
                                      }}
                                    >
                                      <CCol lg="12">
                                        <h6 style={{ fontWeight: "bold" }}>
                                          Informacion adicional
                                        </h6>
                                      </CCol>
                                      <CCol lg="12"></CCol>
                                    </CRow>
                                  </CCardBody>
                                </CCollapse>
                              </CCol>
                            </>
                          )
                        )}
                      </>
                    )
                  )}
                </CCardBody>
              </CCard>
            </CCol>
          ))}
      </CRow>
      {/* <CRow>
    {Object.keys(tasks).map((date) => (
      <CCol xs="12" lg="12" key={date}>
        <CCard>
          <CCardHeader>Tareas: {date}</CCardHeader>
          <CCardBody>
            <CDataTable
              items={tasks[date]}
              fields={fields}
              itemsPerPage={5}
              onPageChange={taskEffect}
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
                                  ClientID: item.ClientID.ID,
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
                        {item.TypeID.ID === 12 && (
                          <CCol lg="2">
                            <h4>Archivos adjuntos</h4>
                            <CButton
                              color="info"
                              onClick={() => {
                                const { publicURL } = getUrlImage(
                                  item.Files
                                );
                                saveAs(publicURL, `${moment().unix()}.jpg`);
                              }}
                            >
                              <CIcon
                                content={freeSet.cilCloudDownload}
                                size="xl"
                              />
                            </CButton>
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
                        {(item.TypeID.ID === 16 ||
                          item.TypeID.ID === 17) && (
                          <CCol lg="3">
                            <h4>Direccion</h4>
                            <h6>{`${item.ClientID?.Address[0].AddressID?.AddressName}  ${item.ClientID?.Address[0].AddressID?.AddressNumber}`}</h6>
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
  </CRow> */}
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
      <CModal show={showTechnicalModal} onClose={setShowTechnicalModal}>
        <CModalHeader closeButton>
          <CModalTitle>Selecciona el tecnico que vas a asignar</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <TechniciansTable
            setTechnicianID={(value) => {
              setTechnicalSelected({ ...technicalSelected, AssignedID: value });
            }}
            TechnicianID={technicalSelected?.AssignedID}
          />
        </CModalBody>
        <CModalFooter>
          <CButton color="success" onClick={handleChangeTechnicalTask}>
            Aceptar
          </CButton>
        </CModalFooter>
      </CModal>
      <CModal
        show={showTechnicalPaymentModal}
        onClose={setShowTechnicalPaymentModal}
      >
        <CModalHeader closeButton>
          <CModalTitle>Crear Pago</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow alignHorizontal="center">
            <CCol xs="12" lg="8">
              <Select
                isMulti
                name="colors"
                options={chargesUserTask
                  .filter(({ State }) => !State)
                  .map((charge) => ({
                    value: parseInt(charge.Charge),
                    label: charge.ChargeTypeID.Name,
                    ID: charge.ID,
                  }))}
                className="basic-multi-select"
                classNamePrefix="select"
                value={chargesSelected}
                onChange={setChargesSelected}
              />
            </CCol>
            <CCol xs="12" lg="3">
              <CButton color="info">
                <UploadFile
                  onChange={({ target: { files } }) => setFiles(files)}
                >
                  Subir Archivo
                </UploadFile>
              </CButton>
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="success" onClick={onFinishPayment}>
            Pagar
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default TasksTable;
