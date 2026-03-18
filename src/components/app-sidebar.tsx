import React from "react";
import {
  LayoutDashboard,
  Calculator,
  UserCircle,
  Eye,
  EyeOff,
  LogIn,
} from "lucide-react";
import { useZakat } from "@/components/Context/ZakatContext";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { NavUser } from "@/components/nav-user";
import { Link, useLocation } from "react-router-dom";

// Import ikon rasmi dari assets
//import Maliyyah from "@/assets/maliyyah.png";

const mainMenuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Kalkulator Zakat", url: "/zakat", icon: Calculator },
  { title: "Profil", url: "/profile", icon: UserCircle },
];

export function AppSidebar() {
  const location = useLocation();
  const { isPrivacyMode, togglePrivacyMode, isAuthenticated } = useZakat();

  return (
    <Sidebar collapsible="icon" className="border-r border-slate-200">
      {/* --- SIDEBAR HEADER --- */}
      <SidebarHeader className="pt-6 px-4">
        <div className="flex items-center gap-3 px-2 mb-2">
          <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-white shadow-sm border border-slate-100 overflow-hidden">
            <img
              //src={Maliyyah}
              //alt="Maliyyah Logo"
              className="size-8 object-contain transition-transform hover:scale-110"
            />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate font-black text-emerald-600 text-xl tracking-tight">
              Maliyyah
            </span>
            <span className="truncate text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
              IdeaNation AI
            </span>
          </div>
        </div>
      </SidebarHeader>

      {/* --- SIDEBAR CONTENT --- */}
      <SidebarContent>
        {/* Kumpulan Utama */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-semibold text-slate-400 uppercase">
            Menu Utama
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-2">
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                    tooltip={item.title}
                    className={`transition-all duration-200 ${
                      location.pathname === item.url
                        ? "bg-emerald-50 text-emerald-700 font-semibold"
                        : "hover:bg-slate-100"
                    }`}
                  >
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon
                        className={`size-5 ${
                          location.pathname === item.url
                            ? "text-emerald-700"
                            : "text-slate-500"
                        }`}
                      />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Kumpulan Kawalan (Hanya Privacy Mode) */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel className="px-4 text-xs font-semibold text-slate-400 uppercase">
            Privasi
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-2">
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={togglePrivacyMode}
                  tooltip={
                    isPrivacyMode ? "Tunjukkan Nilai" : "Sembunyikan Nilai"
                  }
                  className={
                    isPrivacyMode
                      ? "text-orange-600 bg-orange-50 hover:bg-orange-100"
                      : "text-slate-500 hover:bg-slate-100"
                  }
                >
                  {isPrivacyMode ? (
                    <Eye className="size-5" />
                  ) : (
                    <EyeOff className="size-5" />
                  )}
                  <span>{isPrivacyMode ? "Show Values" : "Privacy Mode"}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* --- SIDEBAR FOOTER --- */}
      <SidebarFooter className="border-t border-slate-100 p-2">
        {isAuthenticated ? (
          /* JIKA SUDAH LOGIN: Paparkan profil pengguna (NavUser) */
          <NavUser />
        ) : (
          /* JIKA BELUM LOGIN: Paparkan butang Log Masuk yang jelas */
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="bg-emerald-600 text-white hover:bg-emerald-700 hover:text-white transition-all duration-200 shadow-sm"
                tooltip="Log Masuk"
              >
                <Link
                  to="/login"
                  className="flex items-center gap-3 w-full px-3 py-2"
                >
                  <LogIn className="size-5" />
                  <span className="font-bold">Log Masuk</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
