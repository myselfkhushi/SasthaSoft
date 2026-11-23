"use client";

import React, { useState } from "react";
import { useInventory } from "@/context/InventoryContext";
import { X, ArrowRightLeft, Check, AlertCircle } from "lucide-react";

interface TransferStockModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TransferStockModal({ isOpen, onClose }: TransferStockModalProps) {
  const { items, godowns, transferStock, notify } = useInventory();

  const [itemId, setItemId] = useState(items[0]?.id || "");
  const [fromGodownId, setFromGodownId] = useState(godowns[0]?.id || "");
  const [toGodownId, setToGodownId] = useState(godowns[1]?.id || godowns[0]?.id || "");
  const [quantity, setQuantity] = useState<number>(5);
  const [notes, setNotes] = useState("Inter-hub demand balancing");

  if (!isOpen) return null;

  const currentItem = items.find((i) => i.id === itemId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (fromGodownId === toGodownId) {
      notify("warning", "Invalid Transfer", "Source and destination godowns cannot be identical.");
      return;
    }

    if (!currentItem) return;

    if (quantity > currentItem.currentStock) {
      notify("error", "Exceeds Stock", `Only ${currentItem.currentStock} units available.`);
      return;
    }

    const result = transferStock({
      itemId,
      quantity,
      fromGodownId,
      toGodownId,
      notes,
    });

    if (result.success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white border border-[#EAE4E3] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAE4E3] bg-[#FAF8F7]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#EAF4F4] text-[#165353] border border-[#228181]/20 rounded-xl">
              <ArrowRightLeft className="w-5 h-5 text-[#228181]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1C2727]">
                Inter-Godown Stock Transfer
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Shift physical inventory between regional logistics hubs.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-[#EAE4E3]/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Select Item to Transfer
            </label>
            <select
              value={itemId}
              onChange={(e) => setItemId(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#EAE4E3] bg-[#FAF8F7] text-[#1C2727] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#228181] transition-all"
            >
              {items.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name} ({i.sku}) - {i.currentStock} in stock
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                From Source Godown
              </label>
              <select
                value={fromGodownId}
                onChange={(e) => setFromGodownId(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#EAE4E3] bg-[#FAF8F7] text-[#1C2727] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#228181] transition-all"
              >
                {godowns.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                To Target Godown
              </label>
              <select
                value={toGodownId}
                onChange={(e) => setToGodownId(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#EAE4E3] bg-[#FAF8F7] text-[#1C2727] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#228181] transition-all"
              >
                {godowns.map((g) => (
                  <option key={g.id} value={g.id} disabled={g.id === fromGodownId}>
                    {g.name} {g.id === fromGodownId ? "(Source)" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Transfer Quantity ({currentItem?.unit || "units"})
            </label>
            <input
              type="number"
              min="1"
              max={currentItem?.currentStock || 999}
              required
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#EAE4E3] bg-[#FAF8F7] text-[#1C2727] font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#228181] transition-all"
            />
            {currentItem && (
              <p className="text-[11px] text-slate-500 font-medium mt-1">
                Source live inventory available:{" "}
                <span className="font-bold text-[#165353]">{currentItem.currentStock} {currentItem.unit}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Transfer Memo / Reason
            </label>
            <input
              type="text"
              required
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Fulfill south region sales spike"
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
              <span>Execute Transfer</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
