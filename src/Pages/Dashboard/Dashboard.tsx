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
  ChevronRight,
} from "lucide-react";

export default function MaliyyahDashboard() {
  const [history, setHistory] = useState([
    { tarikh: "21/3/2026", butiran: "PENDAPATAN", jumlah: "11,603.75" },
    { tarikh: "21/3/2026", butiran: "PENDAPATAN", jumlah: "5,040.00" },
    { tarikh: "21/3/2026", butiran: "PENDAPATAN", jumlah: "0.00" },
    { tarikh: "21/3/2026", butiran: "PENDAPATAN", jumlah: "0.00" },
    { tarikh: "21/3/2026", butiran: "PENDAPATAN", jumlah: "0.00" },
  ]);

  const handleReset = () => {
    if (window.confirm("Adakah anda pasti untuk reset semua data aktiviti?")) {
      setHistory([]); // Ini akan mengosongkan jadual Aktiviti Terkini
      console.log("Data Berjaya Direset!");
      alert("Data Aktiviti Telah Direset.");
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#f4f7f6] p-4 md:p-6 text-slate-800 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* BANNER HIJAU GERGASI */}
        <div className="bg-[#006747] rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter">
                RM 11,603.75
              </h1>
              <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase">
                Status: Menunggu Pembayaran <ExternalLink size={12} />
              </div>
            </div>
            <Button className="bg-white text-[#006747] hover:bg-slate-100 rounded-2xl px-8 py-7 font-black text-lg flex gap-3 shadow-xl uppercase">
              Bayar Sekarang <CreditCard size={20} />
            </Button>
          </div>
          {/* Watermark Logo Background */}
          <div className="absolute -right-10 -bottom-10 opacity-10">
            <TrendingUp size={250} />
          </div>
        </div>

        {/* 4 KAD ZAKAT (PENDAPATAN, KRIPTO, HARTA, EMAS) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "ZAKAT PENDAPATAN",
              val: "420.00",
              icon: <Wallet className="text-blue-600" />,
              bg: "bg-blue-50",
            },
            {
              label: "ZAKAT KRIPTO",
              val: "6,968.57",
              icon: <Coins className="text-purple-600" />,
              bg: "bg-purple-50",
            },
            {
              label: "ZAKAT HARTA",
              val: "3,000.00",
              icon: <Briefcase className="text-orange-600" />,
              bg: "bg-orange-50",
            },
            {
              label: "ZAKAT LOGAM/EMAS",
              val: "1,215.18",
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
                RM {item.val}
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
                onClick={handleReset}
                className="text-[10px] font-bold text-slate-400 flex items-center gap-1 hover:text-emerald-600 transition-colors uppercase tracking-widest"
              >
                <RotateCcw size={12} /> Reset Data
              </button>
            </div>

            <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b">
                    <th className="px-6 py-5">Tarikh</th>
                    <th className="px-6 py-5">Butiran Zakat</th>
                    <th className="px-6 py-5 text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {history.map((row, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50/30 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-slate-500 italic">
                        {row.tarikh}
                      </td>
                      <td className="px-6 py-4 text-[10px]">
                        <div className="font-black text-slate-400 uppercase tracking-tighter mb-1">
                          {row.butiran}
                        </div>
                        <div className="text-sm font-black text-slate-800">
                          RM {row.jumlah}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => window.print()}
                          className="inline-flex items-center gap-1 text-blue-500 hover:text-blue-700 font-black text-[10px] uppercase tracking-widest bg-blue-50 px-3 py-1.5 rounded-lg"
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

          {/* SIDEBAR WIDGETS */}
          <div className="space-y-6">
            {/* DIDIK ZAKAT */}
            <Card className="rounded-[1.5rem] border-none shadow-sm bg-white p-6 relative">
              <div className="flex items-center gap-2 text-emerald-600 font-bold mb-4">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <Lightbulb size={18} />
                </div>
                <h3>Didik Zakat</h3>
                <RotateCcw
                  size={14}
                  className="ml-auto text-slate-300 cursor-pointer"
                />
              </div>
              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-emerald-600 tracking-widest uppercase">
                  Zakat Logam (Emas)
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed italic">
                  "Emas yang tidak dipakai (disimpan) wajib dizakatkan jika
                  beratnya mencecah atau melebihi 85 gram."
                </p>
                <div className="pt-4 flex items-center text-[8px] font-bold text-slate-300 uppercase tracking-widest gap-2">
                  <History size={12} /> Sumber: Pejabat Zakat Malaysia
                </div>
              </div>
            </Card>

            {/* MARKET PULSE (BITCOIN) */}
            <Card className="rounded-[1.5rem] border-none shadow-sm bg-white p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[10px] font-black text-slate-400 tracking-widest uppercase">
                  Market Pulse
                </h3>
                <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-orange-50 text-orange-500 rounded-2xl font-black italic">
                    B
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-800">
                      Bitcoin (BTC)
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      Crypto Currency
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-slate-800">
                    RM 278,742.88
                  </p>
                  <p className="text-[10px] text-emerald-500 font-bold tracking-widest">
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
