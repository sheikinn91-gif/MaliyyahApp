import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Banknote,
  Clock,
  RotateCcw,
  RefreshCw,
  FileText,
  CheckCircle,
  MapPin,
  BookOpen,
  GraduationCap,
  TrendingUp,
  Wallet,
  Landmark,
  Heart,
} from "lucide-react";

export default function MaliyyahDashboard() {
  const [salary, setSalary] = useState<number>(0);
  const [history, setHistory] = useState<any[]>([
    { id: "TX-9901", created_at: "2026-03-21", total_zakat: 1586.88 },
  ]);
  const [loading, setLoading] = useState(false);

  // 1. FUNGSI UTAMA (RESET & CALCULATE)
  const handleReset = () => {
    setSalary(0);
    console.log("Dashboard direset.");
  };

  const calculateZakat = () => salary * 0.025;

  const fetchHistory = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  };

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] p-4 md:p-8 text-slate-900">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              Maliyyah Ecosystem
            </h1>
            <p className="text-slate-500 text-sm">
              Urusan Zakat & Kewangan Islamik Anda
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <MapPin size={18} />
            </div>
            <div className="pr-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase">
                Lokasi Semasa
              </p>
              <p className="text-xs font-bold text-slate-700">
                Lahad Datu, Sabah
              </p>
            </div>
          </div>
        </div>

        {/* TOP ROW: INPUT & CALCULATOR BANNER */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* INPUT GAJI */}
          <Card className="rounded-[2.5rem] shadow-sm border-none bg-white">
            <div className="p-6 border-b border-slate-50 flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-xl text-white">
                <Banknote size={20} />
              </div>
              <h3 className="font-bold">Pendapatan Bulanan</h3>
            </div>
            <CardContent className="p-8 space-y-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Gaji Hakiki (RM)
              </p>
              <input
                type="number"
                value={salary || ""}
                placeholder="0.00"
                className="w-full p-5 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-500 outline-none transition-all font-bold text-2xl"
                onChange={(e) => setSalary(Number(e.target.value))}
              />
            </CardContent>
          </Card>

          {/* BANNER HIJAU (TOTAL ZAKAT) */}
          <Card className="lg:col-span-2 border-4 border-dashed border-green-200 bg-green-50/50 rounded-[3rem] p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 text-green-600">
              <TrendingUp size={120} />
            </div>
            <p className="text-xs font-black text-green-700 uppercase tracking-[0.4em] mb-4">
              Total Zakat Wajib (2.5%)
            </p>
            <h2 className="text-6xl font-black text-green-600 mb-8 tracking-tighter">
              RM{" "}
              {calculateZakat().toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </h2>
            <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full px-12 py-8 text-xl font-black shadow-2xl flex items-center gap-3 transition-transform active:scale-95">
              <CheckCircle size={24} /> Tunaikan & Simpan
            </Button>
          </Card>
        </div>

        {/* MIDDLE ROW: KAD-KAD ZAKAT LAIN */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              title: "Zakat Simpanan",
              icon: <Wallet size={18} />,
              color: "bg-orange-500",
            },
            {
              title: "Zakat Emas",
              icon: <TrendingUp size={18} />,
              color: "bg-yellow-500",
            },
            {
              title: "Zakat KWSP",
              icon: <Landmark size={18} />,
              color: "bg-purple-500",
            },
            {
              title: "Zakat Fitrah",
              icon: <Heart size={18} />,
              color: "bg-pink-500",
            },
          ].map((z, idx) => (
            <Card
              key={idx}
              className="rounded-3xl border-none shadow-sm p-5 flex items-center gap-4 bg-white hover:shadow-md transition-shadow cursor-pointer"
            >
              <div
                className={`p-3 ${z.color} text-white rounded-2xl shadow-lg`}
              >
                {z.icon}
              </div>
              <p className="font-bold text-slate-700 text-sm">{z.title}</p>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AKTIVITI TERKINI */}
          <div className="lg:col-span-2 bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
              <h3 className="font-bold flex items-center gap-2 text-slate-700">
                <Clock size={18} className="text-emerald-500" /> Aktiviti
                Terkini
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={handleReset}
                  className="text-[10px] bg-slate-100 px-4 py-2 rounded-full font-bold text-slate-500 flex items-center gap-1 hover:bg-slate-200"
                >
                  <RotateCcw size={12} /> RESET
                </button>
                <button
                  onClick={fetchHistory}
                  className="p-2 bg-emerald-50 text-emerald-600 rounded-full hover:bg-emerald-100"
                >
                  <RefreshCw
                    size={16}
                    className={loading ? "animate-spin" : ""}
                  />
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 tracking-widest border-b">
                    <th className="px-6 py-4">Tarikh</th>
                    <th className="px-6 py-4">Jumlah</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {history.map((item, i) => (
                    <tr
                      key={i}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {item.created_at}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-800">
                        RM {item.total_zakat.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            const win = window.open("", "_blank");
                            if (win) {
                              win.document.write(`
                                <html>
                                  <body style="padding:50px; font-family:sans-serif;">
                                    <div style="border:2px solid #10b981; padding:30px; border-radius:20px; max-width:500px; margin:auto;">
                                      <h1 style="color:#10b981;">Maliyyah Zakat</h1>
                                      <hr/><p><strong>Tarikh:</strong> ${item.created_at}</p>
                                      <p style="font-size:24px;"><strong>Jumlah: RM ${item.total_zakat.toLocaleString()}</strong></p>
                                      <script>window.onload = function() { window.print(); window.close(); };</script>
                                    </div>
                                  </body>
                                </html>
                              `);
                              win.document.close();
                            }
                          }}
                          className="text-blue-500 hover:text-blue-700 font-bold text-xs inline-flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg"
                        >
                          <FileText size={14} /> PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* WIDGET DIDIK ZAKAT */}
          <div className="space-y-6">
            <Card className="rounded-[2.5rem] border-none shadow-sm bg-gradient-to-br from-indigo-600 to-blue-700 text-white p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-white/20 rounded-xl">
                  <BookOpen size={20} />
                </div>
                <h3 className="font-bold">Didik Zakat</h3>
              </div>
              <div className="space-y-4">
                <div className="bg-white/10 p-4 rounded-2xl">
                  <p className="text-xs font-bold opacity-80 mb-1">
                    Info Hari Ini
                  </p>
                  <p className="text-sm font-medium">
                    Zakat pendapatan wajib ditunaikan apabila mencapai nisab
                    setahun.
                  </p>
                </div>
                <Button className="w-full bg-white text-blue-700 hover:bg-slate-100 rounded-2xl py-6 font-black shadow-lg">
                  <GraduationCap className="mr-2" size={18} /> Mula Belajar
                </Button>
              </div>
            </Card>

            <Card className="rounded-[2.5rem] border-none shadow-sm bg-white p-6">
              <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                <MapPin size={16} className="text-emerald-500" /> Lokasi Pusat
                Zakat
              </h4>
              <div className="bg-slate-100 h-32 rounded-3xl flex items-center justify-center text-slate-400 text-xs font-bold italic">
                Peta Lokasi Terdekat...
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
