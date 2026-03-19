import React, { useState } from "react";
import { useZakat } from "@/components/Context/ZakatContext";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Loader2, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useZakat();
  const navigate = useNavigate();

  const handleDemoLogin = () => {
    // Gantikan dengan username & password akaun yang sudah wujud dalam DB anda
    setUsername("pelawat");
    setPassword("password123");

    // Beri masa 100ms untuk state dikemaskini sebelum tekan login automatik
    // Beri masa 100ms untuk state dikemaskini sebelum tekan login automatik
    setTimeout(() => {
      // Pastikan butang LOG MASUK anda ada id="login-submit-btn"
      // atau gunakan querySelector ini:
      const loginButton = document.querySelector('button[type="submit"]');
      if (loginButton) (loginButton as HTMLButtonElement).click();
    }, 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error("Sila masukkan nama pengguna dan kata laluan.");
      return;
    }

    setIsLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL; // || "http://127.0.0.1:8000";

      const res = await fetch(`${apiUrl}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim().toLowerCase(),
          password: password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.access_token) {
          localStorage.setItem("maliyyah_token", data.access_token);
        }

        localStorage.setItem(
          "maliyyah_user",
          JSON.stringify({
            username: data.user.name,
            email: data.user.email,
            location: data.user.location,
            occupation: data.user.occupation,
          }),
        );

        login({
          name: data.user.name,
          occupation: data.user.occupation,
          location: data.user.location,
          email: data.user.email,
          birthYear: data.user.birth_year,
          monthlyIncome: data.user.zakat_pendapatan || 0,
          zakat_kripto: data.user.zakat_kripto || 0,
          zakat_harta: data.user.zakat_harta || 0,
          zakat_logam: data.user.zakat_logam || 0,
        });

        toast.success(`Selamat kembali, ${data.user.name}!`);
        navigate("/");
      } else {
        toast.error(data.detail || "Log masuk gagal. Sila cuba lagi.");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Gagal menyambung ke pelayan. Sila pastikan Backend aktif.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl border-none ring-1 ring-slate-200 bg-white">
          <CardHeader className="space-y-1 pb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
              <Lock className="h-6 w-6 text-emerald-600" />
            </div>
            <CardTitle className="text-3xl font-black tracking-tight text-emerald-600">
              MALIYYAH<span className="text-slate-900">.</span>
            </CardTitle>
            <p className="text-sm text-slate-500 font-medium">
              Sila log masuk ke akaun anda
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <User className="h-4 w-4 text-slate-400" /> Nama Pengguna
                </label>
                <Input
                  placeholder="amir_dev"
                  disabled={isLoading}
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-11 focus-visible:ring-emerald-500 transition-all border-slate-200"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Lock className="h-4 w-4 text-slate-400" /> Kata Laluan
                  </label>
                  {/* PAUTAN LUPA KATA LALUAN DI ATAS INPUT (GAYA MODEN) */}
                  <Link
                    to="/forgot-password"
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    Lupa Kata Laluan?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    disabled={isLoading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 focus-visible:ring-emerald-500 transition-all border-slate-200 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-lg shadow-emerald-200 transition-all active:scale-[0.98] mt-2"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <span className="flex items-center gap-2">
                    LOG MASUK <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
              <button
                type="button"
                onClick={handleDemoLogin}
                style={{
                  marginTop: "10px",
                  backgroundColor: "#6c757d", // Warna kelabu (secondary)
                  color: "white",
                  padding: "10px",
                  borderRadius: "5px",
                  width: "100%",
                  cursor: "pointer",
                  border: "none",
                }}
              >
                ✨ Cuba Akaun Demo (Cepat)
              </button>
            </form>

            <div className="mt-8 text-center border-t pt-6">
              <p className="text-sm text-slate-600">
                Belum mempunyai akaun?{" "}
                <Link
                  to="/signup"
                  className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors"
                >
                  Daftar di sini
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <p className="mt-8 text-center text-xs text-slate-400 uppercase tracking-widest font-semibold">
          © 2026 Maliyyah Digital Ecosystem
        </p>
      </motion.div>
    </div>
  );
}
