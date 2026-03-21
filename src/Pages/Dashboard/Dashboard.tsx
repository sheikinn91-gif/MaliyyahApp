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
  ExternalLink,
  CreditCard,
  QrCode,
  X,
  MapPin,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { toast } from "sonner";
import html2pdf from "html2pdf.js";

export default function Dashboard() {
  const { zakatResults } = useZakat() as any;
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [infoIndex, setInfoIndex] = useState(0);

  // --- DATA DIDIK ZAKAT ---
  const infoZakat = [
    {
      text: "Zakat menyucikan harta serta membantu mengimbangkan ekonomi ummah.",
      tip: "Zakat Kripto dikira 2.5% jika melebihi Nisab.",
    },
    {
      text: "Harta yang dikeluarkan zakat tidak akan berkurang, malah menambah keberkatan.",
      tip: "Zakat Pendapatan boleh dibayar melalui potongan gaji (PCB).",
    },
    {
      text: "Zakat emas dikira apabila beratnya melebihi urf setempat.",
      tip: "Emas simpanan dikenakan zakat jika ≥ 85 gram.",
    },
  ];

  // --- AMBIL DATA DARI DATABASE ---
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

  // --- LOGIK CHART (RECHARTS) ---
  const chartData = history
    .slice(0, 7)
    .reverse()
    .map((item: any) => ({
      date: new Date(item.created_at).toLocaleDateString("ms-MY", {
        day: "2-digit",
        month: "short",
      }),
      jumlah: Number(item.total_zakat),
    }));

  // --- FUNGSI RESET ---
  const handleReset = async () => {
    if (!confirm("Padam semua sejarah?")) return;
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
      const response = await fetch(`${apiUrl}/api/history`, {
        method: "DELETE",
      });
      if (response.ok) {
        setHistory([]);
        toast.success("Rekod dipadam.");
        setTimeout(() => window.location.reload(), 500);
      }
    } catch (e) {
      toast.error("Gagal reset.");
    }
  };

  // --- FUNGSI PDF ---
  const downloadPDF = (id: string) => {
    const token = localStorage.getItem("maliyyah_token");
    const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
    toast.info("Menjana PDF...");
    window.open(`${apiUrl}/api/generate-pdf/${id}?token=${token}`, "_blank");
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
    <div className="p-6 space-y-8 bg-slate-50 min-h-screen text-slate-900 relative">
      {/* HEADER & LOKASI */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight italic">
            MALIYYAH DASHBOARD
          </h1>
          <div className="flex items-center gap-1.5 text-slate-500 text-sm mt-1">
            <MapPin size={14} className="text-emerald-500" />
            <span>Lahad Datu, Sabah</span>
          </div>
        </div>
      </div>

      {/* BANNER HIJAU */}
      <div className="relative bg-[#006837] rounded-[40px] p-10 text-white overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <p className="text-sm font-bold opacity-80 uppercase tracking-widest mb-2 font-mono">
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
          <button
            onClick={() => setIsPaymentModalOpen(true)}
            className="mt-8 bg-white text-[#006837] px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-slate-100 shadow-lg active:scale-95 transition-all"
          >
            BAYAR SEKARANG <ChevronRight size={18} />
          </button>
        </div>
        <Wallet className="absolute right-[-20px] bottom-[-20px] size-64 opacity-10 rotate-12" />
      </div>

      {/* POPUP BAYARAN (MODAL) */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl p-8 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setIsPaymentModalOpen(false)}
              className="absolute right-6 top-6 text-slate-400 hover:text-slate-600"
            >
              <X size={24} />
            </button>
            <h3 className="text-2xl font-bold text-slate-800 mb-8">
              Pilih Cara Bayaran
            </h3>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center mb-8">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 font-mono">
                Jumlah Zakat
              </p>
              <h2 className="text-4xl font-black text-emerald-600">
                RM{" "}
                {totalSemasa.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </h2>
            </div>
            <div className="space-y-4">
              <button
                onClick={() =>
                  window.open("https://zakat.sabah.gov.my", "_blank")
                }
                className="w-full flex items-center gap-4 border-2 border-emerald-500 bg-emerald-50/50 p-4 rounded-2xl text-left hover:bg-emerald-100 transition-all"
              >
                <div className="p-3 rounded-xl bg-emerald-100 text-emerald-600">
                  <ExternalLink size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 font-mono">
                    Portal Rasmi MUIS
                  </h4>
                  <p className="text-xs text-slate-500 font-mono italic">
                    Bayar terus via FPX (Sabah)
                  </p>
                </div>
                <ChevronRight className="text-emerald-500" size={20} />
              </button>
              <div className="w-full flex items-center gap-4 border border-slate-100 bg-white p-4 rounded-2xl">
                <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                  <CreditCard size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 font-mono">JomPAY</h4>
                  <p className="text-xs text-slate-500 font-mono uppercase tracking-widest">
                    Biller Code: 55236
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GRAF PRESTASI (CHART) */}
      <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
        <h3 className="font-bold text-slate-700 mb-6 flex items-center gap-2 font-mono text-sm">
          <TrendingUp size={18} className="text-blue-500" /> Analisis Bayaran
          Zakat
        </h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#94a3b8" }}
              />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  borderRadius: "16px",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey="jumlah"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.1}
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* KAD STATISTIK */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between hover:border-emerald-200 transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <p className="text-xs font-bold text-slate-400 uppercase font-mono">
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
        <div className="lg:col-span-2 bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h3 className="font-bold flex items-center gap-2 text-slate-700 font-mono">
              <Clock size={18} className="text-emerald-500" /> Aktiviti Terkini
            </h3>
            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="text-[10px] flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full font-bold text-slate-500 transition-colors"
              >
                <RotateCcw size={12} /> RESET
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
                  <th className="px-6 py-4">Jumlah</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {history.length > 0 ? (
                  history.slice(0, 5).map((item: any, i: number) => {
                    // Tukar format tarikh dan jumlah siap-siap untuk paparan & PDF
                    const formattedDate = new Date(
                      item.created_at,
                    ).toLocaleDateString("ms-MY");
                    const formattedAmount = Number(
                      item.total_zakat,
                    ).toLocaleString(undefined, { minimumFractionDigits: 2 });

                    return (
                      <tr
                        key={i}
                        className="hover:bg-slate-50/50 transition-colors group"
                      >
                        <td className="px-6 py-4 text-sm text-slate-500">
                          {formattedDate}
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-800 font-mono">
                          RM {formattedAmount}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              const element = document.createElement("div");
                              element.innerHTML = `
                        <div style="padding: 50px; font-family: sans-serif; border: 1px solid #eee; border-radius: 10px;">
                          <h2 style="color: #10b981; margin-bottom: 5px;">Maliyyah Zakat</h2>
                          <p style="font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">Resit Rasmi Pembayaran</p>
                          <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 20px 0;" />
                          <div style="margin-bottom: 10px;">
                            <span style="color: #94a3b8; font-size: 12px;">Tarikh Transaksi:</span><br/>
                            <strong style="font-size: 16px;">${formattedDate}</strong>
                          </div>
                          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-top: 20px;">
                            <span style="color: #64748b; font-size: 12px;">Jumlah Zakat Ditunaikan:</span><br/>
                            <strong style="font-size: 28px; color: #1e293b;">RM ${formattedAmount}</strong>
                          </div>
                          <p style="margin-top: 40px; font-size: 10px; color: #94a3b8; text-align: center;">
                            Resit ini dijana secara digital oleh Maliyyah Engine.<br/>ID: ${item.id || "MLY-" + i}
                          </p>
                        </div>
                      `;

                              const opt = {
                                margin: 10,
                                filename: `Resit_Zakat_${formattedDate.replace(/\//g, "-")}.pdf`,
                                image: { type: "jpeg", quality: 0.98 },
                                html2canvas: { scale: 3 },
                                jsPDF: {
                                  unit: "mm",
                                  format: "a4",
                                  orientation: "portrait" as const,
                                },
                              };

                              // @ts-ignore
                              html2pdf().set(opt).from(element).save();
                            }}
                            className="text-blue-500 hover:text-blue-700 font-bold text-xs inline-flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg transition-all"
                          >
                            <FileText size={14} /> PDF
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-12 text-center text-slate-400 text-sm italic"
                    >
                      Tiada rekod.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* DIDIK ZAKAT (WIDGET REFRESHABLE) */}
        <div className="bg-emerald-50 rounded-[32px] p-8 border border-emerald-100 flex flex-col justify-between relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div className="bg-emerald-500 size-12 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-200 transition-transform group-hover:scale-110">
                <Briefcase size={24} />
              </div>
              <button
                onClick={() => setInfoIndex((infoIndex + 1) % infoZakat.length)}
                className="p-2 hover:bg-emerald-100 rounded-full text-emerald-600 transition-colors"
              >
                <RotateCcw size={16} />
              </button>
            </div>
            <h3 className="font-bold text-emerald-900 text-xl mb-3 font-mono tracking-tighter uppercase">
              Didik Zakat
            </h3>
            <p className="text-emerald-700 leading-relaxed italic text-sm min-h-[60px]">
              "{infoZakat[infoIndex].text}"
            </p>
            <div className="mt-4 p-3 bg-white/50 rounded-xl border border-emerald-200/50 text-[11px] text-emerald-800 font-medium">
              💡 **Tips:** {infoZakat[infoIndex].tip}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
