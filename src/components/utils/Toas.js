import { freeSet } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { CCol, CRow, CToast, CToaster, CToastHeader } from "@coreui/react";
import React from "react";
import { useKeySelector } from "src/hook/general";

const Toas = () => {
  const { toas } = useKeySelector(["toas"]);

  if (!toas.show) return null;
  return (
    <CRow alignHorizontal="end">
      <CCol
        lg="3"
        style={{
          position: "absolute",
          zIndex: 999,
          top: 60,
        }}
      >
        <CToaster position="right" key="toaster">
          <CToast
            key="toast"
            show={true}
            style={{
              borderRadius: 12,
              backgroundColor: "#f2f2f3",
              border: "2px solid #f2f2f3",
              padding: 10,
            }}
          >
            <CToastHeader
              closeButton={true}
              style={{ backgroundColor: "#f2f2f3", border: 0 }}
            >
              {toas.type === "success" && (
                <CIcon content={freeSet.cilCheckCircle} size="2xl" />
              )}
              {toas.type === "loading" && (
                <div class="d-flex justify-content-center">
                  <div
                    class="spinner-grow text-info"
                    role="status"
                    style={{
                      width: "1.5rem",
                      height: "1.5rem",
                    }}
                  />
                </div>
              )}
              <h6
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  paddingTop: 10,
                  marginLeft: 5,
                }}
              >
                {toas.label}
              </h6>
            </CToastHeader>
          </CToast>
        </CToaster>
      </CCol>
    </CRow>
  );
};

export default Toas;
