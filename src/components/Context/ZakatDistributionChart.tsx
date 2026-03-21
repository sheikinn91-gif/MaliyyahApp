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
  { name: "Fakir", value: 35, color: "#10b981" },
  { name: "Miskin", value: 25, color: "#34d399" },
  { name: "Fisabilillah", value: 15, color: "#a7f3d0" },
  { name: "Muallaf", value: 10, color: "#ecfdf5" },
  { name: "Lain-lain", value: 15, color: "#cbd5e1" },
];

export function ZakatDistributionChart() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    // PENTING: Buang h-full, guna max-w-md untuk kawal lebar kad
    <Card className="border-emerald-100 shadow-sm overflow-hidden mx-auto w-full max-w-md">
      <CardHeader className="bg-emerald-50/50 pb-2">
        <CardTitle className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
          <Users className="size-4 text-emerald-600" />
          Ringkasan Agihan Zakat
        </CardTitle>
      </CardHeader>

      {/* Kawal ketinggian di sini: h-[300px] sudah mencukupi */}
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
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                verticalAlign="bottom"
                align="center"
                iconType="circle"
                layout="horizontal"
                iconSize={10}
                wrapperStyle={{
                  paddingTop: "20px",
                  fontSize: "11px",
                  display: "flex",
                  justifyContent: "center",
                  flexWrap: "wrap",
                  gap: "10px",
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
