import React from "react";
import { useZakat } from "@/components/Context/ZakatContext";
import {
  Briefcase,
  TrendingUp,
  Wallet,
  Coins,
  Clock,
  FileText,
  ChevronRight,
} from "lucide-react";

export default function Dashboard() {
  // --- FIX: Gunakan 'as any' supaya TypeScript tidak bising tentang recentHistory ---
  const { zakatResults, recentHistory = [] } = useZakat() as any;

  // 1. Banner Hijau: Hasil pengiraan SEKARANG dari kalkulator
  const totalSemasa = zakatResults?.total_zakat || 0;

  // 2. Kad Statistik: Pecahan dari kalkulator
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
    <div className="p-6 space-y-8 bg-slate-50 min-h-screen text-slate-900 font-sans">
      {/* BANNER HIJAU: HANYA HASIL SEKARANG */}
      <div className="relative bg-[#006837] rounded-[40px] p-10 text-white overflow-hidden shadow-2xl transition-all hover:shadow-emerald-900/20">
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

          <button className="mt-8 bg-white text-[#006837] px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-slate-100 transition-all shadow-lg active:scale-95">
            BAYAR SEKARANG <ChevronRight size={18} />
          </button>
        </div>

        {/* Ikon Wallet besar di belakang */}
        <Wallet className="absolute right-[-20px] bottom-[-20px] size-64 opacity-10 rotate-12 pointer-events-none" />
      </div>

      {/* KAD STATISTIK: HASIL DARI KALKULATOR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between hover:border-emerald-200 transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {stat.title}
              </p>
              <div
                className={`${stat.bg} ${stat.color} p-2.5 rounded-2xl group-hover:scale-110 transition-transform`}
              >
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

      {/* AKTIVITI TERKINI: SEJARAH DARI DATABASE */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white">
            <h3 className="font-bold flex items-center gap-2 text-slate-700">
              <Clock size={18} className="text-emerald-500" /> Aktiviti Terkini
            </h3>
            <span className="text-[10px] bg-slate-100 px-3 py-1 rounded-full font-bold text-slate-500 uppercase">
              Sejarah Pembayaran
            </span>
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
                {recentHistory && recentHistory.length > 0 ? (
                  recentHistory.slice(0, 5).map((item: any, i: number) => (
                    <tr
                      key={i}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {new Date(
                          item.created_at || Date.now(),
                        ).toLocaleDateString("ms-MY")}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[9px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md font-black uppercase mb-1 inline-block">
                          {item.kategori || "UMUM"}
                        </span>
                        <p className="font-bold text-slate-800">
                          RM {Number(item.total_zakat || item.amaun).toFixed(2)}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-blue-500 hover:text-blue-700 font-bold text-xs inline-flex items-center gap-1 group-hover:underline">
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
                      Tiada rekod sejarah ditemui dalam sistem.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* DIDIK ZAKAT CARD */}
        <div className="bg-emerald-50 rounded-[32px] p-8 border border-emerald-100 flex flex-col justify-between relative overflow-hidden group">
          <div className="relative z-10">
            <div className="bg-emerald-500 size-12 rounded-2xl flex items-center justify-center text-white mb-6 shadow-xl shadow-emerald-200 group-hover:rotate-6 transition-transform">
              <Briefcase size={24} />
            </div>
            <h3 className="font-bold text-emerald-900 text-xl mb-3">
              Didik Zakat
            </h3>
            <p className="text-emerald-700 leading-relaxed italic text-sm">
              "Zakat bukan sekadar kewajipan, tetapi ia berfungsi menyucikan
              harta dan jiwa serta membantu mengimbangkan ekonomi ummah."
            </p>
          </div>
          <div className="mt-8 pt-6 border-t border-emerald-200/50 flex items-center justify-between text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
            <span>Pejabat Zakat Malaysia</span>
            <Clock size={14} />
          </div>
          {/* Hiasan latar belakang */}
          <div className="absolute -right-4 -top-4 size-24 bg-emerald-200/20 rounded-full blur-2xl" />
        </div>
      </div>
    </div>
  );
}
