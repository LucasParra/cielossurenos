import React, { useEffect, useState } from "react";
import {
  CButton,
  CCallout,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CSelect,
  CTextarea,
} from "@coreui/react";
import { useHistory, useParams } from "react-router";
import Discounts from "../base/tables/Discounts";
import Charges from "../base/tables/Charges";
import { getUserByID } from "src/state/querys/Users";
import CIcon from "@coreui/icons-react";
import { freeSet } from "@coreui/icons";
import { supabase } from "src/config/configSupabase";
import TechniciansTable from "src/components/Tables/TechniciansTable";
import {
  createTask,
  getTaskByUserID,
  getTypesTasks,
} from "src/state/querys/Tasks";
import TasksTable from "src/components/Tables/TasksTable";
import _ from "lodash";

const User = () => {
  const history = useHistory();
  const { id } = useParams();
  const [modalTechnicians, setModalTechnicians] = useState(false);
  const [types, setTypes] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [taskForm, setTaskForm] = useState({
    TypeID: "",
    AssignedID: "",
    ClientID: id,
    Priority: "Media",
    Note: "",
    StateID: 1,
  });
  const [user, setUser] = useState({});

  const componentDidMount = () => {
    getUserByID(id).then(setUser);
    supabase
      .from("Task")
      .select(
        "*,TypeID(Name,ID),AssignedID!inner(*),ClientID!inner(*,Address:UserAddress!inner(AddressID(AddressName,AddressNumber)))"
      )
      .order("ID", { ascending: false })
      .or("StateID.eq.2,StateID.eq.3")
      .eq("ClientID.ID", id)
      .then((snapshot) => {
        setTasks(_.groupBy(snapshot.data, "Priority"));
      })
      .catch(console.error);

    getTypesTasks().then(setTypes);
  };

  useEffect(componentDidMount, []);
  const changeStateUser = (state, userID) =>
    supabase
      .from("User")
      .update({ StateID: state === "1" ? "2" : "1" })
      .eq("ID", userID)
      .then(() => history.goBack());

  useEffect(componentDidMount, []);
  return (
    <CRow>
      <CCol lg={4}>
        <CCard>
          <CCardHeader
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <CButton
              style={{ borderWidth: 1, borderStyle: "solid" }}
              onClick={() => history.goBack()}
            >
              <CIcon content={freeSet.cilArrowLeft} size="l" />
            </CButton>
            <CLabel style={{ fontSize: 20, fontWeight: "bold" }}>
              Usuario
            </CLabel>
            <CButton
              color={user.StateID === "2" ? "danger" : "success"}
              onClick={() => changeStateUser(user.StateID, user.ID)}
            >
              {user.StateID !== "2" ? "Dar de baja" : "Activar"}
            </CButton>
          </CCardHeader>
          <CCardBody
            style={{
              flexDirection: "column",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              paddingTop: 45,
            }}
          >
            <div
              style={{
                width: 100,
                height: 100,
                borderRadius: 80,
                borderWidth: 3,
                borderStyle: "solid",
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
                marginBottom: 10,
              }}
            >
              <CIcon content={freeSet.cilUser} size="4xl" />
            </div>

            <h4 style={{ marginBottom: 10 }}>{`${user.Rut}`}</h4>
            <h5>{`${user.Names} ${user.LastName}`}</h5>
            <h6>{user.PhoneNumber}</h6>
            <h6>{user.Email}</h6>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol lg={8}>
        <CCard>
          <CCardHeader>
            <CLabel style={{ fontSize: 20, fontWeight: "bold" }}>
              Descuentos
            </CLabel>
          </CCardHeader>

          <CCardBody>
            <Discounts userID={id} />
          </CCardBody>
        </CCard>
      </CCol>
      <CCol lg={12}>
        <CCard>
          <CCardHeader>
            <CLabel style={{ fontSize: 20, fontWeight: "bold" }}>Cargos</CLabel>
          </CCardHeader>
          <CCardBody>
            <Charges userID={id} type="charge" />
          </CCardBody>
        </CCard>
      </CCol>
      <CCol lg={12}>
        <CCard>
          <CCardHeader>
            <CLabel style={{ fontSize: 20, fontWeight: "bold" }}>Pagos</CLabel>
          </CCardHeader>
          <CCardBody>
            <Charges userID={id} type="pay" />
          </CCardBody>
        </CCard>
      </CCol>
      <CCol lg={12}>
        <CCard>
          <CCardHeader>
            <CLabel style={{ fontSize: 20, fontWeight: "bold" }}>
              Crear tareas
            </CLabel>
          </CCardHeader>
          <CCardBody>
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
          </CCardBody>
        </CCard>
      </CCol>
      <CCol lg={12}>
        <CCard>
          <CCardHeader>
            <CLabel style={{ fontSize: 20, fontWeight: "bold" }}>Tareas</CLabel>
          </CCardHeader>
          <CCardBody>
            <TasksTable tasks={tasks} taskEffect={componentDidMount} />
          </CCardBody>
        </CCard>
      </CCol>
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
    </CRow>
  );
};

export default User;
