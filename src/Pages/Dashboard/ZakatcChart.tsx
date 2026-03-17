import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ZakatChartProps {
  historyData: any[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm p-2 shadow-lg border border-slate-100 rounded-lg">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
          Jumlah Zakat
        </p>
        <p className="text-sm font-black text-emerald-600">
          RM{" "}
          {payload[0].value.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}
        </p>
      </div>
    );
  }
  return null;
};

export default function ZakatChart({ historyData }: ZakatChartProps) {
  // Gunakan useMemo untuk transform data & elakkan duplicate declaration
  const chartData = useMemo(() => {
    if (!historyData || historyData.length === 0) return [];

    // 1. Susun data mengikut tarikh paling lama ke terbaru
    const sortedData = [...historyData].sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );

    let runningTotal = 0;

    // 2. Kira jumlah terkumpul (Cumulative Sum)
    return sortedData.map((item: any) => {
      runningTotal += item.total_zakat; // Tambah nilai transaksi ke jumlah sedia ada
      return {
        month: new Date(item.created_at).toLocaleDateString("ms-MY", {
          month: "short",
          day: "numeric",
        }),
        total: runningTotal, // Gunakan jumlah terkumpul untuk graf
      };
    });
  }, [historyData]);

  // Jika data kosong, paparkan mesej placeholder supaya skrin tidak kosong/blank
  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[200px] text-slate-400 text-xs italic">
        Tiada data sejarah tersedia
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[200px] md:min-h-[250px] pt-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#f1f5f9"
          />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 500 }}
            dy={5}
          />
          <YAxis hide={true} />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: "#10b981", strokeWidth: 1 }}
          />
          <Area
            type="monotone"
            dataKey="total"
            stroke="#10b981"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorTotal)"
            animationDuration={800}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
