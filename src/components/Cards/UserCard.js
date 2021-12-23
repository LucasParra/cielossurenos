import CIcon from "@coreui/icons-react";
import { CCol, CRow } from "@coreui/react";
import React from "react";

import { useKeySelector } from "src/hook/general";

const UserCard = () => {
  const { user, colors } = useKeySelector(["user", "colors"]);
  return (
    <>
      <CRow alignVertical="center" alignHorizontal="center">
        <div
          style={{
            backgroundColor: colors.secondary,
            width: 100,
            height: 100,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "50%",
            marginTop: 24,
            marginBottom: 24,
          }}
        >
          <CIcon name="cil-user" height="60" />
        </div>
      </CRow>
      <CRow alignVertical="center" alignHorizontal="center">
        <CCol xl="12" style={{ textAlign: "center" }}>
          <h5 style={{ fontWeight: "bold", marginBottom: 16 }}>
            {user?.Names}
          </h5>
        </CCol>
        <CCol xl="12" style={{ textAlign: "center" }}>
          <h5 style={{ fontWeight: "bold", marginBottom: 16 }}>
            {user?.Email}
          </h5>
        </CCol>
        <CCol xl="12" style={{ textAlign: "center" }}>
          <h5 style={{ fontWeight: "bold", marginBottom: 16 }}>
            {user?.RolID?.Name}
          </h5>
        </CCol>
      </CRow>
    </>
  );
};

export default UserCard;
