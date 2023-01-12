import { createSlice } from "@reduxjs/toolkit";
import jwtDecode from "jwt-decode";
import { Roles, User } from "../../types";

type InitialState = {
  token?: string;
  role?: Roles;
};

const INITIAL_STATE: InitialState = {
  token: undefined,
  role: undefined,
};

const authSlice = createSlice({
  name: "authSlice",
  initialState: INITIAL_STATE,
  reducers: {
    setToken: (state, { payload }) => {
      state.token = payload;
      state.role = payload ? (jwtDecode(payload) as User).role : undefined;
    },
  },
});

export const { setToken } = authSlice.actions;

export default authSlice.reducer;
