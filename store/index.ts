/* eslint-disable @typescript-eslint/no-explicit-any */
import { configureStore, Middleware } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { fileUploadApi } from "./apis/uploadFileApi";
import { projectsApi } from "./apis/projectsApi";
import { profileApi } from "./apis/profileApi";

type ApiModules = {
  [key: string]: {
    reducerPath: string;
    reducer: any;
    middleware: Middleware<Record<string, unknown>>;
  };
};

const combineApiReducersAndMiddleware = (apiModules: ApiModules) => {
  const reducers: Record<string, any> = {};
  const middleware: Middleware<Record<string, unknown>>[] = [];

  Object.keys(apiModules).forEach((moduleName) => {
    const api = apiModules[moduleName];
    reducers[api.reducerPath] = api.reducer;
    middleware.push(api.middleware);
  });

  return { reducers, middleware };
};

const { reducers, middleware } = combineApiReducersAndMiddleware({
  fileUploadApi,
  projectsApi,
  profileApi,
});

export const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
