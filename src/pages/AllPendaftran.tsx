import React, { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Edit, Trash2, FileText, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { deleteRegistration, fetchRegistrations } from "@/stores/store/pendaftaranSlice";


export default function AllPendaftaran() {
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector((state) => state.registrasionSiswa);

  useEffect(() => {
    dispatch(fetchRegistrations());
  }, [dispatch]);

  const handleDelete = (id: number) => {
    dispatch(deleteRegistration(id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Pendaftaran siswa</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{items.length}</CardTitle>
            <CardDescription>Total Siswa</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="h-4 w-4 mr-1" />
              Aktif
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">6</CardTitle>
            <CardDescription>Jumlah Kelas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-muted-foreground">
              <FileText className="h-4 w-4 mr-1" />
              XIII-A hingga XIII-F
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Siswa</CardTitle>
          <CardDescription>Kelola data siswa</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Cari siswa..." className="pl-10" />
            </div>
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          {status === "loading" && <p>Loading...</p>}
          {status === "failed" && <p className="text-red-500">{error}</p>}

          <div className="rounded-md border">
            <div className="p-4 border-b bg-muted/50">
              <div className="grid grid-cols-6 gap-4 font-medium">
                <div>Nama Lengkap</div>
                <div>Email</div>
                <div>No. Telepon</div>
                <div>Jenis Kelamin</div>
                <div>Asal Sekolah</div>
                <div>Aksi</div>
              </div>
            </div>

            <div className="divide-y">
              {items.map((siswa) => (
                <div key={siswa.id} className="p-4 hover:bg-muted/50">
                  <div className="grid grid-cols-6 gap-4 items-center">
                    <div className="font-medium">{siswa.namaLengkap}</div>
                    <div>{siswa.email}</div>
                    <div>{siswa.noTelepon}</div>
                    <div>{siswa.jenisKelamin}</div>
                    <div>
                      <Badge variant="outline">{siswa.asalSekolah}</Badge>
                    </div>
                    <div className="flex space-x-2">
                      {/* <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button> */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => siswa.id && handleDelete(siswa.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {items.length === 0 && status === "idle" && (
                <div className="p-4 text-center text-muted-foreground">
                  Belum ada data siswa.
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
