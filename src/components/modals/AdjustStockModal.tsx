"use client";

import React, { useState } from "react";
import { useInventory } from "@/context/InventoryContext";
import { Item } from "@/types/inventory";
import { X, Sliders, Check } from "lucide-react";

interface AdjustStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Item | null;
}

export function AdjustStockModal({ isOpen, onClose, item }: AdjustStockModalProps) {
  const { adjustStock } = useInventory();

  const [adjustmentType, setAdjustmentType] = useState<"add" | "remove">("add");
  const [amount, setAmount] = useState<number>(5);
  const [reason, setReason] = useState("Periodic physical audit variance");

  if (!isOpen || !item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const delta = adjustmentType === "add" ? amount : -amount;
    adjustStock(item.id, delta, reason);
    onClose();
  };

  const newStock =
    adjustmentType === "add" ? item.currentStock + amount : Math.max(0, item.currentStock - amount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-xl">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-zinc-100">
                Adjust Inventory Stock
              </h3>
              <p className="text-xs text-slate-500 font-mono">{item.sku}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <div className="text-xs text-slate-500">Product</div>
            <div className="text-sm font-semibold text-slate-900 dark:text-zinc-100 mt-0.5">
              {item.name}
            </div>
          </div>

          {/* Type Toggle */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Adjustment Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAdjustmentType("add")}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-colors ${
                  adjustmentType === "add"
                    ? "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-700 dark:text-emerald-300"
                    : "border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400"
                }`}
              >
                + Increase Stock
              </button>
              <button
                type="button"
                onClick={() => setAdjustmentType("remove")}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-colors ${
                  adjustmentType === "remove"
                    ? "bg-rose-50 dark:bg-rose-950/50 border-rose-500 text-rose-700 dark:text-rose-300"
                    : "border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400"
                }`}
              >
                - Decrease Stock
              </button>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Quantity to Adjust ({item.unit})
            </label>
            <input
              type="number"
              min="1"
              required
              value={amount}
              onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center font-bold"
            />
          </div>

          {/* Reason */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Reason / Audit Reference
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Periodic physical audit variance">Periodic physical audit variance</option>
              <option value="Damaged / broken goods write-off">Damaged / broken goods write-off</option>
              <option value="Customer return restocked">Customer return restocked</option>
              <option value="Promotional / marketing sample issued">Promotional sample issued</option>
              <option value="Found unaccounted inventory">Found unaccounted inventory</option>
            </select>
          </div>

          {/* Impact preview */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-950/80 border border-slate-200 dark:border-zinc-800 text-xs flex items-center justify-between">
            <span className="text-slate-500">Current Stock: <strong>{item.currentStock}</strong></span>
            <span className="text-slate-400">➔</span>
            <span className="font-bold text-slate-900 dark:text-zinc-100">
              New Balance: <strong className="text-blue-600 dark:text-blue-400">{newStock}</strong> {item.unit}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-[#228181] hover:bg-[#1A6868] rounded-xl shadow-xs transition-all"
            >
              <Check className="w-4 h-4" />
              Confirm Adjustment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
