import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, KeyRound, ArrowLeft, Eye, EyeOff } from "lucide-react";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // State untuk tunjuk/sembunyi kata laluan
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    location: "",
    new_password: "",
    confirm_password: "",
  });

  const sabahDistricts = [
    "Kota Kinabalu",
    "Penampang",
    "Putatan",
    "Lahad Datu",
    "Sandakan",
    "Tawau",
  ];

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.new_password !== formData.confirm_password) {
      toast.error("Kata laluan tidak padan!");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username.toLowerCase(),
          location: formData.location,
          new_password: formData.new_password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Kata laluan berjaya dikemaskini!");
        navigate("/login");
      } else {
        toast.error(data.detail || "Maklumat pengesahan salah.");
      }
    } catch (err) {
      toast.error("Ralat sambungan ke pelayan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-2xl border-none">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
            <KeyRound className="h-6 w-6 text-orange-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-emerald-600">
            Lupa Kata Laluan?
          </CardTitle>
          <CardDescription>
            Sila masukkan username dan daerah anda untuk set semula kata laluan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleReset} className="space-y-4">
            <div className="space-y-1">
              <Label>Nama Pengguna</Label>
              <Input
                placeholder="cth: amir_dev"
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-1">
              <Label>Daerah Pendaftaran (Soalan Keselamatan)</Label>
              <Select
                onValueChange={(val) =>
                  setFormData({ ...formData, location: val })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih daerah anda" />
                </SelectTrigger>
                <SelectContent>
                  {sabahDistricts.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <hr className="my-4" />

            <div className="space-y-1">
              <Label>Kata Laluan Baru</Label>
              <div className="relative">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  className="pr-10"
                  onChange={(e) =>
                    setFormData({ ...formData, new_password: e.target.value })
                  }
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <Label>Sahkan Kata Laluan</Label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  className="pr-10"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirm_password: e.target.value,
                    })
                  }
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 py-6 font-bold"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "KEMASKINI SEKARANG"
              )}
            </Button>

            <Link
              to="/login"
              className="flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-emerald-600 transition-colors"
            >
              <ArrowLeft size={16} /> Kembali ke Log Masuk
            </Link>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
