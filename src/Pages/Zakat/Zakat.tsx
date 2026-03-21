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
    <div className="w-full min-h-screen bg-slate-50/50 p-4 md:p-8 pb-24 text-slate-900">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* HEADER SECTION */}
        <header className="text-center space-y-3 mb-12">
          <h1 className="text-4xl font-black text-slate-800 tracking-tight italic">
            Maliyyah{" "}
            <span className="text-green-600 not-italic">Zakat Engine</span>
          </h1>
          <div className="inline-flex items-center gap-3 bg-white px-6 py-2 rounded-2xl shadow-sm border border-slate-100">
            <div className="p-1 bg-amber-100 rounded-lg text-amber-600">
              <Info size={16} />
            </div>
            <span className="text-sm font-bold text-slate-600">
              Nisab Semasa: RM {nisabSemasa.toLocaleString()}
            </span>
          </div>
        </header>

        {/* GRID UTAMA - 3 KOLUM YANG SEIMBANG */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {/* 1. KAD PENDAPATAN */}
          <Card className="border-none shadow-xl bg-white rounded-[2.5rem] overflow-hidden flex flex-col">
            <div className="p-6 bg-blue-50/50 border-b border-blue-50 flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-200">
                <Banknote size={20} />
              </div>
              <h3 className="font-bold text-slate-800">Input Pendapatan</h3>
            </div>
            <CardContent className="p-8 flex flex-col flex-grow">
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Gaji Hakiki
                  </label>
                  <input
                    type="number"
                    placeholder="RM 0.00"
                    className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold"
                    onChange={(e) => setSalary(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Bonus / Extra
                  </label>
                  <input
                    type="number"
                    placeholder="RM 0.00"
                    className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold"
                    onChange={(e) => setBonus(Number(e.target.value))}
                  />
                </div>
              </div>
              {/* mt-auto memastikan butang sentiasa di bawah baris yang sama dengan kad lain */}
              <div className="mt-auto pt-8">
                <div className="p-6 bg-blue-600 rounded-[2rem] text-white text-center shadow-xl shadow-blue-100">
                  <p className="text-[10px] font-bold uppercase opacity-80 mb-1 tracking-tighter">
                    Zakat Pendapatan
                  </p>
                  <p className="text-3xl font-black">
                    RM{" "}
                    {incomeZakatResult.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. KAD PELEPASAN - SUSUNAN MENEGAK BERSIH */}
          <Card className="border-none shadow-xl bg-white rounded-[2.5rem] overflow-hidden flex flex-col">
            <div className="p-6 bg-emerald-50/50 border-b border-emerald-50 flex items-center gap-3">
              <div className="p-2 bg-emerald-600 rounded-xl text-white shadow-lg shadow-emerald-200">
                <CheckCircle2 size={20} />
              </div>
              <h3 className="font-bold text-slate-800">Pelepasan & Had</h3>
            </div>
            <CardContent className="p-8 flex flex-col flex-grow">
              <div className="space-y-4">
                {[
                  { label: "KWSP (11%)", key: "kwsp" },
                  { label: "Ibu Bapa", key: "parents" },
                  { label: "Pendidikan", key: "edu" },
                ].map((item) => (
                  <div key={item.key} className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      {item.label}
                    </label>
                    <input
                      type="number"
                      placeholder="RM"
                      className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 focus:bg-white outline-none transition-all font-bold"
                      onChange={(e) => {
                        if (item.key === "kwsp")
                          setKwsp(Number(e.target.value));
                        if (item.key === "parents")
                          setParents(Number(e.target.value));
                        if (item.key === "edu")
                          setEducation(Number(e.target.value));
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-auto pt-6">
                <div className="p-5 bg-emerald-50 rounded-[1.5rem] border-2 border-dashed border-emerald-200 flex justify-between items-center">
                  <div className="text-left">
                    <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">
                      Total Had Kifayah
                    </p>
                    <p className="font-black text-emerald-800 text-xl">
                      RM{" "}
                      {(
                        1000 +
                        (hasSpouse ? 500 : 0) +
                        childrenCount * 250
                      ).toLocaleString()}
                    </p>
                  </div>
                  <Info size={18} className="text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3. KAD KRIPTO - JARAK DIBETULKAN */}
          <Card className="border-none shadow-xl bg-white rounded-[2.5rem] overflow-hidden flex flex-col">
            <div className="p-6 bg-orange-50/50 border-b border-orange-50 flex items-center gap-3">
              <div className="p-2 bg-orange-600 rounded-xl text-white shadow-lg shadow-orange-200">
                <TrendingUp size={20} />
              </div>
              <h3 className="font-bold text-slate-800">Zakat Kripto</h3>
            </div>
            <CardContent className="p-8 flex flex-col flex-grow">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Nilai Portfolio (RM)
                </label>
                <input
                  type="number"
                  placeholder="RM 0.00"
                  className="w-full p-5 bg-slate-50 border-2 border-transparent rounded-[2rem] text-center text-xl font-black text-orange-700 outline-none focus:border-orange-500 focus:bg-white transition-all shadow-inner"
                  onChange={(e) => setCryptoBalance(Number(e.target.value))}
                />
              </div>
              <div className="mt-auto pt-8">
                <div className="p-5 bg-orange-600 rounded-[2rem] text-white text-center font-black text-xl shadow-lg shadow-orange-100">
                  RM {cryptoZakat().toFixed(2)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 4. KAD LOGAM */}
          <Card className="border-none shadow-xl bg-white rounded-[2.5rem] overflow-hidden flex flex-col">
            <div className="p-6 bg-yellow-50/50 border-b border-yellow-100 flex items-center gap-3">
              <div className="p-2 bg-yellow-600 rounded-xl text-white shadow-lg shadow-yellow-200">
                <Coins size={20} />
              </div>
              <h3 className="font-bold text-slate-800">Zakat Logam</h3>
            </div>
            <CardContent className="p-8 flex flex-col flex-grow">
              <div className="space-y-4">
                <input
                  type="number"
                  placeholder="Berat Emas (g)"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-yellow-500"
                  onChange={(e) => setGoldWeight(Number(e.target.value))}
                />
                <input
                  type="number"
                  placeholder="Berat Perak (g)"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-yellow-500"
                  onChange={(e) => setSilverWeight(Number(e.target.value))}
                />
              </div>
              <div className="mt-auto pt-8">
                <div className="p-5 bg-yellow-600 rounded-[2rem] text-white text-center font-black text-xl shadow-lg shadow-yellow-100">
                  RM {(goldZakat() + silverZakat()).toFixed(2)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 5. KAD HARTA */}
          <Card className="border-none shadow-xl bg-white rounded-[2.5rem] overflow-hidden flex flex-col">
            <div className="p-6 bg-teal-50/50 border-b border-teal-50 flex items-center gap-3">
              <div className="p-2 bg-teal-600 rounded-xl text-white shadow-lg shadow-teal-200">
                <Wallet size={20} />
              </div>
              <h3 className="font-bold text-slate-800">Zakat Harta</h3>
            </div>
            <CardContent className="p-8 flex flex-col flex-grow">
              <div className="space-y-2 text-center">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                  Simpanan / Tunai
                </label>
                <input
                  type="number"
                  placeholder="RM 0.00"
                  className="w-full p-5 bg-slate-50 border-2 border-teal-100 rounded-[2rem] text-2xl font-black text-center text-teal-700 outline-none focus:border-teal-500 focus:bg-white transition-all shadow-inner"
                  onChange={(e) => setSavingsAmount(Number(e.target.value))}
                />
              </div>
              <div className="mt-auto pt-8">
                <div className="p-5 bg-teal-600 rounded-[2rem] text-white text-center font-black text-xl shadow-lg shadow-teal-100">
                  RM {wealthZakat().toFixed(2)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 6. KAD JUMLAH ZAKAT WAJIB (SEBELAH HARTA) */}
          <Card className="border-4 border-dashed border-green-200 bg-green-50/40 rounded-[3rem] flex flex-col items-center justify-center p-8 text-center relative group overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-green-500"></div>
            <p className="text-xs font-black text-green-700 uppercase tracking-[0.4em] mb-4">
              Total Zakat Wajib
            </p>
            <div className="mb-8">
              <h2 className="text-6xl font-black text-green-600 tracking-tighter group-hover:scale-110 transition-transform duration-500">
                RM{" "}
                {grandTotal().toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </h2>
              <div className="w-20 h-1.5 bg-green-200 mx-auto mt-2 rounded-full"></div>
            </div>
            <Button
              onClick={handleFinalSubmit}
              className="w-full py-9 bg-green-600 hover:bg-green-700 text-white rounded-full text-2xl font-black shadow-2xl shadow-green-200 transition-all active:scale-95 flex items-center justify-center gap-4"
            >
              <CheckCircle size={32} /> Tunaikan & Simpan
            </Button>
          </Card>
        </div>
      </div>

      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirmIntent={onConfirmIntent}
        totalAmount={grandTotal()}
      />
    </div>
  );
}
