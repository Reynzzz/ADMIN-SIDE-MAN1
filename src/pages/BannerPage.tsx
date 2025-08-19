import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash, Image, Eye, EyeOff } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { fetchBanners, createBanner, deleteBanner,updateBanner } from "@/stores/store/bannerSlice";
import { Dialog, DialogContent } from "@/components/ui/dialog"; // import shadcn/ui dialog

export default function BannerPage() {
  const dispatch = useAppDispatch();
  const { banners, loading, error } = useAppSelector((state) => state.banner);
const [editMode, setEditMode] = useState(false);
const [editId, setEditId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    namaKegiatan: "",
    tanggalKegiatan: "",
    deskripsi: "",
    status: "aktif",
    imageBanner: null as File | null,
  });
const handleClose = () => {
  setShowForm(false); 
  setEditMode(false); 
  setEditId(null);    
  setFormData({       
    namaKegiatan: "",
    tanggalKegiatan: "",
    deskripsi: "",
    status: "aktif",
    imageBanner: null,
  });
};



  useEffect(() => {
    dispatch(fetchBanners());
  }, [dispatch]);
  const [showImageModal, setShowImageModal] = useState(false);
const [selectedImage, setSelectedImage] = useState<string | null>(null);

const handleOpenImage = (imagePath: string) => {
  setSelectedImage(imagePath);
  setShowImageModal(true);
};
const handleEdit = (banner: any) => {
  setEditMode(true);
  setEditId(banner.id);
  setFormData({
    namaKegiatan: banner.namaKegiatan,
    tanggalKegiatan: banner.tanggalKegiatan,
    deskripsi: banner.deskripsi,
    status: banner.status,
    imageBanner: null, // biarkan null karena user bisa pilih file baru
  });
  setShowForm(true);
};

 const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  const data = new FormData();
  data.append("namaKegiatan", formData.namaKegiatan);
  data.append("tanggalKegiatan", formData.tanggalKegiatan);
  data.append("deskripsi", formData.deskripsi);
  data.append("status", formData.status);
  if (formData.imageBanner) {
    data.append("imageBanner", formData.imageBanner);
  }

if (editMode && editId !== null) {
  data.append("id", editId.toString());
  dispatch(updateBanner({ id: editId, data }))
    .unwrap()
    .then(() => dispatch(fetchBanners())); // refresh list langsung
} else {
  dispatch(createBanner(data))
    .unwrap()
    .then(() => dispatch(fetchBanners()));
}


  // Reset form
  setShowForm(false);
  setEditMode(false);
  setEditId(null);
  setFormData({
    namaKegiatan: "",
    tanggalKegiatan: "",
    deskripsi: "",
    status: "aktif",
    imageBanner: null,
  });
};


  const filteredBanners = banners.filter(banner =>
    banner.namaKegiatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    banner.deskripsi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Image className="h-8 w-8 text-primary" />
            Kelola Banner
          </h1>
          <p className="text-muted-foreground">Kelola banner yang ditampilkan di website</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Tambah Banner
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari banner berdasarkan judul atau deskripsi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {showForm && (
        <Card>
          <CardHeader>
           <CardTitle>{editMode ? "Edit Banner" : "Tambah Banner Baru"}</CardTitle>
<CardDescription>{editMode ? "Ubah data banner" : "Lengkapi form untuk menambah banner"}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="namaKegiatan">Judul Banner</Label>
                    <Input
                      id="namaKegiatan"
                      value={formData.namaKegiatan}
                      onChange={(e) => setFormData({ ...formData, namaKegiatan: e.target.value })}
                      placeholder="Masukkan judul banner"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tanggalKegiatan">Tanggal Kegiatan</Label>
                    <Input
                      id="tanggalKegiatan"
                      type="date"
                      value={formData.tanggalKegiatan}
                      onChange={(e) => setFormData({ ...formData, tanggalKegiatan: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full p-2 border border-input rounded-md bg-background"
                    >
                      <option value="aktif">Aktif</option>
                      <option value="tidak aktif">Tidak Aktif</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="imageBanner">Upload Gambar</Label>
                    <Input
                      id="imageBanner"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFormData({ ...formData, imageBanner: e.target.files?.[0] || null })}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="deskripsi">Deskripsi</Label>
                    <Textarea
                      id="deskripsi"
                      value={formData.deskripsi}
                      onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                      placeholder="Masukkan deskripsi banner"
                      rows={6}
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-primary hover:bg-primary/90">Simpan Banner</Button>
             <Button variant="outline" onClick={handleClose}>Batal</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {filteredBanners.map((banner) => (
          <Card key={banner.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-1/3">
                  <div className="relative group w-full h-48 lg:h-32">
  <img
    src={`https://api.man1kotapalu.sch.id/uploads/${banner.imageBanner}`}
    alt={banner.namaKegiatan}
    className="w-full h-full object-cover rounded-lg border border-border"
  />
  <button
    onClick={() => handleOpenImage(`https://api.man1kotapalu.sch.id/uploads/${banner.imageBanner}`)}
    className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg"
  >
    Lihat Gambar
  </button>
</div>

                </div>
                <div className="lg:w-2/3 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-xl text-foreground">{banner.namaKegiatan}</h3>
                      <p className="text-sm text-muted-foreground">Tanggal: {banner.tanggalKegiatan}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={banner.status === 'aktif' ? 'default' : 'secondary'} className="flex items-center gap-1">
                        {banner.status === 'aktif' ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                        {banner.status}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-muted-foreground">{banner.deskripsi}</p>
                  <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(banner)}>
  <Edit className="h-3 w-3 mr-1" />
  Edit
</Button>

                    <Button size="sm" variant="destructive" onClick={() => dispatch(deleteBanner(banner.id))}>
                      <Trash className="h-3 w-3 mr-1" />
                      Hapus
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        <Dialog open={showImageModal} onOpenChange={setShowImageModal}>
  <DialogContent className="max-w-3xl p-0 overflow-hidden">
    {selectedImage && (
      <img
        src={selectedImage}
        alt="Full Banner"
        className="w-full h-full object-contain"
      />
    )}
  </DialogContent>
</Dialog>

      </div>
    </div>
  );
}