import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash, ImageIcon, Grid, List,Tags } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { createCategoryPhoto,fetchCategoryPhotos } from "@/stores/store/categoryPhotoSlice";
import { createGallery, deleteGallery, fetchGallery, updateGallery } from "@/stores/store/galleryPhotosSlice";
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"


export default function GalleryPage() {
    const dispatch = useAppDispatch();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { categoryPhotos, loading: loadingCategory, error: errorCategory } =
  useAppSelector((state) => state.categoryPhoto);
const {   galleries, loading: loadingGallery, error: errorGallery } =
  useAppSelector((state) => state.gallery);
  const [showKategoriManager, setShowKategoriManager] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [editMode, setEditMode] = useState(false);
const [selectedKategori, setSelectedKategori] = useState<null | typeof categoryPhotos[0]>(null);

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
 // state
const [formData, setFormData] = useState({
  nama: "",
  deskripsi: "",           
  imagePhoto: null as File | null,
   oldImagePhoto: "",
  categoryId: null as number | null,
  DATE: ""
});
const handleEdit = (item: any) => {
  setFormData({
    nama: item.nama || "",
    deskripsi: item.deskripsi || "",
   imagePhoto: null, 
    oldImagePhoto: item.imagePhoto || "", 
    categoryId: item.categoryId || null,
    DATE: item.DATE || ""
  });
  setEditId(item.id);
  setEditMode(true);
  setShowForm(true); // buka form add/edit
};


const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  const data = new FormData();
  data.append("nama", formData.nama);
  data.append("deskripsi", formData.deskripsi);
  data.append("categoryId", String(Number(formData.categoryId)));
  data.append("DATE", formData.DATE);

  if (formData.imagePhoto) {
    data.append("imagePhoto", formData.imagePhoto);
  } else {
    data.append("oldImagePhoto", formData.oldImagePhoto); // kirim nama lama
  }

  if (editMode && editId !== null) {
    dispatch(updateGallery({ id: editId, formData: data }));
  } else {
    dispatch(createGallery(data));
  }

  // Reset
  setShowForm(false);
  setEditMode(false);
  setEditId(null);
  setFormData({
    nama: "",
    deskripsi: "",
      imagePhoto: null,
    oldImagePhoto: "",
    categoryId: null,
    DATE: ""
  });
};

  const [showFormCategory, setShowFormCategory] = useState(false);
  const [kategoriBaru, setKategoriBaru] = useState("");
const handleTambahKategori = async () => {
  if (!kategoriBaru.trim()) return;

  try {
    await dispatch(
      createCategoryPhoto({ nama: kategoriBaru }) 
    ).unwrap();

    setShowFormCategory(false); 
    setKategoriBaru(""); 
  } catch (err) {
    console.error("Gagal membuat kategori:", err);
  }
};


  useEffect(() => {
    dispatch(fetchCategoryPhotos());
    dispatch(fetchGallery())
  }, [dispatch]);

