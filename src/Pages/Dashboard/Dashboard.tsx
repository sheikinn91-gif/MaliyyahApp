import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useZakat } from "@/components/Context/ZakatContext";
import { toast } from "sonner";
import PaymentModal from "@/components/Context/PaymentModal";
import AIChatBot from "@/components/Context/AIChatBot";
import { ZakatDistributionChart } from "@/components/Context/ZakatDistributionChart";
import DidikZakatWidget from "./ZakatFacts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Wallet,
  Briefcase,
  MapPin,
  TrendingUp,
  PieChart,
  ArrowUpRight,
  Clock,
  Coins,
  CreditCard,
  Bitcoin,
  History,
  RotateCcw,
  FileText,
} from "lucide-react";

interface MarketData {
  btc: number;
  gold_gram: number;
  silver_gram: number;
}

const Dashboard = () => {
  const {
    userName,
    occupation,
    location,
    zakatResults,
    isPrivacyMode,
    resetZakatResults,
  } = useZakat();
  const navigate = useNavigate();

  const [market, setMarket] = useState<MarketData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [recentHistory, setRecentHistory] = useState([]);
  const [summary, setSummary] = useState({
    total_keseluruhan: 0,
    pendapatan: 0,
    kripto: 0,
    harta: 0,
    logam: 0,
  });

  // LOGIK PEMBETULAN 1: Banner Hijau mengikut Database
  const totalKeseluruhan =
    summary.total_keseluruhan > 0
      ? summary.total_keseluruhan
      : (Number(zakatResults.pendapatan) || 0) +
        (Number(zakatResults.kripto) || 0) +
        (Number(zakatResults.harta) || 0) +
        (Number(zakatResults.logam) || 0);

  const refreshData = async () => {
    const token = localStorage.getItem("maliyyah_token");
    const apiUrl = import.meta.env.VITE_API_URL;

    if (!token) {
      setRecentHistory([]);
      return;
    }

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const [historyRes, summaryRes, marketRes] = await Promise.all([
        fetch(`${apiUrl}/api/history`, { headers }),
        fetch(`${apiUrl}/api/zakat-summary`, { headers }),
        fetch(`${apiUrl}/api/live-market`),
      ]);

      if (historyRes.ok) setRecentHistory(await historyRes.json());
      if (summaryRes.ok) setSummary(await summaryRes.json());
      if (marketRes.ok) setMarket(await marketRes.json());
    } catch (error) {
      console.error("Gagal refresh data:", error);
    }
  };

  const handleResetDashboard = async () => {
    const token = localStorage.getItem("maliyyah_token");
    if (!token)
      return toast.error("Hanya pengguna berdaftar boleh memadam rekod.");

    if (
      !window.confirm(
        "Adakah anda pasti? Semua sejarah akan dipadam secara kekal.",
      )
    )
      return;

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/api/history`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        resetZakatResults();
        setSummary({
          total_keseluruhan: 0,
          pendapatan: 0,
          kripto: 0,
          harta: 0,
          logam: 0,
        });
        toast.success("Rekod dipadam!");
        refreshData();
      }
    } catch (error) {
      toast.error("Ralat sambungan.");
    }
  };

  const handleDownloadPDF = (item: any) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow)
      return toast.error("Sila benarkan pop-up untuk muat turun.");

    const tarikh = new Date(item.created_at).toLocaleDateString("ms-MY", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    printWindow.document.write(`
      <html>
        <head>
          <title>Penyata Zakat Maliyyah - ${item.id}</title>
          <style>
            body { font-family: 'Helvetica', sans-serif; padding: 50px; color: #334155; }
            .header { text-align: center; border-bottom: 2px solid #10b981; padding-bottom: 20px; }
            .logo { color: #10b981; font-size: 28px; font-weight: 900; }
            .content { margin-top: 30px; line-height: 1.6; }
            .footer { margin-top: 50px; font-size: 12px; color: #94a3b8; text-align: center; }
            .amount { font-size: 24px; font-weight: bold; color: #059669; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">MALIYYAH</div>
            <p>Penyata Rasmi Pengiraan Zakat</p>
          </div>
          <div class="content">
            <p><strong>Nama Pengguna:</strong> ${userName}</p>
            <p><strong>Tarikh Transaksi:</strong> ${tarikh}</p>
            <p><strong>Kategori Zakat:</strong> ${item.kategori}</p>
            <hr />
            <p>Jumlah Zakat Yang Telah Dikira:</p>
            <p class="amount">RM ${item.total_zakat.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            <p><em>Status: Rekod telah disimpan dalam sistem Maliyyah.</em></p>
          </div>
          <div class="footer">
            Dokumen ini dijana secara automatik oleh Maliyyah Zakat Engine pada ${new Date().toLocaleString()}.
          </div>
          <script>window.onload = function() { window.print(); window.close(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  useEffect(() => {
    refreshData();
  }, [zakatResults]);

  const formatValue = (val: number) => {
    if (isPrivacyMode) return "RM ••••••";
    return new Intl.NumberFormat("en-MY", {
      style: "currency",
      currency: "MYR",
      minimumFractionDigits: 2,
    }).format(val || 0);
  };

  // LOGIK PEMBETULAN 2: Kad statistik mengikut Database (Summary)
  const stats = [
    {
      title: "Zakat Pendapatan",
      amount:
        summary.pendapatan > 0 ? summary.pendapatan : zakatResults.pendapatan,
      icon: Briefcase,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Zakat Kripto",
      amount: summary.kripto > 0 ? summary.kripto : zakatResults.kripto,
      icon: TrendingUp,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Zakat Harta",
      amount: summary.harta > 0 ? summary.harta : zakatResults.harta,
      icon: Wallet,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      title: "Zakat Logam/Emas",
      amount: summary.logam > 0 ? summary.logam : zakatResults.logam,
      icon: PieChart,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
  ];

  return (
    <div className="flex-1 space-y-8 p-4 md:p-6 pt-6 bg-slate-50/30">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">
            Dashboard Maliyyah
          </h2>
          <div className="flex flex-wrap items-center gap-4 mt-1 text-slate-500 text-sm font-medium">
            <span className="text-emerald-700 font-bold italic">
              Assalamu'alaikum, {userName}
            </span>
            <span className="flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5" /> {occupation}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> {location}
            </span>
          </div>
        </div>
        <div className="flex items-center text-xs text-slate-400 bg-white border border-slate-100 px-4 py-2 rounded-full shadow-sm w-fit">
          <Clock className="mr-2 h-3 w-3" />{" "}
          {new Date().toLocaleDateString("ms-MY", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </div>
      </div>

      <Card className="border-none shadow-2xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white overflow-hidden relative rounded-[2.5rem]">
        <div className="absolute right-0 bottom-0 p-8 opacity-10 rotate-12 pointer-events-none">
          <Wallet size={160} />
        </div>
        <CardHeader>
          <CardTitle className="text-emerald-100 font-bold uppercase tracking-widest text-[10px]">
            Ringkasan Kewajipan
          </CardTitle>
          <CardDescription className="text-white text-lg font-medium">
            Jumlah Keseluruhan Zakat Terkumpul
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
            <div>
              <div className="text-5xl md:text-7xl font-black tracking-tighter">
                {formatValue(totalKeseluruhan)}
              </div>
              <div
                className={`mt-4 flex items-center text-[10px] font-bold w-fit px-4 py-1.5 rounded-full border ${isPaid ? "bg-emerald-400/20 border-emerald-400" : "bg-white/10 border-white/20"}`}
              >
                {totalKeseluruhan > 0
                  ? isPaid
                    ? "STATUS: PROSES PENGESAHAN"
                    : "STATUS: MENUNGGU PEMBAYARAN"
                  : "STATUS: TIADA KEWAJIPAN AKTIF"}
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </div>
            </div>
            {totalKeseluruhan > 0 && !isPaid && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="group flex items-center justify-center gap-3 bg-white text-emerald-700 px-8 py-4 rounded-2xl font-black text-sm shadow-xl hover:bg-emerald-50 transition-all active:scale-95"
              >
                BAYAR SEKARANG <CreditCard className="h-5 w-5" />
              </button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((item, index) => (
          <Card
            key={index}
            className="border-none shadow-sm hover:shadow-md transition-all rounded-3xl"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-[10px] font-bold text-slate-500 uppercase">
                {item.title}
              </CardTitle>
              <div className={`${item.bg} ${item.color} p-2 rounded-lg`}>
                <item.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-slate-800">
                {formatValue(item.amount)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-md font-bold text-slate-800 flex items-center gap-2">
              <History className="text-slate-400" size={18} /> Aktiviti Terkini
            </h3>
            <Button
              onClick={handleResetDashboard}
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-red-500 text-[10px] font-bold"
            >
              <RotateCcw className="w-3 h-3 mr-1" /> RESET DATA
            </Button>
          </div>

          <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="pl-6 text-[10px] font-bold uppercase">
                    Tarikh
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase">
                    Butiran Zakat
                  </TableHead>
                  <TableHead className="text-right pr-6 text-[10px] font-bold uppercase">
                    Tindakan
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentHistory.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center py-16 text-slate-400 italic text-sm"
                    >
                      Tiada rekod transaksi.
                    </TableCell>
                  </TableRow>
                ) : (
                  recentHistory.map((item: any) => (
                    <TableRow
                      key={item.id}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <TableCell className="pl-6 text-sm text-slate-600">
                        {new Date(item.created_at).toLocaleDateString("ms-MY")}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[9px] font-black uppercase w-fit">
                            {item.kategori}
                          </span>
                          <span className="text-xs font-bold text-slate-900 mt-1">
                            {formatValue(item.total_zakat)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <button
                          onClick={() => handleDownloadPDF(item)}
                          className="inline-flex items-center gap-2 p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all active:scale-90"
                          title="Muat Turun PDF"
                        >
                          <FileText size={16} />
                          <span className="text-[10px] font-bold hidden md:inline">
                            PDF
                          </span>
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
          <ZakatDistributionChart />
        </div>

        <div className="lg:col-span-3 space-y-6">
          <DidikZakatWidget />
          <div className="p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between px-1">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
                Market Pulse
              </h4>
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group hover:bg-orange-50 transition-all border border-transparent hover:border-orange-100">
                <div className="flex items-center gap-3">
                  <Bitcoin className="w-5 h-5 text-orange-500" />
                  <span className="text-xs font-bold text-slate-600">
                    Bitcoin (BTC)
                  </span>
                </div>
                <span className="text-sm font-black text-slate-800">
                  {market ? formatValue(market.btc) : "---"}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group hover:bg-yellow-50 transition-all border border-transparent hover:border-yellow-100">
                <div className="flex items-center gap-3">
                  <Coins className="w-5 h-5 text-yellow-600" />
                  <span className="text-xs font-bold text-slate-600">
                    Gold / Gram
                  </span>
                </div>
                <span className="text-sm font-black text-slate-800">
                  {market ? formatValue(market.gold_gram) : "---"}
                </span>
              </div>
            </div>
          </div>
          <Card className="border-none shadow-sm bg-slate-900 text-white rounded-[2rem] overflow-hidden">
            <CardContent className="p-8 space-y-4 text-center relative">
              <MapPin className="mx-auto text-emerald-500 h-8 w-8" />
              <p className="font-black text-2xl tracking-tighter uppercase">
                {location || "MALAYSIA"}
              </p>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Zakat anda diagihkan secara setempat untuk membantu asnaf dan
                memperkasa ekonomi ummah di wilayah anda.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        totalAmount={totalKeseluruhan}
        onConfirmIntent={(provider) => {
          setIsPaid(true);
          setIsModalOpen(false);
          toast.success("Pembayaran sedang diproses!");
        }}
      />
      <AIChatBot />
    </div>
  );
};

export default Dashboard;
