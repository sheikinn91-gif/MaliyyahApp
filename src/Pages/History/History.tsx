import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Pastikan anda dah run: npx shadcn-ui@latest add table
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  History as HistoryIcon,
  ArrowLeft,
  Calendar,
  Wallet,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

// Definisi interface mengikut schema database FastAPI anda
interface ZakatRecord {
  id: number;
  pendapatan: number;
  kripto: number;
  harta: number;
  logam: number;
  total_zakat: number;
  created_at: string;
}

export default function HistoryPage() {
  const [records, setRecords] = useState<ZakatRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchZakatHistory();
  }, []);

  const fetchZakatHistory = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL; //|| "http://127.0.0.1:8000";
      const response = await fetch(`${apiUrl}/api/history`);

      if (!response.ok) throw new Error("Gagal mengambil data dari server.");

      const data = await response.json();
      setRecords(data);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Ralat sambungan. Pastikan Backend anda aktif.");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper: Format RM
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("ms-MY", {
      style: "currency",
      currency: "MYR",
    }).format(val);
  };

  // Helper: Format Tarikh (Gaya Malaysia)
  const formatDateTime = (str: string) => {
    return new Date(str).toLocaleDateString("ms-MY", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <Link to="/">
              <Button
                variant="link"
                className="p-0 h-auto text-emerald-600 hover:text-emerald-700 font-bold mb-2"
              >
                <ArrowLeft size={16} className="mr-2" /> Kembali ke Dashboard
              </Button>
            </Link>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <HistoryIcon className="text-emerald-600" size={32} />
              Rekod <span className="text-emerald-600">Maliyyah</span>
            </h1>
            <p className="text-slate-500 font-medium">
              Pantau sejarah pengiraan dan pembayaran zakat anda.
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="rounded-xl border-slate-200">
              Muat Turun CSV
            </Button>
          </div>
        </div>

        {/* Table Card */}
        <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-2xl overflow-hidden ring-1 ring-slate-200">
          <CardHeader className="bg-white border-b border-slate-100">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <TrendingUp size={18} className="text-emerald-500" />
              Senarai Pengiraan Terkini
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="py-24 flex flex-col items-center justify-center text-slate-400">
                <Loader2 className="animate-spin mb-4" size={40} />
                <p className="font-medium">Menghubungi pangkalan data...</p>
              </div>
            ) : records.length === 0 ? (
              <div className="py-24 text-center space-y-4">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-300">
                  <Wallet size={40} />
                </div>
                <div className="space-y-1">
                  <p className="text-slate-900 font-bold text-lg">
                    Tiada rekod disimpan
                  </p>
                  <p className="text-slate-500 text-sm">
                    Mulakan pengiraan pertama anda di dashboard.
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow className="hover:bg-transparent border-slate-100">
                      <TableHead className="w-[200px] font-bold py-5 px-6 text-slate-700">
                        Tarikh
                      </TableHead>
                      <TableHead className="font-bold text-slate-700">
                        Pendapatan
                      </TableHead>
                      <TableHead className="font-bold text-slate-700">
                        Kripto & Logam
                      </TableHead>
                      <TableHead className="font-bold text-slate-700">
                        Harta
                      </TableHead>
                      <TableHead className="text-right font-bold py-5 px-6 text-emerald-700">
                        Zakat Dikenakan
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {records.map((row) => (
                      <TableRow
                        key={row.id}
                        className="border-slate-100 hover:bg-slate-50/50 transition-colors"
                      >
                        <TableCell className="py-4 px-6">
                          <div className="flex items-center gap-2 font-semibold text-slate-800">
                            <Calendar size={14} className="text-slate-400" />
                            {formatDateTime(row.created_at)}
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-600 font-medium">
                          {formatCurrency(row.pendapatan)}
                        </TableCell>
                        <TableCell className="text-slate-600">
                          <div className="text-xs space-y-0.5">
                            <p>
                              🪙 Kripto:{" "}
                              <span className="font-bold">
                                {formatCurrency(row.kripto)}
                              </span>
                            </p>
                            <p>
                              ✨ Logam:{" "}
                              <span className="font-bold">
                                {formatCurrency(row.logam)}
                              </span>
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-600 font-medium">
                          {formatCurrency(row.harta)}
                        </TableCell>
                        <TableCell className="text-right py-4 px-6">
                          <span className="inline-flex items-center bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg font-black text-sm ring-1 ring-emerald-100">
                            {formatCurrency(row.total_zakat)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer Info */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-slate-400 font-bold uppercase tracking-widest gap-4">
          <p>© 2026 Maliyyah Digital Ecosystem • Sabah Region</p>
          <div className="flex gap-6">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>{" "}
              Backend Online
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
