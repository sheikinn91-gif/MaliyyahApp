import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useZakat } from "@/components/Context/ZakatContext";
import { toast } from "sonner";
import PaymentModal from "@/components/Context/PaymentModal";
import AIChatBot from "@/components/Context/AIChatBot";
import { ZakatDistributionChart } from "@/components/Context/ZakatDistributionChart";
import DidikZakatWidget from "./ZakatFacts"; // Pastikan path ini betul

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
} from "lucide-react";

interface MarketData {
  btc: number;
  gold_gram: number;
  silver_gram: number;
}

const Dashboard = () => {
  const { userName, occupation, location, zakatResults, isPrivacyMode } =
    useZakat();
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
  const totalKeseluruhan =
    (zakatResults.pendapatan || 0) +
    (zakatResults.kripto || 0) +
    (zakatResults.harta || 0) +
    (zakatResults.logam || 0);

  const refreshData = async () => {
    const token = localStorage.getItem("maliyyah_token");
    const apiUrl = import.meta.env.VITE_API_URL; //|| "http://127.0.0.1:8000";

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
      const apiUrl = import.meta.env.VITE_API_URL; //|| "http://127.0.0.1:8000";
      const res = await fetch(`${apiUrl}/api/history`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        // --- TAMBAH BARIS INI ---
        resetZakatResults(); // Ini yang akan tukar Banner Hijau jadi RM 0
        toast.success("Rekod dipadam!");
        refreshData();
      }
    } catch (error) {
      toast.error("Ralat sambungan.");
    }
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
    }).format(val);
  };

  // Stats mapping untuk kad-kad kecil
  const stats = [
    {
      title: "Zakat Pendapatan",
      amount: zakatResults.pendapatan,
      icon: Briefcase,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Zakat Kripto",
      amount: zakatResults.kripto,
      icon: TrendingUp,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Zakat Harta",
      amount: zakatResults.harta,
      icon: Wallet,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      title: "Zakat Logam/Emas",
      amount: zakatResults.logam,
      icon: PieChart,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
  ];
  const { resetZakatResults } = useZakat();

  return (
    <div className="flex-1 space-y-8 p-4 md:p-6 pt-6 bg-slate-50/30">
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">
            Dashboard Maliyyah
          </h2>
          <div className="flex flex-wrap items-center gap-4 mt-1 text-slate-500 text-sm font-medium">
            <span className="text-emerald-600 font-bold italic">
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

      {/* 2. MAIN HIGHLIGHT CARD */}
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
                {summary.total_keseluruhan > 0
                  ? isPaid
                    ? "STATUS: PROSES PENGESAHAN"
                    : "STATUS: MENUNGGU PEMBAYARAN"
                  : "STATUS: TIADA KEWAJIPAN AKTIF"}
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </div>
            </div>
            {summary.total_keseluruhan > 0 && !isPaid && (
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

      {/* 3. FOUR STATS CARDS */}
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

      {/* 4. MAIN CONTENT GRID (SPLIT 4:3) */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* LEFT COLUMN: HISTORY & CHART */}
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
                    Kategori
                  </TableHead>
                  <TableHead className="text-right pr-6 text-[10px] font-bold uppercase">
                    Jumlah
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
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <TableCell className="pl-6 text-sm text-slate-600">
                        {new Date(item.created_at).toLocaleDateString("ms-MY")}
                      </TableCell>
                      <TableCell>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-black uppercase">
                          {item.kategori}
                        </span>
                      </TableCell>
                      <TableCell className="text-right pr-6 font-bold text-emerald-600">
                        {formatValue(item.total_zakat)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>

          <ZakatDistributionChart />
        </div>

        {/* RIGHT COLUMN: SIDEBAR WIDGETS */}
        <div className="lg:col-span-3 space-y-6">
          {/* WIDGET 1: DIDIK ZAKAT (DAILY FACTS) */}
          <DidikZakatWidget />

          {/* WIDGET 2: MARKET PULSE */}
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

          {/* WIDGET 3: LOCATION IMPACT */}
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
