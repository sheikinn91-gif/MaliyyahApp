import React, { useState, useEffect } from "react";
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

  // Ambil URL dari env
  const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

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

  // Logik Nisab Dinamik (85g Emas)
  const nisabSemasa = livePrices.gold * 85;

  // Calculation Logic
  const incomeZakat = () => {
    const totalSetahun = (salary + bonus) * 12;
    return totalSetahun >= nisabSemasa ? (totalSetahun * 0.025) / 12 : 0;
  };

  const cryptoZakat = () => {
    const nilaiKripto = cryptoBalance * livePrices.btc;
    return nilaiKripto >= nisabSemasa ? nilaiKripto * 0.025 : 0;
  };

  const goldZakat = () => {
    const NISAB_BERAT = 85;
    const URF_SABAH = 150;

    if (goldType === "simpanan") {
      return goldWeight >= NISAB_BERAT
        ? goldWeight * livePrices.gold * 0.025
        : 0;
    } else {
      return goldWeight > URF_SABAH
        ? (goldWeight - URF_SABAH) * livePrices.gold * 0.025
        : 0;
    }
  };

  const silverZakat = () => {
    const NISAB_PERAK = 595;
    return silverWeight >= NISAB_PERAK
      ? silverWeight * livePrices.silver * 0.025
      : 0;
  };

  const wealthZakat = () => {
    const total = savingsAmount + investmentAmount;
    return total >= nisabSemasa ? total * 0.025 : 0;
  };

  const grandTotal = () =>
    incomeZakat() + goldZakat() + silverZakat() + cryptoZakat() + wealthZakat();

  // Submit to Backend
  const handleFinalSubmit = async () => {
    const totalValue = grandTotal();

    if (totalValue <= 0) {
      toast.error("Tiada jumlah zakat untuk direkodkan.");
      return;
    }

    const payload = {
      pendapatan: Number(incomeZakat().toFixed(2)),
      kripto: Number(cryptoZakat().toFixed(2)),
      harta: Number(wealthZakat().toFixed(2)),
      logam: Number((goldZakat() + silverZakat()).toFixed(2)),
      total_zakat: Number(totalValue.toFixed(2)),
    };

    try {
      const response = await fetch(`${apiUrl}/api/calculate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setZakatResults(payload);
        toast.success("Rekod zakat berjaya disimpan!");
        setIsModalOpen(true);
      } else {
        toast.error("Gagal menyimpan rekod.");
      }
    } catch (error) {
      toast.error("Ralat menghubungi pelayan.");
    }
  };

  const onConfirmIntent = (method: string) => {
    if (method === "MUIS")
      window.open("https://zakat.muis.gov.my/online/", "_blank");
    setIsModalOpen(false);
    navigate("/dashboard");
  };

  return (
    <div className="p-4 space-y-6 max-w-6xl mx-auto pb-20 text-slate-900">
      <header className="text-center space-y-2">
        <h1 className="text-4xl font-black tracking-tighter">
          Maliyyah Zakat Engine
        </h1>
        <div className="flex items-center justify-center gap-2 text-xs text-amber-600 font-bold bg-amber-50 w-fit mx-auto px-3 py-1 rounded-full border border-amber-100">
          <Info size={14} /> Nisab Semasa: RM{" "}
          {nisabSemasa.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </div>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Card Pendapatan */}
        <Card className="border-blue-100 shadow-sm overflow-hidden">
          <CardHeader className="bg-blue-50/50">
            <CardTitle className="flex items-center gap-2 text-blue-700 font-bold">
              <Banknote className="size-5" /> Pendapatan Bulanan
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <input
              type="number"
              placeholder="Gaji (RM)"
              className="w-full p-3 border rounded-xl"
              onChange={(e) => setSalary(Number(e.target.value))}
            />
            <input
              type="number"
              placeholder="Bonus (RM)"
              className="w-full p-3 border rounded-xl"
              onChange={(e) => setBonus(Number(e.target.value))}
            />
            <div className="p-3 bg-blue-600 rounded-xl text-white text-center font-bold">
              RM {incomeZakat().toFixed(2)}
            </div>
          </CardContent>
        </Card>

        {/* Card Kripto */}
        <Card className="border-orange-100 shadow-sm overflow-hidden">
          <CardHeader className="bg-orange-50/50">
            <CardTitle className="flex items-center gap-2 text-orange-700 font-bold">
              <TrendingUp className="size-5" /> Kripto (Live BTC)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="text-[10px] text-orange-600 font-bold text-right">
              Harga: RM {livePrices.btc.toLocaleString()}
            </div>
            <input
              type="number"
              placeholder="Jumlah Bitcoin (BTC)"
              className="w-full p-3 border rounded-xl"
              onChange={(e) => setCryptoBalance(Number(e.target.value))}
            />
            <div className="p-3 bg-orange-600 rounded-xl text-white text-center font-bold">
              RM {cryptoZakat().toFixed(2)}
            </div>
          </CardContent>
        </Card>

        {/* Card Logam */}
        <Card className="border-yellow-100 shadow-sm overflow-hidden">
          <CardHeader className="bg-yellow-50/50">
            <CardTitle className="flex items-center gap-2 text-yellow-700 font-bold">
              <Coins className="size-5" /> Logam Mulia
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex gap-1">
                <button
                  onClick={() => setGoldType("simpanan")}
                  className={`text-[10px] px-2 py-1 rounded-md font-bold transition-colors ${goldType === "simpanan" ? "bg-yellow-600 text-white" : "bg-yellow-100 text-yellow-700"}`}
                >
                  Simpanan
                </button>
                <button
                  onClick={() => setGoldType("perhiasan")}
                  className={`text-[10px] px-2 py-1 rounded-md font-bold transition-colors ${goldType === "perhiasan" ? "bg-yellow-600 text-white" : "bg-yellow-100 text-yellow-700"}`}
                >
                  Perhiasan (Sabah)
                </button>
              </div>
              <div className="text-[10px] text-yellow-600 font-bold">
                Emas: RM {livePrices.gold.toFixed(2)}/g
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Emas (g)"
                className="p-3 border rounded-xl"
                onChange={(e) => setGoldWeight(Number(e.target.value))}
              />
              <input
                type="number"
                placeholder="Perak (g)"
                className="p-3 border rounded-xl"
                onChange={(e) => setSilverWeight(Number(e.target.value))}
              />
            </div>
            <div className="p-3 bg-yellow-600 rounded-xl text-white text-center font-bold">
              RM {(goldZakat() + silverZakat()).toFixed(2)}
            </div>
          </CardContent>
        </Card>

        {/* Card Harta */}
        <Card className="border-emerald-100 shadow-sm overflow-hidden">
          <CardHeader className="bg-emerald-50/50">
            <CardTitle className="flex items-center gap-2 text-emerald-700 font-bold">
              <Wallet className="size-5" /> Harta & Simpanan
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <input
              type="number"
              placeholder="Simpanan / Pelaburan (RM)"
              className="w-full p-3 border rounded-xl"
              onChange={(e) => setSavingsAmount(Number(e.target.value))}
            />
            <div className="p-3 bg-emerald-600 rounded-xl text-white text-center font-bold">
              RM {wealthZakat().toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer Total */}
      <Card className="border-t-8 border-t-green-600 bg-white shadow-2xl mt-10">
        <CardContent className="p-10 flex flex-col items-center gap-6">
          <div className="text-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Jumlah Zakat Wajib
            </p>
            <h2 className="text-6xl font-black text-green-600">
              RM{" "}
              {grandTotal().toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </h2>
          </div>
          <Button
            onClick={handleFinalSubmit}
            className="px-12 py-8 bg-green-600 hover:bg-green-700 text-white rounded-full text-xl font-bold shadow-xl flex items-center gap-3"
          >
            <CheckCircle className="size-6" /> Tunaikan & Simpan
          </Button>
        </CardContent>
      </Card>

      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirmIntent={onConfirmIntent}
        totalAmount={grandTotal()}
      />
    </div>
  );
}
