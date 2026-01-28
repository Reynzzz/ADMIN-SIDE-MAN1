import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_API = "https://api.man1kotapalu.sch.id";

/* ================= TYPE ================= */
export interface RegistrationData {
  id?: number;

  /* DATA PRIBADI */
  namaLengkap: string;
  jenisKelamin: string;
  nisn: string;
  jumlahSaudara: string;
  anakKe: string;
  noKartuKeluarga: string;
  nik: string;
  tempatLahir: string;
  tanggalLahir: string;
  agama: string;
  berkebutuhanKhusus: string;

  /* ALAMAT */
  alamat: string;
  rt: string;
  rw: string;
  kelurahan: string;
  kecamatan: string;
  kabupatenKota: string;
  provinsi: string;
  kodePos: string;

  /* SEKOLAH */
  npsnSekolahAsal: string;
  namaSekolahAsal: string;

  /* TRANSPORT */
  alatTransportasi: string;
  jenisTinggal: string;

  /* KONTAK */
  noHpWa: string;
  emailPribadi: string;

  /* AYAH */
  namaAyah: string;
  statusAyah: string;
  kewarganegaraanAyah: string;
  nikAyah: string;
  tempatLahirAyah: string;
  tanggalLahirAyah: string;
  pekerjaanAyah: string;
  pendidikanAyah: string;
  penghasilanBulananAyah: string;
  noHpWaAyah: string;

  /* IBU */
  namaIbu: string;
  statusIbu: string;
  kewarganegaraanIbu: string;
  nikIbu: string;
  tempatLahirIbu: string;
  tanggalLahirIbu: string;
  pekerjaanIbu: string;
  pendidikanIbu: string;
  penghasilanBulananIbu: string;
  noHpWaIbu: string;

  /* WALI */
  namaWali: string;
  statusWali: string;
  kewarganegaraanWali: string;
  nikWali: string;
  tempatLahirWali: string;
  tanggalLahirWali: string;
  pekerjaanWali: string;
  pendidikanWali: string;
  penghasilanBulananWali: string;

  /* FISIK */
  tinggiBadan: string;
  beratBadan: string;
  jarakTempatTinggal: string;
  waktuTempuh: string;

  agreement: boolean;

  createdAt?: string;
  updatedAt?: string;
}

/* ================= STATE ================= */
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

/* ================= THUNKS ================= */

// CREATE
export const createRegistration = createAsyncThunk<
  RegistrationData,
  RegistrationData,
  { rejectValue: string }
>("registrations/create", async (data, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${BASE_API}/registerSiswa`, data);
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.error || err.message);
  }
});

// FETCH ALL
export const fetchRegistrations = createAsyncThunk<
  RegistrationData[],
  void,
  { rejectValue: string }
>("registrations/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${BASE_API}/registerSiswa`);
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.error || err.message);
  }
});

// DELETE
export const deleteRegistration = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("registrations/delete", async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`${BASE_API}/registerSiswa/${id}`);
    return id;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.error || err.message);
  }
});

/* ================= SLICE ================= */
const registrationSlice = createSlice({
  name: "registrations",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* CREATE */
      .addCase(createRegistration.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        createRegistration.fulfilled,
        (state, action: PayloadAction<RegistrationData>) => {
          state.status = "idle";
          state.items.push(action.payload);
        }
      )
      .addCase(createRegistration.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Gagal menyimpan data";
      })

      /* FETCH */
      .addCase(fetchRegistrations.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchRegistrations.fulfilled,
        (state, action: PayloadAction<RegistrationData[]>) => {
          state.status = "idle";
          state.items = action.payload;
        }
      )
      .addCase(fetchRegistrations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Gagal mengambil data";
      })

      /* DELETE */
      .addCase(deleteRegistration.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        deleteRegistration.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.status = "idle";
          state.items = state.items.filter(
            (item) => item.id !== action.payload
          );
        }
      )
      .addCase(deleteRegistration.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Gagal menghapus data";
      });
  },
});

export default registrationSlice.reducer;
