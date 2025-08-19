import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash, Video, Play, Grid, List, Tags } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { createVideo, deleteVideo, fetchVideos, updateVideo } from "@/stores/store/videoSlice";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { createCategory, fetchCategories, updateCategory } from "@/stores/store/categoryVideoSlice";
import { toast } from "sonner";

export default function VideoPage() {
  const dispatch = useAppDispatch();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
const [selectedKategori, setSelectedKategori] = useState<null | typeof categoryVideos[0]>(null);
    const { categoryVideos, loading: loadingCategory, error: errorCategory } =
    useAppSelector((state) => state.categoryVideo);
  const {   items, loading: loadingGallery, error: errorGallery } =
    useAppSelector((state) => state.video);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
      const [editId, setEditId] = useState<number | null>(null);
        const [showKategoriManager, setShowKategoriManager] = useState(false);
    const [editMode, setEditMode] = useState(false);
const [formData, setFormData] = useState({
  name: "",            
  desc: "",         
  urlVideo: "",     
  categoryVideoId: null, 
  DATE: ""             
});
const handleEdit = (item: any) => {
  setFormData({
    name: item.name || "",
    desc: item.desc || "",
   urlVideo: item.urlVideo, 
    categoryVideoId: item.categoryVideoId|| null,
    DATE: item.DATE || ""
  });
  setEditId(item.id);
  setEditMode(true);
  setShowForm(true); // buka form add/edit
}
  const [showFormCategory, setShowFormCategory] = useState(false);
  const [kategoriBaru, setKategoriBaru] = useState("");
  const [viewsMap, setViewsMap] = useState<Record<number, string>>({});

const handleSaveCategory = async () => {
  if (!kategoriBaru.trim()) return;

  try {
    if (selectedKategori) {
      await dispatch(
        updateCategory({
          id: selectedKategori.id,
          name: kategoriBaru
        })
      ).unwrap();
    } else {
      await dispatch(createCategory({ name: kategoriBaru })).unwrap();
    }

    // Refresh video list supaya kategori di items ikut update
    dispatch(fetchVideos());

    // Reset form
    setShowFormCategory(false);
    setKategoriBaru("");
    setSelectedKategori(null);
  } catch (err) {
    console.error("Gagal menyimpan kategori:", err);
  }
};


const handleEditClick = (category: typeof categoryVideos[0]) => {
  setSelectedKategori(category);
  setKategoriBaru(category.name);
  setShowFormCategory(true); // buka modal
};

const handleCloseModal = () => {
  setShowFormCategory(false);
  setKategoriBaru("");
  setSelectedKategori(null);
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const payload = {
    name: formData.name,
    desc: formData.desc,
    urlVideo: formData.urlVideo,
    categoryVideoId: Number(formData.categoryVideoId), // pastikan number
    DATE: formData.DATE
  };

  try {
   if (editMode && editId !== null) {
  await dispatch(updateVideo({ id: editId, data: payload })).unwrap();
  await dispatch(fetchVideos()); // refresh list video
  toast.success('Berhasil Update Data');
} else {
  await dispatch(createVideo(payload)).unwrap();
  await dispatch(fetchVideos()); // refresh list video
  toast.success('Berhasil Tambah Data');
}


    setShowForm(false);
    setEditMode(false);
    setEditId(null);
    setFormData({
      name: "",
      desc: "",
      urlVideo: "",
      categoryVideoId: "",
      DATE: ""
    });
  } catch (error) {
    console.error("Error saving video:", error);
  }
};

const getYoutubeEmbed = (url: string) => {
  try {
    const videoId = new URL(url).searchParams.get("v");
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  } catch {
    return null;
  }
};
const API_KEY = "AIzaSyBxzPsWJD3Pk1oaGhWIKI4umkMZ-65L63Q";

const getYoutubeVideoId = (url: string) => {
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname.includes("youtu.be")) {
      return parsedUrl.pathname.slice(1);
    }
    return parsedUrl.searchParams.get("v");
  } catch {
    return null;
  }
};

