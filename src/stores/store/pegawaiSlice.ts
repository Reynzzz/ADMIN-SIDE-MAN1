// features/pegawai/pegawaiSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://api.man1kotapalu.sch.id/guru";

// Fetch All
export const fetchPegawai = createAsyncThunk("pegawai/fetchAll", async () => {
  const res = await axios.get(API_URL);
  return res.data;
});

// Create
export const createPegawai = createAsyncThunk(
  "pegawai/create",
  async (
    {
      nip,
      password,
      nama,
      jabatanStruktural,
    }: { nip: string; password: string; nama: string; jabatanStruktural: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.post(API_URL, {
        nip,
        password,
        nama,
        jabatanStruktural,
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Create failed");
    }
  }
);

// Update
export const updatePegawai = createAsyncThunk(
  "pegawai/update",
  async (
    {
      id,
      data,
    }: {
      id: number;
      data: { nip: string; password?: string; nama: string; jabatanStruktural: string };
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, data);
      return res.data.pegawai; // backend balikin { message, pegawai }
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Update failed");
    }
  }
);

// Delete
export const deletePegawai = createAsyncThunk(
  "pegawai/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`${API_URL}/${id}`);
      return { id };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Delete failed");
    }
  }
);

const pegawaiSlice = createSlice({
  name: "pegawai",
  initialState: {
    data: [] as any[],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchPegawai.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPegawai.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchPegawai.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // CREATE
      .addCase(createPegawai.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })

      // UPDATE
      .addCase(updatePegawai.fulfilled, (state, action) => {
        const index = state.data.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })

      // DELETE
      .addCase(deletePegawai.fulfilled, (state, action) => {
        state.data = state.data.filter((p) => p.id !== action.payload.id);
      });
  },
});

export default pegawaiSlice.reducer;
