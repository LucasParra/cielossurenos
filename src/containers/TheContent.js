import React, { Suspense } from "react";
import { Switch, Route } from "react-router-dom";
import { CCard, CContainer, CFade, CRow } from "@coreui/react";

// routes config
import routes from "../routes";
import Toas from "src/components/utils/Toas";

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
      <Toas />
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
          </Switch>
        </Suspense>
      </CContainer>
    </main>
  );
};

export default React.memo(TheContent);
