import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "../services/authFeature";

const initialState ={
  user: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  isLoggedIn: false,
  message: "",
};

export const register = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) =>{
    try{
      return await authService.register(userData);
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) =>{
    try{
      return await authService.login(userData);
    } catch (error){
      const message =
        error?.response?.data?.message ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, thunkAPI) => {
    try {
      return await authService.getCurrentUser();
    } catch (error) {
      return thunkAPI.rejectWithValue("Not authenticated");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    RESET(state){
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },

    LOGOUT(state){
      state.user = null;
      state.isLoggedIn = false;
    },
  },

  extraReducers: (builder) =>{
    builder

      .addCase(login.pending, (state) =>{
        state.isLoading = true;
      })

      .addCase(login.fulfilled, (state, action) =>{
        state.isLoading = false;
        state.isLoggedIn = true;
        state.user = action.payload;
      })

      .addCase(login.rejected, (state, action) =>{
        state.isLoading = false;
        state.isError = true;
        state.isLoggedIn = false;
        state.message = action.payload;
      })

      .addCase(checkAuth.fulfilled, (state, action) =>{
        state.user = action.payload;
        state.isLoggedIn = true;
      })

      .addCase(checkAuth.rejected, (state) =>{
        state.user = null;
        state.isLoggedIn = false;
      });
  },
});

export const {RESET, LOGOUT} = authSlice.actions;
export default authSlice.reducer;