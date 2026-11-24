"use client";

import React from "react";
import { useInventory } from "@/context/InventoryContext";
import {
  Building2,
  ArrowRightLeft,
  MapPin,
  Phone,
  User,
  Boxes,
} from "lucide-react";
import { formatCurrency, formatDateTime } from "@/lib/utils";

interface GodownsViewProps {
  onOpenTransfer: () => void;
}

export function GodownsView({ onOpenTransfer }: GodownsViewProps) {
  const { godowns, items, transfers } = useInventory();

  return (
    <div className="space-y-6">
      {/* Header and Transfer CTA */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#1C2727]">
            Godowns &amp; Distribution Facilities
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Manage multi-warehouse capacity, regional distribution hubs, and inter-godown transfers.
          </p>
        </div>

        <button
          onClick={onOpenTransfer}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#228181] hover:bg-[#1A6868] active:scale-95 rounded-xl shadow-xs hover:shadow-md transition-all duration-150 shrink-0"
        >
          <ArrowRightLeft className="w-4 h-4" />
          <span>Transfer Stock Between Hubs</span>
        </button>
      </div>

      {/* Godowns Facilities Grid */}
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
              className="p-5 rounded-2xl bg-white border border-[#EAE4E3] shadow-[0_4px_20px_rgba(34,129,129,0.03)] hover:shadow-lg hover:border-[#228181]/40 hover:-translate-y-1 active:scale-[0.99] transition-all duration-200 flex flex-col justify-between gap-4 cursor-pointer"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-base text-[#1C2727]">
                      {godown.name}
                    </h3>
                    <span className="font-mono text-xs font-bold text-[#165353] bg-[#EAF4F4] px-2 py-0.5 rounded border border-[#228181]/20 mt-1 inline-block">
                      {godown.code}
                    </span>
                  </div>
                  <span className="p-2 rounded-xl bg-[#EAF4F4] text-[#165353] border border-[#228181]/15">
                    <Building2 className="w-4 h-4 text-[#228181]" />
                  </span>
                </div>

                <div className="mt-4 space-y-1.5 text-xs text-slate-600 font-medium">
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
                <div className="mt-4 pt-4 border-t border-[#EAE4E3] space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 font-medium">Capacity Utilization:</span>
                    <span className="font-bold text-[#1C2727]">
                      {totalUnitsStored} / {godown.capacityUnits} units ({capacityUsedPercent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#EAE4E3] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#228181] transition-all"
                      style={{ width: `${Math.max(4, capacityUsedPercent)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Valuation */}
              <div className="pt-3 border-t border-[#EAE4E3] flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Active SKUs: {godownItems.length}</span>
                <span className="font-black font-mono text-[#165353]">
                  {formatCurrency(totalGodownValuation)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Inter-Facility Transfers Log */}
      <div className="rounded-2xl border border-[#EAE4E3] bg-white overflow-hidden shadow-[0_4px_20px_rgba(34,129,129,0.03)]">
        <div className="p-4 border-b border-[#EAE4E3] bg-[#FAF8F7] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Boxes className="w-4 h-4 text-[#228181]" />
            <h3 className="text-sm font-bold text-[#1C2727]">
              Inter-Godown Transfer History Ledger
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {transfers.length} Recorded Movements
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-[#EAE4E3] bg-[#FAF8F7] text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4">Transfer Date</th>
                <th className="py-3.5 px-4">Item Transferred</th>
                <th className="py-3.5 px-4">Source Hub</th>
                <th className="py-3.5 px-4 text-center">Direction</th>
                <th className="py-3.5 px-4">Destination Hub</th>
                <th className="py-3.5 px-4 text-center">Quantity</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Memo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE4E3]/70">
              {transfers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-500 text-xs font-medium">
                    No inter-godown transfers have been logged yet.
                  </td>
                </tr>
              ) : (
                transfers.map((tr) => (
                  <tr
                    key={tr.id}
                    className="hover:bg-[#FAF6F4] active:bg-[#F2ECE9] transition-colors duration-150 cursor-pointer"
                  >
                    <td className="py-3.5 px-4 text-slate-600 text-xs whitespace-nowrap font-medium">
                      {formatDateTime(tr.date)}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#1C2727]">
                      {tr.itemName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">{tr.fromGodownName}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-block p-1 rounded-full bg-[#EAF4F4] text-[#165353]">
                        ➔
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">{tr.toGodownName}</td>
                    <td className="py-3.5 px-4 text-center font-bold font-mono text-[#1C2727]">
                      {tr.quantity} units
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF4F4] text-[#165353] border border-[#228181]/20">
                        {tr.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-xs max-w-xs truncate font-medium">
                      {tr.notes}
                    </td>
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
