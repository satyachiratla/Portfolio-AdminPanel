import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE_URL = import.meta.env.VITE_PORTFOLIO_API_BASE_URL_PROD;

export const profileApi = createApi({
  reducerPath: "profileApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ["Profile"],
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => "profile",
      providesTags: ["Profile"],
    }),
    createProfile: builder.mutation({
      query: (profile) => ({
        url: "createprofile",
        method: "POST",
        body: profile,
      }),
      invalidatesTags: ["Profile"],
    }),
    editProfile: builder.mutation({
      query: (profile) => ({
        url: `editprofile/${profile._id}`,
        method: "PUT",
        body: profile,
      }),
      invalidatesTags: ["Profile"],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useCreateProfileMutation,
  useEditProfileMutation,
} = profileApi;
