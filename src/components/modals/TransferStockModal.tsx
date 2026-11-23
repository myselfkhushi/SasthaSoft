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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 rounded-xl">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-zinc-100">
                Inter-Godown Stock Transfer
              </h3>
              <p className="text-xs text-slate-500">
                Shift physical inventory between regional logistics hubs.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Select Item to Transfer
            </label>
            <select
              value={itemId}
              onChange={(e) => setItemId(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                From Origin Godown
              </label>
              <select
                value={fromGodownId}
                onChange={(e) => setFromGodownId(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {godowns.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                To Destination Godown
              </label>
              <select
                value={toGodownId}
                onChange={(e) => setToGodownId(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {godowns.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {fromGodownId === toGodownId && (
            <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-lg border border-amber-200 dark:border-amber-900">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Source and destination must be distinct warehouses.</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Quantity to Transfer
            </label>
            <input
              type="number"
              min="1"
              required
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Transfer Manifest Notes
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Driver name, vehicle number, dispatch memo..."
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
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
              disabled={fromGodownId === toGodownId}
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-lg shadow-purple-600/25 transition-all"
            >
              <Check className="w-4 h-4" />
              Authorize Transfer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
