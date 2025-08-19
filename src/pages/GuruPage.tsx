import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash, Users } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { fetchPegawai, createPegawai, updatePegawai, deletePegawai } from "@/stores/store/pegawaiSlice";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function GuruPage() {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector((state) => state.guru);

  const [formData, setFormData] = useState({
    nama: "",
    nip: "",
    jabatanStruktural: "",
    password: "",
  });

  useEffect(() => {
    dispatch(fetchPegawai())
      .unwrap()
      .catch(() => toast.error("Gagal memuat data guru"));
  }, [dispatch]);

  const filteredGuru = data.filter((guru) =>
    guru.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = () => {
    if (!formData.nama || !formData.nip || !formData.jabatanStruktural) {
      toast.error("Semua field wajib diisi!");
      return;
    }

    if (editingId) {
      dispatch(updatePegawai({ id: editingId, data: formData }))
        .unwrap()
        .then(() => {
          toast.success("Data guru berhasil diperbarui");
          resetForm();
        })
        .catch(() => toast.error("Gagal memperbarui data guru"));
    } else {
      dispatch(createPegawai(formData))
        .unwrap()
        .then(() => {
          toast.success("Guru baru berhasil ditambahkan");
          resetForm();
        })
        .catch(() => toast.error("Gagal menambahkan guru"));
    }
  };

  const handleEdit = (guru: any) => {
    setEditingId(guru.id);
    setFormData({
      nama: guru.nama,
      nip: guru.nip,
      jabatanStruktural: guru.jabatanStruktural,
      password: "",
    });
    setShowForm(true);
  };

  const handleDeleteClick = (id: number) => {
    setSelectedId(id);
    setOpenDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!selectedId) return;
    dispatch(deletePegawai(selectedId))
      .unwrap()
      .then(() => toast.success("Guru berhasil dihapus"))
      .catch(() => toast.error("Gagal menghapus guru"))
      .finally(() => {
        setOpenDeleteModal(false);
        setSelectedId(null);
      });
  };

  const resetForm = () => {
    setFormData({
      nama: "",
      nip: "",
      jabatanStruktural: "",
      password: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Users className="h-8 w-8 text-primary" />
            Data Guru
          </h1>
          <p className="text-muted-foreground">Kelola data guru MAN 1 Kota Palu</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          {showForm ? "Tutup Form" : "Tambah Guru"}
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari guru berdasarkan nama..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Guru" : "Tambah Guru Baru"}</CardTitle>
            <CardDescription>
              {editingId ? "Ubah data guru yang dipilih" : "Lengkapi form untuk menambah data guru"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="nama">Nama Lengkap</Label>
                  <Input
                    id="nama"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="nip">NIP</Label>
                  <Input
                    id="nip"
                    value={formData.nip}
                    onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="jabatan">Jabatan</Label>
                  <Input
                    id="jabatan"
                    value={formData.jabatanStruktural}
                    onChange={(e) => setFormData({ ...formData, jabatanStruktural: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90">
                {editingId ? "Update" : "Simpan"}
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Batal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGuru.map((guru) => (
          <Card key={guru.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-4">
                <img
                  src={guru.foto || "/default-avatar.png"}
                  alt={guru.nama}
                  className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg truncate">{guru.nama}</h3>
                  <p className="text-sm text-muted-foreground">NIP: {guru.nip}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {guru.jabatanStruktural}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => handleEdit(guru)}>
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleDeleteClick(guru.id)}
                >
                  <Trash className="h-3 w-3 mr-1" />
                  Hapus
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal Konfirmasi Hapus */}
      <Dialog open={openDeleteModal} onOpenChange={setOpenDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
          </DialogHeader>
          <p>Apakah Anda yakin ingin menghapus guru ini?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDeleteModal(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
