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
      notify("error", "Validation Error", "Please select a valid supplier.");
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-3xl bg-white border border-[#EAE4E3] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAE4E3] bg-[#FAF8F7]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#EAF4F4] text-[#165353] border border-[#228181]/20 rounded-xl">
              <Truck className="w-5 h-5 text-[#228181]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1C2727]">
                Create Purchase Order (Procurement)
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Connected workflow: Selecting &apos;Received&apos; automatically increments stock across warehouses.
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
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Supplier & Warehouse */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Vendor / Supplier <span className="text-rose-500">*</span>
              </label>
              <select
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#EAE4E3] bg-[#FAF8F7] text-[#1C2727] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#228181] focus:border-[#228181] transition-all"
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
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Target Godown / Hub <span className="text-rose-500">*</span>
              </label>
              <select
                value={godownId}
                onChange={(e) => setGodownId(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#EAE4E3] bg-[#FAF8F7] text-[#1C2727] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#228181] focus:border-[#228181] transition-all"
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
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Initial Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "ordered" | "received")}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#EAE4E3] bg-[#FAF8F7] text-[#1C2727] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#228181] focus:border-[#228181] transition-all font-semibold"
              >
                <option value="received">Received (Increments Stock Now)</option>
                <option value="ordered">Ordered (Awaiting Delivery)</option>
              </select>
            </div>
          </div>

          {/* Line Items */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Items to Restock
              </label>
              <button
                type="button"
                onClick={addLine}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#228181] hover:text-[#165353] active:scale-95 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="border border-[#EAE4E3] rounded-xl overflow-hidden divide-y divide-[#EAE4E3]">
              {lineItems.map((line, index) => {
                const currentItem = items.find((i) => i.id === line.itemId);

                return (
                  <div
                    key={index}
                    className="p-3.5 flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-white hover:bg-[#FAF8F7] transition-colors"
                  >
                    {/* Item Select */}
                    <div className="flex-1 w-full sm:w-auto">
                      <select
                        value={line.itemId}
                        onChange={(e) => handleItemChange(index, e.target.value)}
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#EAE4E3] bg-[#FAF8F7] text-[#1C2727] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#228181]"
                      >
                        {items.map((i) => (
                          <option key={i.id} value={i.id}>
                            {i.name} ({i.sku})
                          </option>
                        ))}
                      </select>
                      {currentItem && (
                        <div className="text-[11px] text-slate-500 mt-1 font-medium">
                          Current: {currentItem.currentStock} {currentItem.unit} •{" "}
                          <span className="text-[#165353] font-bold">
                            After PO: {currentItem.currentStock + line.quantity} {currentItem.unit}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Quantity Input */}
                    <div className="w-24">
                      <input
                        type="number"
                        min="1"
                        value={line.quantity}
                        onChange={(e) => handleQtyChange(index, parseInt(e.target.value) || 1)}
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#EAE4E3] bg-[#FAF8F7] text-[#1C2727] font-mono text-center focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#228181]"
                        placeholder="Qty"
                      />
                    </div>

                    {/* Unit Cost */}
                    <div className="w-32">
                      <input
                        type="number"
                        min="0"
                        value={line.unitCost}
                        onChange={(e) => handleCostChange(index, parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#EAE4E3] bg-[#FAF8F7] text-[#1C2727] font-mono text-right focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#228181]"
                        placeholder="Cost/unit"
                      />
                    </div>

                    {/* Line Total */}
                    <div className="w-28 text-right font-black text-[#1C2727] text-xs sm:text-sm font-mono">
                      {formatCurrency(line.quantity * line.unitCost)}
                    </div>

                    {/* Remove Action */}
                    <button
                      type="button"
                      onClick={() => removeLine(index)}
                      disabled={lineItems.length === 1}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 disabled:opacity-30 disabled:pointer-events-none active:scale-90 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Notes and Total Summary Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Vendor Notes / Reference
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Vendor invoice #, tracking courier details, batch serial..."
                rows={3}
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-[#EAE4E3] bg-[#FAF8F7] text-[#1C2727] placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#228181] resize-none transition-all"
              />
            </div>

            {/* Calculations Card */}
            <div className="p-4 rounded-xl bg-[#FAF8F7] border border-[#EAE4E3] flex flex-col justify-between space-y-2">
              <div className="space-y-1.5 text-xs text-slate-600 font-medium">
                <div className="flex justify-between">
                  <span>Total Items</span>
                  <span className="font-bold font-mono text-[#1C2727]">
                    {lineItems.reduce((a, b) => a + b.quantity, 0)} units
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Status Behavior</span>
                  <span className="font-bold text-[#165353]">
                    {status === "received" ? "Instant Stock Increment" : "Pending Ledger Entry"}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#EAE4E3] flex justify-between items-center">
                <span className="text-sm font-bold text-[#1C2727]">Total PO Valuation</span>
                <span className="text-lg font-black text-[#165353] font-mono">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
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
              <span>Place Purchase Order</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
