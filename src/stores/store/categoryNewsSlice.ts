// features/categoryNews/categoryNewsSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://api.man1kotapalu.sch.id/categoryNews';

// GET all
export const fetchCategoryNews = createAsyncThunk(
  'category-news/fetchAll',
  async () => {
    const res = await axios.get(API_URL);
    return res.data;
  }
);

// CREATE
export const createCategoryNews = createAsyncThunk(
  "category-news/create",
  async (data: { name: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, data, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Create failed');
    }
  }
);

// DELETE
export const deleteCategoryNews = createAsyncThunk(
  'category-news/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`${API_URL}/${id}`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Delete failed');
    }
  }
);

// UPDATE
export const updateCategoryNews = createAsyncThunk(
  'category-news/update',
  async ({ id, name }: { id: number;   name: string  }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, {name}, {
        headers: { 'Content-Type': 'application/json' },
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Update failed');
    }
  }
);

const categoryNewsSlice = createSlice({
  name: 'categoryNews',
  initialState: {
    categoryNews: [] as { id: number; name: string }[],
    loading: false,
    error: null,
  } as {
    categoryNews: any[];
    loading: boolean;
    error: string | null;
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchCategoryNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryNews.fulfilled, (state, action) => {
        state.loading = false;
        state.categoryNews = action.payload;
      })
      .addCase(fetchCategoryNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // create
      .addCase(createCategoryNews.fulfilled, (state, action) => {
        state.categoryNews.push(action.payload);
      })

      // update
      .addCase(updateCategoryNews.fulfilled, (state, action) => {
        const index = state.categoryNews.findIndex(p => p.id === action.payload.id);
        if (index !== -1) state.categoryNews[index] = action.payload;
      })

      // delete
      .addCase(deleteCategoryNews.fulfilled, (state, action) => {
        state.categoryNews = state.categoryNews.filter(
          p => p.id !== action.payload.id
        );
      });
  },
});

export default categoryNewsSlice.reducer;
