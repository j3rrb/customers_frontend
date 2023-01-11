import { createSlice } from "@reduxjs/toolkit";

type InitialState = {
  token?: string;
};

const INITIAL_STATE: InitialState = {
  token: undefined,
};

const authSlice = createSlice({
  name: "authSlice",
  initialState: INITIAL_STATE,
  reducers: {
    setToken: (state, { payload }) => {
      state.token = payload;
    },
  },
});

export const { setToken } = authSlice.actions;

export default authSlice.reducer;
