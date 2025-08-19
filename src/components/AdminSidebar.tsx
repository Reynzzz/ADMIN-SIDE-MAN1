import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  Users, 
  Image, 
  ImageIcon, 
  Video, 
Newspaper,
  Menu,
  Home,
  Settings,
  GraduationCap,
  BookOpen
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Guru", url: "/guru", icon: Users },
  { title: "Banner", url: "/banner", icon: Image },
  { title: "Gallery", url: "/gallery", icon: ImageIcon },
  { title: "Video", url: "/video", icon: Video },
 { title: "Berita", url: "/berita", icon: Newspaper },
  { title: "Pendaftaran", url: "/pendaftaran-siswa", icon: GraduationCap },
];

const studentClasses = [
  { title: "Kelas X", url: "/siswa/kelas-x", icon: GraduationCap },
  { title: "Kelas XI", url: "/siswa/kelas-xi", icon: GraduationCap },
  { title: "Kelas XII", url: "/siswa/kelas-xii", icon: GraduationCap },
  { title: "Kelas XIII", url: "/siswa/kelas-xiii", icon: GraduationCap },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
const getNavCls = ({ isActive }: { isActive: boolean }) =>
  isActive 
    ? "bg-green-500 text-white font-medium shadow-md"
    : "hover:bg-green-500 transition-colors duration-200";


  return (
    <Sidebar
      className={`${collapsed ? "w-14" : "w-64"} border-r border-border`}
      collapsible="icon"
    >
      <div className="p-4 bg-primary border-b border-primary-foreground/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
            <span className="font-bold text-accent-foreground text-lg">M</span>
          </div>
          {!collapsed && (
            <div className="text-primary-foreground">
              <h2 className="text-lg font-bold">MAN 1</h2>
              <p className="text-sm opacity-90">KOTA PALU</p>
            </div>
          )}
        </div>
      </div>

      <SidebarContent className="bg-primary">
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary-foreground/80 text-sm font-semibold px-3">
            {!collapsed && "Menu Utama"}
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
  <SidebarMenuButton asChild>
    <NavLink
      to={item.url}
      end
      className={`group ${getNavCls({ isActive: isActive(item.url) })} rounded-lg mx-2 px-3 py-2.5 flex items-center gap-3 hover:bg-green-600`}
    >
      <item.icon
        className={`h-5 w-5 transition-colors duration-200 ${
          isActive(item.url)
            ? "text-white"
            : "text-primary-foreground/70 group-hover:text-white"
        }`}
      />
      {!collapsed && (
        <span
          className={`font-medium transition-colors duration-200 ${
            isActive(item.url)
              ? "text-white"
              : "text-primary-foreground/90 group-hover:text-white"
          }`}
        >
          {item.title}
        </span>
      )}
    </NavLink>
  </SidebarMenuButton>
</SidebarMenuItem>

              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-primary-foreground/80 text-sm font-semibold px-3">
            {!collapsed && "Data Siswa"}
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {studentClasses.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="group">
                    <NavLink 
                      to={item.url} 
                      end 
                      className={`${getNavCls({ isActive: isActive(item.url) })} rounded-lg mx-2 px-3 py-2.5 flex items-center gap-3`}
                    >
                      <item.icon className={`h-5 w-5 ${isActive(item.url) ? "text-primary-foreground" : "text-primary-foreground/70"}`} />
                      {!collapsed && (
                        <span className={`font-medium ${isActive(item.url) ? "text-primary-foreground" : "text-primary-foreground/90"}`}>
                          {item.title}
                        </span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}