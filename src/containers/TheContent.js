import React, { Suspense } from "react";
import { Switch, Route } from "react-router-dom";
import { CContainer, CFade } from "@coreui/react";

// routes config
import routes from "../routes";

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

const Comp = (props) => {
  return (
    <CFade>
      <props.route.component {...props} />
    </CFade>
  );
};

const TheContent = () => {
  return (
    <main className="c-main">
      <CContainer fluid>
        <Suspense fallback={loading}>
          <Switch>
            {routes.map((route) => {
              return (
                route.component && (
                  <Route
                    key={route.path}
                    path={route.path}
                    exact={route.exact}
                    name={route.name}
                    component={() => (
                      <Comp route={route} component={route.component} />
                    )}
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
