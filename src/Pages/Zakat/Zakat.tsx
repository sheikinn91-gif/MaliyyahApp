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
    /* Container utama dengan padding yang selamat untuk dashboard */
    <div className="w-full min-h-screen bg-slate-50/30 p-4 md:p-6 lg:p-8 pb-24">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER: Ringkas & Tidak Mengganggu Dashboard */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              Maliyyah <span className="text-green-600">Zakat Engine</span>
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              Kira zakat anda dengan tepat dan pantas.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100">
            <div className="p-1.5 bg-amber-100 rounded-lg text-amber-600">
              <Info size={16} />
            </div>
            <div className="text-xs">
              <p className="text-slate-400 font-bold uppercase tracking-tighter">
                Nisab Semasa
              </p>
              <p className="text-slate-800 font-black text-base">
                RM {nisabSemasa.toLocaleString()}
              </p>
            </div>
          </div>
        </header>

        {/* GRID UTAMA: 3 Kolum Stabil */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {/* 1. KAD PENDAPATAN */}
          <Card className="border-none shadow-md bg-white rounded-[2rem] overflow-hidden flex flex-col">
            <div className="p-6 bg-blue-50/30 border-b border-blue-50 flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-xl text-white">
                <Banknote size={20} />
              </div>
              <h3 className="font-bold text-slate-800">Pendapatan</h3>
            </div>
            <CardContent className="p-6 space-y-4 flex-grow">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Gaji Hakiki
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    onChange={(e) => setSalary(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Bonus / Lain
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    onChange={(e) => setBonus(Number(e.target.value))}
                  />
                </div>
              </div>
              <div className="p-5 bg-blue-600 rounded-2xl text-white text-center mt-4 shadow-lg shadow-blue-100">
                <p className="text-[10px] font-bold uppercase opacity-80">
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

          {/* 2. KAD PELEPASAN: Susunan Menegak (Saranan Anda) */}
          <Card className="border-none shadow-md bg-white rounded-[2rem] overflow-hidden flex flex-col">
            <div className="p-6 bg-emerald-50/30 border-b border-emerald-50 flex items-center gap-3">
              <div className="p-2 bg-emerald-600 rounded-xl text-white">
                <CheckCircle2 size={20} />
              </div>
              <h3 className="font-bold text-slate-800">Pelepasan</h3>
            </div>
            <CardContent className="p-6 space-y-4 flex-grow flex flex-col justify-between">
              <div className="space-y-3">
                {["KWSP (11%)", "Ibu Bapa", "Pendidikan"].map((label, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-100"
                  >
                    <span className="text-[9px] font-black text-slate-400 uppercase w-16 pl-2">
                      {label.split(" ")[0]}
                    </span>
                    <input
                      type="number"
                      placeholder="RM"
                      className="flex-1 p-2 bg-white border border-slate-200 rounded-lg text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                      onChange={(e) => {
                        if (idx === 0) setKwsp(Number(e.target.value));
                        if (idx === 1) setParents(Number(e.target.value));
                        if (idx === 2) setEducation(Number(e.target.value));
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="p-4 bg-emerald-50 rounded-xl border border-dashed border-emerald-200 flex justify-between items-center mt-4">
                <span className="text-[10px] font-bold text-emerald-700 uppercase">
                  Had Kifayah
                </span>
                <span className="font-black text-emerald-800">
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
          <Card className="border-none shadow-md bg-white rounded-[2rem] overflow-hidden flex flex-col">
            <div className="p-6 bg-orange-50/30 border-b border-orange-50 flex items-center gap-3">
              <div className="p-2 bg-orange-600 rounded-xl text-white">
                <TrendingUp size={20} />
              </div>
              <h3 className="font-bold text-slate-800">Kripto</h3>
            </div>
            <CardContent className="p-6 space-y-4 flex-grow flex flex-col justify-between">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Nilai Portfolio
                </label>
                <input
                  type="number"
                  placeholder="RM 0.00"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-center text-lg outline-none focus:ring-2 focus:ring-orange-500"
                  onChange={(e) => setCryptoBalance(Number(e.target.value))}
                />
              </div>
              <div className="p-4 bg-orange-600 rounded-xl text-white text-center font-black">
                RM {cryptoZakat().toFixed(2)}
              </div>
            </CardContent>
          </Card>

          {/* 4. KAD LOGAM */}
          <Card className="border-none shadow-md bg-white rounded-[2rem] overflow-hidden flex flex-col">
            <div className="p-6 bg-yellow-50/30 border-b border-yellow-50 flex items-center gap-3">
              <div className="p-2 bg-yellow-600 rounded-xl text-white">
                <Coins size={20} />
              </div>
              <h3 className="font-bold text-slate-800">Logam</h3>
            </div>
            <CardContent className="p-6 space-y-4 flex-grow flex flex-col justify-between">
              <div className="grid grid-cols-1 gap-3">
                <input
                  type="number"
                  placeholder="Emas (gram)"
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  onChange={(e) => setGoldWeight(Number(e.target.value))}
                />
                <input
                  type="number"
                  placeholder="Perak (gram)"
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  onChange={(e) => setSilverWeight(Number(e.target.value))}
                />
              </div>
              <div className="p-4 bg-yellow-600 rounded-xl text-white text-center font-black">
                RM {(goldZakat() + silverZakat()).toFixed(2)}
              </div>
            </CardContent>
          </Card>

          {/* 5. KAD HARTA */}
          <Card className="border-none shadow-md bg-white rounded-[2rem] overflow-hidden flex flex-col">
            <div className="p-6 bg-teal-50/30 border-b border-teal-50 flex items-center gap-3">
              <div className="p-2 bg-teal-600 rounded-xl text-white">
                <Wallet size={20} />
              </div>
              <h3 className="font-bold text-slate-800">Harta</h3>
            </div>
            <CardContent className="p-6 space-y-4 flex-grow flex flex-col justify-between">
              <div className="space-y-1 text-center">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Simpanan / Tunai
                </label>
                <input
                  type="number"
                  placeholder="RM 0.00"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-center text-lg outline-none focus:ring-2 focus:ring-teal-500"
                  onChange={(e) => setSavingsAmount(Number(e.target.value))}
                />
              </div>
              <div className="p-4 bg-teal-600 rounded-xl text-white text-center font-black">
                RM {wealthZakat().toFixed(2)}
              </div>
            </CardContent>
          </Card>

          {/* 6. JUMLAH ZAKAT (HASIL AKHIR - SEBALAH HARTA) */}
          <Card className="border-4 border-dashed border-green-200 bg-green-50/30 rounded-[2.5rem] flex flex-col items-center justify-center p-6 text-center shadow-inner relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
            <p className="text-[10px] font-black text-green-700 uppercase tracking-[0.3em] mb-2">
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
              className="w-full py-7 bg-green-600 hover:bg-green-700 text-white rounded-full text-lg font-bold shadow-lg shadow-green-100 flex items-center justify-center gap-2"
            >
              <CheckCircle size={20} /> Tunaikan & Simpan
            </Button>
          </Card>
        </div>

        {/* MODAL PEMBAYARAN */}
        <PaymentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirmIntent={onConfirmIntent}
          totalAmount={grandTotal()}
        />
      </div>
    </div>
  );
}
