import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

const dataAgihan = [
  // 1. KEMASKINI WARNA: Gunakan warna cair untuk carta,
  // tetapi WARNA TEKS (display_color) diasingkan di Legend.
  { name: "Fakir", value: 35, color: "#10b981", display_color: "#047857" }, // Emerald cair -> Emerald Gelap
  { name: "Miskin", value: 25, color: "#34d399", display_color: "#065f46" },
  {
    name: "Fisabilillah",
    value: 15,
    color: "#a7f3d0",
    display_color: "#0f5132",
  }, // <--- Paling kritikal
  { name: "Muallaf", value: 10, color: "#ecfdf5", display_color: "#1e3a2f" },
  { name: "Lain-lain", value: 15, color: "#cbd5e1", display_color: "#475569" }, // Slate cair -> Slate Gelap
];

export function ZakatDistributionChart() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <Card className="border-emerald-100 shadow-sm overflow-hidden mx-auto w-full max-w-md">
      <CardHeader className="bg-emerald-50/50 pb-2">
        <CardTitle className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
          <Users className="size-4 text-emerald-600" />
          Ringkasan Agihan Zakat
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6 h-[320px] w-full relative">
        {isMounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dataAgihan}
                cx="50%"
                cy="45%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={5}
                dataKey="value"
                cornerRadius={10}
                stroke="none"
              >
                {dataAgihan.map((entry, index) => (
                  // Carta kekal guna 'color' yang cair
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />

              {/* 2. KEMASKINI LEGEND: Guna formatters untuk kawal teks */}
              <Legend
                verticalAlign="bottom"
                align="center"
                iconType="circle"
                wrapperStyle={{
                  fontSize: "12px",
                  paddingTop: "20px",
                  lineHeight: "20px",
                }}
                formatter={(value, entry: any) => {
                  // Kita cari data asal untuk dapatkan 'display_color' yang gelap
                  const originalData = dataAgihan.find(
                    (item) => item.name === value,
                  );
                  const textColor = originalData
                    ? originalData.display_color
                    : "#1e293b";

                  return (
                    <span
                      style={{
                        color: textColor, // <--- Warna gelap untuk kebolehbacaan
                        fontWeight: "600",
                        marginLeft: "5px",
                        marginRight: "10px",
                      }}
                    >
                      {value}
                    </span>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-300">
            Loading...
          </div>
        )}
      </CardContent>
    </Card>
  );
}
