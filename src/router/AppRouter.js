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
// const Page404 = React.lazy(() => import("./views/pages/page404/Page404"));
// const Page500 = React.lazy(() => import("./views/pages/page500/Page500"));

const AppRouter = () => {
  const [session, setSession] = useState(null);
  const componentDidMount = () => {
    supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
    });
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
        <PrivateRoute
          path="/"
          name="Home"
          component={TheLayout}
          isAuthenticated={session}
        />
        {/* <Redirect to="/login" /> */}
      </Switch>
    </Router>
  );
};

export default AppRouter;
