import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const usersAPI = createApi({
  reducerPath: "usersAPI",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_API_URL }),
  endpoints: (builder) => ({
    create: builder.mutation({
      query: (userData) => ({
        method: "POST",
        url: "users/create",
        body: userData,
      }),
    }),
    listAll: builder.query({
      query: (role) => ({
        params: role,
        method: "GET",
        url: "users/list/all",
      }),
    }),
  }),
});

export const { useCreateMutation, useListAllQuery } = usersAPI;
