import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Clock,
  RotateCcw,
  FileText,
  Wallet,
  Coins,
  Briefcase,
  History,
  Lightbulb,
  TrendingUp,
  CreditCard,
  ExternalLink,
} from "lucide-react";

export default function MaliyyahDashboard() {
  // 1. STATE BERMULA DENGAN 0 - UNTUK PAPARAN RM 0.00 BILA LOGIN
  const [totalZakat, setTotalZakat] = useState<number>(0);
  const [zakatPendapatan, setZakatPendapatan] = useState<number>(0);
  const [zakatKripto, setZakatKripto] = useState<number>(0);
  const [zakatHarta, setZakatHarta] = useState<number>(0);
  const [zakatEmas, setZakatEmas] = useState<number>(0);

  // 2. FIX RALAT 'NEVER' - Beritahu TypeScript ini adalah array objek
  const [history, setHistory] = useState<any[]>([]);

  // 2. LOGIK PENARIKAN DATA AUTOMATIK
  // Fungsi ini akan "tarik" nilai setiap kali dashboard dibuka
  useEffect(() => {
    const savedData = localStorage.getItem("maliyyah_zakat");
    if (savedData) {
      const data = JSON.parse(savedData);
      setTotalZakat(data.total || 0);
      setZakatPendapatan(data.pendapatan || 0);
      setZakatKripto(data.kripto || 0);
      setZakatHarta(data.harta || 0);
      setZakatEmas(data.emas || 0);
    }
  }, []); // Berjalan sekali setiap kali dashboard muncul

  // 3. FUNGSI RESET YANG AKAN MEMAKSA SEMUA JADI 0
  const handleResetData = () => {
    if (window.confirm("TOTALLY RESET SEMUA DATA?")) {
      setTotalZakat(0);
      setZakatPendapatan(0);
      setZakatKripto(0);
      setZakatHarta(0);
      setZakatEmas(0);
      setHistory([]);
      localStorage.removeItem("maliyyah_zakat"); // Padam memori kalkulator
      alert("Reset Berjaya!");
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#f4f7f6] p-4 md:p-6 text-slate-800">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* BANNER HIJAU (EMERALD) */}
        <div className="bg-[#006747] rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-2">
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter">
                RM{" "}
                {totalZakat.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </h1>
              <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
                Status:{" "}
                {totalZakat > 0 ? "Menunggu Pembayaran" : "Tiada Tunggakan"}{" "}
                <ExternalLink size={12} />
              </div>
            </div>
            <Button className="bg-white text-[#006747] hover:bg-slate-100 rounded-2xl px-8 py-7 font-black text-lg flex gap-3 uppercase">
              Bayar Sekarang <CreditCard size={20} />
            </Button>
          </div>
          <div className="absolute -right-10 -bottom-10 opacity-10">
            <TrendingUp size={250} />
          </div>
        </div>

        {/* 4 KAD ZAKAT (DYNAMIK) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "ZAKAT PENDAPATAN",
              val: zakatPendapatan,
              icon: <Wallet className="text-blue-600" />,
              bg: "bg-blue-50",
            },
            {
              label: "ZAKAT KRIPTO",
              val: zakatKripto,
              icon: <Coins className="text-purple-600" />,
              bg: "bg-purple-50",
            },
            {
              label: "ZAKAT HARTA",
              val: zakatHarta,
              icon: <Briefcase className="text-orange-600" />,
              bg: "bg-orange-50",
            },
            {
              label: "ZAKAT LOGAM/EMAS",
              val: zakatEmas,
              icon: <History className="text-yellow-600" />,
              bg: "bg-yellow-50",
            },
          ].map((item, i) => (
            <Card
              key={i}
              className="border-none shadow-sm rounded-[1.5rem] p-6 bg-white"
            >
              <div className="flex justify-between items-start mb-6">
                <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase">
                  {item.label}
                </span>
                <div className={`p-2 rounded-xl ${item.bg}`}>{item.icon}</div>
              </div>
              <h3 className="text-2xl font-black text-slate-800">
                RM{" "}
                {item.val.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </h3>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center px-2">
              <h3 className="font-bold flex items-center gap-2 text-slate-700">
                <Clock size={18} /> Aktiviti Terkini
              </h3>
              {/* BUTANG RESET DATA UTAMA */}
              <button
                onClick={handleResetData}
                className="text-[10px] font-black text-slate-400 hover:text-red-500 flex items-center gap-1 p-2 uppercase tracking-widest cursor-pointer"
              >
                <RotateCcw size={12} /> Reset Data
              </button>
            </div>

            <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 overflow-hidden min-h-[300px]">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 border-b uppercase tracking-widest">
                    <th className="px-6 py-5">Tarikh</th>
                    <th className="px-6 py-5">Butiran Zakat</th>
                    <th className="px-6 py-5 text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {history.length > 0 ? (
                    history.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/30">
                        <td className="px-6 py-4 text-sm text-slate-500 italic">
                          {row.tarikh}
                        </td>
                        <td className="px-6 py-4 font-black text-slate-800">
                          RM {row.jumlah.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => window.print()}
                            className="text-blue-500 font-black text-[10px] bg-blue-50 px-3 py-1.5 rounded-lg uppercase tracking-widest"
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
                        className="px-6 py-20 text-center text-slate-300 italic text-sm"
                      >
                        Belum ada rekod (Totally Clean).
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="rounded-[1.5rem] border-none shadow-sm bg-white p-6">
              <div className="flex items-center gap-2 text-emerald-600 font-bold mb-4">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <Lightbulb size={18} />
                </div>
                <h3>Didik Zakat</h3>
              </div>
              <p className="text-xs text-slate-500 italic">
                "Zakat menyucikan harta."
              </p>
            </Card>

            <Card className="rounded-[1.5rem] border-none shadow-sm bg-white p-6">
              <h3 className="text-[10px] font-black text-slate-400 tracking-widest uppercase mb-6">
                Market Pulse
              </h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-orange-50 text-orange-500 rounded-2xl font-black italic">
                    B
                  </div>
                  <p className="text-sm font-black text-slate-800">
                    Bitcoin (BTC)
                  </p>
                </div>
                <p className="text-sm font-black text-slate-800">
                  RM 278,742.88
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
