import React from "react";
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

// Data contoh agihan zakat berdasarkan asnaf
const dataAgihan = [
  { name: "Fakir", value: 35, color: "#10b981" }, // Emerald 500
  { name: "Miskin", value: 25, color: "#34d399" }, // Emerald 400
  { name: "Fisabilillah", value: 15, color: "#a7f3d0" }, // Emerald 200
  { name: "Muallaf", value: 10, color: "#ecfdf5" }, // Emerald 50
  { name: "Lain-lain", value: 15, color: "#cbd5e1" }, // Slate 300
];

export function ZakatDistributionChart() {
  return (
    <Card className="border-emerald-100 shadow-sm overflow-hidden h-full">
      <CardHeader className="bg-emerald-50/50 pb-2">
        <CardTitle className="flex items-center gap-2 text-emerald-800 font-bold text-sm uppercase tracking-wider">
          <Users className="size-5 text-emerald-600" />
          Ringkasan Agihan Zakat
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 h-[300px]">
        {" "}
        {/* Tetapkan tinggi kandungan */}
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={dataAgihan}
              cx="50%"
              cy="50%"
              innerRadius={60} // Jadikan ia donut chart untuk rupa lebih moden
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
              cornerRadius={8} // Sudut melengkung, serasi dengan tema Muji anda
            >
              {dataAgihan.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                border: "none",
                borderRadius: "12px",
                padding: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              itemStyle={{ color: "#1e293b" }}
              cursor={{ fill: "none" }}
            />
            <Legend
              iconType="circle"
              wrapperStyle={{ paddingTop: "20px", fontSize: "12px" }}
              formatter={(value, entry: any) => (
                <span className="text-slate-600 ml-2">
                  {value} ({entry.payload.value}%)
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
