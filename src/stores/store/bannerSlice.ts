// features/banner/bannerSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://api.man1kotapalu.sch.id/banner';
export const fetchBanners = createAsyncThunk('banner/fetchAll', async () => {
  const res = await axios.get(API_URL);
  return res.data;
});

export const createBanner = createAsyncThunk(
  'banner/create',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const res = await axios.post(API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data.message || 'Create failed');
    }
  }
);

export const deleteBanner = createAsyncThunk(
  'banner/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`${API_URL}/${id}`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data.message || 'Delete failed');
    }
  }
);
export const updateBanner = createAsyncThunk(
  "banner/updateBanner",
  async ({ id, data }: { id: number; data: FormData }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        body: data,
      });
      if (!res.ok) throw new Error("Gagal update banner");
      return await res.json(); // pastikan backend kirim data banner yang sudah diperbarui
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);


const bannerSlice = createSlice({
  name: 'banner',
  initialState: {
    banners: [],
    loading: false,
    error: null,
  } as {
    banners: any[];
    loading: boolean;
    error: string | null;
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBanners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = action.payload;
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createBanner.fulfilled, (state, action) => {
        state.banners.push(action.payload);
      })
      .addCase(deleteBanner.fulfilled, (state, action) => {
        state.banners = state.banners.filter(b => b.id !== action.payload.id);
      })
          .addCase(updateBanner.fulfilled, (state, action) => {
      const index = state.banners.findIndex(b => b.id === action.payload.id);
      if (index !== -1) {
        state.banners[index] = action.payload; // update langsung di state
      }
    });
      
  },
});

export default bannerSlice.reducer;
