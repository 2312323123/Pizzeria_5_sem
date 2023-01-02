import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = {
  panel: "deliveries", // history
  deliveries: [],
  history: [],
};

export const delivererSlice = createSlice({
  name: "deliverer",
  initialState: {
    value: initialStateValue,
  },
  reducers: {
    switch_deliverer_panel: (state, action) => {
      state.value.panel =
        state.value.panel === "deliveries" ? "history" : "deliveries";
    },
    update_deliveries: (state, action) => {
      state.value.products = action.payload;
    },
    reset_deliveries: (state, action) => {
      state.value.deliveries = [];
    },
    set_history: (state, action) => {
      state.value.history = action.payload;
    },
    reset_history: (state, action) => {
      state.value.history = [];
    },
  },
});

export const {
  switch_deliverer_panel,
  update_deliveries,
  reset_deliveries,
  set_history,
  reset_history,
} = delivererSlice.actions;

export default delivererSlice.reducer;
