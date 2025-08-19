import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Image, ImageIcon, Video, TrendingUp, Eye } from "lucide-react";

const stats = [
  {
    title: "Total Guru",
    value: "45",
    icon: Users,
    description: "Guru aktif",
    trend: "+2 bulan ini"
  },
  {
    title: "Banner Aktif",
    value: "8",
    icon: Image,
    description: "Banner ditampilkan",
    trend: "+1 minggu ini"
  },
  {
    title: "Foto Gallery",
    value: "156",
    icon: ImageIcon,
    description: "Foto tersimpan",
    trend: "+12 bulan ini"
  },
  {
    title: "Video",
    value: "23",
    icon: Video,
    description: "Video tersedia",
    trend: "+3 bulan ini"
  }
];

const recentActivities = [
  { action: "Menambah guru baru", name: "Dra. Siti Aminah", time: "2 jam lalu" },
  { action: "Update banner", name: "Banner Penerimaan Siswa Baru", time: "5 jam lalu" },
  { action: "Upload foto", name: "Kegiatan OSIS", time: "1 hari lalu" },
  { action: "Publish video", name: "Profil Sekolah 2024", time: "2 hari lalu" },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-accent/80 rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Selamat Datang di Panel Admin</h1>
        <p className="text-lg opacity-90">MAN 1 KOTA PALU - Sistem Manajemen Konten</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
              <div className="flex items-center mt-2 text-xs text-accent">
                <TrendingUp className="h-3 w-3 mr-1" />
                {stat.trend}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activities and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              Aktivitas Terbaru
            </CardTitle>
            <CardDescription>
              Aktivitas terbaru dalam sistem
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.name}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Aksi Cepat</CardTitle>
            <CardDescription>
              Akses cepat ke fitur utama
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors duration-200 text-center group">
                <Users className="h-8 w-8 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-medium">Tambah Guru</p>
              </button>
              <button className="p-4 bg-accent/10 hover:bg-accent/20 rounded-lg transition-colors duration-200 text-center group">
                <Image className="h-8 w-8 text-accent-foreground mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-medium">Upload Banner</p>
              </button>
              <button className="p-4 bg-secondary/10 hover:bg-secondary/20 rounded-lg transition-colors duration-200 text-center group">
                <ImageIcon className="h-8 w-8 text-secondary-foreground mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-medium">Kelola Gallery</p>
              </button>
              <button className="p-4 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors duration-200 text-center group">
                <Video className="h-8 w-8 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-medium">Upload Video</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}