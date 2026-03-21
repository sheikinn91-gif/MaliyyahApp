import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Banknote,
  Clock,
  RotateCcw,
  RefreshCw,
  FileText,
  CheckCircle,
} from "lucide-react";

export default function MaliyyahDashboard() {
  const [salary, setSalary] = useState<number>(0);
  const [history, setHistory] = useState<any[]>([]); // Data dari database anda
  const [loading, setLoading] = useState(false);

  // 1. FUNGSI RESET - Pasti Berfungsi
  const handleReset = () => {
    setSalary(0);
    console.log("Input direset.");
  };

  // 2. FUNGSI REFRESH
  const fetchHistory = async () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  };

  // 3. FORMULA ZAKAT (2.5%) - Tidak Diusik
  const calculateZakat = () => salary * 0.025;

  return (
    <div className="w-full min-h-screen bg-slate-50/50 p-4 md:p-8 text-slate-900">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* KAD ATAS (INPUT & HASIL ZAKAT) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="rounded-[2.5rem] shadow-xl border-none bg-white">
            <div className="p-6 bg-blue-50/50 border-b flex items-center gap-3">
              <Banknote className="text-blue-600" />
              <h3 className="font-bold">Pendapatan</h3>
            </div>
            <CardContent className="p-8">
              <input
                type="number"
                value={salary || ""}
                placeholder="RM 0.00"
                className="w-full p-4 bg-slate-50 border-2 rounded-2xl outline-none focus:border-blue-500 font-bold text-xl"
                onChange={(e) => setSalary(Number(e.target.value))}
              />
            </CardContent>
          </Card>

          <Card className="md:col-span-2 border-4 border-dashed border-green-200 bg-green-50/40 rounded-[3rem] p-8 flex flex-col items-center justify-center text-center">
            <p className="text-xs font-black text-green-700 uppercase tracking-widest mb-4">
              Total Zakat Wajib
            </p>
            <h2 className="text-5xl font-black text-green-600 mb-8">
              RM{" "}
              {calculateZakat().toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </h2>
            <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full px-10 py-6 text-xl font-black shadow-xl flex gap-3">
              <CheckCircle /> Tunaikan & Simpan
            </Button>
          </Card>
        </div>

        {/* JADUAL AKTIVITI (FUNGSI PDF DI SINI) */}
        <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h3 className="font-bold flex items-center gap-2 text-slate-700 font-mono">
              <Clock size={18} className="text-emerald-500" /> Aktiviti Terkini
            </h3>
            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="text-[10px] bg-slate-100 px-3 py-1.5 rounded-full font-bold text-slate-500 flex items-center gap-1"
              >
                <RotateCcw size={12} /> RESET
              </button>
              <button
                onClick={fetchHistory}
                className="p-1.5 bg-emerald-50 text-emerald-600 rounded-full"
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
                <tr className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 border-b">
                  <th className="px-6 py-4">Tarikh</th>
                  <th className="px-6 py-4 text-center">Jumlah</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {history.length > 0 ? (
                  history.slice(0, 5).map((item: any, i: number) => {
                    const tkh = new Date(item.created_at).toLocaleDateString(
                      "ms-MY",
                    );
                    const jlh = Number(item.total_zakat).toLocaleString(
                      undefined,
                      { minimumFractionDigits: 2 },
                    );

                    return (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="px-6 py-4 text-sm text-slate-500">
                          {tkh}
                        </td>
                        <td className="px-6 py-4 text-center font-bold font-mono">
                          RM {jlh}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              const printWin = window.open("", "_blank");
                              if (printWin) {
                                printWin.document.write(`
                                  <html>
                                    <body style="padding:50px; font-family:sans-serif;">
                                      <div style="border:2px solid #10b981; padding:30px; border-radius:20px; max-width:500px; margin:auto;">
                                        <h1 style="color:#10b981; margin:0;">Maliyyah Zakat</h1>
                                        <p style="color:#666; font-size:12px;">RESIT RASMI PEMBAYARAN</p>
                                        <hr style="border:0; border-top:1px solid #eee; margin:20px 0;"/>
                                        <p><strong>Tarikh:</strong> ${tkh}</p>
                                        <p style="font-size:24px;"><strong>Jumlah: RM ${jlh}</strong></p>
                                        <p style="margin-top:40px; font-size:10px; color:#999;">ID: ${item.id || "MLY-" + i}</p>
                                      </div>
                                      <script>window.onload = function() { window.print(); window.close(); };</script>
                                    </body>
                                  </html>
                                `);
                                printWin.document.close();
                              }
                            }}
                            className="text-blue-600 hover:text-blue-800 font-bold text-xs flex items-center gap-1 float-right"
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
                      className="px-6 py-12 text-center text-slate-400 italic"
                    >
                      Tiada rekod.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
