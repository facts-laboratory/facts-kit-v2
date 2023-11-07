import React from "react";
import App from "./App";
import { useValue } from "react-cosmos/client";

export default () => {
  const [tx, settx] = useValue("tx", {
    defaultValue: "wvN4ejzgsMJ0KWOC-s5nvcoU-AudynoruzqhvZmzPXc",
  });

  return <App tx={tx} />;
};
