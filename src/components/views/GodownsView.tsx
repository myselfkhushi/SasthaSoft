"use client";

import React from "react";
import { useInventory } from "@/context/InventoryContext";
import {
  Building2,
  ArrowRightLeft,
  Package,
  MapPin,
  Phone,
  User,
  Plus,
  CheckCircle2,
} from "lucide-react";
import { formatCurrency, formatDateTime } from "@/lib/utils";

interface GodownsViewProps {
  onOpenTransfer: () => void;
}

export function GodownsView({ onOpenTransfer }: GodownsViewProps) {
  const { godowns, items, transfers } = useInventory();

  return (
    <div className="space-y-6">
      {/* Header and CTA */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-100">
            Regional Warehouses &amp; Fulfillment Facilities
          </h2>
          <p className="text-xs text-slate-500">
            Monitor decentralized physical storage across India, capacity utilization, and inter-facility transfers.
          </p>
        </div>

        <button
          onClick={onOpenTransfer}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#228181] hover:bg-[#1A6868] rounded-xl shadow-xs transition-all shrink-0"
        >
          <ArrowRightLeft className="w-4 h-4" />
          Transfer Stock Between Godowns
        </button>
      </div>

      {/* Godown Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {godowns.map((godown) => {
          const godownItems = items.filter((i) => i.godownId === godown.id);
          const totalUnitsStored = godownItems.reduce((acc, i) => acc + i.currentStock, 0);
          const totalGodownValuation = godownItems.reduce(
            (acc, i) => acc + i.costPrice * i.currentStock,
            0
          );
          const capacityUsedPercent = Math.min(
            100,
            Math.round((totalUnitsStored / godown.capacityUnits) * 100)
          );

          return (
            <div
              key={godown.id}
              className="p-5 rounded-2xl bg-white border border-[#EAE4E3] shadow-[0_4px_20px_rgba(34,129,129,0.03)] flex flex-col justify-between gap-4"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-zinc-100">
                        {godown.name}
                      </h3>
                      <div className="text-[11px] font-mono text-purple-600 dark:text-purple-400 font-semibold">
                        {godown.code}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 space-y-1.5 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{godown.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Manager: {godown.manager}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{godown.contactPhone}</span>
                  </div>
                </div>

                {/* Capacity Progress Bar */}
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-zinc-800 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Utilization:</span>
                    <span className="font-bold text-slate-900 dark:text-zinc-100">
                      {totalUnitsStored} / {godown.capacityUnits} units ({capacityUsedPercent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-purple-600 transition-all"
                      style={{ width: `${Math.max(4, capacityUsedPercent)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Valuation */}
              <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                <span className="text-slate-500">Active SKUs: {godownItems.length}</span>
                <span className="font-bold font-mono text-indigo-600 dark:text-indigo-400">
                  {formatCurrency(totalGodownValuation)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Inter-Godown Transfers Log Table */}
      <div className="rounded-2xl border border-[#EAE4E3] bg-white overflow-hidden shadow-[0_4px_20px_rgba(34,129,129,0.03)]">
        <div className="p-4 border-b border-[#EAE4E3] bg-[#FAF8F7] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4 text-[#228181]" />
            <h3 className="text-sm font-bold text-[#1C2727]">
              Inter-Godown Transfer Manifest &amp; Log
            </h3>
          </div>
          <span className="text-xs text-slate-400">{transfers.length} transfers recorded</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#EAE4E3] text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">Transfer #</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Product &amp; SKU</th>
                <th className="py-3 px-4">From Origin Godown</th>
                <th className="py-3 px-4">To Destination Godown</th>
                <th className="py-3 px-4 text-center">Quantity</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4">Manifest Memo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60 text-xs sm:text-sm">
              {transfers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 text-xs">
                    No inter-godown transfers recorded yet. Click &quot;Transfer Stock Between Godowns&quot; to authorize one!
                  </td>
                </tr>
              ) : (
                transfers.map((tr) => (
                  <tr key={tr.id} className="hover:bg-slate-50/80 dark:hover:bg-zinc-800/40">
                    <td className="py-3 px-4 font-mono font-bold text-purple-600 dark:text-purple-400">
                      {tr.transferNumber}
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-xs">{formatDateTime(tr.date)}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 dark:text-zinc-100">{tr.itemName}</div>
                      <div className="text-[11px] font-mono text-slate-400">{tr.sku}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-zinc-300 font-medium">
                      {tr.fromGodownName}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-zinc-300 font-medium">
                      {tr.toGodownName}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-slate-900 dark:text-zinc-100">
                      {tr.quantity} units
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
                        <CheckCircle2 className="w-3 h-3" />
                        {tr.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-xs">{tr.notes || "Standard transfer"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
