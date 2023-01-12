import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import {
  CreateOrderFormFields,
  EditOrderFormFields,
  Order,
  OrderStatuses,
} from "../../../types";
import { RootState } from "../../store";

export const ordersAPI = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/orders/`,
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
    createOrder: builder.mutation<Order, CreateOrderFormFields>({
      query: (data) => ({
        url: "create",
        method: "POST",
        body: data,
      }),
    }),
    getOrder: builder.query<Order, number>({
      query: (id) => ({
        method: "GET",
        url: `get/${id}`,
      }),
    }),
    listOrders: builder.query<Order[], { id: number; status?: OrderStatuses }>({
      query: ({ id, status }) => ({
        method: "GET",
        url: `customer/${id}/list${status ? `?status=${status}` : ""}`,
      }),
    }),
    update: builder.mutation<Order, { id: number; data: EditOrderFormFields }>({
      query: ({ id, data }) => ({
        method: "PATCH",
        url: `update/${id}`,
        body: data,
      }),
    }),
  }),
});

export const {
  useLazyListOrdersQuery,
  useCreateOrderMutation,
  useListOrdersQuery,
  useUpdateMutation,
  useLazyGetOrderQuery,
} = ordersAPI;
