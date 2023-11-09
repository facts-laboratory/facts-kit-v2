import { connect } from "react-redux";
import { mapStateToProps } from "./store/router";

import loadable from "@loadable/component";

const pages = {
  Home: loadable(() => import("./pages/FactMarket"), {
    resolveComponent: (c) => c.default,
  }),
  FactMarket: loadable(() => import("./pages/FactMarket"), {
    resolveComponent: (c) => c.default,
  }),
};

function App({ page, tx }) {
  const Component = pages[page || "Feed"];
  return (
    <>
      <Component tx={tx} />
    </>
  );
}

export default connect(mapStateToProps)(App);
