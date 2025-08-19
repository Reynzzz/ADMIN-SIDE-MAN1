import { useState, useRef, useEffect } from "react";
import { Plus, Edit, Trash2, Search, Calendar, User, Upload, X, Trash, Tags } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { createCategoryNews, fetchCategoryNews, updateCategoryNews } from "@/stores/store/categoryNewsSlice";
import { DialogDescription } from "@radix-ui/react-dialog";
import { createNews, updateNews, fetchNews, deleteNews } from "@/stores/store/newsSlice";

export default function BeritaPage() {
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { categoryNews } = useAppSelector((state) => state.categoryNews);
  const { newsList, loading } = useAppSelector((state) => state.news);

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBerita, setEditingBerita] = useState<any | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedKategori, setSelectedKategori] = useState<null | typeof categoryNews[0]>(null);

  const [showFormCategory, setShowFormCategory] = useState(false);
  const [kategoriBaru, setKategoriBaru] = useState("");
  const [showKategoriManager, setShowKategoriManager] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    desc: "",
    categoryNewsId:  null,
     oldImagePhoto: "",
    imageNews: null as File | null,
    Date: "",
  });

  const filteredBerita = newsList.filter((item: any) => {
    const matchKategori =
      !selectedKategori ||
      selectedKategori.id === undefined ||
      item.categoryNewsId === selectedKategori.id;

    const lowerSearch = searchTerm.toLowerCase();
    const matchSearch =
      (item.name ?? "").toLowerCase().includes(lowerSearch) ||
      (item.desc ? item.desc.toLowerCase().includes(lowerSearch) : false);

    return matchKategori && matchSearch;
  });
  const handleEdit = (item: any) => {
    
  let formattedDate = "";
  if (item.Date) {
    const d = new Date(item.Date);
    formattedDate = d.toISOString().split("T")[0]; // format YYYY-MM-DD
  }
    setEditingBerita(item);
    setFormData({
      name: item.name ?? "",
      desc: item.desc ?? "",
       oldImagePhoto: item.imageNews || "",
      categoryNewsId: item.categoryNewsId ?? null,
      imageNews: null,
      Date: formattedDate,
    });
    setUploadedImage(item.imageNews || null);
    setIsDialogOpen(true);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("desc", formData.desc);
      formDataToSend.append("categoryNewsId", String(formData.categoryNewsId ?? ""));
      formDataToSend.append("Date", formData.Date);

       if (formData.imageNews) {
    formDataToSend.append("imageNews", formData.imageNews);
  } else {
    formDataToSend.append("oldImagePhoto", formData.oldImagePhoto); // kirim nama lama
  }

      if (editingBerita) {
        await dispatch(updateNews({ id: editingBerita.id, data: formDataToSend })).unwrap();
        toast.success("Berita berhasil diupdate");
      } else {
        await dispatch(createNews(formDataToSend)).unwrap();
        toast.success("Berita berhasil ditambahkan");
         await dispatch(fetchNews());
      }

      resetForm();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Gagal menyimpan berita");
    } finally {
      setUploading(false);
    }
  };

  const handleSaveCategory = async () => {
    if (!kategoriBaru.trim()) return;

    try {
      if (selectedKategori) {
        await dispatch(
          updateCategoryNews({
            id: selectedKategori.id,
            name: kategoriBaru
          })
        ).unwrap();
      } else {
        await dispatch(createCategoryNews({ name: kategoriBaru })).unwrap();
      }
      setShowFormCategory(false);
      setKategoriBaru("");
      setSelectedKategori(null);
    } catch (err) {
      console.error("Gagal menyimpan kategori:", err);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      desc: "",
       oldImagePhoto: "",
      categoryNewsId: null,
      imageNews: null,
      Date: "",

    });
    setEditingBerita(null);
    setIsDialogOpen(false);
    setUploadedImage(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };




const handleDelete = async (id: number) => {
  try {
    await dispatch(deleteNews(id)).unwrap();
    toast.success("Berita berhasil dihapus");
    await dispatch(fetchNews()); // refresh data dari backend
  } catch (e) {
    toast.error("Gagal menghapus berita");
  }
};


  useEffect(() => {
    dispatch(fetchCategoryNews());
    dispatch(fetchNews());
  }, [dispatch]);
