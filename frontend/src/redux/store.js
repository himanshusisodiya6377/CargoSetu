import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import loadReducer from "./features/loadSlice";
import contactReducer from "./features/contactSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    load: loadReducer,
    contact: contactReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export default store;