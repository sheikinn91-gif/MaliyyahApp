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
        <h1 className="text-4xl font-black tracking-tighter text-slate-800">
          Maliyyah Zakat Engine
        </h1>
        <div className="flex items-center justify-center gap-2 text-xs text-amber-600 font-bold bg-amber-50 w-fit mx-auto px-3 py-1 rounded-full border border-amber-100">
          <Info size={14} /> Nisab Semasa: RM {nisabSemasa.toLocaleString()}
        </div>
      </header>

      {/* GRID UTAMA (3 KOLUM PADA SKRIN BESAR) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {/* 1. KAD PENDAPATAN */}
        <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden flex flex-col">
          <div className="p-6 bg-blue-50/50 border-b border-blue-100">
            <h3 className="flex items-center gap-2 text-blue-700 font-bold text-lg">
              <Banknote size={20} /> Input Pendapatan
            </h3>
          </div>
          <CardContent className="p-6 space-y-6 flex-grow">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Gaji Hakiki
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  onChange={(e) => setSalary(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Bonus
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  onChange={(e) => setBonus(Number(e.target.value))}
                />
              </div>
            </div>
            <div className="p-5 bg-gradient-to-br from-blue-600 to-blue-700 rounded-[2rem] text-white text-center shadow-lg">
              <p className="text-[10px] font-bold uppercase opacity-80 mb-1">
                Zakat Pendapatan
              </p>
              <p className="text-2xl font-black">
                RM{" "}
                {incomeZakatResult.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 2. KAD PELEPASAN */}
        <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden flex flex-col">
          <div className="p-6 bg-emerald-50/50 border-b border-emerald-100">
            <h3 className="flex items-center gap-2 text-emerald-700 font-bold text-lg">
              <CheckCircle2 size={20} /> Pelepasan
            </h3>
          </div>
          <CardContent className="p-6 space-y-4 flex-grow">
            <div className="grid grid-cols-3 gap-2">
              <input
                type="number"
                placeholder="KWSP"
                className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs"
                onChange={(e) => setKwsp(Number(e.target.value))}
              />
              <input
                type="number"
                placeholder="Ibu Bapa"
                className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs"
                onChange={(e) => setParents(Number(e.target.value))}
              />
              <input
                type="number"
                placeholder="Belajar"
                className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs"
                onChange={(e) => setEducation(Number(e.target.value))}
              />
            </div>
            <div className="p-4 bg-emerald-50 rounded-2xl border border-dashed border-emerald-200 flex justify-between items-center mt-auto">
              <span className="text-xs font-bold text-emerald-800">
                Had Kifayah:
              </span>
              <span className="font-black text-emerald-700">
                RM{" "}
                {(
                  1000 +
                  (hasSpouse ? 500 : 0) +
                  childrenCount * 250
                ).toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* 3. KAD KRIPTO */}
        <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden flex flex-col">
          <div className="p-6 bg-orange-50/50 border-b border-orange-100">
            <h3 className="flex items-center gap-2 text-orange-700 font-bold text-lg">
              <TrendingUp size={20} /> Zakat Kripto
            </h3>
          </div>
          <CardContent className="p-6 space-y-4 flex-grow">
            <input
              type="number"
              placeholder="Nilai Pelaburan (RM)"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500"
              onChange={(e) => setCryptoBalance(Number(e.target.value))}
            />
            <div className="p-3 bg-orange-600 rounded-xl text-white text-center font-black mt-auto">
              RM {cryptoZakat().toFixed(2)}
            </div>
          </CardContent>
        </Card>

        {/* 4. KAD LOGAM */}
        <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden flex flex-col">
          <div className="p-6 bg-yellow-50/50 border-b border-yellow-100">
            <h3 className="flex items-center gap-2 text-yellow-700 font-bold text-lg">
              <Coins size={20} /> Zakat Logam
            </h3>
          </div>
          <CardContent className="p-6 space-y-4 flex-grow">
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Emas (g)"
                className="p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                onChange={(e) => setGoldWeight(Number(e.target.value))}
              />
              <input
                type="number"
                placeholder="Perak (g)"
                className="p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                onChange={(e) => setSilverWeight(Number(e.target.value))}
              />
            </div>
            <div className="p-3 bg-yellow-600 rounded-xl text-white text-center font-black mt-auto">
              RM {(goldZakat() + silverZakat()).toFixed(2)}
            </div>
          </CardContent>
        </Card>

        {/* 5. KAD HARTA / SIMPANAN */}
        <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden flex flex-col">
          <div className="p-6 bg-emerald-50/50 border-b border-emerald-100">
            <h3 className="flex items-center gap-2 text-emerald-700 font-bold text-lg">
              <Wallet size={20} /> Zakat Harta
            </h3>
          </div>
          <CardContent className="p-6 space-y-4 flex-grow flex flex-col justify-between">
            <input
              type="number"
              placeholder="Simpanan (RM)"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500"
              onChange={(e) => setSavingsAmount(Number(e.target.value))}
            />
            <div className="p-3 bg-emerald-600 rounded-xl text-white text-center font-black">
              RM {wealthZakat().toFixed(2)}
            </div>
          </CardContent>
        </Card>

        {/* 6. KAD JUMLAH ZAKAT WAJIB (INI BAHAGIAN PINDAHAN) */}
        <Card className="border-2 border-dashed border-green-200 bg-green-50/30 rounded-[2.5rem] flex flex-col overflow-hidden items-center justify-center p-6 text-center">
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">
            Jumlah Zakat Wajib
          </p>

          <h2 className="text-5xl font-black text-green-600 tracking-tighter mb-6">
            RM{" "}
            {grandTotal().toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </h2>

          <Button
            onClick={handleFinalSubmit}
            className="w-full py-7 bg-green-600 hover:bg-green-700 text-white rounded-full text-lg font-bold shadow-xl shadow-green-200 transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            <CheckCircle size={22} /> Tunaikan & Simpan
          </Button>
        </Card>
      </div>

      {/* MODAL */}
      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirmIntent={onConfirmIntent}
        totalAmount={grandTotal()}
      />
    </div>
  );
}
