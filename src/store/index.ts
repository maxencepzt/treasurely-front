import { configureStore } from "@reduxjs/toolkit";

import { api, authSlice, pictureSlice } from "./slices";

const reducer = {
  // Add slices here
  [api.reducerPath]: api.reducer,
  auth: authSlice.reducer,
  pictures: pictureSlice.reducer,
};

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type rootState = ReturnType<typeof store.getState>;
export default store;
