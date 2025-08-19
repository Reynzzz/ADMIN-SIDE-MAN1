// features/gallery/gallerySlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://api.man1kotapalu.sch.id/gallery-photos'; // endpoint BE kamu untuk galleryPhoto

// GET all photos
export const fetchGallery = createAsyncThunk('gallery/fetchAll', async () => {
  const res = await axios.get(API_URL);
  return res.data;
});

// CREATE photo
export const createGallery = createAsyncThunk(
  'gallery/create',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const res = await axios.post(API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Gagal menambahkan foto');
    }
  }
);

// UPDATE photo
export const updateGallery = createAsyncThunk(
  'gallery/update',
  async ({ id, formData }: { id: number; formData: FormData }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Gagal mengupdate foto');
    }
  }
);

// DELETE photo
export const deleteGallery = createAsyncThunk(
  'gallery/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Gagal menghapus foto');
    }
  }
);

const gallerySlice = createSlice({
  name: 'gallery',
  initialState: {
    galleries: [],
    loading: false,
    error: null,
  } as {
    galleries: any[];
    loading: boolean;
    error: string | null;
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchGallery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGallery.fulfilled, (state, action) => {
        state.loading = false;
        state.galleries = action.payload;
      })
      .addCase(fetchGallery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // CREATE
      .addCase(createGallery.fulfilled, (state, action) => {
        state.galleries.push(action.payload);
      })
      // UPDATE
      .addCase(updateGallery.fulfilled, (state, action) => {
        const index = state.galleries.findIndex((g) => g.id === action.payload.id);
        if (index !== -1) {
          state.galleries[index] = action.payload;
        }
      })
      // DELETE
      .addCase(deleteGallery.fulfilled, (state, action) => {
        state.galleries = state.galleries.filter((g) => g.id !== action.payload);
      });
  },
});

export default gallerySlice.reducer;
