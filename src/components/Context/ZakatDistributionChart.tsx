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
  // Trik 1: Gunakan state untuk mount carta selepas komponen sedia
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <Card className="border-emerald-100 shadow-sm overflow-hidden h-full min-h-[420px]">
      <CardHeader className="bg-emerald-50/50 pb-2">
        <CardTitle className="flex items-center gap-2 text-emerald-800 font-bold text-sm uppercase tracking-wider">
          <Users className="size-5 text-emerald-600" />
          Ringkasan Agihan Zakat
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-4 h-[350px] w-full relative">
        {/* Trik 2: Hanya render ResponsiveContainer jika isMounted adalah true */}
        {isMounted ? (
          <ResponsiveContainer
            width="100%"
            height="100%"
            minWidth={0}
            minHeight={0}
          >
            <PieChart>
              <Pie
                data={dataAgihan}
                cx="50%"
                cy="45%"
                innerRadius={65}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                cornerRadius={10}
                stroke="none"
                animationBegin={0}
                animationDuration={800}
              >
                {dataAgihan.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    className="outline-none focus:outline-none"
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
              />

              <Legend
                verticalAlign="bottom"
                align="center"
                iconType="circle"
                wrapperStyle={{
                  paddingTop: "20px",
                  fontSize: "12px",
                }}
                formatter={(value, entry: any) => (
                  <span className="text-slate-600 font-medium">
                    {value}{" "}
                    <span className="text-slate-400 font-normal">
                      ({entry.payload.value}%)
                    </span>
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          // Tampilan sementara (loading/empty) semasa carta sedang disediakan
          <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs">
            Menyediakan carta...
          </div>
        )}
      </CardContent>
    </Card>
  );
}
