import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = {
  panel: "menu", // history
  menu: "",
  products: [],
  making_order: false,
  current_order: { name: "", price: 0 },
  predicted_time: "^ wprowadź odległość",
  distance: 0,
  history: [],
};

export const customerSlice = createSlice({
  name: "customer",
  initialState: {
    value: initialStateValue,
  },
  reducers: {
    switch_panel: (state, action) => {
      state.value.panel = state.value.panel === "menu" ? "history" : "menu";
    },
    update_products: (state, action) => {
      state.value.products = action.payload;
    },
    start_making_order: (state, action) => {
      state.value.making_order = true;
      state.value.current_order = action.payload;
    },
    end_making_order: (state, action) => {
      state.value.making_order = false;
      state.value.current_order = { name: "", price: 0 };
      state.value.predicted_time = "^ wprowadź odległość";
      state.value.distance = 0;
    },
    set_predicted_time: (state, action) => {
      state.value.predicted_time = action.payload;
    },
    set_distance: (state, action) => {
      state.value.distance = action.payload;
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
  switch_panel,
  update_products,
  start_making_order,
  end_making_order,
  set_predicted_time,
  set_distance,
  set_history,
  reset_history,
} = customerSlice.actions;

export default customerSlice.reducer;
