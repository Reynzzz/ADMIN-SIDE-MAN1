// features/categoryPhotos/categoryPhotosSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://api.man1kotapalu.sch.id/category-photos';

// GET all
export const fetchCategoryPhotos = createAsyncThunk(
  'category-photos/fetchAll',
  async () => {
    const res = await axios.get(API_URL);
    return res.data;
  }
);

export const createCategoryPhoto = createAsyncThunk(
  "categoryPhoto/create",
  async (data: { nama: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, data, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  }
);


// DELETE
export const deleteCategoryPhoto = createAsyncThunk(
  'category-photos/delete',
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
export const updateCategoryPhoto = createAsyncThunk(
  'category-photos/update',
  async ({ id, data }: { id: number; data: FormData }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Update failed');
    }
  }
);

const categoryPhotosSlice = createSlice({
  name: 'categoryPhotos',
  initialState: {
  categoryPhotos: [] as { name: string; kategori?: string }[],
    loading: false,
    error: null,
  } as {
    categoryPhotos: any[];
    loading: boolean;
    error: string | null;
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchCategoryPhotos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryPhotos.fulfilled, (state, action) => {
        state.loading = false;
        state.categoryPhotos = action.payload;
      })
      .addCase(fetchCategoryPhotos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // create
      .addCase(createCategoryPhoto.fulfilled, (state, action) => {
        state.categoryPhotos.push(action.payload);
      })

      // update
      .addCase(updateCategoryPhoto.fulfilled, (state, action) => {
        const index = state.categoryPhotos.findIndex(p => p.id === action.payload.id);
        if (index !== -1) state.categoryPhotos[index] = action.payload;
      })

      // delete
      .addCase(deleteCategoryPhoto.fulfilled, (state, action) => {
        state.categoryPhotos = state.categoryPhotos.filter(
          p => p.id !== action.payload.id
        );
      });
  },
});

export default categoryPhotosSlice.reducer;
