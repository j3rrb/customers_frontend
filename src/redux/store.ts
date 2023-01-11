import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { authAPI } from "./apis/auth";
import { usersAPI } from "./apis/users";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import auth from "./slices/auth";

const PERSIST_CONFIG = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(PERSIST_CONFIG, auth);

const rootReducer = combineReducers({
  [authAPI.reducerPath]: authAPI.reducer,
  [usersAPI.reducerPath]: usersAPI.reducer,
  persistedReducer,
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([authAPI.middleware, usersAPI.middleware]),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
