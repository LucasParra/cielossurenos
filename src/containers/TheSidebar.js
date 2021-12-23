import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  CCreateElement,
  CSidebar,
  CSidebarNav,
  CSidebarNavDivider,
  CSidebarNavTitle,
  CSidebarMinimizer,
  CSidebarNavDropdown,
  CSidebarNavItem,
} from "@coreui/react";
import _ from "lodash";

// sidebar nav config
import navigation from "./_nav";
import { useKeySelector } from "src/hook/general";
import { supabase } from "src/config/configSupabase";
import { getUserByEmail } from "src/state/querys/Users";
import UserCard from "src/components/Cards/UserCard";

const TheSidebar = () => {
  const dispatch = useDispatch();
  const { user, sidebarShow } = useKeySelector(["user", "sidebarShow"]);

  const componentDidMount = () => {
    if (!(user.length === 0)) {
      const {
        user: { email },
      } = supabase.auth.session();
      return getUserByEmail(email).then((response) =>
        dispatch({ type: "SET_USER", payload: response[0] })
      );
    }
  };
  useEffect(componentDidMount, []);

  // if (!user.RolID) return;
  return (
    <CSidebar
      show={sidebarShow}
      onShowChange={(val) =>
        dispatch({ type: "SET_SIDEBARSHOW", payload: val })
      }
    >
      <CSidebarNav>
        <UserCard />
        <CCreateElement
          items={navigation.filter(
            (nav) => _.indexOf(nav.users, user?.RolID?.ID) !== -1
          )}
          components={{
            CSidebarNavDivider,
            CSidebarNavDropdown,
            CSidebarNavItem,
            CSidebarNavTitle,
          }}
        />
      </CSidebarNav>
      <CSidebarMinimizer className="c-d-md-down-none" />
    </CSidebar>
  );
};

export default React.memo(TheSidebar);
