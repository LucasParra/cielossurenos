import {
  CButton,
  CCallout,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CListGroup,
  CListGroupItem,
  CRow,
} from "@coreui/react";
import React, { useState } from "react";
import moment from "moment";

const UserInfo = ({ goBack, user, charges, tasks, products }) => {
  const [step, setStep] = useState("Charges");
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
              onClick={() => setStep("Charges")}
            >
              Deudas
            </CListGroupItem>
            <CListGroupItem
              component="button"
              active={step === "Payment"}
              onClick={() => setStep("Payment")}
            >
              Ultimos Pagos
            </CListGroupItem>
            <CListGroupItem
              component="button"
              active={step === "Tasks"}
              onClick={() => setStep("Tasks")}
            >
              Estado de Tarea de tecnico
            </CListGroupItem>
            <CListGroupItem
              component="button"
              active={step === "Products"}
              onClick={() => setStep("Products")}
            >
              Productos Contratados
            </CListGroupItem>
          </CListGroup>
        </CCol>
        <CCol>
          <CCard>
            <CCardBody>
              {(step === "Charges" || step === "Payment") &&
                charges
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
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default UserInfo;
