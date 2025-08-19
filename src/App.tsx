import { Provider } from "react-redux";
import { store } from "./stores/index";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminLayout } from "./components/AdminLayout";

import Dashboard from "./pages/Dashboard";
import GuruPage from "./pages/GuruPage";
import BannerPage from "./pages/BannerPage";
import GalleryPage from "./pages/GalleryPage";
import VideoPage from "./pages/VideoPage";
import KelasXPage from "./pages/KelasXPage";
import KelasXIPage from "./pages/KelasXIPage";
import KelasXIIPage from "./pages/KelasXIIPage";
import KelasXIIIPage from "./pages/KelasXIIIPage";
import NotFound from "./pages/NotFound";
import BeritaPage from "./pages/BeritaPage";
import { LoginForm } from "./pages/loginForm";
import AllPendaftran from "./pages/allPendaftran";

const queryClient = new QueryClient();

const AppContent = () => (
  <TooltipProvider>
    <Toaster />

    <BrowserRouter>
      <Routes>

        <Route path="/" element={<LoginForm />} />

        <Route
          path="/dashboard"
          element={
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          }
        />
        <Route
          path="/guru"
          element={
            <AdminLayout>
              <GuruPage />
            </AdminLayout>
          }
        />
        <Route
          path="/banner"
          element={
            <AdminLayout>
              <BannerPage />
            </AdminLayout>
          }
        />
        <Route
          path="/gallery"
          element={
            <AdminLayout>
              <GalleryPage />
            </AdminLayout>
          }
        />
        <Route
          path="/berita"
          element={
            <AdminLayout>
              <BeritaPage />
            </AdminLayout>
          }
        />
        <Route
          path="/video"
          element={
            <AdminLayout>
              <VideoPage />
            </AdminLayout>
          }
        />
         <Route
          path="/pendaftaran-siswa"
          element={
            <AdminLayout>
              <AllPendaftran />
            </AdminLayout>
          }
        />
        <Route
          path="/siswa/kelas-x"
          element={
            <AdminLayout>
              <KelasXPage />
            </AdminLayout>
          }
        />
        <Route
          path="/siswa/kelas-xi"
          element={
            <AdminLayout>
              <KelasXIPage />
            </AdminLayout>
          }
        />
        <Route
          path="/siswa/kelas-xii"
          element={
            <AdminLayout>
              <KelasXIIPage />
            </AdminLayout>
          }
        />
        <Route
          path="/siswa/kelas-xiii"
          element={
            <AdminLayout>
              <KelasXIIIPage />
            </AdminLayout>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </TooltipProvider>
);

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  </Provider>
);

export default App;
