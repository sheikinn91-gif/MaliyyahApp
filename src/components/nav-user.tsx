import {
  ChevronsUpDown,
  LogOut,
  User,
  Settings,
  Bell,
  BadgeCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { useZakat } from "@/components/Context/ZakatContext";
import { toast } from "sonner";

export function NavUser() {
  const { userName, userEmail, logout } = useZakat();
  const { isMobile } = useSidebar();
  const navigate = useNavigate();

  const displayUser = {
    name: userName || "Pengguna",
    email: userEmail || "user@maliyyah.com",
    avatar: "https://github.com/shadcn.png", // Anda boleh gantikan dengan URL imej sebenar
  };

  const handleLogout = () => {
    logout();
    toast.success("Log keluar berjaya. Jumpa lagi!");
    navigate("/login");
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground transition-all duration-200"
            >
              <Avatar className="h-8 w-8 rounded-lg border border-slate-200 shadow-sm">
                <AvatarImage src={displayUser.avatar} alt={displayUser.name} />
                <AvatarFallback className="rounded-lg bg-emerald-100 text-emerald-700 font-bold">
                  {displayUser.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-bold text-slate-700">
                  {displayUser.name}
                </span>
                <span className="truncate text-xs text-slate-500">
                  {displayUser.email}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 text-slate-400" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-xl shadow-xl border-slate-100 p-1"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={8}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-2 py-2 text-left text-sm">
                <Avatar className="h-9 w-9 rounded-lg border border-slate-100">
                  <AvatarImage
                    src={displayUser.avatar}
                    alt={displayUser.name}
                  />
                  <AvatarFallback className="rounded-lg bg-emerald-50 text-emerald-600 font-bold">
                    {displayUser.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold text-slate-800">
                    {displayUser.name}
                  </span>
                  <span className="truncate text-xs text-slate-500">
                    {displayUser.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="bg-slate-100" />

            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer py-2 focus:bg-slate-50">
                <BadgeCheck className="mr-2 h-4 w-4 text-emerald-600" />
                Akaun Profil
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer py-2 focus:bg-slate-50">
                <Settings className="mr-2 h-4 w-4 text-slate-500" />
                Tetapan
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer py-2 focus:bg-slate-50">
                <Bell className="mr-2 h-4 w-4 text-slate-500" />
                Notifikasi
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="bg-slate-100" />

            <DropdownMenuItem
              className="cursor-pointer py-2 text-red-600 focus:text-white focus:bg-red-500 rounded-md transition-colors"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
