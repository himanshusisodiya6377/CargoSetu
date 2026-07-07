import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "../services/authFeature";
import { toast } from "react-toastify";

const user = JSON.parse(localStorage.getItem("user"));

const initialState ={
  user: user ? user : null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  isLoggedIn: user ? true : false,
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
      const data= await authService.login(userData);
      localStorage.setItem("user", JSON.stringify(data.user));
      return data;

    } catch (error){
      const message =
        error?.response?.data?.message ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      await authService.logout();
      localStorage.removeItem("user");
      return true;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getLogInStatus = createAsyncThunk(
  "auth/status",
  async (_, thunkAPI) => {
    try {
      return await authService.getLoginStatus();
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getUserProfile = createAsyncThunk(
  "auth/profile",
  async (_, thunkAPI) => {
    try {
      return await authService.getUserProfile();
    } catch (error) {
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
      const user=await authService.getCurrentUser();
      localStorage.setItem("user", JSON.stringify(user));
      return user;
    } catch (error) {
      localStorage.removeItem("user");
      return thunkAPI.rejectWithValue("Not authenticated");
    }
  }
);

export const loginUserAsSeller = createAsyncThunk(
  "auth/loginAsSeller",
  async (userData, thunkAPI) => {
    try {
      return await authService.loginUserAsSeller(userData);
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getAllUsers = createAsyncThunk(
  "auth/getAllUsers",
  async (_, thunkAPI) => {
    // console.log("hee")
    try {
      return await authService.getAllUser();
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "auth/updateProfile",
  async (userData, thunkAPI) => {
    try {
      return await authService.updateProfile(userData);
    } catch (error) {
      const message = error?.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const becomeSender = createAsyncThunk(
  "auth/becomeSender",
  async (_, thunkAPI) => {
    try {
      const data = await authService.becomeSender();
      localStorage.setItem("user", JSON.stringify(data));
      return data;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "auth/deleteUser",
  async (id, thunkAPI) => {
    try {
      await authService.deleteUser(id);
      return id;
    } catch (error) {
      const message = error?.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    RESET(state){
      state.isError = false;
      state.isLoading = false;
      state.message = "";
    },

    LOGOUT(state){
      state.user = null;
      state.isLoggedIn = false;
      localStorage.removeItem("user");
    },
  },

  extraReducers: (builder) =>{
    builder
      
       .addCase(register.pending, (state) =>{                 
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })

      .addCase(register.fulfilled, (state, action) =>{
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        toast.success("Account created successfully!");
      })

      .addCase(register.rejected, (state, action) =>{       
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      .addCase(login.pending, (state) =>{
        state.isLoading = true;
        state.isError = false;        
        state.isSuccess = false;
      })

      .addCase(login.fulfilled, (state, action) =>{
        state.isLoading = false;
        state.isLoggedIn = true;
        state.user = action.payload.user;
        toast.success("Welcome back!");
      })

      .addCase(login.rejected, (state, action) =>{
        state.isLoading = false;
        state.isError = true;
        state.isLoggedIn = false;
        state.message = action.payload;
        toast.error(action.payload);
      })
      
       .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isLoggedIn = false;
        toast.success("Logged out successfully");
      })

      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      .addCase(getLogInStatus.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(getLogInStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = action.payload;
      })

      .addCase(getLogInStatus.rejected, (state) => {
        state.isLoading = false;
        state.isLoggedIn = false;
      })
      
      .addCase(getUserProfile.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.user = action.payload;

        localStorage.setItem("user", JSON.stringify(action.payload));
        })

        .addCase(getUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;

        state.user = null;
        state.isLoggedIn = false;

        localStorage.removeItem("user");
        })
      
      .addCase(checkAuth.pending, (state) => {                
        state.isLoading = true;
      })

      .addCase(checkAuth.fulfilled, (state, action) =>{
         state.isLoading = false;  
        state.user = action.payload;
        state.isLoggedIn = true;
      })

      .addCase(checkAuth.rejected, (state) =>{
        state.isLoading = false; 
        state.user = null;
        state.isLoggedIn = false;
      })

      .addCase(loginUserAsSeller.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(loginUserAsSeller.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = true;
        state.user = action.payload;

        localStorage.setItem("user", JSON.stringify(action.payload));
        toast.success("Logged in as Seller");
      })

      .addCase(loginUserAsSeller.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(getAllUsers.fulfilled, (state, action) => {
          // console.log("API payload:", action.payload);
        state.isLoading = false;
        state.users = action.payload;
      })

      .addCase(getAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
        toast.success("Profile updated successfully");
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      .addCase(becomeSender.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(becomeSender.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
        toast.success("Account upgraded to Sender!");
      })
      .addCase(becomeSender.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      .addCase(deleteUser.fulfilled, (state, action) => {
        if (Array.isArray(state.users)) {
          state.users = state.users.filter((u) => u._id !== action.payload);
        }
        toast.success("User deleted successfully");
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      });
        },
      });

export const {RESET, LOGOUT} = authSlice.actions;
export default authSlice.reducer;

export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectUser = (state) => state.auth.user;
export const selectIsSuccess = (state) => state.auth.isSuccess;