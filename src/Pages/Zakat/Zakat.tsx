import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle,
  Banknote,
  TrendingUp,
  Coins,
  Wallet,
  ExternalLink,
  CreditCard,
  X,
  CheckCircle2,
  Info,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useZakat } from "@/components/Context/ZakatContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// --- 1. KOMPONEN PAYMENT MODAL ---
const PaymentModal = ({
  isOpen,
  onClose,
  onConfirmIntent,
  totalAmount,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirmIntent: (provider: string) => void;
  totalAmount: number;
}) => {
  if (!isOpen) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Biller Code ${text} disalin!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 text-slate-900">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-bold">Pilih Cara Bayaran</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6 text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-slate-50 p-4 rounded-xl text-center mb-4">
            <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">
              Jumlah Zakat
            </span>
            <div className="text-3xl font-black text-green-600">
              RM{" "}
              {totalAmount.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </div>
          </div>

          <button
            onClick={() => onConfirmIntent("MUIS")}
            className="w-full flex items-center p-4 border-2 border-slate-100 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
          >
            <div className="bg-emerald-100 p-3 rounded-lg group-hover:bg-emerald-200">
              <ExternalLink className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="ml-4 text-left">
              <div className="font-bold">Portal Rasmi MUIS</div>
              <div className="text-xs text-slate-500">
                Bayar terus via FPX (Sabah)
              </div>
            </div>
          </button>

          <button
            onClick={() => {
              copyToClipboard("4240");
              onConfirmIntent("JomPAY");
            }}
            className="w-full flex items-center p-4 border-2 border-slate-100 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
          >
            <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-200">
              <CreditCard className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4 text-left">
              <div className="font-bold">JomPAY (Biller Code: 4240)</div>
              <div className="text-xs text-slate-500">Klik untuk salin kod</div>
            </div>
          </button>
        </div>

        <div className="p-4 bg-slate-50 text-center">
          <div className="flex items-center justify-center text-xs text-slate-400">
            <CheckCircle2 className="h-4 w-4 mr-1 text-emerald-500" />
            Rekod akan disimpan secara automatik
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 2. KOMPONEN UTAMA ZAKAT ---
export default function Zakat() {
  const { setZakatResults } = useZakat();
  const navigate = useNavigate();

  // Input States
  const [salary, setSalary] = useState<number>(0);
  const [bonus, setBonus] = useState<number>(0);
  const [hasSpouse, setHasSpouse] = useState<boolean>(false);
  const [childrenCount, setChildrenCount] = useState<number>(0);
  const [incomeZakatResult, setIncomeZakatResult] = useState<number>(0);
  const [kwsp, setKwsp] = useState<number>(0); // 11% biasanya
  const [parents, setParents] = useState<number>(0); // Pemberian ibu bapa
  const [education, setEducation] = useState<number>(0); // Yuran belajar

  const [cryptoBalance, setCryptoBalance] = useState<number>(0);
  const [goldWeight, setGoldWeight] = useState<number>(0);
  const [silverWeight, setSilverWeight] = useState<number>(0);
  const [goldType, setGoldType] = useState<"simpanan" | "perhiasan">(
    "simpanan",
  );
  const [savingsAmount, setSavingsAmount] = useState<number>(0);
  const [investmentAmount, setInvestmentAmount] = useState<number>(0);

  // Prices State
  const [livePrices, setLivePrices] = useState({ btc: 0, gold: 0, silver: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // URL API
  const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

  // Fetch Market Prices
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/live-market`);
        const data = await response.json();
        setLivePrices({
          btc: data.btc,
          gold: data.gold_gram,
          silver: data.silver_gram,
        });
      } catch (error) {
        setLivePrices({ btc: 278821, gold: 571.86, silver: 10.59 });
      }
    };
    fetchPrices();
  }, [apiUrl]);

  const nisabSemasa = livePrices.gold * 85;

  // Logik Pengiraan Pendapatan
  // --- 1. LOGIK PENGIRAAN PENDAPATAN DENGAN HAD KIFAYAH ---
  const calculateIncomeZakat = useCallback(() => {
    // Bonus dibahagi 12 untuk pengiraan bulanan yang adil
    const totalMonthlyIncome = salary + bonus / 12;

    if (totalMonthlyIncome <= 0) {
      setIncomeZakatResult(0);
      return;
    }

    // --- KADAR HAD KIFAYAH (Standard Bulanan) ---
    const HAD_KIFAYAH = {
      DIRI: 1000,
      ISTERI: 500,
      ANAK: 250,
    };

    // 1. Kira Had Kifayah Asas berdasarkan tanggungan
    let pelepasanAsas = HAD_KIFAYAH.DIRI;
    if (hasSpouse) pelepasanAsas += HAD_KIFAYAH.ISTERI;
    pelepasanAsas += childrenCount * HAD_KIFAYAH.ANAK;

    // 2. Auto-Calculate KWSP 11% daripada Gaji Pokok (Boleh diubah manual kemudian)
    // Jika anda mahu pengguna isi sendiri, biarkan nilai kwsp dari state
    const kwspDeduction = kwsp > 0 ? kwsp : salary * 0.11;

    // 3. Kira Pelepasan Tambahan (KWSP + Ibu Bapa + Pendidikan)
    const pelepasanTambahan = kwspDeduction + parents + education;

    // 4. Pendapatan Bersih (Tolak semua pelepasan)
    const bakiPendapatan =
      totalMonthlyIncome - pelepasanAsas - pelepasanTambahan;

    // 5. Semakan Nisab (Nisab Semasa dibahagi 12)
    const nisabBulanan = nisabSemasa / 12;

    // SYARAT: Wajib Zakat jika Gaji Kasar > Nisab DAN ada baki selepas Had Kifayah
    if (totalMonthlyIncome >= nisabBulanan && bakiPendapatan > 0) {
      setIncomeZakatResult(bakiPendapatan * 0.025);
    } else {
      setIncomeZakatResult(0);
    }
  }, [
    salary,
    bonus,
    hasSpouse,
    childrenCount,
    kwsp,
    parents,
    education,
    nisabSemasa,
  ]);

  // Panggil fungsi pengiraan setiap kali input berubah
  useEffect(() => {
    calculateIncomeZakat();
  }, [calculateIncomeZakat]);
  // Logik Zakat
  const cryptoZakat = () =>
    cryptoBalance * livePrices.btc >= nisabSemasa
      ? cryptoBalance * livePrices.btc * 0.025
      : 0;
  const goldZakat = () => {
    const URF_SABAH = 150;
    if (goldType === "simpanan")
      return goldWeight >= 85 ? goldWeight * livePrices.gold * 0.025 : 0;
    return goldWeight > URF_SABAH
      ? (goldWeight - URF_SABAH) * livePrices.gold * 0.025
      : 0;
  };
  const silverZakat = () =>
    silverWeight >= 595 ? silverWeight * livePrices.silver * 0.025 : 0;
  const wealthZakat = () =>
    savingsAmount + investmentAmount >= nisabSemasa
      ? (savingsAmount + investmentAmount) * 0.025
      : 0;

  const grandTotal = () =>
    incomeZakatResult +
    goldZakat() +
    silverZakat() +
    cryptoZakat() +
    wealthZakat();

  // --- HANDLE SUBMIT DENGAN TEKNIK BYPASS ANY ---
  // --- GANTIKAN SEMUA BLOK SUBMIT & CONFIRM DENGAN INI ---
  const handleFinalSubmit = async () => {
    const totalValue = grandTotal();

    if (totalValue <= 0) {
      toast.error("Tiada jumlah zakat untuk direkodkan.");
      return;
    }

    const token = localStorage.getItem("maliyyah_token");

    const payload = {
      kategori: "ZAKAT KESELURUHAN",
      total_zakat: Number(totalValue.toFixed(2)),
      pendapatan: Number(incomeZakatResult.toFixed(2)),
      kripto: Number(cryptoZakat().toFixed(2)),
      harta: Number(wealthZakat().toFixed(2)),
      logam: Number((goldZakat() + silverZakat()).toFixed(2)),
    };

    try {
      const response = await fetch(`${apiUrl}/api/calculate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        (setZakatResults as any)(payload);
        toast.success("Rekod berjaya disimpan!");
        setIsModalOpen(true);
      } else {
        toast.error("Gagal menyimpan rekod.");
      }
    } catch (error) {
      console.error("Ralat:", error);
      toast.error("Ralat pelayan.");
    }
  };

  const onConfirmIntent = (method: string) => {
    if (method === "MUIS") {
      window.open("https://zakat.muis.gov.my/online/", "_blank");
    }
    setIsModalOpen(false);
    navigate("/dashboard");
  };
  // --- HABIS BLOK ---
  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto pb-20 text-slate-900">
      {/* HEADER SECTION */}
      <header className="text-center space-y-2 mb-10">
        <h1 className="text-4xl font-black tracking-tighter">
          Maliyyah Zakat Engine
        </h1>
        <div className="flex items-center justify-center gap-2 text-xs text-amber-600 font-bold bg-amber-50 w-fit mx-auto px-3 py-1 rounded-full border border-amber-100">
          <Info size={14} /> Nisab: RM{" "}
          {nisabSemasa.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </div>
      </header>

      {/* KAD INDUK UTAMA (GRID 2 KOLUM) */}
      <Card className="border-t-8 border-t-green-600 shadow-2xl overflow-hidden">
        <CardContent className="p-6 md:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            {/* KOLUM KIRI: SEMUA INPUT ZAKAT ASAL ANDA */}
            <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. KAD PENDAPATAN (ASAL) */}
                <Card className="border-blue-100 shadow-sm flex flex-col">
                  <CardHeader className="bg-blue-50/50">
                    <CardTitle className="flex items-center gap-2 text-blue-700 font-bold">
                      <Banknote size={20} /> Input Pendapatan
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4 flex-grow">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 text-center block">
                          Gaji Hakiki
                        </label>
                        <input
                          type="number"
                          placeholder="Contoh: 3500"
                          className="p-3 border rounded-xl w-full mt-1 focus:ring-2 focus:ring-blue-400 outline-none transition-all"
                          onChange={(e) => setSalary(Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 text-center block">
                          Bonus/Lain-lain
                        </label>
                        <input
                          type="number"
                          placeholder="Contoh: 1000"
                          className="p-3 border rounded-xl w-full mt-1 focus:ring-2 focus:ring-blue-400 outline-none transition-all"
                          onChange={(e) => setBonus(Number(e.target.value))}
                        />
                      </div>
                    </div>
                    <div className="mt-6">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 text-center">
                        Zakat Pendapatan (Sebulan)
                      </p>
                      <div className="p-4 bg-blue-600 rounded-2xl text-white text-center shadow-lg shadow-blue-200">
                        <span className="text-3xl font-black">
                          RM{" "}
                          {incomeZakatResult.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 2. KAD PELEPASAN & HAD KIFAYAH (ASAL) */}
                <Card className="border-emerald-100 shadow-sm flex flex-col">
                  <CardHeader className="bg-emerald-50/50">
                    <CardTitle className="flex items-center gap-2 text-emerald-700 font-bold">
                      <CheckCircle2 size={20} /> Pelepasan & Had Kifayah
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase">
                          KWSP (11%)
                        </label>
                        <input
                          type="number"
                          placeholder={`RM ${(salary * 0.11).toFixed(0)}`}
                          className="p-3 border rounded-xl w-full mt-1 bg-slate-50 focus:bg-white transition-all"
                          onChange={(e) => setKwsp(Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase">
                          Ibu Bapa
                        </label>
                        <input
                          type="number"
                          placeholder="RM"
                          className="p-3 border rounded-xl w-full mt-1"
                          onChange={(e) => setParents(Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase">
                          Pendidikan
                        </label>
                        <input
                          type="number"
                          placeholder="RM"
                          className="p-3 border rounded-xl w-full mt-1"
                          onChange={(e) => setEducation(Number(e.target.value))}
                        />
                      </div>
                    </div>
                    <div className="p-4 bg-emerald-50 rounded-2xl border border-dashed border-emerald-200 mt-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-emerald-800 font-medium italic">
                          Jumlah Had Kifayah:
                        </span>
                        <span className="font-black text-emerald-700 text-lg">
                          RM{" "}
                          {(
                            1000 +
                            (hasSpouse ? 500 : 0) +
                            childrenCount * 250
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 3. KAD KRIPTO (ASAL) */}
                <Card className="border-orange-100 shadow-sm">
                  <CardHeader className="bg-orange-50/50">
                    <CardTitle className="flex items-center gap-2 text-orange-700 font-bold">
                      <TrendingUp size={20} /> Kripto
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <input
                      type="number"
                      placeholder="BTC / Value"
                      className="p-3 border rounded-xl w-full"
                      onChange={(e) => setCryptoBalance(Number(e.target.value))}
                    />
                    <div className="p-3 bg-orange-600 rounded-xl text-white text-center font-bold">
                      RM {cryptoZakat().toFixed(2)}
                    </div>
                  </CardContent>
                </Card>

                {/* 4. KAD LOGAM (ASAL) */}
                <Card className="border-yellow-100 shadow-sm">
                  <CardHeader className="bg-yellow-50/50">
                    <CardTitle className="flex items-center gap-2 text-yellow-700 font-bold">
                      <Coins size={20} /> Logam
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        placeholder="Emas (g)"
                        className="p-3 border rounded-xl w-full"
                        onChange={(e) => setGoldWeight(Number(e.target.value))}
                      />
                      <input
                        type="number"
                        placeholder="Perak (g)"
                        className="p-3 border rounded-xl w-full"
                        onChange={(e) =>
                          setSilverWeight(Number(e.target.value))
                        }
                      />
                    </div>
                    <div className="p-3 bg-yellow-600 rounded-xl text-white text-center font-bold">
                      RM {(goldZakat() + silverZakat()).toFixed(2)}
                    </div>
                  </CardContent>
                </Card>

                {/* 5. KAD HARTA (ASAL) */}
                <Card className="border-emerald-100 shadow-sm md:col-span-2">
                  <CardHeader className="bg-emerald-50/50">
                    <CardTitle className="flex items-center gap-2 text-emerald-700 font-bold">
                      <Wallet size={20} /> Harta / Simpanan
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <input
                      type="number"
                      placeholder="Masukkan jumlah simpanan (RM)"
                      className="p-4 border-2 rounded-2xl w-full text-lg focus:border-emerald-500 outline-none transition-all"
                      onChange={(e) => setSavingsAmount(Number(e.target.value))}
                    />
                    <div className="p-4 bg-emerald-600 rounded-2xl text-white text-center font-black text-xl">
                      RM{" "}
                      {wealthZakat().toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* KOLUM KANAN: JUMLAH ZAKAT WAJIB (PINDAHAN) */}
            <div className="lg:sticky lg:top-10 space-y-6">
              <div className="flex flex-col items-center justify-center p-10 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200 text-center">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                  JUMLAH ZAKAT WAJIB
                </p>
                <h2 className="text-6xl font-black text-green-600 tracking-tighter mb-8">
                  RM{" "}
                  {grandTotal().toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </h2>

                <Button
                  onClick={handleFinalSubmit}
                  className="w-full py-8 bg-green-600 hover:bg-green-700 text-white rounded-full text-xl font-bold shadow-xl shadow-green-100 flex items-center justify-center gap-3 transition-transform active:scale-95"
                >
                  <CheckCircle size={24} /> Tunaikan & Simpan
                </Button>

                <p className="mt-6 text-[10px] text-slate-400 font-medium px-4 leading-relaxed">
                  Data akan direkodkan secara automatik ke dalam sejarah
                  aktiviti anda.
                </p>
              </div>

              {/* TIPS TAMBAHAN (OPTIONAL) */}
              <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100 text-blue-800 text-xs">
                <strong>Info:</strong> Pastikan semua input adalah berdasarkan
                nilai semasa untuk ketepatan pengiraan.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* MODAL & OTHERS */}
      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirmIntent={onConfirmIntent}
        totalAmount={grandTotal()}
      />
    </div>
  );
}
