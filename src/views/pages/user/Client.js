import React, { useState } from "react";
import {
  CButton,
  CCol,
  CContainer,
  CInput,
  CInputGroup,
  CInputGroupAppend,
  CInputGroupPrepend,
  CInputGroupText,
  CRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { clean, format } from "rut.js";
import { getUserByRut } from "src/state/querys/Users";
import UserInfo from "src/views/base/cards/UserInfo";
import { getAllChargeUserID } from "src/state/querys/Charges";
import { getTaskByUserID } from "src/state/querys/Tasks";
import { getProductByIDUser } from "src/state/querys/Product";

const Client = () => {
  const [rut, setRut] = useState("");
  const [user, setUser] = useState({});
  const [step, setStep] = useState("search");
  const [charges, setCharges] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [products, setProducts] = useState([]);

  const getUser = () => {
    getUserByRut(
      `${clean(rut).substr(0, clean(rut).length - 1)}-${clean(rut).substr(
        clean(rut).substr(0, clean(rut).length - 1).length,
        clean(rut).length - 1
      )}`
    ).then((response) => {
      setUser(response[0]);
      const userID = response[0]?.ID;
      console.log("id del usuario es :", userID);

      if (!userID) return null;
      Promise.all([
        getAllChargeUserID(userID),
        getTaskByUserID(userID),
        getProductByIDUser(userID),
      ]).then((response) => {
        setCharges(response[0]);
        setTasks(response[1]);
        setProducts(response[2]);
      });

      setStep("user");
    });
  };
  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          {step === "search" ? (
            <CCol md="6">
              <span className="clearfix">
                <h1 className="display-3" style={{ textAlign: "center" }}>
                  bienvenido
                </h1>
              </span>
              <CInputGroup className="input-prepend">
                <CInputGroupPrepend>
                  <CInputGroupText>
                    <CIcon name="cil-magnifying-glass" />
                  </CInputGroupText>
                </CInputGroupPrepend>
                <CInput
                  size="16"
                  type="text"
                  value={format(rut)}
                  maxLength={12}
                  onChange={({ target: { value } }) => setRut(value)}
                />
                <CInputGroupAppend>
                  <CButton color="info" onClick={getUser}>
                    Ingresar
                  </CButton>
                </CInputGroupAppend>
              </CInputGroup>
            </CCol>
          ) : (
            <UserInfo
              goBack={() => {
                setRut("");
                setStep("search");
              }}
              user={user}
              charges={charges}
              tasks={tasks}
              products={products}
            />
          )}
        </CRow>
      </CContainer>
    </div>
  );
};

export default Client;
