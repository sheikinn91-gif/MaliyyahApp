import React, { useState, useEffect } from "react";
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
  // 1. STATE UTAMA - Bermula dengan 0 untuk paparan RM 0.00 bila tiada data
  const [totalZakat, setTotalZakat] = useState<number>(0);
  const [zakatPendapatan, setZakatPendapatan] = useState<number>(0);
  const [zakatKripto, setZakatKripto] = useState<number>(0);
  const [zakatHarta, setZakatHarta] = useState<number>(0);
  const [zakatEmas, setZakatEmas] = useState<number>(0);

  // State untuk History/Aktiviti Terkini
  const [history, setHistory] = useState<any[]>([]);

  // 2. MAGNET PENARIK DATA (useEffect)
  // Fungsi ini akan menarik data dari Kalkulator secara automatik tanpa menjejaskan UI
  useEffect(() => {
    const dataMentah = localStorage.getItem("maliyyah_zakat_data");

    if (dataMentah) {
      const data = JSON.parse(dataMentah);

      // Mengemaskini Banner Hijau dan Kad Zakat dengan nilai sebenar
      setTotalZakat(data.total || 0);
      setZakatPendapatan(data.pendapatan || 0);
      setZakatKripto(data.kripto || 0);
      setZakatHarta(data.harta || 0);
      setZakatEmas(data.logam || 0); // Mengikut key 'logam' dari payload kalkulator

      // Masukkan ke dalam rekod Aktiviti Terkini
      setHistory([
        {
          tarikh: new Date().toLocaleDateString("en-GB"),
          butiran: "ZAKAT KESELURUHAN",
          jumlah: data.total,
        },
      ]);
    }
  }, []); // Berjalan sekali setiap kali Dashboard dibuka

  // 3. FUNGSI RESET - Memaksa semua jadi 0 dan padam memori browser
  const handleResetData = () => {
    if (
      window.confirm(
        "ADAKAH ANDA PASTI? Ini akan memadam semua data di Dashboard.",
      )
    ) {
      localStorage.removeItem("maliyyah_zakat_data");
      setTotalZakat(0);
      setZakatPendapatan(0);
      setZakatKripto(0);
      setZakatHarta(0);
      setZakatEmas(0);
      setHistory([]);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#f4f7f6] p-4 md:p-6 text-slate-800 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* BANNER HIJAU - Memaparkan total dari Kalkulator */}
        <div className="bg-[#006747] rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
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
            <Button className="bg-white text-[#006747] hover:bg-slate-100 rounded-2xl px-8 py-7 font-black text-lg flex gap-3 shadow-xl uppercase transition-transform active:scale-95">
              Bayar Sekarang <CreditCard size={20} />
            </Button>
          </div>
          <div className="absolute -right-10 -bottom-10 opacity-10">
            <TrendingUp size={250} />
          </div>
        </div>

        {/* 4 KAD ZAKAT - Menarik data dari state yang dikemaskini */}
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
          {/* JADUAL AKTIVITI TERKINI */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center px-2">
              <h3 className="font-bold flex items-center gap-2 text-slate-700">
                <Clock size={18} /> Aktiviti Terkini
              </h3>
              <button
                onClick={handleResetData}
                className="text-[10px] font-black text-slate-400 hover:text-red-500 flex items-center gap-1 p-2 uppercase tracking-widest cursor-pointer transition-all"
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
                        <td className="px-6 py-4">
                          <div className="text-[10px] font-black text-slate-400 uppercase mb-1">
                            PEMBAYARAN
                          </div>
                          <div className="text-sm font-black text-slate-800">
                            RM{" "}
                            {row.jumlah.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => window.print()}
                            className="text-blue-500 font-black text-[10px] bg-blue-50 px-3 py-1.5 rounded-lg uppercase tracking-widest"
                          >
                            <FileText size={14} className="inline mr-1" /> PDF
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

          {/* SIDEBAR MARKET PULSE */}
          <div className="space-y-6">
            <Card className="rounded-[1.5rem] border-none shadow-sm bg-white p-6">
              <div className="flex items-center gap-2 text-emerald-600 font-bold mb-4">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <Lightbulb size={18} />
                </div>
                <h3>Didik Zakat</h3>
              </div>
              <p className="text-xs text-slate-500 italic">
                "Penyucian harta bermula dengan niat yang ikhlas."
              </p>
            </Card>

            <Card className="rounded-[1.5rem] border-none shadow-sm bg-white p-6">
              <h3 className="text-[10px] font-black text-slate-400 uppercase mb-6 tracking-widest">
                Market Pulse
              </h3>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-orange-50 text-orange-500 rounded-2xl font-black italic text-xs">
                    BTC
                  </div>
                  <p className="text-sm font-black text-slate-800">Bitcoin</p>
                </div>
                <div className="text-right font-black text-sm">
                  RM 278,742.88
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
