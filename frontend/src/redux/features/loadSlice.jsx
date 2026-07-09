import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import loadService from "../services/loadService";
import { toast } from "react-toastify";

const initialState = {
  loads: [],
  userLoads: [],
  wonLoads: [],
  myBids: [],
  load: null,
  earnings: null,
  activeLoads: [],
  completedLoads: [],
  adminLoads: [],
  loadBids: [],

  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};


const getErrorMessage = (error) => {
  return (
    error.response?.data?.message ||
    error.message ||
    error.toString()
  );
};


export const createLoad = createAsyncThunk(
  "loads/create",
  async (formData, thunkAPI) => {
    try {
      return await loadService.createLoad(formData);
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);



export const getLoads = createAsyncThunk(
  "loads/getAll",
  async (_, thunkAPI) =>{
    try {
      return await loadService.getLoads();
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);


export const getUserLoads = createAsyncThunk(
  "loads/getUserLoads",
  async (_, thunkAPI) => {
    try {
      return await loadService.getUserLoads();
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);


export const getLoad = createAsyncThunk(
  "load/getLoad",
  async (id, thunkAPI) => {
    try {
      return await loadService.getLoad(id);
    } catch (error) {

      const message =
        error.response?.data?.message ||
        error.message;

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteLoad = createAsyncThunk(
  "loads/delete",
  async (id, thunkAPI) => {
    try {
      return await loadService.deleteLoad(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateLoad = createAsyncThunk(
  "loads/update",
  async ({ id, formData }, thunkAPI) => {
    try {
      const response = await loadService.updateLoad(id, formData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

export const placeBid = createAsyncThunk(
  "loads/bid",
  async ({ id, amount }, thunkAPI) => {
    try {
      return await loadService.placeBid(id, amount);
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

export const placeBidAndRefresh = createAsyncThunk(
  "loads/bidAndRefresh",
  async ({ id, amount }, thunkAPI) => {
    try {

      await loadService.placeBid(id, amount);
      return await loadService.getLoad(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

export const getWonBids = createAsyncThunk(
  "loads/getWonBids",
  async (_, thunkAPI) => {
    try {
      return await loadService.getWonBids();
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateTracking = createAsyncThunk(
  "loads/updateTracking",
  async ({ loadId, status }, thunkAPI) => {
    try {
      return await loadService.updateTracking(loadId, status);
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchActiveLoads = createAsyncThunk(
  "loads/getActive",
  async (coords, thunkAPI) => {
    try { return await loadService.getActiveLoads(coords); }
    catch (error) { return thunkAPI.rejectWithValue(getErrorMessage(error)); }
  }
);

export const fetchCompletedLoads = createAsyncThunk(
  "loads/getCompleted",
  async (_, thunkAPI) => {
    try { return await loadService.getCompletedLoads(); }
    catch (error) { return thunkAPI.rejectWithValue(getErrorMessage(error)); }
  }
);

export const fetchMyBids = createAsyncThunk(
  "loads/myBids",
  async (_, thunkAPI) => {
    try { return await loadService.getMyBids(); }
    catch (error) { return thunkAPI.rejectWithValue(getErrorMessage(error)); }
  }
);

export const updateMyBid = createAsyncThunk(
  "loads/updateMyBid",
  async ({ id, amount }, thunkAPI) => {
    try { return await loadService.updateBid(id, amount); }
    catch (error) { return thunkAPI.rejectWithValue(getErrorMessage(error)); }
  }
);

export const deleteMyBid = createAsyncThunk(
  "loads/deleteMyBid",
  async (id, thunkAPI) => {
    try {
      await loadService.deleteBid(id);
      return id;
    } catch (error) { return thunkAPI.rejectWithValue(getErrorMessage(error)); }
  }
);

export const fetchAdminLoads = createAsyncThunk(
  "loads/fetchAdminLoads",
  async (_, thunkAPI) => {
    try { return await loadService.getAllLoadsAdmin(); }
    catch (error) { return thunkAPI.rejectWithValue(getErrorMessage(error)); }
  }
);

export const deleteAdminLoad = createAsyncThunk(
  "loads/deleteAdminLoad",
  async (id, thunkAPI) => {
    try {
      await loadService.deleteLoadByAdmin(id);
      return id;
    } catch (error) { return thunkAPI.rejectWithValue(getErrorMessage(error)); }
  }
);

export const deleteBidAdmin = createAsyncThunk(
  "loads/deleteBidAdmin",
  async (id, thunkAPI) => {
    try {
      await loadService.deleteBidByAdmin(id);
      return id;
    } catch (error) { return thunkAPI.rejectWithValue(getErrorMessage(error)); }
  }
);

export const fetchLoadBids = createAsyncThunk(
  "loads/fetchLoadBids",
  async (loadId, thunkAPI) => {
    try { return await loadService.getLoadBids(loadId); }
    catch (error) { return thunkAPI.rejectWithValue(getErrorMessage(error)); }
  }
);

const loadSlice = createSlice({
  name: "load",
  initialState,

  reducers: {
    RESET(state) {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
      state.load = null;
    },
  },

  extraReducers: (builder) => {
    builder


  .addCase(createLoad.pending, (state) => {
        state.isLoading = true;
      })
  .addCase(createLoad.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      if(state.userLoads?.data){
        state.userLoads.data.unshift(action.payload.data);
        state.userLoads.count = (state.userLoads.count ?? 0) + 1;
      }
      toast.success("Load posted successfully");
      })
  .addCase(createLoad.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

  .addCase(getLoads.pending, (state) => {
        state.isLoading = true;
      })
  .addCase(getLoads.fulfilled, (state, action) => {
        state.isLoading = false;
        state.loads = action.payload;
      })
  .addCase(getLoads.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

  .addCase(getUserLoads.pending, (state) => {
        state.isLoading = true;
      })
  .addCase(getUserLoads.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userLoads = action.payload;
      })
  .addCase(getUserLoads.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

  .addCase(getLoad.pending, (state) => {
        state.isLoading = true;
      })
  .addCase(getLoad.fulfilled, (state, action) => {
        state.isLoading = false;
        state.load = action.payload;
      })
  .addCase(getLoad.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

  .addCase(deleteLoad.pending, () => {
      })
  .addCase(deleteLoad.fulfilled, (state, action) => {
  const id = action.payload.id || action.payload._id || action.meta.arg;

      if(state.loads?.data){
        state.loads ={
          ...state.loads,
          data: state.loads.data.filter((item) => item._id !== id),
          count: (state.loads.count || 1) - 1,
        };
  }
      if (Array.isArray(state.userLoads)) {
        state.userLoads = state.userLoads.filter((item) => item._id !== id);
      } else if (state.userLoads?.data) {
        state.userLoads.data = state.userLoads.data.filter((item) => item._id !== id);
        state.userLoads.count = (state.userLoads.count || 1) - 1;
      }
      toast.success("Load deleted successfully");
      })
  .addCase(deleteLoad.rejected, (state, action) => {
       state.isLoading = false;
       state.isError = true;
       state.message = action.payload;

       toast.error(action.payload);
      })

      
  .addCase(updateLoad.pending, (state) => {
        state.isLoading = true;
      })

  .addCase(updateLoad.fulfilled, (state, action) => {

        state.isLoading = false;
        state.isSuccess = true;

        const updatedLoad = action.payload.data;

        toast.success("Load updated successfully");

        if (Array.isArray(state.loads)) {
         state.loads = state.loads.map((item) =>
          item._id === updatedLoad._id ? updatedLoad : item
       );
      }

      if (Array.isArray(state.userLoads)) {
      state.userLoads = state.userLoads.map((item) =>
      item._id === updatedLoad._id ? updatedLoad : item
      );
      } else if (state.userLoads?.data) {
        state.userLoads.data = state.userLoads.data.map((item) =>
          item._id === updatedLoad._id ? updatedLoad : item
        );
      }

        state.load = updatedLoad;

      })
      
  .addCase(updateLoad.rejected, (state, action) =>{
        state.isLoading = false;
        state.isError = true;
      
        toast.error(action.payload);
      })

  .addCase(placeBid.pending, () =>{
      })
  .addCase(placeBid.fulfilled, () =>{
})
  .addCase(placeBid.rejected, (state,action) =>{
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

  .addCase(placeBidAndRefresh.pending, (state) => {
  state.isLoading = true;
})
  .addCase(placeBidAndRefresh.fulfilled, (state, action) =>{
  state.isLoading = false;
  state.load = action.payload;
  toast.success("Bid placed successfully");
})
  .addCase(placeBidAndRefresh.rejected, (state, action) =>{
  state.isLoading = false;
  state.isError = true;
  state.message = action.payload;
  toast.error(action.payload);
})

 .addCase(getWonBids.pending, (state) =>{
  state.isLoading = true;
})
.addCase(getWonBids.fulfilled, (state, action) =>{
  state.isLoading = false;
  state.wonLoads = action.payload.data;
})
.addCase(getWonBids.rejected, (state, action) =>{
  state.isLoading = false;
  state.isError = true;
  state.message = action.payload;
  toast.error(action.payload);
})
 
.addCase(updateTracking.fulfilled,(state,action) =>{
  const updated = action.payload.data;


  if(Array.isArray(state.wonLoads)){
    state.wonLoads = state.wonLoads.map((bid) =>
      bid.load?._id === updated._id ? { ...bid, load: { ...bid.load, status: updated.status } } : bid
    );
  }

  if(Array.isArray(state.activeLoads)){
    if(updated.status === "DELIVERED"){
      state.activeLoads = state.activeLoads.filter((l) => l._id !== updated._id);
    }else{
      state.activeLoads = state.activeLoads.map((l) =>
        l._id === updated._id ? { ...l, status: updated.status } : l
      );
    }}

  toast.success(action.payload.message);
})
.addCase(updateTracking.rejected, (state, action) =>{
  toast.error(action.payload);
})

.addCase(fetchActiveLoads.pending, (state) => { state.isLoading = true; })
.addCase(fetchActiveLoads.fulfilled, (state, action) =>{
  state.isLoading = false;
  state.activeLoads = action.payload.data;
})
.addCase(fetchActiveLoads.rejected, (state, action) =>{
  state.isLoading = false;
  state.message = action.payload;
  toast.error(action.payload);
})

.addCase(fetchCompletedLoads.pending, (state) => { state.isLoading = true; })
.addCase(fetchCompletedLoads.fulfilled, (state, action) =>{
  state.isLoading = false;
  state.completedLoads = action.payload.data;
})
.addCase(fetchCompletedLoads.rejected, (state, action) =>{
  state.isLoading = false;
  state.message = action.payload;
  toast.error(action.payload);
})

.addCase(fetchMyBids.pending, (state) =>{state.isLoading = true})
.addCase(fetchMyBids.fulfilled, (state, action) =>{
  state.isLoading = false;
  state.myBids = action.payload.data;
})
.addCase(fetchMyBids.rejected, (state, action) =>{
  state.isLoading = false;
  state.message = action.payload;
  toast.error(action.payload);
})

.addCase(updateMyBid.fulfilled, (state, action) =>{
  const updated = action.payload.data;
  state.myBids = state.myBids.map((b) => b._id === updated._id ? { ...b, amount: updated.amount } : b);
  toast.success("Bid updated!");
})
.addCase(updateMyBid.rejected, (state, action) =>{
  toast.error(action.payload);
})

.addCase(deleteMyBid.fulfilled, (state, action) =>{
  state.myBids = state.myBids.filter((b) => b._id !== action.payload);
  toast.success("Bid withdrawn!");
})
.addCase(deleteMyBid.rejected, (state, action) =>{
  toast.error(action.payload);
})


.addCase(fetchAdminLoads.pending, (state) => { state.isLoading = true; })
.addCase(fetchAdminLoads.fulfilled, (state, action) =>{
  state.isLoading = false;
  state.adminLoads = action.payload.data ?? [];
})
.addCase(fetchAdminLoads.rejected, (state, action) =>{
  state.isLoading = false;
  state.message = action.payload;
  toast.error(action.payload);
})

.addCase(deleteAdminLoad.fulfilled, (state, action) =>{
  state.adminLoads = state.adminLoads.filter((l) => l._id !== action.payload);
  toast.success("Load deleted!");
})
.addCase(deleteAdminLoad.rejected, (state, action) =>{
  toast.error(action.payload);
})

.addCase(fetchLoadBids.pending, (state) => {state.isLoading = true})
.addCase(fetchLoadBids.fulfilled, (state, action) =>{
  state.isLoading = false;
  state.loadBids = action.payload.data ?? [];
})
.addCase(fetchLoadBids.rejected, (state,action) =>{
  state.isLoading = false;
  state.message = action.payload;
  toast.error(action.payload);
})

.addCase(deleteBidAdmin.fulfilled, (state,action) =>{
  state.loadBids = state.loadBids.filter((b) => b._id !== action.payload);
  toast.success("Bid deleted!");
})
.addCase(deleteBidAdmin.rejected, (state,action) =>{
  toast.error(action.payload);
})
  },
});

export const { RESET } = loadSlice.actions;
export default loadSlice.reducer;