console.log(newsList);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Kelola Berita</h1>
          <p className="text-muted-foreground">Tambah, edit, dan kelola berita sekolah</p>
        </div>
        <div className="flex justify-between items-center mb-4 gap-5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowKategoriManager(!showKategoriManager)}
          >
            <Tags className="h-4 w-4 mr-2" />
            Kelola Kategori
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="h-4 w-4 mr-2" />
                Tambah Berita
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingBerita ? "Edit Berita" : "Tambah Berita Baru"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Judul */}
                <div className="space-y-2">
                  <Label htmlFor="judul">Judul Berita</Label>
                  <Input
                    id="judul"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Masukkan judul berita"
                    required
                  />
                </div>

                {/* Kategori */}
                <div className="space-y-2">
                  <Label htmlFor="kategori">Kategori</Label>
                  <Select
                    value={formData.categoryNewsId ? String(formData.categoryNewsId) : ""}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, categoryNewsId: Number(value) }))
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryNews.map((kategori: any) => (
                        <SelectItem className="text-black" key={kategori.id} value={String(kategori.id)}>
                          {kategori.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Penulis */}
              

                {/* Tanggal */}
                <div className="space-y-2">
                  <Label htmlFor="tanggal">Tanggal</Label>
                  <Input
                    id="tanggal"
                    type="date"
                    value={formData.Date}
                    onChange={(e) => setFormData((prev) => ({ ...prev, Date: e.target.value }))}
                    required
                  />
                </div>

                {/* Konten */}
                <div className="space-y-2">
                  <Label htmlFor="konten">Konten Berita</Label>
                  <Textarea
                    id="konten"
                    value={formData.desc}
                    onChange={(e) => setFormData((prev) => ({ ...prev, desc: e.target.value }))}
                    placeholder="Tulis konten berita..."
                    rows={6}
                    required
                  />
                </div>

                {/* Gambar */}
            <div>
  <Label htmlFor="gambar">Upload Gambar</Label>
  <Input
    id="gambar"
    type="file"
    accept="image/*"
    onChange={(e) =>
      setFormData({
        ...formData,
        imageNews: e.target.files ? e.target.files[0] : null
      })
    }
  />
</div>
{formData.imageNews && (
                  <div>
                    <Label>Preview</Label>
                <div className="mt-2 border border-border rounded-lg overflow-hidden">
  <img
    src={
      formData.imageNews
        ? URL.createObjectURL(formData.imageNews) // jika file upload
        : "https://via.placeholder.com/400x300?text=No+Image"
    }
    alt="Preview"
    className="w-full h-48 object-cover"
    onError={(e) => {
      (e.target as HTMLImageElement).src =
        "https://via.placeholder.com/400x300?text=Image+Not+Found";
    }}
  />
</div>

                  </div>
                )}
                {/* Status */}
                {/* <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: "draft" | "published") =>
                      setFormData((prev) => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div> */}

                {/* Button */}
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1" disabled={uploading}>
                    {uploading ? "Menyimpan..." : editingBerita ? "Update Berita" : "Simpan Berita"}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Batal
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Kategori Manager */}
      {showKategoriManager && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tags className="h-5 w-5" />
              Kelola Kategori Kegiatan
            </CardTitle>
            <CardDescription>Tambah, edit, atau hapus kategori untuk berita</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-end gap-2">
                <Button
                  onClick={() => setShowFormCategory(!showFormCategory)}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Upload jenis Kegiatan
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {categoryNews.map((kategori: any) => (
                  <div key={kategori.id} className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/50">
                    <span className="font-medium">{kategori?.name}</span>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" onClick={() => {
                        setSelectedKategori(kategori);
                        setKategoriBaru(kategori.name);
                        setShowFormCategory(true);
                      }}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="destructive">
                        <Trash className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pencarian */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Pencarian & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Cari berita..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Tabel Berita */}
      <Card>
        <CardHeader className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold">
              Daftar Berita ({filteredBerita.length})
            </CardTitle>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {categoryNews.map((kategori: any) => (
                <Button
                  key={kategori.id}
                  variant={selectedKategori?.id === kategori.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedKategori(kategori)}
                  className="rounded-full px-4 py-2 whitespace-nowrap"
                >
                  {kategori.name}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Gambar</TableHead>
                  <TableHead>Judul</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBerita.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Tidak ada berita ditemukan
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBerita.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <img
                          src={`https://api.man1kotapalu.sch.id/uploads/${item.imageNews}` || "https://via.placeholder.com/160x120"}
                          alt={item.name}
                          className="w-16 h-12 object-cover rounded border"
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground line-clamp-2">
                            {item.desc}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{item.categoryNews?.name ?? "-"}</Badge>
                      </TableCell>
                     
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {item.Date ? new Date(item.Date).toLocaleDateString("id-ID") : "-"}
                        </div>
                      </TableCell>
                      {/* <TableCell>
                        <Badge variant={item.status === "published" ? "default" : "secondary"}>
                          {item.status === "published" ? "Published" : "Draft"}
                        </Badge>
                      </TableCell> */}
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog Tambah/Edit Kategori */}
      <Dialog open={showFormCategory} onOpenChange={setShowFormCategory}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedKategori ? "Edit Jenis Kegiatan" : "Tambah Jenis Kegiatan"}
            </DialogTitle>
            <DialogDescription>
              {selectedKategori
                ? "Ubah nama kategori/jenis kegiatan yang sudah ada."
                : "Masukkan nama kategori/jenis kegiatan baru untuk Berita."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="kategoriBaru">Nama Kategori</Label>
              <Input
                id="kategoriBaru"
                value={kategoriBaru}
                onChange={(e) => setKategoriBaru(e.target.value)}
                placeholder="Contoh: Pengumuman"
              />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button onClick={handleSaveCategory}>
              {selectedKategori ? "Update" : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
