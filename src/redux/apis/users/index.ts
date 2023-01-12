import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CreateAccountFormFields, Roles, User } from "../../../types";
import { RootState } from "../../store";

export const usersAPI = createApi({
  reducerPath: "usersAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/users/`,
    prepareHeaders(headers, { getState, endpoint }) {
      const token = (getState() as RootState).auth.token;

      if (token && endpoint !== "refresh") {
        headers.append("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
    credentials: "include",
  }),
  endpoints: (builder) => ({
    create: builder.mutation<User, CreateAccountFormFields>({
      query: (userData) => ({
        method: "POST",
        url: "create",
        body: userData,
      }),
    }),
    listUsers: builder.query<User[], Roles | undefined>({
      query: (role) => ({
        method: "GET",
        url: `list/all${role ? `?role=${role}` : ""}`,
        mode: "cors",
      }),
    }),
  }),
});

export const { useCreateMutation, useListUsersQuery, useLazyListUsersQuery } =
  usersAPI;
