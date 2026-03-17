import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useZakat } from "@/components/Context/ZakatContext";
import { toast } from "sonner";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { userEmail } = useZakat();
  const location = useLocation();
  const token = localStorage.getItem("maliyyah_token");

  // Logik: Tunjukkan notifikasi jika pengguna cuba akses halaman terkunci tanpa login
  useEffect(() => {
    if (!userEmail && !token) {
      toast.info("Akses Terhad", {
        description:
          "Sila log masuk terlebih dahulu untuk menggunakan kalkulator zakat.",
        duration: 4000,
      });
    }
  }, [userEmail, token]);

  // Jika tiada emel dalam context DAN tiada token dalam storage, baru redirect ke login
  if (!userEmail && !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
