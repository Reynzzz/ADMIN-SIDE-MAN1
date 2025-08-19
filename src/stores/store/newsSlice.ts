// features/news/newsSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://api.man1kotapalu.sch.id/news';

export const fetchNews = createAsyncThunk('news/fetchAll', async () => {
  const res = await axios.get(API_URL);
  return res.data;
});

export const createNews = createAsyncThunk(
  'news/create',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const res = await axios.post(API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Create failed');
    }
  }
);

export const deleteNews = createAsyncThunk(
  'news/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`${API_URL}/${id}`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Delete failed');
    }
  }
);

export const updateNews = createAsyncThunk(
  'news/update',
  async ({ id, data }: { id: number; data: FormData }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        body: data,
      });
      if (!res.ok) throw new Error('Gagal update news');
      return await res.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const newsSlice = createSlice({
  name: 'news',
  initialState: {
    newsList: [],
    loading: false,
    error: null,
  } as {
    newsList: any[];
    loading: boolean;
    error: string | null;
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.loading = false;
        state.newsList = action.payload;
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createNews.fulfilled, (state, action) => {
        state.newsList.push(action.payload);
      })
      .addCase(deleteNews.fulfilled, (state, action) => {
        state.newsList = state.newsList.filter((n) => n.id !== action.payload.id);
      })
      .addCase(updateNews.fulfilled, (state, action) => {
        const index = state.newsList.findIndex((n) => n.id === action.payload.id);
        if (index !== -1) {
          state.newsList[index] = action.payload;
        }
      });
  },
});

export default newsSlice.reducer;
