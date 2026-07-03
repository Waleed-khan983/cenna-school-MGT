"use client"

import { motion } from "framer-motion";

export default function DashboardCard({ title, value, icon, change, color = "black" }) {
  const colors = {
    black: "border-black/10 bg-white",
    gold: "border-yellow-500/30 bg-yellow-50",
    green: "border-green-500/30 bg-green-50",
    blue: "border-blue-500/30 bg-blue-50",
    red: "border-red-500/30 bg-red-50",
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`rounded-2xl border p-6 shadow-sm transition ${colors[color] || colors.black}`}
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-500">{title}</p>
          <h3 className="mt-2 text-3xl font-extrabold text-black">{value}</h3>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-black text-2xl text-white">
          {icon}
        </div>
      </div>

      {change && (
        <p className="text-sm font-semibold text-gray-500">{change}</p>
      )}
    </motion.div>
  );
}