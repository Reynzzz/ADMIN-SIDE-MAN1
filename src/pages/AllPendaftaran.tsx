import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, Trash2, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import {
  fetchRegistrations,
  deleteRegistration,
} from "@/stores/store/pendaftaranSlice";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function AllPendaftaran() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { items, status } = useAppSelector(
    (state) => state.registrasionSiswa
  );

  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchRegistrations());
  }, [dispatch]);

  // 🔍 Filter data
  const filteredItems = useMemo(() => {
    return items.filter((siswa) =>
      `${siswa.namaLengkap} ${siswa.nisn} ${siswa.namaSekolahAsal}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [items, search]);

  // 📥 Download Excel
 const handleExportExcel = () => {
    const data = items.map((siswa) => ({
      ID: siswa.id,
      "Nama Lengkap": siswa.namaLengkap,
      "Jenis Kelamin": siswa.jenisKelamin,
      NISN: siswa.nisn,
      NIK: siswa.nik,
      "Jumlah Saudara": siswa.jumlahSaudara,
      "Anak Ke": siswa.anakKe,
      "No KK": siswa.noKartuKeluarga,
      "Tempat Lahir": siswa.tempatLahir,
      "Tanggal Lahir": siswa.tanggalLahir,
      Agama: siswa.agama,
      "Berkebutuhan Khusus": siswa.berkebutuhanKhusus,
      Alamat: siswa.alamat,
      RT: siswa.rt,
      RW: siswa.rw,
      Kelurahan: siswa.kelurahan,
      Kecamatan: siswa.kecamatan,
      Kabupaten: siswa.kabupatenKota,
      Provinsi: siswa.provinsi,
      "Kode Pos": siswa.kodePos,
      Transportasi: siswa.alatTransportasi,
      "Jenis Tinggal": siswa.jenisTinggal,
      "No HP": siswa.noHpWa,
      Email: siswa.emailPribadi,
      "Nama Sekolah Asal": siswa.namaSekolahAsal,
      NPSN: siswa.npsnSekolahAsal,

      /* AYAH */
      "Nama Ayah": siswa.namaAyah,
      "Pekerjaan Ayah": siswa.pekerjaanAyah,
      "Pendidikan Ayah": siswa.pendidikanAyah,
      "Penghasilan Ayah": siswa.penghasilanBulananAyah,

      /* IBU */
      "Nama Ibu": siswa.namaIbu,
      "Pekerjaan Ibu": siswa.pekerjaanIbu,
      "Pendidikan Ibu": siswa.pendidikanIbu,
      "Penghasilan Ibu": siswa.penghasilanBulananIbu,

      /* WALI */
      "Nama Wali": siswa.namaWali,
      "Pekerjaan Wali": siswa.pekerjaanWali,
      "Pendidikan Wali": siswa.pendidikanWali,
      "Penghasilan Wali": siswa.penghasilanBulananWali,

      "Tinggi Badan": siswa.tinggiBadan,
      "Berat Badan": siswa.beratBadan,
      "Jarak Tempat Tinggal": siswa.jarakTempatTinggal,
      "Waktu Tempuh": siswa.waktuTempuh,
      Agreement: siswa.agreement ? "Ya" : "Tidak",
      "Tanggal Daftar": siswa.createdAt,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Pendaftaran");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(file, "data-pendaftaran-siswa.xlsx");
  };

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <CardTitle>Daftar Pendaftaran Siswa</CardTitle>

        <div className="flex gap-2 w-full md:w-auto">
          <Input
            placeholder="Cari nama / NISN / sekolah..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="md:w-64"
          />

          <Button onClick={handleExportExcel} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Excel
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {status === "loading" && <p>Loading...</p>}
        {status === "failed" && <p>Gagal mengambil data</p>}

        <div className="rounded-md border">
          {/* Header */}
          <div className="grid grid-cols-6 gap-4 p-4 bg-muted font-medium text-sm">
            <div>Nama</div>
            <div>NISN</div>
            <div>JK</div>
            <div>Sekolah</div>
            <div>No HP</div>
            <div>Aksi</div>
          </div>

          {/* Data */}
          {filteredItems.length === 0 && (
            <div className="p-4 text-center text-muted-foreground">
              Data tidak ditemukan
            </div>
          )}

          {filteredItems.map((siswa) => (
            <div
              key={siswa.id}
              className="grid grid-cols-6 gap-4 p-4 border-t items-center text-sm"
            >
              <div className="font-medium">{siswa.namaLengkap}</div>
              <div>{siswa.nisn}</div>
              <div>
                <Badge variant="outline">{siswa.jenisKelamin}</Badge>
              </div>
              <div>{siswa.namaSekolahAsal}</div>
              <div>{siswa.noHpWa}</div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    navigate(`/admin/pendaftaran/${siswa.id}`)
                  }
                >
                  <Eye className="h-4 w-4" />
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() =>
                    siswa.id && dispatch(deleteRegistration(siswa.id))
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
