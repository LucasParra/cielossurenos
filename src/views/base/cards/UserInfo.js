import {
  CButton,
  CCallout,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CListGroup,
  CListGroupItem,
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
import moment from "moment";
import { createTask, getTypesTasks } from "src/state/querys/Tasks";
import TechniciansTable from "src/components/Tables/TechniciansTable";

const UserInfo = ({ goBack, user, charges, tasks, products }) => {
  const [step, setStep] = useState("Charges");
  const [types, setTypes] = useState([]);
  const [modalTechnicians, setModalTechnicians] = useState(false);
  const [taskForm, setTaskForm] = useState({
    TypeID: "",
    AssignedID: "",
    ClientID: user.ID,
    Note: "",
    StateID: 1,
  });

  const componentDidMount = () => {
    getTypesTasks().then(setTypes);
  };
  useEffect(componentDidMount, []);
  return (
    <CContainer>
      <CRow className="justify-content-center">
        <CCol md="12">
          <CButton color="info" onClick={goBack}>
            Volver
          </CButton>
          <span className="clearfix">
            <h4 className="pt-3">{`${user?.Names} ${user?.LastName}`}</h4>
          </span>
        </CCol>
        <CCol md="3">
          <CListGroup>
            <CListGroupItem
              component="button"
              active={step === "Charges"}
              style={{ cursor: "pointer" }}
              onClick={() => setStep("Charges")}
            >
              Deudas
            </CListGroupItem>
            <CListGroupItem
              component="button"
              active={step === "Payment"}
              style={{ cursor: "pointer" }}
              onClick={() => setStep("Payment")}
            >
              Ultimos Pagos
            </CListGroupItem>
            {products.length !== 0 && (
              <CListGroupItem
                component="button"
                active={step === "Tasks"}
                style={{ cursor: "pointer" }}
                onClick={() => setStep("Tasks")}
              >
                Estado de Tarea de tecnico
              </CListGroupItem>
            )}
            <CListGroupItem
              component="button"
              active={step === "Products"}
              style={{ cursor: "pointer" }}
              onClick={() => setStep("Products")}
            >
              Productos Contratados
            </CListGroupItem>
            <CListGroupItem
              component="button"
              active={step === "CreateTask"}
              style={{ cursor: "pointer" }}
              onClick={() => setStep("CreateTask")}
            >
              Crear Tareas
            </CListGroupItem>
          </CListGroup>
        </CCol>
        <CCol>
          <CCard>
            <CCardBody>
              {(step === "Charges" || step === "Payment") && (
                <>
                  {charges
                    .filter((charge) =>
                      step === "Charges" ? !charge.State : charge.State
                    )
                    .map((charge) => (
                      <CCallout
                        color={step === "Charges" ? "danger" : "success"}
                        key={charge.ID}
                      >
                        <span className="clearfix">
                          <h4 className="pt-1">{`${new Intl.NumberFormat(
                            "es-CL",
                            {
                              currency: "CLP",
                              style: "currency",
                            }
                          ).format(charge.Charge)}`}</h4>
                          <h3 className="pt-1">{`${charge.Name}`}</h3>
                          <h5 className="pt-1">{`Fecha : ${moment(
                            charge.CreatedAt
                          ).format("DD-MM-YYYY")}`}</h5>
                        </span>
                      </CCallout>
                    ))}
                  {charges.filter((charge) =>
                    step === "Charges" ? !charge.State : charge.State
                  ).length === 0 && <h4 className="pt-1">Estás al día</h4>}
                </>
              )}

              {step === "Tasks" &&
                tasks
                  .filter((task) => task.StateID !== 3)
                  .map((task) => (
                    <CCallout
                      color={task.StateID === 1 ? "info" : "success"}
                      key={task.ID}
                    >
                      <span className="clearfix">
                        <h4 className="pt-1">{`${task.TypeID.Name}`}</h4>
                        <h3 className="pt-1">{` Estado : ${
                          task.StateID === 1 ? "Pendiente" : "Finalizada"
                        }`}</h3>
                        <h5 className="pt-1">{` ID : ${task.ID}`}</h5>
                      </span>
                    </CCallout>
                  ))}
              {step === "Products" &&
                products.map((product) => (
                  <CCallout color="info" key={product.ID}>
                    <span className="clearfix">
                      <h4 className="pt-1">{`${product.ProductID.Name}`}</h4>
                    </span>
                  </CCallout>
                ))}
              {step === "CreateTask" && (
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
                      {types
                        .filter(({ ID }) => ID < 6)
                        .map((type) => (
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
                    <h4>Nota (Opcional)</h4>
                    <CTextarea
                      id="name"
                      value={taskForm.Note}
                      onChange={({ target: { value } }) =>
                        setTaskForm({ ...taskForm, Note: value })
                      }
                    />
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
                            Note: "",
                            StateID: 4,
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
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
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
    </CContainer>
  );
};

export default UserInfo;