const getYoutubeViews = async (videoId: string) => {
  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${API_KEY}`
    );
    const data = await res.json();
    return data?.items?.[0]?.statistics?.viewCount || null;
  } catch (err) {
    console.error("Gagal ambil views:", err);
    return null;
  }
};
useEffect(() => {
  const fetchAllViews = async () => {
    const tempViews: Record<number, string> = {};
    for (const vid of items) {
      const videoId = getYoutubeVideoId(vid.urlVideo);
      if (videoId) {
        const views = await getYoutubeViews(videoId);
        if (views) tempViews[vid.id] = Number(views).toLocaleString();
      }
    }
    setViewsMap(tempViews);
  };

  if (items.length > 0) {
    fetchAllViews();
  }
}, [items]);

const filteredVideos = items.filter((item) => {
  console.log(item);
  
const matchKategori =
  !selectedKategori ||
  selectedKategori === "" ||
  item.categoryVideoId === selectedKategori.id ||
  item.category?.id === selectedKategori.id;

  const lowerSearch = searchTerm.toLowerCase();
  const matchSearch =
    item.name.toLowerCase().includes(lowerSearch) ||
    (item.desc ? item.desc.toLowerCase().includes(lowerSearch) : false);

  return matchKategori && matchSearch;
  });
 useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchVideos())
  }, [dispatch]);
console.log(selectedKategori);
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Video className="h-8 w-8 text-primary" />
            Kelola Video
          </h1>
          <p className="text-muted-foreground">Kelola koleksi video dokumentasi dan pembelajaran</p>
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
            Tambah Video
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
                {categoryVideos.map((kategori) => (
                  <div key={kategori.id} className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/50">
                    <span className="font-medium">{kategori?.name}</span>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditClick(kategori)}
                      >
                        <Edit  className="h-3 w-3" />
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
                placeholder="Cari video berdasarkan judul atau deskripsi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categoryVideos.map((kategori) => (
                <Button
                  key={kategori.id}
                  variant={selectedKategori === kategori ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedKategori(kategori)}
                  className="h-10"
                >
                  {kategori.name}
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
            <CardTitle>Tambah Video Baru</CardTitle>
            <CardDescription>Lengkapi form berikut untuk menambah video</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="judul">Judul Video</Label>
                  <Input 
                    id="judul"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Masukkan judul video"
                  />
                </div>
                <div>
                  <Label htmlFor="url">URL Video (YouTube, Vimeo, dll)</Label>
                  <Input 
                    id="urlVideo"
                    value={formData.urlVideo}
                    onChange={(e) => setFormData({...formData, urlVideo: e.target.value})}
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>
            <div>
                  <Label htmlFor="url">tanggal Kegiatan</Label>
                  <Input 
                    id="url"
                    type="date"
                    value={formData.DATE}
                    onChange={(e) => setFormData({...formData, DATE: e.target.value})}
                    
                  />
                </div>
                <div>
                  <Label htmlFor="kategori">Kategori</Label>
                  <select 
                    id="kategori"
                    value={formData.categoryVideoId}
                    onChange={(e) => setFormData({...formData, categoryVideoId: e.target.value})}
                    className="w-full p-2 border border-input rounded-md bg-background"
                  >
                     <option value="">-- Pilih jenis Kegiatan --</option>
                    {categoryVideos.map((kategori) => (
                      <option className="bg-white text-black" key={kategori.id} value={kategori.id}>{kategori.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="deskripsi">Deskripsi</Label>
                  <Textarea 
                    id="deskripsi"
                    value={formData.desc}
                    onChange={(e) => setFormData({...formData, desc: e.target.value})}
                    placeholder="Masukkan deskripsi video"
                    rows={6}
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <Button className="bg-primary hover:bg-primary/90">
                Simpan Video
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Batal
              </Button>
            </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Video Grid/List */}
       {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <Card key={video.id} className="group hover:shadow-lg transition-all duration-200 overflow-hidden">
              <div className="relative overflow-hidden">
              <iframe
  width="100%"
  height="auto"
  src={getYoutubeEmbed(video.urlVideo) || ""}
  title={video.name}
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
/>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-200 flex items-center justify-center">
                  <Play className="h-12 w-12 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-200" />
                </div>
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-black/70 text-white border-0">
                    {/* {video.durasi} */} 22.02
                  </Badge>
                </div>
                <div className="absolute bottom-2 left-2">
                  <Badge variant="secondary" className="bg-black/70 text-white border-0 text-xs">
                    {video.category?.name}
                  </Badge>
                </div>
              </div>
              <CardContent className="pt-4">
                <h3 className="font-semibold text-lg truncate mb-2">{video.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{video.des}</p>
                <div className="flex justify-between items-center text-xs text-muted-foreground mb-3">
                  <span>{viewsMap[video.id] || '...'} views</span>
                  <span>{video.DATE}</span>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleEdit(video)} size="sm" variant="outline" className="flex-1">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button   onClick={() => dispatch(deleteVideo(video.id))} size="sm" variant="destructive">
                    <Trash className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredVideos.map((video) => (
            <Card key={video.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="pt-6">
                <div className="flex gap-6">
                  <div className="relative w-48 h-28 flex-shrink-0 rounded-lg overflow-hidden">
                   <iframe
  width="100%"
  height="250"
  src={getYoutubeEmbed(video.urlVideo) || ""}
  title={video.name}
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
/>
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <Play className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute bottom-1 right-1">
                      <Badge variant="secondary" className="bg-black/70 text-white border-0 text-xs">
                        {/* {video.durasi} */} 22.02
                      </Badge>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-xl">{video.name}</h3>
                               {video.category?.name}
                    </div>
                    <p className="text-muted-foreground mb-3">{video.deskripsi}</p>
                    <div className="flex justify-between items-center text-sm text-muted-foreground mb-3">
                      <span>22.02 views</span>
                      <span>{video.DATE}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => handleEdit(video)} size="sm" variant="outline">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button onClick={() => dispatch(deleteVideo(video.id))} size="sm" variant="destructive">
                        <Trash className="h-3 w-3 mr-1" />
                        Hapus
                      </Button>
                      <Button size="sm" variant="secondary">
                        <Play className="h-3 w-3 mr-1" />
                        Tonton
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredVideos.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground">Tidak ada video ditemukan</h3>
              <p className="text-sm text-muted-foreground">Coba ubah filter pencarian atau tambah video baru</p>
            </div>
          </CardContent>
        </Card>
      )} 
      <Dialog open={showFormCategory} onOpenChange={setShowFormCategory}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>
        {selectedKategori ? "Edit Jenis Kegiatan" : "Tambah Jenis Kegiatan"}
      </DialogTitle>
      <DialogDescription>
        {selectedKategori
          ? "Ubah nama kategori/jenis kegiatan yang sudah ada."
          : "Masukkan nama kategori/jenis kegiatan baru untuk Video."}
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
      <Button onClick={handleSaveCategory}>
        {selectedKategori ? "Update" : "Simpan"}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

    </div>
  );
}