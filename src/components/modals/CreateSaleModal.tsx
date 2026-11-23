"use client";

import React, { useState } from "react";
import { useInventory } from "@/context/InventoryContext";
import { X, Plus, Trash2, ShoppingCart, Check, AlertCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface CreateSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SaleLineItemInput {
  itemId: string;
  quantity: number;
  unitPrice: number;
}

export function CreateSaleModal({ isOpen, onClose }: CreateSaleModalProps) {
  const { items, customers, godowns, addSalesOrder, notify } = useInventory();

  const [customerId, setCustomerId] = useState(customers[0]?.id || "");
  const [godownId, setGodownId] = useState(godowns[0]?.id || "");
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState("");

  const inStockItems = items.filter((i) => i.currentStock > 0);
  const [lineItems, setLineItems] = useState<SaleLineItemInput[]>([
    {
      itemId: inStockItems[0]?.id || items[0]?.id || "",
      quantity: 1,
      unitPrice: inStockItems[0]?.sellingPrice || items[0]?.sellingPrice || 0,
    },
  ]);

  if (!isOpen) return null;

  const handleItemChange = (index: number, itemId: string) => {
    const selectedItem = items.find((i) => i.id === itemId);
    const updated = [...lineItems];
    updated[index] = {
      ...updated[index],
      itemId,
      unitPrice: selectedItem ? selectedItem.sellingPrice : 0,
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

  const addLine = () => {
    const available = items.find(
      (i) => i.currentStock > 0 && !lineItems.some((li) => li.itemId === i.id)
    );
    if (!available) {
      notify("warning", "No More Available Items", "All in-stock products are already selected.");
      return;
    }

    setLineItems([
      ...lineItems,
      {
        itemId: available.id,
        quantity: 1,
        unitPrice: available.sellingPrice,
      },
    ]);
  };

  const removeLine = (index: number) => {
    if (lineItems.length === 1) return;
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  // Calculations
  const subtotal = lineItems.reduce((acc, l) => acc + l.quantity * l.unitPrice, 0);
  const taxAmount = Math.round(subtotal * 0.18); // 18% standard GST
  const totalAmount = Math.max(0, subtotal + taxAmount - discount);

  // Validate stock
  const validateStock = () => {
    for (const line of lineItems) {
      const item = items.find((i) => i.id === line.itemId);
      if (!item) return "Product not found";
      if (item.currentStock < line.quantity) {
        return `Insufficient stock for ${item.name}. Available: ${item.currentStock}, Requested: ${line.quantity}`;
      }
    }
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateStock();
    if (validationError) {
      notify("error", "Stock Validation Failed", validationError);
      return;
    }

    const selectedCustomer = customers.find((c) => c.id === customerId);
    if (!selectedCustomer) {
      notify("error", "Invalid Customer", "Please select a valid customer.");
      return;
    }

    const orderItems = lineItems.map((line) => {
      const item = items.find((i) => i.id === line.itemId)!;
      return {
        itemId: item.id,
        itemName: item.name,
        sku: item.sku,
        quantity: line.quantity,
        unitPrice: line.unitPrice,
        total: line.quantity * line.unitPrice,
      };
    });

    const result = addSalesOrder({
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      customerCompany: selectedCustomer.company,
      date: new Date().toISOString(),
      items: orderItems,
      subtotal,
      taxAmount,
      discountAmount: discount,
      totalAmount,
      status: "pending",
      paymentStatus: "paid",
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
              <ShoppingCart className="w-5 h-5 text-[#228181]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1C2727]">
                New Sales Order / Invoice
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Connected workflow: Placing a sale will immediately reduce available stock &amp; log history.
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
          {/* Customer & Warehouse Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Client / Customer <span className="text-rose-500">*</span>
              </label>
              <select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#EAE4E3] bg-[#FAF8F7] text-[#1C2727] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#228181] focus:border-[#228181] transition-all"
                required
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.company} ({c.name})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Fulfillment Godown / Warehouse <span className="text-rose-500">*</span>
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
          </div>

          {/* Line Items Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Line Items &amp; Inventory Deduction
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
                const isOutOfStock = currentItem ? currentItem.currentStock < line.quantity : false;

                return (
                  <div
                    key={index}
                    className={`p-3.5 flex flex-col sm:flex-row items-start sm:items-center gap-3 transition-colors ${
                      isOutOfStock ? "bg-rose-50/50" : "bg-white hover:bg-[#FAF8F7]"
                    }`}
                  >
                    {/* Item Select */}
                    <div className="flex-1 w-full sm:w-auto">
                      <select
                        value={line.itemId}
                        onChange={(e) => handleItemChange(index, e.target.value)}
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#EAE4E3] bg-[#FAF8F7] text-[#1C2727] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#228181]"
                      >
                        {items.map((i) => (
                          <option key={i.id} value={i.id} disabled={i.currentStock === 0}>
                            {i.name} ({i.sku}) {i.currentStock === 0 ? "- Out of Stock" : ""}
                          </option>
                        ))}
                      </select>
                      {currentItem && (
                        <div className="flex items-center gap-2 mt-1 text-[11px]">
                          <span
                            className={`font-semibold ${
                              isOutOfStock ? "text-rose-600 font-bold" : "text-[#165353]"
                            }`}
                          >
                            Live Stock: {currentItem.currentStock} {currentItem.unit}
                          </span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-500 font-medium">
                            Min Threshold: {currentItem.minStockLevel}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Quantity */}
                    <div className="w-24">
                      <input
                        type="number"
                        min="1"
                        max={currentItem ? currentItem.currentStock : 999}
                        value={line.quantity}
                        onChange={(e) => handleQtyChange(index, parseInt(e.target.value) || 1)}
                        className={`w-full px-3 py-2 text-xs sm:text-sm rounded-xl border bg-[#FAF8F7] text-[#1C2727] font-mono text-center focus:bg-white focus:outline-none focus:ring-2 ${
                          isOutOfStock
                            ? "border-rose-400 focus:ring-rose-500"
                            : "border-[#EAE4E3] focus:ring-[#228181]"
                        }`}
                        placeholder="Qty"
                      />
                    </div>

                    {/* Unit Price */}
                    <div className="w-32">
                      <input
                        type="number"
                        min="0"
                        value={line.unitPrice}
                        readOnly
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#EAE4E3] bg-[#FAF8F7] text-slate-600 font-mono text-right cursor-not-allowed"
                        placeholder="Price"
                      />
                    </div>

                    {/* Line Total */}
                    <div className="w-28 text-right font-black text-[#1C2727] text-xs sm:text-sm font-mono">
                      {formatCurrency(line.quantity * line.unitPrice)}
                    </div>

                    {/* Delete Line */}
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

          {/* Notes & Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Internal Order Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Shipping instructions, client purchase PO reference, delivery requirements..."
                rows={3}
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-[#EAE4E3] bg-[#FAF8F7] text-[#1C2727] placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#228181] resize-none transition-all"
              />
            </div>

            {/* Calculations Card */}
            <div className="p-4 rounded-xl bg-[#FAF8F7] border border-[#EAE4E3] space-y-2 text-xs font-medium text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold font-mono text-[#1C2727]">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST Tax (18% Standard)</span>
                <span className="font-bold font-mono text-[#1C2727]">{formatCurrency(taxAmount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Discount (₹)</span>
                <input
                  type="number"
                  min="0"
                  value={discount}
                  onChange={(e) => setDiscount(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-24 px-2 py-1 text-right text-xs rounded-lg border border-[#EAE4E3] bg-white text-[#1C2727] font-mono focus:ring-1 focus:ring-[#228181]"
                />
              </div>
              <div className="pt-2 border-t border-[#EAE4E3] flex justify-between items-center">
                <span className="text-sm font-bold text-[#1C2727]">Total Invoice Amount</span>
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
              <span>Generate Invoice &amp; Deduct Stock</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
