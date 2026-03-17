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
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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

  // State sementara untuk borang (Local state)
  const [formData, setFormData] = useState({
    name: userName,
    location: location,
    birthYear: birthYear,
    occupation: occupation,
    income: monthlyIncome,
  });

  // Pastikan borang dikemaskini jika data context berubah (cth: selepas login)
  useEffect(() => {
    setFormData({
      name: userName,
      location: location,
      birthYear: birthYear,
      occupation: occupation,
      income: monthlyIncome,
    });
  }, [userName, location, birthYear, occupation, monthlyIncome]);

  const handleSave = () => {
    // Simpan ke Global Context
    setUserName(formData.name);
    setLocation(formData.location);
    setBirthYear(formData.birthYear);
    setOccupation(formData.occupation);
    setMonthlyIncome(Number(formData.income));

    setIsEditing(false);
    toast.success("Profil berjaya dikemaskini!", {
      description: "Data anda telah diselaraskan dengan ekosistem Maliyyah.",
    });
  };

  const handleCancel = () => {
    // Reset semula borang mengikut data asal context
    setFormData({
      name: userName,
      location: location,
      birthYear: birthYear,
      occupation: occupation,
      income: monthlyIncome,
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight text-emerald-600 uppercase">
            PROFIL PENGGUNA
          </h1>
          <p className="text-slate-500 font-medium">
            Urus maklumat peribadi untuk ketepatan pengiraan zakat anda.
          </p>
        </div>
        <Button
          variant={isEditing ? "destructive" : "outline"}
          onClick={isEditing ? handleCancel : () => setIsEditing(true)}
          className="rounded-xl font-bold transition-all active:scale-95"
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
        {/* Card Utama */}
        <Card className="lg:col-span-2 border-none shadow-xl ring-1 ring-slate-200 rounded-3xl overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-emerald-600 h-5 w-5" />
              <CardTitle className="text-lg font-bold text-slate-800">
                Maklumat Asas
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nama */}
              <div className="space-y-2">
                <Label className="text-slate-600 font-bold">Nama Penuh</Label>
                <Input
                  disabled={!isEditing}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="rounded-xl border-slate-200 focus-visible:ring-emerald-500 h-11"
                />
              </div>

              {/* Tempat Tinggal */}
              <div className="space-y-2">
                <Label className="text-slate-600 font-bold">
                  Lokasi (Sabah)
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <Input
                    disabled={!isEditing}
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="pl-10 rounded-xl border-slate-200 focus-visible:ring-emerald-500 h-11"
                  />
                </div>
              </div>

              {/* Tahun Lahir */}
              <div className="space-y-2">
                <Label className="text-slate-600 font-bold">Tahun Lahir</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <Input
                    type="number"
                    disabled={!isEditing}
                    value={formData.birthYear}
                    onChange={(e) =>
                      setFormData({ ...formData, birthYear: e.target.value })
                    }
                    className="pl-10 rounded-xl border-slate-200 focus-visible:ring-emerald-500 h-11"
                  />
                </div>
              </div>

              {/* Pekerjaan */}
              <div className="space-y-2">
                <Label className="text-slate-600 font-bold">Pekerjaan</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <Input
                    disabled={!isEditing}
                    value={formData.occupation}
                    onChange={(e) =>
                      setFormData({ ...formData, occupation: e.target.value })
                    }
                    className="pl-10 rounded-xl border-slate-200 focus-visible:ring-emerald-500 h-11"
                  />
                </div>
              </div>

              {/* Pendapatan Bulanan */}
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
                    className="pl-10 rounded-xl border-slate-200 focus-visible:ring-emerald-500 h-11 font-black text-emerald-700 text-lg"
                  />
                </div>
              </div>
            </div>

            <AnimatePresence>
              {isEditing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Button
                    onClick={handleSave}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 rounded-xl font-bold shadow-lg shadow-emerald-100 transition-all active:scale-[0.98] mt-4"
                  >
                    <Save className="h-5 w-5 mr-2" /> SIMPAN PERUBAHAN
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Sidebar Info / Nota AI */}
        <div className="space-y-6">
          <Card className="border-none shadow-lg bg-emerald-600 text-white rounded-3xl">
            <CardContent className="p-6 space-y-4">
              <div className="bg-white/20 p-3 rounded-2xl w-fit">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-black text-xl uppercase italic">
                  Status Profil
                </h3>
                <p className="text-emerald-100 text-sm leading-relaxed mt-1">
                  Profil anda membantu sistem menentukan **Nisab** dan **Haul**
                  yang tepat berdasarkan lokasi anda di **{location}**.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-white rounded-3xl border border-slate-100">
            <CardContent className="p-6">
              <div className="flex gap-3">
                <div className="bg-amber-100 p-2 rounded-xl h-fit">
                  <ShieldCheck className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                    Nota AI Maliyyah
                  </p>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                    Sebagai seorang <strong>{occupation}</strong>, pengiraan
                    zakat anda akan difokuskan kepada
                    <strong> Zakat Al-Mal</strong> (Harta) dan{" "}
                    <strong>Zakat Pendapatan</strong>.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
