import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE_URL = import.meta.env.VITE_PORTFOLIO_API_BASE_URL_PROD;

export const fileUploadApi = createApi({
  reducerPath: "fileUploadApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ["FileUpload"],
  endpoints: (builder) => ({
    fileUpload: builder.mutation({
      query: (fileUploadData) => ({
        url: "upload",
        method: "POST",
        body: fileUploadData,
      }),
    }),
  }),
});

export const { useFileUploadMutation } = fileUploadApi;
