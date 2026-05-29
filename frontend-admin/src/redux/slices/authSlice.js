import { createSlice } from "@reduxjs/toolkit";

const token =
  sessionStorage.getItem("token");

const user =
  JSON.parse(
    sessionStorage.getItem("user")
  );

const initialState = {
  token: token || null,
  user: user || null,
  isAuthenticated: !!token,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {

    loginSuccess: (
      state,
      action
    ) => {

      state.token =
        action.payload.token;

      state.user =
        action.payload.user;

      state.isAuthenticated =
        true;

      sessionStorage.setItem(
        "token",
        action.payload.token
      );

      sessionStorage.setItem(
        "user",
        JSON.stringify(
          action.payload.user
        )
      );
    },

    logout: (state) => {

      state.token = null;

      state.user = null;

      state.isAuthenticated =
        false;

      sessionStorage.clear();
    },
  },
});

export const {
  loginSuccess,
  logout,
} = authSlice.actions;

export default authSlice.reducer;