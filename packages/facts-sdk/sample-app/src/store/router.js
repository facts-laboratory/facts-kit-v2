import { NOT_FOUND } from "redux-first-router";

const components = {
  HOME: "Home",
  FACT_MARKET: "FactMarket",
  [NOT_FOUND]: "Home",
};

export const routesMap = {
  HOME: {
    path: "/",
    thunk: async (dispatch, getState) => {
      console.log("Home thunk.");
    },
  },
  FACT_MARKET: {
    path: "/:tx",
    thunk: async (dispatch, getState) => {
      console.log("Home thunk.");
    },
  },
  NOT_FOUND: {
    path: "/",
  },
};

export const router = (dispatch) => {
  return {
    goBack: () => back(),
    goToHome: () => dispatch({ type: "HOME" }),
    goToFactMarket: (tx) => dispatch({ type: "FACT_MARKET", payload: { tx } }),
  };
};

export const mapStateToProps = (state, props) => {
  return {
    ...props,
    page: state.page,
    tx: state?.location?.payload?.tx,
    ticker: state?.location?.payload?.ticker,
    transaction: state?.location?.payload?.transaction,
  };
};

export default (state = "HOME", action = {}) =>
  components[action.type] || state;
