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
import { toast } from "sonner";
import AIChatbot from "@/components/Context/AIChatBot";

export default function MaliyyahDashboard() {
  // 1. STATE UNTUK PAPARAN DATA
  const [totalZakat, setTotalZakat] = useState<number>(0);
  const [zakatPendapatan, setZakatPendapatan] = useState<number>(0);
  const [zakatKripto, setZakatKripto] = useState<number>(0);
  const [zakatHarta, setZakatHarta] = useState<number>(0);
  const [zakatEmas, setZakatEmas] = useState<number>(0);
  const [history, setHistory] = useState<any[]>([]);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);

  // 2. FUNGSI PENARIK DATA (Magnet)
  useEffect(() => {
    const dataMentah = localStorage.getItem("maliyyah_zakat_data");

    if (dataMentah) {
      try {
        const data = JSON.parse(dataMentah);

        // Kemaskini state dengan data yang dihantar oleh Kalkulator
        setTotalZakat(data.total || 0);
        setZakatPendapatan(data.pendapatan || 0);
        setZakatKripto(data.kripto || 0);
        setZakatHarta(data.harta || 0);
        setZakatEmas(data.logam || 0);

        setHistory([
          {
            tarikh: new Date().toLocaleDateString("en-GB"),
            butiran: "ZAKAT KESELURUHAN",
            jumlah: data.total,
          },
        ]);
      } catch (e) {
        console.error("Ralat membaca data dari storage:", e);
      }
    }
  }, []);

  // 3. FUNGSI RESET DATA
  const handleResetData = () => {
    if (window.confirm("Padam semua data paparan di Dashboard?")) {
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
        {/* BANNER UTAMA */}
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
                {totalZakat > 0 ? "Menunggu Pembayaran" : "Tiada Tunggakan"}
                <ExternalLink size={12} />
              </div>
            </div>
            <Button
              onClick={() => {
                if (totalZakat <= 0) {
                  toast.error("Tiada jumlah zakat untuk dibayar.");
                  return;
                }
                setIsPayModalOpen(true); // Ini akan buka modal
              }}
              className="bg-white text-[#006747] hover:bg-slate-100 rounded-2xl px-8 py-7 font-black text-lg flex gap-3 shadow-xl uppercase transition-transform active:scale-95"
            >
              Bayar Sekarang <CreditCard size={20} />
            </Button>
          </div>
          <div className="absolute -right-10 -bottom-10 opacity-10">
            <TrendingUp size={250} />
          </div>
        </div>

        {/* KAD KATEGORI ZAKAT */}
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

        {/* AKTIVITI TERKINI & SIDEBAR */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                        Tiada rekod tersimpan.
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
                "Penyucian harta bermula dengan niat yang ikhlas."
              </p>
            </Card>
            {/* KAD MARKET PULSE (BITCOIN & EMAS) */}
            <Card className="rounded-[1.5rem] border-none shadow-sm bg-white p-6">
              <h3 className="text-[10px] font-black text-slate-400 uppercase mb-6 tracking-widest">
                Market Pulse
              </h3>

              <div className="space-y-6">
                {/* BITCOIN */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-orange-50 text-orange-500 rounded-2xl font-black italic text-xs">
                      BTC
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-800">
                        Bitcoin
                      </p>
                      <p className="text-[10px] text-slate-400 uppercase">
                        Live Crypto
                      </p>
                    </div>
                  </div>
                  <div className="text-right font-black text-sm text-slate-800">
                    RM 278,742.88
                  </div>
                </div>

                {/* EMAS */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-yellow-50 text-yellow-600 rounded-2xl font-black italic text-xs">
                      AU
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-800">
                        Emas (999)
                      </p>
                      <p className="text-[10px] text-slate-400 uppercase">
                        Harga Semasa/g
                      </p>
                    </div>
                  </div>
                  <div className="text-right font-black text-sm text-slate-800">
                    RM 350.50
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
      {/* Kod Modal Start */}
      {isPayModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            {/* Header Modal */}
            <div className="p-8 flex justify-between items-center border-b border-slate-50">
              <h2 className="text-2xl font-black text-slate-800">
                Pilih Cara Bayaran
              </h2>
              <button
                onClick={() => setIsPayModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <RotateCcw size={20} className="rotate-45 text-slate-400" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              {/* Jumlah Ringgit */}
              <div className="bg-emerald-50/50 rounded-3xl p-8 text-center border border-emerald-100">
                <p className="text-[10px] font-black text-emerald-600/60 uppercase tracking-widest mb-1">
                  Jumlah Zakat
                </p>
                <h1 className="text-4xl font-black text-emerald-600">
                  RM{" "}
                  {totalZakat.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </h1>
              </div>

              {/* Pilihan: MUIS */}
              <button
                onClick={() =>
                  window.open("https://fpx.zakat.com.my/", "_blank")
                }
                className="w-full flex items-center gap-4 p-5 rounded-[1.5rem] border-2 border-emerald-500 bg-emerald-50/30 hover:bg-emerald-100/50 transition-all text-left"
              >
                <div className="p-3 bg-emerald-500 text-white rounded-xl">
                  <ExternalLink size={20} />
                </div>
                <div>
                  <p className="font-black text-slate-800">Portal Rasmi MUIS</p>
                  <p className="text-xs text-slate-500 font-medium">
                    Bayar terus via FPX (Sabah)
                  </p>
                </div>
              </button>

              {/* Pilihan: JomPAY */}
              <div className="w-full flex items-center justify-between p-5 rounded-[1.5rem] border border-slate-100 bg-white shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <p className="font-black text-slate-800">JomPAY</p>
                    <p className="text-xs text-slate-400">
                      Biller Code:{" "}
                      <span className="text-blue-600 font-bold">55236</span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText("55236");
                    toast.success("Biller Code disalin!");
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black px-4 py-2 rounded-lg uppercase transition-colors"
                >
                  Salin
                </button>
              </div>

              <p className="text-[10px] text-center text-slate-400 font-bold px-6 italic">
                Resit rasmi akan dihantar ke emel anda selepas pengesahan bank.
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Kod Modal End */}
      <div className="relative z-[110]">
        <AIChatbot />
      </div>
    </div> // Penutup <main> atau container utama dalam Dashboard
  );
}
