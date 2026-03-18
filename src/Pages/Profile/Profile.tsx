import React, { useState, useEffect } from "react";
import {
  User,
  MapPin,
  Briefcase,
  Calendar,
  Banknote,
  Save,
  Edit2,
  X,
  ShieldCheck,
  Mail,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useZakat } from "@/components/Context/ZakatContext";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function Profile() {
  const {
    userName,
    setUserName,
    userEmail,
    setUserEmail,
    location,
    setLocation,
    birthYear,
    setBirthYear,
    occupation,
    setOccupation,
    monthlyIncome,
    setMonthlyIncome,
  } = useZakat();

  const [isEditing, setIsEditing] = useState(false);

  // 1. Inisialisasi formData dengan SEMUA data dari Context
  const [formData, setFormData] = useState({
    name: userName,
    email: userEmail,
    location: location,
    birthYear: birthYear,
    occupation: occupation,
    income: monthlyIncome,
  });

  // 2. Sync semula borang jika data dalam Context berubah (cth: lepas login/refresh)
  useEffect(() => {
    setFormData({
      name: userName,
      email: userEmail,
      location: location,
      birthYear: birthYear,
      occupation: occupation,
      income: monthlyIncome,
    });
  }, [userName, userEmail, location, birthYear, occupation, monthlyIncome]);

  const handleSave = () => {
    // 3. Simpan ke Global Context
    setUserName(formData.name);
    setUserEmail(formData.email);
    setLocation(formData.location);
    setBirthYear(formData.birthYear);
    setOccupation(formData.occupation);
    setMonthlyIncome(Number(formData.income));

    // 4. Simpan ke LocalStorage supaya data kekal abadi
    localStorage.setItem(
      "maliyyah_user",
      JSON.stringify({
        name: formData.name,
        email: formData.email,
        location: formData.location,
        occupation: formData.occupation,
        birthYear: formData.birthYear,
        monthlyIncome: Number(formData.income),
      }),
    );

    setIsEditing(false);
    toast.success("Profil Berjaya Dikemaskini!", {
      description: "Data anda kini selaras dalam sistem Maliyyah.",
    });
  };

  const handleCancel = () => {
    setFormData({
      name: userName,
      email: userEmail,
      location: location,
      birthYear: birthYear,
      occupation: occupation,
      income: monthlyIncome,
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-emerald-600 tracking-tight uppercase italic">
            PROFIL PENGGUNA
          </h1>
          <p className="text-slate-500 font-medium">
            Urus maklumat peribadi dan kewangan anda.
          </p>
        </div>
        <Button
          variant={isEditing ? "destructive" : "outline"}
          onClick={isEditing ? handleCancel : () => setIsEditing(true)}
          className="rounded-xl font-bold transition-all active:scale-95 shadow-sm"
        >
          {isEditing ? (
            <>
              <X className="h-4 w-4 mr-2" /> Batal
            </>
          ) : (
            <>
              <Edit2 className="h-4 w-4 mr-2" /> Edit Profil
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-none shadow-xl ring-1 ring-slate-200 rounded-3xl overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
            <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-800">
              <ShieldCheck className="text-emerald-600 h-5 w-5" /> Maklumat
              Peribadi
            </CardTitle>
          </CardHeader>

          <CardContent className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Ruangan Emel */}
              <div className="space-y-2 md:col-span-2">
                <Label className="text-slate-600 font-bold flex items-center gap-2">
                  <Mail className="h-4 w-4 text-emerald-600" /> Alamat Emel
                </Label>
                <Input
                  disabled={!isEditing}
                  value={formData.email || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="emel@contoh.com"
                  className={`rounded-xl h-11 transition-all ${!isEditing ? "bg-slate-50 cursor-not-allowed" : "bg-white border-emerald-200"}`}
                />
              </div>

              {/* Ruangan Nama */}
              <div className="space-y-2">
                <Label className="text-slate-600 font-bold">Nama Penuh</Label>
                <Input
                  disabled={!isEditing}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="rounded-xl h-11"
                />
              </div>

              {/* Ruangan Daerah/Lokasi */}
              <div className="space-y-2">
                <Label className="text-slate-600 font-bold">
                  Daerah / Negeri
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <Input
                    disabled={!isEditing}
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="pl-10 rounded-xl h-11"
                  />
                </div>
              </div>

              {/* Ruangan Pekerjaan */}
              <div className="space-y-2">
                <Label className="text-slate-600 font-bold text-sm">
                  Pekerjaan
                </Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <Input
                    disabled={!isEditing}
                    value={formData.occupation}
                    onChange={(e) =>
                      setFormData({ ...formData, occupation: e.target.value })
                    }
                    className="pl-10 rounded-xl h-11"
                  />
                </div>
              </div>

              {/* Ruangan Tahun Lahir */}
              <div className="space-y-2">
                <Label className="text-slate-600 font-bold text-sm">
                  Tahun Lahir
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <Input
                    type="number"
                    disabled={!isEditing}
                    value={formData.birthYear}
                    onChange={(e) =>
                      setFormData({ ...formData, birthYear: e.target.value })
                    }
                    className="pl-10 rounded-xl h-11"
                  />
                </div>
              </div>

              {/* Ruangan Pendapatan (Kini dipaparkan semula) */}
              <div className="space-y-2 md:col-span-2">
                <Label className="text-slate-600 font-bold">
                  Pendapatan Bulanan (RM)
                </Label>
                <div className="relative">
                  <Banknote className="absolute left-3 top-3 h-5 w-5 text-emerald-600" />
                  <Input
                    type="number"
                    disabled={!isEditing}
                    value={formData.income}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        income: Number(e.target.value),
                      })
                    }
                    className="pl-10 rounded-xl h-11 font-black text-emerald-700 text-lg border-emerald-100"
                  />
                </div>
              </div>
            </div>

            <AnimatePresence>
              {isEditing && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  <Button
                    onClick={handleSave}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 rounded-xl font-bold shadow-lg shadow-emerald-100 mt-4 transition-all"
                  >
                    <Save className="h-5 w-5 mr-2" /> SIMPAN SEMUA PERUBAHAN
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Sidebar Status */}
        <div className="space-y-6 h-fit">
          <Card className="border-none shadow-lg bg-emerald-600 text-white rounded-3xl overflow-hidden">
            <CardContent className="p-6 space-y-4">
              <div className="bg-white/20 p-3 rounded-2xl w-fit">
                <User className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-black text-xl italic uppercase tracking-wider">
                Status Profil
              </h3>
              <p className="text-emerald-50 text-sm leading-relaxed">
                Maklumat anda digunakan untuk menentukan Nisab berdasarkan
                kawasan <strong>{location || "anda"}</strong>.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
