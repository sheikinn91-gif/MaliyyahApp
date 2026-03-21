import React, { useEffect, useState } from "react";
import { useZakat } from "@/components/Context/ZakatContext";
import {
  Briefcase,
  TrendingUp,
  Wallet,
  Coins,
  Clock,
  FileText,
  ChevronRight,
  RotateCcw,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

export default function Dashboard() {
  const { zakatResults } = useZakat() as any;
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. FUNGSI AMBIL DATA DARI DATABASE (Aktiviti Terkini)
  const fetchHistory = async () => {
    setLoading(true);
    const token = localStorage.getItem("maliyyah_token");
    const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

    try {
      const response = await fetch(`${apiUrl}/api/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error("Gagal ambil sejarah:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // 2. FUNGSI RESET DATA (Frontend Sahaja)
  const handleReset = async () => {
    if (!confirm("Padam semua sejarah aktiviti?")) return;

    try {
      // Logik Automatik:
      // Jika buka di Vercel, ia guna URL Render. Jika buka di Laptop, ia guna Localhost.
      const isProduction = window.location.hostname !== "localhost";
      const API_URL = isProduction
        ? "https://maliyyahapp-1.onrender.com/api/history" // GANTI URL RENDER ANDA DI SINI
        : "http://127.0.0.1:8000/api/history";

      const response = await fetch(API_URL, {
        method: "DELETE",
      });

      if (response.ok) {
        setHistory([]); // Buang senarai di skrin serta-merta
        toast.success("Rekod berjaya dipadam.");

        // Cara lama yang anda suka - kita kekalkan untuk 'refresh' total zakat
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    } catch (error) {
      console.error(error);
      toast.error("Gagal reset. Pastikan server Backend anda aktif.");
    }
  };
  // 3. FUNGSI DOWNLOAD PDF (Placeholder)
  const downloadPDF = (id: string) => {
    toast.info("Menjana PDF... Sila tunggu.");
    // Logik window.open(apiUrl + `/api/generate-pdf/${id}`) biasanya di sini
  };

  const totalSemasa = zakatResults?.total_zakat || 0;

  const stats = [
    {
      title: "Zakat Pendapatan",
      amount: zakatResults?.pendapatan || 0,
      icon: Briefcase,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Zakat Kripto",
      amount: zakatResults?.kripto || 0,
      icon: TrendingUp,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Zakat Harta",
      amount: zakatResults?.harta || 0,
      icon: Wallet,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      title: "Zakat Logam/Emas",
      amount: zakatResults?.logam || 0,
      icon: Coins,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
  ];

  return (
    <div className="p-6 space-y-8 bg-slate-50 min-h-screen text-slate-900">
      {/* BANNER HIJAU */}
      <div className="relative bg-[#006837] rounded-[40px] p-10 text-white overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <p className="text-sm font-bold opacity-80 uppercase tracking-widest mb-2">
            Ringkasan Kewajipan Semasa
          </p>
          <h2 className="text-2xl font-medium mb-1 tracking-tight">
            Jumlah Zakat Perlu Dibayar
          </h2>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-light">RM</span>
            <span className="text-7xl font-black tracking-tighter">
              {totalSemasa.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
          <button className="mt-8 bg-white text-[#006837] px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-slate-100 shadow-lg active:scale-95 transition-all">
            BAYAR SEKARANG <ChevronRight size={18} />
          </button>
        </div>
        <Wallet className="absolute right-[-20px] bottom-[-20px] size-64 opacity-10 rotate-12" />
      </div>

      {/* KAD STATISTIK */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between hover:border-emerald-200 transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <p className="text-xs font-bold text-slate-400 uppercase">
                {stat.title}
              </p>
              <div className={`${stat.bg} ${stat.color} p-2.5 rounded-2xl`}>
                <stat.icon size={20} />
              </div>
            </div>
            <h3 className="text-2xl font-black text-slate-800">
              RM{" "}
              {stat.amount.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </h3>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* AKTIVITI TERKINI */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h3 className="font-bold flex items-center gap-2 text-slate-700">
              <Clock size={18} className="text-emerald-500" /> Aktiviti Terkini
            </h3>
            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="text-[10px] flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full font-bold text-slate-500 transition-colors"
              >
                <RotateCcw size={12} /> RESET DATA
              </button>
              <button
                onClick={fetchHistory}
                className="p-1.5 bg-emerald-50 text-emerald-600 rounded-full hover:bg-emerald-100 transition-colors"
              >
                <RefreshCw
                  size={14}
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
                  <th className="px-6 py-4">Butiran Zakat</th>
                  <th className="px-6 py-4 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {history.length > 0 ? (
                  history.slice(0, 5).map((item: any, i: number) => (
                    <tr
                      key={i}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {new Date(item.created_at).toLocaleDateString("ms-MY")}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[9px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md font-black uppercase mb-1 inline-block">
                          JUMLAH ZAKAT
                        </span>
                        <p className="font-bold text-slate-800">
                          RM{" "}
                          {Number(item.total_zakat).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => downloadPDF(item.id)}
                          className="text-blue-500 hover:text-blue-700 font-bold text-xs inline-flex items-center gap-1"
                        >
                          <FileText size={14} /> PDF
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-12 text-center text-slate-400 text-sm italic"
                    >
                      Tiada rekod ditemui. Tekan "Tunaikan" di kalkulator untuk
                      menyimpan rekod.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* DIDIK ZAKAT - WIDGET BERFUNGSI */}
        <div className="bg-emerald-50 rounded-[32px] p-8 border border-emerald-100 flex flex-col justify-between relative overflow-hidden group">
          <div className="relative z-10">
            <div className="bg-emerald-500 size-12 rounded-2xl flex items-center justify-center text-white mb-6 shadow-xl shadow-emerald-200 transition-transform group-hover:scale-110">
              <Briefcase size={24} />
            </div>
            <h3 className="font-bold text-emerald-900 text-xl mb-3">
              Didik Zakat
            </h3>
            <p className="text-emerald-700 leading-relaxed italic text-sm">
              "Zakat bukan sekadar kewajipan, ia menyucikan harta serta membantu
              mengimbangkan ekonomi ummah."
            </p>
            <div className="mt-4 p-3 bg-white/50 rounded-xl border border-emerald-200/50 text-[11px] text-emerald-800 font-medium">
              💡 **Tips:** Zakat Kripto dikira 2.5% jika nilai melebihi Nisab
              (RM {totalSemasa > 0 ? "85g Emas" : "..."}).
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-emerald-200/50 flex items-center justify-between text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
            <span>Pejabat Zakat Malaysia</span>
            <Clock size={14} />
          </div>
        </div>
      </div>
    </div>
  );
}
