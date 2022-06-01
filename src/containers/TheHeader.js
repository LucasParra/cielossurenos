import React from "react";
import { useDispatch } from "react-redux";
import { CHeader, CToggler, CHeaderNav, CButton } from "@coreui/react";
import CIcon from "@coreui/icons-react";

import { freeSet } from "@coreui/icons";
import { useKeySelector } from "src/hook/general";
import { supabase } from "src/config/configSupabase";

const TheHeader = () => {
  const dispatch = useDispatch();
  const { colors, sidebarShow } = useKeySelector(["colors", "sidebarShow"]);

  const toggleSidebar = () => {
    const val = [true, "responsive"].includes(sidebarShow)
      ? false
      : "responsive";
    dispatch({ type: "SET_SIDEBARSHOW", payload: val });
  };

  const toggleSidebarMobile = () => {
    const val = [false, "responsive"].includes(sidebarShow)
      ? true
      : "responsive";
    dispatch({ type: "SET_SIDEBARSHOW", payload: val });
  };

  return (
    <CHeader withSubheader style={{ justifyContent: "space-between" }}>
      <CToggler
        inHeader
        className="ml-md-3 d-lg-none"
        onClick={toggleSidebarMobile}
      />
      <CToggler
        inHeader
        className="ml-3 d-md-down-none"
        onClick={toggleSidebar}
      />

      <CHeaderNav style={{ marginRight: 8 }}>
        <CButton
          style={{ backgroundColor: colors.secondary }}
          onClick={() => supabase.auth.signOut()}
        >
          <CIcon
            content={freeSet.cilPowerStandby}
            size="xl"
            style={{ color: "#fff" }}
          />
        </CButton>
      </CHeaderNav>
    </CHeader>
  );
};

export default TheHeader;
