import React, { Suspense } from "react";
import { Switch } from "react-router-dom";
import { CContainer, CFade } from "@coreui/react";

// routes config
import routes from "../routes";
import { PrivateRoute } from "src/router/PrivateRouter";

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

const TheContent = () => {
  return (
    <main className="c-main">
      <CContainer fluid>
        <Suspense fallback={loading}>
          <Switch>
            {routes.map((route, idx) => {
              return (
                route.component && (
                  <PrivateRoute
                    key={idx}
                    path={route.path}
                    exact={route.exact}
                    name={route.name}
                    component={(props) => (
                      <CFade>
                        <route.component {...props} />
                      </CFade>
                    )}
                    isAuthenticated={true}
                  />
                )
              );
            })}
            {/* <Redirect from="/" to="/login" /> */}
          </Switch>
        </Suspense>
      </CContainer>
    </main>
  );
};

export default React.memo(TheContent);
