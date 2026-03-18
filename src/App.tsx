import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useZakat } from "@/components/Context/ZakatContext";
import { Toaster } from "sonner";

// Import UI Components (Shadcn)
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

// Import Halaman
import LoginPage from "./Pages/Login/Login";
import SignUp from "./Pages/SignUp/SignUp";
import Dashboard from "./Pages/Dashboard/Dashboard";
import History from "./Pages/History/History";
import Zakat from "./Pages/Zakat/Zakat";
import Profile from "./Pages/Profile/Profile";
import ForgotPassword from "./Pages/ForgotPassword/ForgotPassword";

// Import Komponen Keselamatan
import { ProtectedRoute } from "./Auth/ProtectedRoute";

function App() {
  const { setUserName, setUserEmail, setLocation, setOccupation } = useZakat();

  // 1. Logik Re-hydration & Demo Data
  useEffect(() => {
    const token = localStorage.getItem("maliyyah_token");
    const savedUser = localStorage.getItem("maliyyah_user");

    if (token && savedUser) {
      try {
        const user = JSON.parse(savedUser);
        if (setUserName) setUserName(user.name);
        if (setUserEmail) setUserEmail(user.email);
        if (setLocation) setLocation(user.location);
        if (setOccupation) setOccupation(user.occupation);
      } catch (error) {
        console.error("Gagal memulihkan sesi:", error);
      }
    } else {
      // SET DATA DEMO: Jika tiada sesi, set data default supaya Dashboard tidak kosong
      if (setUserName) setUserName("");
      if (setLocation) setLocation("");
      if (setOccupation) setOccupation("");
    }
  }, [setUserName, setUserEmail, setLocation, setOccupation]);

  // 2. Komponen Layout Wrapper: Menguruskan Sidebar dan Header secara konsisten
  const LayoutWrapper = ({ children }: { children: React.ReactNode }) => (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-50/50">
        <AppSidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="h-4 w-[1px] bg-slate-200 mx-2 hidden md:block" />
            <span className="font-bold text-emerald-600 tracking-tight">
              Maliyyah Ecosystem
            </span>
          </header>
          <div className="flex-1 overflow-y-auto p-4 md:p-8">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );

  return (
    <BrowserRouter>
      {/* Notifikasi Pop-up */}
      <Toaster position="top-center" richColors closeButton />

      <Routes>
        {/* --- LALUAN AWAM (TIADA SIDEBAR) --- */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUp />} />

        {/* --- LALUAN TERBUKA (DASHBOARD & HISTORY) --- */}
        <Route
          path="/"
          element={
            <LayoutWrapper>
              <Dashboard />
            </LayoutWrapper>
          }
        />
        <Route
          path="/history"
          element={
            <LayoutWrapper>
              <History />
            </LayoutWrapper>
          }
        />

        {/* --- LALUAN DILINDUNGI (MESTI LOGIN UNTUK AKSES) --- */}
        <Route
          path="/zakat"
          element={
            <ProtectedRoute>
              <LayoutWrapper>
                <Zakat />
              </LayoutWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <LayoutWrapper>
                <Profile />
              </LayoutWrapper>
            </ProtectedRoute>
          }
        />

        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
