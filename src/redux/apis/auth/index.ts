import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { LoginFormFields } from "../../../types";

export const authAPI = createApi({
  reducerPath: "authAPI",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_API_URL }),
  endpoints: (builder) => ({
    login: builder.mutation<{ accessToken: string }, LoginFormFields>({
      query: (loginData) => ({
        method: "POST",
        url: "auth/login",
        body: loginData,
      }),
    }),
  }),
});

export const { useLoginMutation } = authAPI;
