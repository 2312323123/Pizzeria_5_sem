import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import userReducer from "./features/user";
import customerReducer from "./features/customer";
import managerProductReducer from "./features/manager_product";

const store = configureStore({
  reducer: {
    user: userReducer,
    customer: customerReducer,
    manager_product: managerProductReducer,
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
