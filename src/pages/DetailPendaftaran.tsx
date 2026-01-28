import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppSelector } from "@/hooks/reduxHooks";

const Item = ({ label, value }: { label: string; value?: any }) => (
  <div>
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="font-medium">{value || "-"}</p>
  </div>
);

export default function DetailPendaftaran() {
  const { id } = useParams();
  const siswa = useAppSelector((state) =>
    state.registrasionSiswa.items.find(
      (item) => item.id === Number(id)
    )
  );

  if (!siswa) return <p>Data tidak ditemukan</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{siswa.namaLengkap}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold mb-2">Data Pribadi</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Item label="NISN" value={siswa.nisn} />
            <Item label="NIK" value={siswa.nik} />
            <Item label="Jenis Kelamin" value={siswa.jenisKelamin} />
            <Item label="Agama" value={siswa.agama} />
            <Item label="TTL" value={`${siswa.tempatLahir}, ${siswa.tanggalLahir}`} />
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Alamat</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Item label="Alamat" value={siswa.alamat} />
            <Item label="RT / RW" value={`${siswa.rt}/${siswa.rw}`} />
            <Item label="Kelurahan" value={siswa.kelurahan} />
            <Item label="Kecamatan" value={siswa.kecamatan} />
            <Item label="Kab/Kota" value={siswa.kabupatenKota} />
            <Item label="Provinsi" value={siswa.provinsi} />
          </div>
        </div>

        {/* section lain tinggal copy: ayah, ibu, wali, fisik */}
      </CardContent>
    </Card>
  );
}
