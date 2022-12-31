import { createSlice, current } from "@reduxjs/toolkit";

const initialStateValue = {
  panel: "menu", // history
  menu: "",
  products: [],
  making_order: false,
  current_order: { name: "", price: 0 },
  predicted_time: "^ wprowadź odległość",
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
    },
  },
});

export const {
  switch_panel,
  update_products,
  start_making_order,
  end_making_order,
} = customerSlice.actions;

export default customerSlice.reducer;
