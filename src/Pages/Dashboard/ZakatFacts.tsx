import React, { useState, useEffect } from "react";
import { Lightbulb, RefreshCw, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ZAKAT_FACTS = [
  {
    title: "Zakat Pendapatan",
    fact: "Zakat pendapatan wajib dikeluarkan ke atas semua jenis sumber pendapatan hasil daripada kerja atau perkhidmatan seperti gaji, bonus, dan komisen.",
  },
  {
    title: "Zakat Logam (Emas)",
    fact: "Emas yang tidak dipakai (disimpan) wajib dizakatkan jika beratnya mencecah atau melebihi 85 gram.",
  },
  {
    title: "Syarat Nisab",
    fact: "Nisab adalah had minimum jumlah harta yang menentukan sama ada seseorang itu wajib mengeluarkan zakat atau tidak.",
  },
  {
    title: "Kelebihan Berzakat",
    fact: "Zakat bukan sekadar kewajipan, tetapi ia berfungsi menyucikan harta dan jiwa serta membantu mengimbangkan ekonomi ummah.",
  },
  {
    title: "Zakat Kripto",
    fact: "Mata wang digital atau kripto juga wajib dikenakan zakat sebanyak 2.5% sekiranya ia memenuhi syarat cukup nisab dan haul.",
  },
];

export default function DidikZakatWidget() {
  const [index, setIndex] = useState(0);

  // Tukar fakta secara rawak semasa pertama kali load
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * ZAKAT_FACTS.length);
    setIndex(randomIndex);
  }, []);

  const nextFact = () => {
    setIndex((prev) => (prev + 1) % ZAKAT_FACTS.length);
  };

  return (
    <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/30 p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-emerald-700">
          <div className="rounded-lg bg-emerald-100 p-2">
            <Lightbulb className="h-5 w-5" />
          </div>
          <h3 className="font-bold tracking-tight">Didik Zakat</h3>
        </div>
        <button
          onClick={nextFact}
          className="text-slate-400 hover:text-emerald-600 transition-colors"
          title="Fakta Seterusnya"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      <div className="relative min-h-[100px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-2"
          >
            <h4 className="text-xs font-black uppercase tracking-widest text-emerald-600">
              {ZAKAT_FACTS[index].title}
            </h4>
            <p className="text-sm leading-relaxed text-slate-600">
              "{ZAKAT_FACTS[index].fact}"
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-4 flex items-center gap-2 border-t border-emerald-100/50 pt-4">
        <BookOpen className="h-3.5 w-3.5 text-slate-400" />
        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">
          Sumber: Pejabat Zakat Malaysia
        </span>
      </div>
    </div>
  );
}
