import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { LoginFormFields } from "../../../types";

export const authAPI = createApi({
  reducerPath: "authAPI",
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.REACT_APP_API_URL}/auth/` }),
  endpoints: (builder) => ({
    login: builder.mutation<{ accessToken: string }, LoginFormFields>({
      query: (loginData) => ({
        method: "POST",
        url: "login",
        body: loginData,
      }),
    }),
    validateToken: builder.mutation<{ token: string }, string>({
      query: (token) => ({
        method: "POST",
        url: "validate-token",
        body: { token },
      }),
    }),
  }),
});

export const { useLoginMutation, useValidateTokenMutation } = authAPI;
