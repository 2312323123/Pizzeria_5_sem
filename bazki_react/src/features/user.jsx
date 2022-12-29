import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    value: { login: "lol", password: "", position: "unauthenticated" },
  },
  reducers: {
    login_action: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { login_action } = userSlice.actions;

export default userSlice.reducer;
