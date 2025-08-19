import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://api.man1kotapalu.sch.id/categories"; // endpoint kategori

// Thunks
export const fetchCategories = createAsyncThunk(
  "categoryVideo/fetchAll",
  async () => {
    const res = await axios.get(API_URL);
    return res.data;
  }
);

export const createCategory = createAsyncThunk(
  "categoryVideo/create",
  async (data : {name : string}) => {
    const res = await axios.post(API_URL, data);
    return res.data;
  }
);

export const updateCategory = createAsyncThunk(
  "categoryVideo/update",
  async ({ id, name }: { id: number; name: string }) => {
    const res = await axios.put(`${API_URL}/${id}`, { name });
    return res.data;
  }
);


export const deleteCategory = createAsyncThunk(
  "categoryVideo/delete",
  async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    return id;
  }
);

// Slice
const categoryVideoSlice = createSlice({
  name: "categoryVideo",
  initialState: {
    categoryVideos: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get All
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categoryVideos = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Create
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categoryVideos.push(action.payload);
      })

      // Update
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categoryVideos.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.categoryVideos[index] = action.payload;
        }
      })

      // Delete
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categoryVideos = state.categoryVideos.filter((c) => c.id !== action.payload);
      });
  },
});

export default categoryVideoSlice.reducer;
