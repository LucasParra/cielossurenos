import React, { useEffect, useState } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
} from "@coreui/react";
import { useHistory, useParams } from "react-router";
import Discounts from "../base/tables/Discounts";
import Charges from "../base/tables/Charges";
import { getUserByID } from "src/state/querys/Users";
import CIcon from "@coreui/icons-react";
import { freeSet } from "@coreui/icons";
import { supabase } from "src/config/configSupabase";

const User = () => {
  const history = useHistory();
  const { id } = useParams();
  const [user, setUser] = useState({});

  const componentDidMount = () => {
    getUserByID(id).then(setUser);
  };
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
            Usuario
            <CButton
              color={user.StateID === "2" ? "danger" : "success"}
              onClick={() => changeStateUser(user.StateID, user.ID)}
            >
              {user.StateID === "2" ? "Dar de baja" : "Activar"}
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
          </CCardBody>
        </CCard>
      </CCol>
      <CCol lg={8}>
        <CCard>
          <CCardHeader>Descuentos</CCardHeader>
          <CCardBody>
            <Discounts userID={id} />
          </CCardBody>
        </CCard>
      </CCol>
      <CCol lg={12}>
        <CCard>
          <CCardHeader>Cargos</CCardHeader>
          <CCardBody>
            <Charges userID={id} />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default User;
