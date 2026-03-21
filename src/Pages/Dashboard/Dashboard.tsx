import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
  // 1. DATA BERMULA DENGAN 0 - BERSIH & SUCI BILA LOG IN
  const [totalZakat, setTotalZakat] = useState(0);
  const [zakatPendapatan, setZakatPendapatan] = useState(0);
  const [zakatKripto, setZakatKripto] = useState(0);
  const [zakatHarta, setZakatHarta] = useState(0);
  const [zakatEmas, setZakatEmas] = useState(0);

  // Array sejarah kosong secara default
  const [history, setHistory] = useState<any[]>([]);

  // 2. FUNGSI TOTALLY RESET - TEKAN SAJA, SEMUA JADI 0 BALIK
  const handleResetAll = () => {
    if (
      window.confirm(
        "Adakah anda pasti untuk mengosongkan semua data dan kembali ke RM 0.00?",
      )
    ) {
      setTotalZakat(0);
      setZakatPendapatan(0);
      setZakatKripto(0);
      setZakatHarta(0);
      setZakatEmas(0);
      setHistory([]);
      alert("Semua data telah dikosongkan (Totally Reset).");
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#f4f7f6] p-4 md:p-6 text-slate-800 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* BANNER HIJAU (EMERALD) */}
        <div className="bg-[#006747] rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter">
                RM{" "}
                {totalZakat.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </h1>
              <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase">
                Status:{" "}
                {totalZakat > 0 ? "Menunggu Pembayaran" : "Tiada Tunggakan"}{" "}
                <ExternalLink size={12} />
              </div>
            </div>
            <Button className="bg-white text-[#006747] hover:bg-slate-100 rounded-2xl px-8 py-7 font-black text-lg flex gap-3 shadow-xl uppercase transition-transform active:scale-95">
              Bayar Sekarang <CreditCard size={20} />
            </Button>
          </div>
          <div className="absolute -right-10 -bottom-10 opacity-10">
            <TrendingUp size={250} />
          </div>
        </div>

        {/* 4 KAD ZAKAT (RM 0.00) */}
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
          {/* AKTIVITI TERKINI */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center px-2">
              <h3 className="font-bold flex items-center gap-2 text-slate-700">
                <Clock size={18} /> Aktiviti Terkini
              </h3>
              <button
                onClick={handleResetAll}
                className="text-[10px] font-black text-slate-400 hover:text-red-500 flex items-center gap-1 transition-all cursor-pointer uppercase tracking-widest p-2"
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
                        <td className="px-6 py-4 font-black">
                          RM {row.jumlah.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => window.print()}
                            className="text-blue-500 font-black text-[10px] bg-blue-50 px-3 py-1.5 rounded-lg"
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

          {/* SIDEBAR WIDGETS */}
          <div className="space-y-6">
            <Card className="rounded-[1.5rem] border-none shadow-sm bg-white p-6">
              <div className="flex items-center gap-2 text-emerald-600 font-bold mb-4">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <Lightbulb size={18} />
                </div>
                <h3>Didik Zakat</h3>
              </div>
              <p className="text-xs text-slate-500 italic">
                "Penyucian harta bermula dengan zakat yang tepat."
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
                  <div>
                    <p className="text-sm font-black text-slate-800">
                      Bitcoin (BTC)
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-slate-800">
                    RM 278,742.88
                  </p>
                  <p className="text-[10px] text-emerald-500 font-bold">
                    + 2.4%
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
