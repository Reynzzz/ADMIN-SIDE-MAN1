import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://api.man1kotapalu.sch.id/videos"; // endpoint video

// Thunks
export const fetchVideos = createAsyncThunk(
  "video/fetchAll",
  async () => {
    const res = await axios.get(API_URL);
    return res.data;
  }
);

export const createVideo = createAsyncThunk(
  "video/create",
  async (data: { name: string; desc: string; urlVideo: string; categoryVideoId: number; DATE: string }) => {
    const res = await axios.post(API_URL, data);
    return res.data.data;
  }
);

export const updateVideo = createAsyncThunk(
  "video/update",
  async ({ id, data }: { id: number; data: { name: string; desc: string; urlVideo: string; categoryVideoId: number; DATE: string } }) => {
    const res = await axios.put(`${API_URL}/${id}`, data);
    return res.data.data;
  }
);

export const deleteVideo = createAsyncThunk(
  "video/delete",
  async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    return id;
  }
);

// Slice
const videoSlice = createSlice({
  name: "video",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get All
      .addCase(fetchVideos.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Create
      .addCase(createVideo.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      // Update
      .addCase(updateVideo.fulfilled, (state, action) => {
        const index = state.items.findIndex((v) => v.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })

      // Delete
      .addCase(deleteVideo.fulfilled, (state, action) => {
        state.items = state.items.filter((v) => v.id !== action.payload);
      });
  },
});

export default videoSlice.reducer;
