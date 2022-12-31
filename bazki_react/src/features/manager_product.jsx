import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = {
  products: [],
};

export const managerProductSlice = createSlice({
  name: "manager_product",
  initialState: {
    value: initialStateValue,
  },
  reducers: {
    update_products: (state, action) => {
      state.value.products = action.payload;
    },
  },
});

export const { update_products } = managerProductSlice.actions;

export default managerProductSlice.reducer;
