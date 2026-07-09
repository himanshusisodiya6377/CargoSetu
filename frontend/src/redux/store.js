import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import loadReducer from "./features/loadSlice";
import contactReducer from "./features/contactSlice";
import paymentReducer from "./features/paymentSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    load: loadReducer,
    contact: contactReducer,
    payment: paymentReducer,
  },
  devTools: import.meta.env.MODE !== "production",
});

export default store;