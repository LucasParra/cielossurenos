import React, { useEffect, useState } from "react";
import { Switch, BrowserRouter as Router } from "react-router-dom";
import { supabase } from "src/config/configSupabase";
import { PrivateRoute } from "./PrivateRouter";
import { PublicRoute } from "./PublicRouter";

// Containers
const TheLayout = React.lazy(() => import("../containers/TheLayout"));

// Pages
const Login = React.lazy(() => import("../views/pages/login/Login"));
const Register = React.lazy(() => import("../views/pages/register/Register"));
const Client = React.lazy(() => import("../views/pages/user/Client"));
// const Page404 = React.lazy(() => import("./views/pages/page404/Page404"));
// const Page500 = React.lazy(() => import("./views/pages/page500/Page500"));

const AppRouter = () => {
  const [session, setSession] = useState(null);
  const componentDidMount = () => {
    const a = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session);
    });
    setSession(
      supabase?.auth?.currentSession?.user?.id
        ? supabase?.auth?.currentSession
        : false
    );
    return () => a.data.unsubscribe();
  };
  useEffect(componentDidMount, []);
  return (
    <Router>
      <Switch>
        <PublicRoute
          exact
          path="/login"
          name="Login Page"
          component={Login}
          isAuthenticated={session}
        />
        <PublicRoute
          exact
          path="/register"
          name="Register Page"
          component={Register}
          isAuthenticated={session}
        />
        <PublicRoute
          exact
          path="/client"
          name="cliente"
          component={Client}
          isAuthenticated={false}
        />
        <PrivateRoute
          path="/"
          name="Home"
          component={TheLayout}
          isAuthenticated={session}
        />
      </Switch>
    </Router>
  );
};

export default AppRouter;
