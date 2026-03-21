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
    <Card className="border-emerald-100 shadow-sm overflow-hidden h-full min-h-[400px]">
      <CardHeader className="bg-emerald-50/50 pb-2">
        <CardTitle className="flex items-center gap-2 text-emerald-800 font-bold text-sm uppercase tracking-wider">
          <Users className="size-5 text-emerald-600" />
          Ringkasan Agihan Zakat
        </CardTitle>
      </CardHeader>

      {/* PENTING: Kita guna h-[350px] dan relative supaya 
          ResponsiveContainer ada rujukan saiz yang stabil.
      */}
      <CardContent className="pt-4 h-[350px] relative">
        <ResponsiveContainer width="100%" height="100%" debounce={1}>
          <PieChart>
            <Pie
              data={dataAgihan}
              cx="50%"
              cy="45%" // Kita naikkan sikit pusat bulatan supaya tak rapat sangat dengan Legend
              innerRadius={65} // Donut style yang lebih luas di tengah
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
              cornerRadius={10} // Sudut yang lebih lembut (Muji style)
              stroke="none"
            >
              {dataAgihan.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  className="outline-none"
                />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                border: "none",
                borderRadius: "12px",
                padding: "12px",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                backgroundColor: "rgba(255, 255, 255, 0.95)",
              }}
              itemStyle={{ color: "#065f46", fontWeight: "bold" }}
            />

            <Legend
              verticalAlign="bottom"
              align="center"
              iconType="circle"
              layout="horizontal"
              wrapperStyle={{
                paddingTop: "20px",
                fontSize: "12px",
                fontWeight: "500",
              }}
              formatter={(value, entry: any) => (
                <span className="text-slate-600 mr-2">
                  {value}{" "}
                  <span className="text-slate-400 font-normal">
                    ({entry.payload.value}%)
                  </span>
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
