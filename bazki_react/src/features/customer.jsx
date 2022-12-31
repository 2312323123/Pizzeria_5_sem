import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = {
  panel: "menu", // history
  menu: "",
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
  },
});

export const { switch_panel } = customerSlice.actions;

export default customerSlice.reducer;
