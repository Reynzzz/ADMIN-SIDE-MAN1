import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Edit, Trash2, FileText, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function KelasXPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Kelas X</h1>
          <p className="text-muted-foreground">Kelola data siswa kelas X</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Tambah Siswa
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">120</CardTitle>
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
            <CardTitle className="text-2xl">8</CardTitle>
            <CardDescription>Jumlah Kelas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-muted-foreground">
              <FileText className="h-4 w-4 mr-1" />
              X-A hingga X-H
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">15</CardTitle>
            <CardDescription>Rata-rata/Kelas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="h-4 w-4 mr-1" />
              Siswa per kelas
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">98%</CardTitle>
            <CardDescription>Kehadiran</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-muted-foreground">
              <Badge variant="secondary" className="text-primary">
                Tinggi
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Siswa Kelas X</CardTitle>
          <CardDescription>Kelola data siswa kelas X</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari siswa..."
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          <div className="rounded-md border">
            <div className="p-4 border-b bg-muted/50">
              <div className="grid grid-cols-6 gap-4 font-medium">
                <div>NISN</div>
                <div>Nama Siswa</div>
                <div>Kelas</div>
                <div>Jenis Kelamin</div>
                <div>Status</div>
                <div>Aksi</div>
              </div>
            </div>
            
            <div className="divide-y">
              {[
                { nisn: "2023001", nama: "Ahmad Rizky", kelas: "X-A", jk: "L", status: "Aktif" },
                { nisn: "2023002", nama: "Siti Nurhaliza", kelas: "X-A", jk: "P", status: "Aktif" },
                { nisn: "2023003", nama: "Muhammad Fadli", kelas: "X-B", jk: "L", status: "Aktif" },
                { nisn: "2023004", nama: "Dewi Sartika", kelas: "X-B", jk: "P", status: "Aktif" },
                { nisn: "2023005", nama: "Rahmat Hidayat", kelas: "X-C", jk: "L", status: "Aktif" },
              ].map((siswa, index) => (
                <div key={index} className="p-4 hover:bg-muted/50">
                  <div className="grid grid-cols-6 gap-4 items-center">
                    <div className="font-medium">{siswa.nisn}</div>
                    <div>{siswa.nama}</div>
                    <div>
                      <Badge variant="outline">{siswa.kelas}</Badge>
                    </div>
                    <div>{siswa.jk}</div>
                    <div>
                      <Badge variant="secondary" className="text-primary">
                        {siswa.status}
                      </Badge>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}