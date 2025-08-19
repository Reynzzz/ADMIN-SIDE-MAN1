import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Edit, Trash2, FileText, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function KelasXIIPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Kelas XII</h1>
          <p className="text-muted-foreground">Kelola data siswa kelas XII</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Tambah Siswa
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">108</CardTitle>
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
            <CardTitle className="text-2xl">7</CardTitle>
            <CardDescription>Jumlah Kelas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-muted-foreground">
              <FileText className="h-4 w-4 mr-1" />
              XII-A hingga XII-G
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
            <CardTitle className="text-2xl">94%</CardTitle>
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
          <CardTitle>Daftar Siswa Kelas XII</CardTitle>
          <CardDescription>Kelola data siswa kelas XII</CardDescription>
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
                { nisn: "2021001", nama: "Dimas Pratama", kelas: "XII-A", jk: "L", status: "Aktif" },
                { nisn: "2021002", nama: "Rina Wulandari", kelas: "XII-A", jk: "P", status: "Aktif" },
                { nisn: "2021003", nama: "Fajar Nugroho", kelas: "XII-B", jk: "L", status: "Aktif" },
                { nisn: "2021004", nama: "Maya Sari", kelas: "XII-B", jk: "P", status: "Aktif" },
                { nisn: "2021005", nama: "Yoga Pratama", kelas: "XII-C", jk: "L", status: "Aktif" },
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