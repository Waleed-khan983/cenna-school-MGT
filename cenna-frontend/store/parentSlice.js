import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getParents,
  getParent,
  createParent,
  updateParent,
  deleteParent,
  getMyParentProfileApi,
  getMyChildrenAttendanceApi,
  getMyChildrenResultsApi,
  getMyChildrenAssignmentsApi,
  getMyChildrenFeesApi,
  updateParentProfileImageApi,


} from "@/services/parentService";

export const fetchParents = createAsyncThunk("parents/fetchParents", async (params, thunkAPI) => {
  try {
    return await getParents(params);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to load parents");
  }
});

export const fetchParent = createAsyncThunk("parents/fetchParent", async (id, thunkAPI) => {
  try {
    return await getParent(id);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to load parent");
  }
});


export const fetchMyParentProfile = createAsyncThunk(
  "parents/fetchMyParentProfile",
  async (_, thunkAPI) => {
    try {
      return await getMyParentProfileApi();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load parent profile"
      );
    }
  }
);


export const addParent = createAsyncThunk("parents/addParent", async (data, thunkAPI) => {
  try {
    return await createParent(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to create parent");
  }
});

export const editParent = createAsyncThunk("parents/editParent", async ({ id, data }, thunkAPI) => {
  try {
    return await updateParent({ id, data });
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to update parent");
  }
});

export const fetchMyChildrenAttendance = createAsyncThunk(
  "parents/fetchMyChildrenAttendance",
  async (_, thunkAPI) => {
    try {
      return await getMyChildrenAttendanceApi();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
        "Failed to load attendance"
      );
    }
  }
);

export const fetchMyChildrenResults = createAsyncThunk(
  "parents/fetchMyChildrenResults",
  async (_, thunkAPI) => {
    try {
      return await getMyChildrenResultsApi();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load results"
      );
    }
  }
);


export const updateParentProfileImage =
  createAsyncThunk(
    "parents/updateProfileImage",
    async (formData, thunkAPI) => {
      try {
        return await updateParentProfileImageApi(
          formData
        );
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message
        );
      }
    }
  );

export const removeParent = createAsyncThunk("parents/removeParent", async (id, thunkAPI) => {
  try {
    await deleteParent(id);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to delete parent");
  }
});

export const fetchMyChildrenAssignments = createAsyncThunk(
  "parents/fetchMyChildrenAssignments",
  async (_, thunkAPI) => {
    try {
      return await getMyChildrenAssignmentsApi();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load assignments"
      );
    }
  }
);

export const fetchMyChildrenFees = createAsyncThunk(
  "parents/fetchMyChildrenFees",
  async (_, thunkAPI) => {
    try {
      return await getMyChildrenFeesApi();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load fees"
      );
    }
  }
);

const parentSlice = createSlice({
  name: "parents",
  initialState: {
    parents: [],
    attendance: [],
    parent: null,
    total: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchParents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchParents.fulfilled, (state, action) => {
        state.loading = false;
        state.parents = action.payload.parents || [];
        state.total = action.payload.total || 0;
      })
      .addCase(fetchParents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMyParentProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyParentProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.parent = action.payload.parent;
        state.children = action.payload.parent?.children || [];
      })
      .addCase(fetchMyParentProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchParent.fulfilled, (state, action) => {
        state.parent = action.payload.parent;
      })
      .addCase(addParent.fulfilled, (state, action) => {
        if (action.payload.parent) state.parents.unshift(action.payload.parent);
      })
      .addCase(editParent.fulfilled, (state, action) => {
        const updated = action.payload.parent;
        state.parents = state.parents.map((parent) =>
          parent._id === updated._id ? updated : parent
        );
      })
      .addCase(
        fetchMyChildrenAttendance.fulfilled,
        (state, action) => {
          state.attendance =
            action.payload.attendance || [];
        }
      )
      .addCase(
        updateParentProfileImage.fulfilled,
        (state, action) => {
          if (state.parent) {
            state.parent.profileImage =
              action.payload.profileImage;
          }
        }
      )
      .addCase(removeParent.fulfilled, (state, action) => {
        state.parents = state.parents.filter((parent) => parent._id !== action.payload);
      })
      .addCase(fetchMyChildrenResults.fulfilled, (state, action) => {
        state.results = action.payload.results || [];
      })
      .addCase(fetchMyChildrenAssignments.fulfilled, (state, action) => {
        state.assignments = action.payload.assignments || [];
      })
      .addCase(fetchMyChildrenFees.fulfilled, (state, action) => {
        state.fees = action.payload.fees || [];
      })

  },
});

export default parentSlice.reducer;