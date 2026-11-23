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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white border border-[#EAE4E3] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAE4E3] bg-[#FAF8F7]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#EAF4F4] text-[#165353] border border-[#228181]/20 rounded-xl">
              <Sliders className="w-5 h-5 text-[#228181]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1C2727]">
                Adjust Inventory Stock
              </h3>
              <p className="text-xs text-slate-500 font-mono font-bold">{item.sku}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-[#EAE4E3]/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Product</div>
            <div className="text-sm font-bold text-[#1C2727] mt-0.5">
              {item.name}
            </div>
          </div>

          {/* Type Toggle */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Adjustment Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAdjustmentType("add")}
                className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all active:scale-95 ${
                  adjustmentType === "add"
                    ? "bg-[#EAF4F4] border-[#228181] text-[#165353] shadow-xs"
                    : "border-[#EAE4E3] bg-[#FAF8F7] text-slate-600 hover:bg-white"
                }`}
              >
                + Increase Stock
              </button>
              <button
                type="button"
                onClick={() => setAdjustmentType("remove")}
                className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all active:scale-95 ${
                  adjustmentType === "remove"
                    ? "bg-[#FAF0F4] border-[#D78EAB] text-[#7A2D4C] shadow-xs"
                    : "border-[#EAE4E3] bg-[#FAF8F7] text-slate-600 hover:bg-white"
                }`}
              >
                - Decrease Stock
              </button>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Quantity to Adjust ({item.unit})
            </label>
            <input
              type="number"
              min="1"
              required
              value={amount}
              onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#EAE4E3] bg-[#FAF8F7] text-[#1C2727] font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#228181] transition-all"
            />
          </div>

          {/* Calculated Output */}
          <div className="p-3.5 rounded-xl bg-[#FAF8F7] border border-[#EAE4E3] flex items-center justify-between text-xs font-medium">
            <span className="text-slate-600">Current: {item.currentStock} {item.unit}</span>
            <span className="text-slate-400">➔</span>
            <span className="font-bold text-sm font-mono text-[#165353]">
              Resulting: {newStock} {item.unit}
            </span>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Reason / Audit Memo
            </label>
            <input
              type="text"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Broken packaging, physical recount variance"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#EAE4E3] bg-[#FAF8F7] text-[#1C2727] placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#228181] transition-all"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EAE4E3]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-[#1C2727] hover:bg-[#FAF8F7] active:scale-95 rounded-xl border border-[#DDD6D5] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-[#228181] hover:bg-[#1A6868] active:scale-95 rounded-xl shadow-xs hover:shadow-md transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Record Stock Adjustment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
