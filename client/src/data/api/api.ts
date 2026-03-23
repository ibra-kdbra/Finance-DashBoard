import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  GetKpisResponse,
  GetProductsResponse,
  GetTransactionsResponse,
} from "../../domain/entities/types";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  reducerPath: "main",
  tagTypes: ["Kpis", "Products", "Transactions"],
  endpoints: (build) => ({
    sendMessage: build.mutation<{ reply: string }, { messages: { role: string; content: string }[] }>({
      query: (body) => ({
        url: "ai/chat",
        method: "POST",
        body,
      }),
    }),
    login: build.mutation<any, any>({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    signup: build.mutation<any, any>({
      query: (credentials) => ({
        url: "auth/signup",
        method: "POST",
        body: credentials,
      }),
    }),
    uploadCSV: build.mutation<any, FormData>({
      query: (formData) => ({
        url: "ingest/csv",
        method: "POST",
        body: formData,
      }),
    }),
    syncStripe: build.mutation<any, void>({
      query: () => ({
        url: "integration/stripe/sync",
        method: "POST",
      }),
      invalidatesTags: ["Kpis", "Products", "Transactions"],
    }),
    syncMock: build.mutation<any, void>({
      query: () => ({
        url: "integration/mock",
        method: "POST",
      }),
      invalidatesTags: ["Kpis", "Products", "Transactions"],
    }),
    appendManualData: build.mutation<any, { month: string, revenue: number, expenses: number }>({
      query: (body) => ({
        url: "integration/manual",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Kpis"],
    }),
    getKpis: build.query<Array<GetKpisResponse>, void>({
      query: () => "kpi/kpis/",
      providesTags: ["Kpis"],
    }),
    getProducts: build.query<Array<GetProductsResponse>, void>({
      query: () => "product/products/",
      providesTags: ["Products"],
    }),
    getTransactions: build.query<Array<GetTransactionsResponse>, void>({
      query: () => "transaction/transactions/",
      providesTags: ["Transactions"],
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useUploadCSVMutation,
  useSyncStripeMutation,
  useSyncMockMutation,
  useAppendManualDataMutation,
  useSendMessageMutation,
  useGetKpisQuery,
  useGetProductsQuery,
  useGetTransactionsQuery,
} = api;
