"use client";

import React, { useState } from "react";
import { useInventory } from "@/context/InventoryContext";
import { X, Plus, Trash2, Truck, Check } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface CreatePurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedItemId?: string;
}

interface POLineItemInput {
  itemId: string;
  quantity: number;
  unitCost: number;
}

export function CreatePurchaseModal({
  isOpen,
  onClose,
  preselectedItemId,
}: CreatePurchaseModalProps) {
  const { items, suppliers, godowns, addPurchaseOrder, notify } = useInventory();

  const [supplierId, setSupplierId] = useState(suppliers[0]?.id || "");
  const [godownId, setGodownId] = useState(godowns[0]?.id || "");
  const [status, setStatus] = useState<"ordered" | "received">("received");
  const [notes, setNotes] = useState("");

  const defaultItem = preselectedItemId
    ? items.find((i) => i.id === preselectedItemId) || items[0]
    : items[0];

  const [lineItems, setLineItems] = useState<POLineItemInput[]>([
    {
      itemId: defaultItem?.id || "",
      quantity: 10,
      unitCost: defaultItem?.costPrice || 0,
    },
  ]);

  if (!isOpen) return null;

  const handleItemChange = (index: number, itemId: string) => {
    const selectedItem = items.find((i) => i.id === itemId);
    const updated = [...lineItems];
    updated[index] = {
      ...updated[index],
      itemId,
      unitCost: selectedItem ? selectedItem.costPrice : 0,
    };
    setLineItems(updated);
  };

  const handleQtyChange = (index: number, quantity: number) => {
    const updated = [...lineItems];
    updated[index] = {
      ...updated[index],
      quantity: Math.max(1, quantity),
    };
    setLineItems(updated);
  };

  const handleCostChange = (index: number, unitCost: number) => {
    const updated = [...lineItems];
    updated[index] = {
      ...updated[index],
      unitCost: Math.max(0, unitCost),
    };
    setLineItems(updated);
  };

  const addLine = () => {
    const available = items.find((i) => !lineItems.some((li) => li.itemId === i.id)) || items[0];
    if (!available) return;

    setLineItems([
      ...lineItems,
      {
        itemId: available.id,
        quantity: 10,
        unitCost: available.costPrice,
      },
    ]);
  };

  const removeLine = (index: number) => {
    if (lineItems.length === 1) return;
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const totalAmount = lineItems.reduce((acc, l) => acc + l.quantity * l.unitCost, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedSupplier = suppliers.find((s) => s.id === supplierId);
    if (!selectedSupplier) {
      notify("error", "Supplier required", "Please select a valid supplier.");
      return;
    }

    const orderItems = lineItems.map((line) => {
      const item = items.find((i) => i.id === line.itemId)!;
      return {
        itemId: item.id,
        itemName: item.name,
        sku: item.sku,
        quantity: line.quantity,
        unitPrice: line.unitCost,
        total: line.quantity * line.unitCost,
      };
    });

    const result = addPurchaseOrder({
      supplierId: selectedSupplier.id,
      supplierName: selectedSupplier.name,
      supplierCompany: selectedSupplier.company,
      date: new Date().toISOString(),
      items: orderItems,
      totalAmount,
      status,
      godownId,
      notes,
    });

    if (result.success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-zinc-100">
                Create Purchase Order (Procurement)
              </h3>
              <p className="text-xs text-slate-500">
                Connected workflow: Selecting &apos;Received&apos; automatically increments stock across warehouses.
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
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Supplier & Warehouse */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Vendor / Supplier <span className="text-rose-500">*</span>
              </label>
              <select
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              >
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.company} ({s.name})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Target Godown / Hub <span className="text-rose-500">*</span>
              </label>
              <select
                value={godownId}
                onChange={(e) => setGodownId(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              >
                {godowns.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name} ({g.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Initial Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "ordered" | "received")}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              >
                <option value="received">Received (Increments Stock Now)</option>
                <option value="ordered">Ordered (Awaiting Delivery)</option>
              </select>
            </div>
          </div>

          {/* Line Items */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Items to Restock
              </label>
              <button
                type="button"
                onClick={addLine}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Item
              </button>
            </div>

            <div className="border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden divide-y divide-slate-200 dark:divide-zinc-800">
              {lineItems.map((line, index) => {
                const currentItem = items.find((i) => i.id === line.itemId);

                return (
                  <div
                    key={index}
                    className="p-3.5 flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-white dark:bg-zinc-900"
                  >
                    {/* Item Select */}
                    <div className="flex-1 w-full sm:w-auto">
                      <select
                        value={line.itemId}
                        onChange={(e) => handleItemChange(index, e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs sm:text-sm rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        {items.map((i) => (
                          <option key={i.id} value={i.id}>
                            {i.name} ({i.sku}) - Current Stock: {i.currentStock}
                          </option>
                        ))}
                      </select>
                      {currentItem && (
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                          <span>Current: {currentItem.currentStock} {currentItem.unit}</span>
                          <span>•</span>
                          <span className={status === "received" ? "text-emerald-600 font-medium" : ""}>
                            After PO: {status === "received" ? currentItem.currentStock + line.quantity : currentItem.currentStock} {currentItem.unit}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Quantity */}
                    <div className="w-24 shrink-0">
                      <label className="text-[10px] text-slate-400 block sm:hidden">Restock Qty</label>
                      <input
                        type="number"
                        min="1"
                        value={line.quantity}
                        onChange={(e) => handleQtyChange(index, parseInt(e.target.value) || 1)}
                        className="w-full px-2.5 py-1.5 text-xs sm:text-sm rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 text-center focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    {/* Unit Cost */}
                    <div className="w-32 shrink-0">
                      <label className="text-[10px] text-slate-400 block sm:hidden">Unit Cost (₹)</label>
                      <input
                        type="number"
                        min="0"
                        value={line.unitCost}
                        onChange={(e) => handleCostChange(index, parseFloat(e.target.value) || 0)}
                        className="w-full px-2.5 py-1.5 text-xs sm:text-sm rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 text-right focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    {/* Line Total */}
                    <div className="w-28 text-right font-medium text-xs sm:text-sm text-slate-900 dark:text-zinc-100 shrink-0">
                      {formatCurrency(line.quantity * line.unitCost)}
                    </div>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => removeLine(index)}
                      disabled={lineItems.length === 1}
                      className="p-1.5 text-slate-400 hover:text-rose-500 disabled:opacity-30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Notes & Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-200 dark:border-zinc-800">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Vendor Notes / Reference
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Vendor invoice #, tracking courier details, batch serial..."
                rows={3}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              />
            </div>

            <div className="bg-slate-50 dark:bg-zinc-950/60 p-4 rounded-xl border border-slate-200 dark:border-zinc-800 space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between text-slate-600 dark:text-zinc-400">
                <span>Total Items</span>
                <span>{lineItems.reduce((acc, l) => acc + l.quantity, 0)} units</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-zinc-400">
                <span>Status Behavior</span>
                <span className="font-semibold text-emerald-600">
                  {status === "received" ? "Instant Stock Increment" : "Pending Receiving Action"}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-zinc-800 flex justify-between font-bold text-base text-slate-900 dark:text-zinc-100">
                <span>Total PO Valuation</span>
                <span className="text-emerald-600 dark:text-emerald-400">{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-lg shadow-emerald-600/25 transition-all"
            >
              <Check className="w-4 h-4" />
              Place Purchase Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
