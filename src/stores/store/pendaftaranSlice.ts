
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";



const BASE_API = "https://api.man1kotapalu.sch.id";
// Definisikan tipe untuk data registrasi
export interface RegistrationData {
  id?: number;
  namaLengkap: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: string;
  agama: string;
  kewarganegaraan: string;
  alamat: string;
  noTelepon: string;
  email: string;
  namaAyah: string;
  pekerjaanAyah: string;
  namaIbu: string;
  pekerjaanIbu: string;
  noTeleponOrtu: string;
  asalSekolah: string;
  nilaiUN: string;
  jurusan: string;
  agreement?: boolean;
}

interface RegistrationState {
  items: RegistrationData[];
  status: "idle" | "loading" | "failed";
  error: string | null;
}

const initialState: RegistrationState = {
  items: [],
  status: "idle",
  error: null,
};

// Thunks
export const createRegistration = createAsyncThunk(
  "registrations/create",
  async (data: RegistrationData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_API}/registerSiswa`, data);
      return response.data as RegistrationData;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

export const fetchRegistrations = createAsyncThunk(
  "registrations/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_API}/registerSiswa`);
      return response.data as RegistrationData[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// DELETE
export const deleteRegistration = createAsyncThunk(
  "registrations/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_API}/registerSiswa/${id}`);
      return id; // return ID yang dihapus supaya bisa filter state
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

const registrationSlice = createSlice({
  name: "registrations",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createRegistration.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createRegistration.fulfilled, (state, action: PayloadAction<RegistrationData>) => {
        state.status = "idle";
        state.items.push(action.payload);
      })
      .addCase(createRegistration.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // Fetch
      .addCase(fetchRegistrations.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRegistrations.fulfilled, (state, action: PayloadAction<RegistrationData[]>) => {
        state.status = "idle";
        state.items = action.payload;
      })
      .addCase(fetchRegistrations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // Delete
      .addCase(deleteRegistration.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteRegistration.fulfilled, (state, action: PayloadAction<number>) => {
        state.status = "idle";
        state.items = state.items.filter((reg) => reg.id !== action.payload);
      })
      .addCase(deleteRegistration.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default registrationSlice.reducer;
