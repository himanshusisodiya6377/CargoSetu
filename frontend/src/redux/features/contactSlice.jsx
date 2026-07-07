import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import contactService from "../services/contactService";
import { toast } from "react-toastify";

export const sendContactMessage = createAsyncThunk(
  "contact/send",
  async (formData, thunkAPI) => {
    try {
      return await contactService.submitContact(formData);
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const contactSlice = createSlice({
  name: "contact",
  initialState: {
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: "",
  },
  reducers: {
    resetContact: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendContactMessage.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(sendContactMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message;
        toast.success("Message sent! We'll get back to you soon.");
      })
      .addCase(sendContactMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { resetContact } = contactSlice.actions;
export default contactSlice.reducer;
