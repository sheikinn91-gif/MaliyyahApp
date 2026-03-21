import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle,
  Banknote,
  TrendingUp,
  Coins,
  Wallet,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useZakat } from "@/components/Context/ZakatContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import AIChatbot from "@/components/Context/AIChatBot";
export default function Zakat() {
  const { setZakatResults } = useZakat();
  const navigate = useNavigate();

  // --- States ---
  const [salary, setSalary] = useState<number>(0);
  const [bonus, setBonus] = useState<number>(0);
  const [hasSpouse, setHasSpouse] = useState<boolean>(false);
  const [childrenCount, setChildrenCount] = useState<number>(0);
  const [incomeZakatResult, setIncomeZakatResult] = useState<number>(0);
  const [kwsp, setKwsp] = useState<number>(0);
  const [parents, setParents] = useState<number>(0);
  const [education, setEducation] = useState<number>(0);

  const [cryptoBalance, setCryptoBalance] = useState<number>(0);
  const [goldWeight, setGoldWeight] = useState<number>(0);
  const [silverWeight, setSilverWeight] = useState<number>(0);
  const [goldType, setGoldType] = useState<"simpanan" | "perhiasan">(
    "simpanan",
  );
  const [savingsAmount, setSavingsAmount] = useState<number>(0);
  const [investmentAmount, setInvestmentAmount] = useState<number>(0);

  const [livePrices, setLivePrices] = useState({
    btc: 278821,
    gold: 350.5,
    silver: 4.5,
  });
  const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

  // --- Fetch Prices ---
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
        console.log("Using default prices");
      }
    };
    fetchPrices();
  }, [apiUrl]);

  const nisabSemasa = livePrices.gold * 85;

  // --- Logik Pengiraan ---
  const calculateIncomeZakat = useCallback(() => {
    const totalMonthlyIncome = salary + bonus / 12;
    if (totalMonthlyIncome <= 0) {
      setIncomeZakatResult(0);
      return;
    }
    const HAD_KIFAYAH = { DIRI: 1000, ISTERI: 500, ANAK: 250 };
    let pelepasanAsas =
      HAD_KIFAYAH.DIRI +
      (hasSpouse ? HAD_KIFAYAH.ISTERI : 0) +
      childrenCount * HAD_KIFAYAH.ANAK;
    const kwspDeduction = kwsp > 0 ? kwsp : salary * 0.11;
    const bakiPendapatan =
      totalMonthlyIncome -
      pelepasanAsas -
      (kwspDeduction + parents + education);
    const nisabBulanan = nisabSemasa / 12;

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

  useEffect(() => {
    calculateIncomeZakat();
  }, [calculateIncomeZakat]);

  const cryptoZakat = () =>
    cryptoBalance * livePrices.btc >= nisabSemasa
      ? cryptoBalance * livePrices.btc * 0.025
      : 0;
  const goldZakat = () => {
    const URF = 150;
    if (goldType === "simpanan")
      return goldWeight >= 85 ? goldWeight * livePrices.gold * 0.025 : 0;
    return goldWeight > URF ? (goldWeight - URF) * livePrices.gold * 0.025 : 0;
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

  // --- FUNGSI SUBMIT KE DASHBOARD & API ---
  const handleFinalSubmit = async () => {
    try {
      const totalValue = grandTotal();

      if (totalValue <= 0) {
        toast.error("Sila masukkan nilai untuk dikira.");
        return;
      }

      // 1. Ambil Token & User
      const token = localStorage.getItem("maliyyah_token");
      const savedUser = localStorage.getItem("maliyyah_user");

      // 2. Siapkan Payload
      const payload = {
        total: Number(totalValue.toFixed(2)),
        pendapatan: Number(incomeZakatResult.toFixed(2)),
        kripto: Number(cryptoZakat().toFixed(2)),
        harta: Number(wealthZakat().toFixed(2)),
        logam: Number((goldZakat() + silverZakat()).toFixed(2)),
      };

      // 3. SIMPAN LOKAL (Paling Penting!)
      localStorage.setItem("maliyyah_zakat_data", JSON.stringify(payload));

      // Update context jika fungsi wujud
      if (setZakatResults) {
        (setZakatResults as any)(payload);
      }

      toast.success("Rekod disimpan!");

      // 4. Hantar API (Tanpa 'await' supaya tak sekat navigasi)
      if (token && savedUser) {
        fetch(`${apiUrl}/api/calculate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }).catch((e) => console.log("API 422/Error diabaikan"));
      }

      // 5. NAVIGASI PAKSA KE "/" (Dashboard Utama)
      // Kita guna timeout sedikit lama (1.2s) supaya toast sempat muncul
      setTimeout(() => {
        window.location.assign("/"); // Lebih stabil daripada .href
      }, 1200);
    } catch (error) {
      console.error("Critical Submit Error:", error);
      // Jika semua gagal, tetap paksa balik ke Dashboard
      window.location.assign("/");
    }
  };
  return (
    <div className="w-full min-h-screen bg-slate-50/50 p-4 lg:p-8 pb-24 text-slate-900">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 1. Pendapatan */}
          <Card className="border-none shadow-lg bg-white rounded-[2rem] overflow-hidden flex flex-col">
            <div className="p-5 bg-blue-50 flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg text-white">
                <Banknote size={18} />
              </div>
              <h3 className="font-bold text-sm">Pendapatan</h3>
            </div>
            <CardContent className="p-6 space-y-4">
              <input
                type="number"
                placeholder="RM Gaji"
                className="w-full p-3 bg-slate-50 rounded-xl font-bold"
                onChange={(e) => setSalary(Number(e.target.value))}
              />
              <input
                type="number"
                placeholder="RM Bonus"
                className="w-full p-3 bg-slate-50 rounded-xl font-bold"
                onChange={(e) => setBonus(Number(e.target.value))}
              />
              <div className="mt-auto p-4 bg-blue-600 rounded-2xl text-white text-center font-black">
                RM {incomeZakatResult.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          {/* 2. Pelepasan */}
          <Card className="border-none shadow-lg bg-white rounded-[2rem] overflow-hidden">
            <div className="p-5 bg-emerald-50 flex items-center gap-3">
              <div className="p-2 bg-emerald-600 rounded-lg text-white">
                <CheckCircle2 size={18} />
              </div>
              <h3 className="font-bold text-sm">Pelepasan</h3>
            </div>
            <CardContent className="p-6 space-y-3">
              <input
                type="number"
                placeholder="RM KWSP"
                className="w-full p-3 bg-slate-50 rounded-xl"
                onChange={(e) => setKwsp(Number(e.target.value))}
              />
              <input
                type="number"
                placeholder="RM Ibubapa"
                className="w-full p-3 bg-slate-50 rounded-xl"
                onChange={(e) => setParents(Number(e.target.value))}
              />
              <div className="p-3 bg-emerald-50 rounded-xl text-center text-emerald-700 font-bold uppercase text-[10px]">
                Had Kifayah Aktif
              </div>
            </CardContent>
          </Card>

          {/* 3. Kripto */}
          <Card className="border-none shadow-lg bg-white rounded-[2rem] overflow-hidden flex flex-col">
            <div className="p-5 bg-orange-50 flex items-center gap-3">
              <div className="p-2 bg-orange-600 rounded-lg text-white">
                <TrendingUp size={18} />
              </div>
              <h3 className="font-bold text-sm">Zakat Kripto</h3>
            </div>
            <CardContent className="p-6 space-y-4">
              <input
                type="number"
                placeholder="Portfolio (Unit)"
                className="w-full p-4 bg-slate-50 rounded-xl text-center font-black"
                onChange={(e) => setCryptoBalance(Number(e.target.value))}
              />
              <div className="mt-auto p-4 bg-orange-600 rounded-2xl text-white text-center font-black">
                RM {cryptoZakat().toFixed(2)}
              </div>
            </CardContent>
          </Card>

          {/* 4. Logam */}
          <Card className="border-none shadow-lg bg-white rounded-[2rem] overflow-hidden flex flex-col">
            <div className="p-5 bg-yellow-50 flex items-center gap-3">
              <div className="p-2 bg-yellow-600 rounded-lg text-white">
                <Coins size={18} />
              </div>
              <h3 className="font-bold text-sm">Logam</h3>
            </div>
            <CardContent className="p-6 space-y-3">
              <input
                type="number"
                placeholder="Emas (g)"
                className="w-full p-3 bg-slate-50 rounded-xl"
                onChange={(e) => setGoldWeight(Number(e.target.value))}
              />
              <input
                type="number"
                placeholder="Perak (g)"
                className="w-full p-3 bg-slate-50 rounded-xl"
                onChange={(e) => setSilverWeight(Number(e.target.value))}
              />
              <div className="mt-auto p-4 bg-yellow-600 rounded-2xl text-white text-center font-black">
                RM {(goldZakat() + silverZakat()).toFixed(2)}
              </div>
            </CardContent>
          </Card>

          {/* 5. Harta */}
          <Card className="border-none shadow-lg bg-white rounded-[2rem] overflow-hidden flex flex-col">
            <div className="p-5 bg-teal-50 flex items-center gap-3">
              <div className="p-2 bg-teal-600 rounded-lg text-white">
                <Wallet size={18} />
              </div>
              <h3 className="font-bold text-sm">Zakat Harta</h3>
            </div>
            <CardContent className="p-6 space-y-4">
              <input
                type="number"
                placeholder="RM Tunai"
                className="w-full p-4 bg-slate-50 rounded-xl text-center font-black"
                onChange={(e) => setSavingsAmount(Number(e.target.value))}
              />
              <div className="mt-auto p-4 bg-teal-600 rounded-2xl text-white text-center font-black">
                RM {wealthZakat().toFixed(2)}
              </div>
            </CardContent>
          </Card>

          {/* 6. TOTAL & SUBMIT */}
          <Card className="border-4 border-dashed border-green-200 bg-green-50/40 rounded-[2.5rem] flex flex-col items-center justify-center p-6 text-center">
            <p className="text-[10px] font-black text-green-700 uppercase mb-4 tracking-widest">
              Total Zakat Wajib
            </p>
            <h2 className="text-5xl font-black text-green-600 mb-8">
              RM{" "}
              {grandTotal().toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </h2>
            <Button
              onClick={handleFinalSubmit}
              className="w-full py-8 bg-green-600 hover:bg-green-700 text-white rounded-2xl text-xl font-bold shadow-xl active:scale-95 transition-all flex gap-3"
            >
              <CheckCircle size={24} /> Tunaikan & Simpan
            </Button>
          </Card>
        </div>
      </div>
      {/* 2. MASUKKAN SEMULA AICHATBOT DI SINI */}
      <AIChatbot />
    </div>
  );
}
