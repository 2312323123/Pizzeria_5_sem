import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = {
  login: "",
  password: "",
  position: "unauthenticated",
};

export const userSlice = createSlice({
  name: "user",
  initialState: {
    value: initialStateValue,
  },
  reducers: {
    login_action: (state, action) => {
      state.value = action.payload;
    },
    logout: (state) => {
      state.value = initialStateValue;
    },
  },
});

export const { login_action, logout } = userSlice.actions;

export default userSlice.reducer;
