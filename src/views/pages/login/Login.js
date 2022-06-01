import React, { useState } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { supabase } from "src/config/configSupabase";
import { getUserByEmail } from "src/state/querys/Users";

import { useDispatch } from "react-redux";

const Login = () => {
  const dispatch = useDispatch();
  const [loginForm, setloginForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(false);

  const handleLogin = () =>
    supabase.auth
      .signIn(loginForm)
      .then(({ user: { email } }) =>
        getUserByEmail(email).then((response) =>
          dispatch({ type: "SET_USER", payload: response[0] })
        )
      )
      .catch(() => setError(true));
  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="5">
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Bienvenido!</h1>

                    {error ? (
                      <p className="text-danger">
                        Usuario o contraseña incorrectos{" "}
                      </p>
                    ) : (
                      <p className="text-muted">Ingresa tu Cuenta</p>
                    )}
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-user" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput
                        type="email"
                        placeholder="email"
                        autoComplete="email"
                        style={{ borderColor: error ? "red" : "#9999" }}
                        onChange={({ target: { value } }) =>
                          setloginForm({ ...loginForm, email: value })
                        }
                        value={loginForm.email}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        style={{ borderColor: error ? "red" : "#9999" }}
                        onChange={({ target: { value } }) =>
                          setloginForm({ ...loginForm, password: value })
                        }
                        value={loginForm.password}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs="6">
                        <CButton
                          color="primary"
                          className="px-4"
                          onClick={() => handleLogin()}
                        >
                          Ingresar
                        </CButton>
                      </CCol>
                      {/* <CCol xs="6" className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol> */}
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              {/* <CCard
                className="text-white bg-primary py-5 d-md-down-none"
                style={{ width: "44%" }}
              >
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua.
                    </p>
                    <Link to="/register">
                      <CButton
                        color="primary"
                        className="mt-3"
                        active
                        tabIndex={-1}
                      >
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard> */}
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login;