const filteredGallery = galleries.filter((item) => {
  console.log(item);
  
  const matchKategori =
    !selectedKategori || selectedKategori === "" || item.categoryId === selectedKategori.id;
  const lowerSearch = searchTerm.toLowerCase();
  const matchSearch =
    item.nama.toLowerCase().includes(lowerSearch) ||
    (item.deskripsi ? item.deskripsi.toLowerCase().includes(lowerSearch) : false);

  return matchKategori && matchSearch;
});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <ImageIcon className="h-8 w-8 text-primary" />
            Gallery Foto
          </h1>
          <p className="text-muted-foreground">Kelola koleksi foto kegiatan sekolah</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
          >
            {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
          </Button>
           <Button 
            variant="outline"
            size="sm"
            onClick={() => setShowKategoriManager(!showKategoriManager)}
          >
            <Tags className="h-4 w-4 mr-2" />
            Kelola Kategori
          </Button>
          <Button 
            onClick={() => setShowForm(!showForm)}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Upload Foto
          </Button>
        
        </div>
      </div>
 {showKategoriManager && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tags className="h-5 w-5" />
              Kelola Kategori Kegiatan
            </CardTitle>
            <CardDescription>Tambah, edit, atau hapus kategori untuk gallery foto</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Add/Edit Form */}
              <div className="flex  justify-end gap-2">
                  <Button 
            onClick={() => setShowFormCategory(!showFormCategory)}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Upload jenis Kegiatan 
          </Button>
              
              </div>


              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {categoryPhotos.map((kategori) => (
                  <div key={kategori.id} className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/50">
                    <span className="font-medium">{kategori.nama}</span>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                  
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                       
                      >
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
      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari foto berdasarkan judul atau deskripsi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
                <Button
    variant={selectedKategori === null ? "default" : "outline"}
    size="sm"
    onClick={() => setSelectedKategori(null)}
    className="h-10"
  >
    Semua
  </Button>
              {categoryPhotos.map((kategori) => (
                <Button
                  key={kategori.id}
                  variant={selectedKategori === kategori ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedKategori(kategori)}
                  className="h-10"
                >
                  {kategori.nama}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Foto Baru</CardTitle>
            <CardDescription>Lengkapi form berikut untuk menambah foto ke gallery</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="judul">Judul Foto</Label>
                  <Input 
                    id="judul"
                    value={formData.nama}
                    onChange={(e) => setFormData({...formData, nama: e.target.value})}
                    placeholder="Masukkan judul foto"
                  />
                </div>
                  <div>
  <Label htmlFor="tanggalKegiatan">Tanggal Kegiatan</Label>
  <Popover>
    <PopoverTrigger asChild>
      <Button
        variant={"outline"}
        className={`w-full justify-start text-left font-normal ${
          !formData.DATE && "text-muted-foreground"
        }`}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {formData.DATE ? format(new Date(formData.DATE), "dd MMM yyyy") : "Pilih tanggal"}
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-auto p-0" align="start">
      <Calendar
        mode="single"
        selected={formData.DATE ? new Date(formData.DATE) : undefined}
        onSelect={(date) =>
          setFormData({ ...formData, DATE: date ? date.toISOString().split("T")[0] : "" })
        }
        initialFocus
      />
    </PopoverContent>
  </Popover>
</div>
                <div>
                  <Label htmlFor="kategori">Kategori</Label>
                  <select 
                    id="kategori"
                    value={formData.categoryId}
                    onChange={(e) => setFormData({...formData, categoryId: Number(e.target.value)})}
                    className="w-full p-2 border border-input rounded-md bg-background"
                  >
                     <option value="">-- Pilih jenis Kegiatan --</option>
                    {categoryPhotos.map((kategori) => (
                      <option className="bg-white text-black" key={kategori.id} value={kategori.id}>{kategori.nama}</option>
                    ))}
                  </select>
                </div>
              <div>
  <Label htmlFor="gambar">Upload Gambar</Label>
  <Input
    id="gambar"
    type="file"
    accept="image/*"
    onChange={(e) =>
      setFormData({
        ...formData,
        imagePhoto: e.target.files ? e.target.files[0] : null
      })
    }
  />
</div>

              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="deskripsi">Deskripsi</Label>
                  <textarea 
                    id="deskripsi"
                    value={formData.deskripsi}
                    onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
                    placeholder="Masukkan deskripsi foto"
                    rows={4}
                    className="w-full p-2 border border-input rounded-md bg-background resize-none"
                  />
                </div>
                {formData.imagePhoto && (
                  <div>
                    <Label>Preview</Label>
                <div className="mt-2 border border-border rounded-lg overflow-hidden">
  <img
    src={
      formData.imagePhoto
        ? URL.createObjectURL(formData.imagePhoto) // jika file upload
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
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <Button className="bg-primary hover:bg-primary/90">
                Upload Foto
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Batal
              </Button>
            </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Gallery Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGallery.map((item) => (
            <Card key={item.id} className="group hover:shadow-lg transition-all duration-200 overflow-hidden">
              <div className="relative overflow-hidden">
                <img 
                  src={`https://api.man1kotapalu.sch.id/uploads/${item.imagePhoto}`}
                  alt={item.imagePhoto}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-black/50 text-white border-0">
                     {item.category?.nama || "Tidak ada kategori"}
                  </Badge>
                </div>
              </div>
              <CardContent className="pt-4">
                <h3 className="font-semibold text-lg truncate">{item.nama}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{item.deksripsi}</p>
                <p className="text-xs text-muted-foreground mb-3">{item.DATE}</p>
                <div className="flex gap-2">
                 <Button 
  size="sm" 
  variant="outline" 
  className="flex-1"
  onClick={() => handleEdit(item)}
>
  <Edit className="h-3 w-3 mr-1" />
  Edit
</Button>

                 <Button 
  size="sm" 
  variant="destructive"
  onClick={() => dispatch(deleteGallery(item.id))}
>
  <Trash className="h-3 w-3" />
</Button>

                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredGallery.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="pt-6">
                <div className="flex gap-6">
                  <img 
                     src={`https://api.man1kotapalu.sch.id/uploads/${item.imagePhoto}`}
                  alt={item.imagePhoto}
                    className="w-32 h-24 object-cover rounded-lg border border-border flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-xl">{item.nama}</h3>
                      <Badge variant="secondary"> {item.category?.nama || "Tidak ada kategori"}</Badge>
                    </div>
                    <p className="text-muted-foreground mb-2">{item.deksripsi}</p>
                    <p className="text-sm text-muted-foreground mb-3">{item.DATE}</p>
                    <div className="flex gap-2">
                   <Button 
  size="sm" 
  variant="outline" 
  className="flex-1"
  onClick={() => handleEdit(item)}
>
  <Edit className="h-3 w-3 mr-1" />
  Edit
</Button>

                     <Button 
  size="sm" 
  variant="destructive"
  onClick={() => dispatch(deleteGallery(item.id))}
>
  <Trash className="h-3 w-3" />
</Button>

                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredGallery.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground">Tidak ada foto ditemukan</h3>
              <p className="text-sm text-muted-foreground">Coba ubah filter pencarian atau tambah foto baru</p>
            </div>
          </CardContent>
        </Card>
      )}
  <Dialog open={showFormCategory} onOpenChange={setShowFormCategory}>
      {/* Tombol buka modal */}
    

      {/* Isi modal */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Jenis Kegiatan</DialogTitle>
          <DialogDescription>
            Masukkan nama kategori/jenis kegiatan baru untuk galeri.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div>
            <Label htmlFor="kategoriBaru">Nama Kategori</Label>
            <Input
              id="kategoriBaru"
              value={kategoriBaru}
              onChange={(e) => setKategoriBaru(e.target.value)}
              placeholder="Contoh: Study Tour"
            />
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button onClick={handleTambahKategori}>
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    </div>
  );
}