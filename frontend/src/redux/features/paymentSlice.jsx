import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import paymentService from "../services/paymentService";
import { toast } from "react-toastify";

const initialState = {
  payment: null,
  payments: [],
  isLoading: false,
  isError: false,
  message: "",
};

export const createPaymentOrder = createAsyncThunk(
  "payment/createOrder",
  async (loadId, thunkAPI) => {
    try {
      return await paymentService.createOrder(loadId);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const verifyPayment = createAsyncThunk(
  "payment/verify",
  async (paymentData, thunkAPI) => {
    try {
      return await paymentService.verifyPayment(paymentData);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchPaymentDetails = createAsyncThunk(
  "payment/fetchDetails",
  async (loadId, thunkAPI) => {
    try {
      return await paymentService.getPaymentDetails(loadId);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchPaymentHistory = createAsyncThunk(
  "payment/fetchHistory",
  async (_, thunkAPI) => {
    try {
      return await paymentService.getPaymentHistory();
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    resetPayment: (state) => {
      state.payment = null;
      state.isLoading = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPaymentOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createPaymentOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.payment = action.payload;
      })
      .addCase(createPaymentOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      .addCase(verifyPayment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.payment = action.payload.payment;
        toast.success("Payment successful! Load assigned.");
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload || "Payment verification failed");
      })
      .addCase(fetchPaymentDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPaymentDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.payment = action.payload.data;
      })
      .addCase(fetchPaymentDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(fetchPaymentHistory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPaymentHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.payments = action.payload.data;
      })
      .addCase(fetchPaymentHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetPayment } = paymentSlice.actions;
export default paymentSlice.reducer;