"use client";

import React, { useState } from "react";
import { useInventory } from "@/context/InventoryContext";
import { X, Plus, Trash2, AlertCircle, ShoppingCart, Check } from "lucide-react";
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
  const [notes, setNotes] = useState("");
  const [discount, setDiscount] = useState<number>(0);
  const [lineItems, setLineItems] = useState<SaleLineItemInput[]>([
    {
      itemId: items[0]?.id || "",
      quantity: 1,
      unitPrice: items[0]?.sellingPrice || 0,
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

  const handlePriceChange = (index: number, unitPrice: number) => {
    const updated = [...lineItems];
    updated[index] = {
      ...updated[index],
      unitPrice: Math.max(0, unitPrice),
    };
    setLineItems(updated);
  };

  const addLine = () => {
    const firstAvailable = items.find(
      (i) => !lineItems.some((li) => li.itemId === i.id) && i.currentStock > 0
    ) || items[0];

    if (!firstAvailable) {
      notify("warning", "No items left", "All inventory items have already been added.");
      return;
    }

    setLineItems([
      ...lineItems,
      {
        itemId: firstAvailable.id,
        quantity: 1,
        unitPrice: firstAvailable.sellingPrice,
      },
    ]);
  };

  const removeLine = (index: number) => {
    if (lineItems.length === 1) return;
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  // Calculations
  const subtotal = lineItems.reduce((acc, line) => {
    return acc + line.quantity * line.unitPrice;
  }, 0);

  const taxAmount = Math.round(subtotal * 0.18); // 18% standard GST
  const totalAmount = Math.max(0, subtotal + taxAmount - discount);

  // Check validation issues
  let validationError: string | null = null;
  for (const line of lineItems) {
    const item = items.find((i) => i.id === line.itemId);
    if (!item) {
      validationError = "Please select a valid product.";
      break;
    }
    if (item.currentStock < line.quantity) {
      validationError = `Insufficient stock for "${item.name}". Only ${item.currentStock} units available, requested: ${line.quantity}.`;
      break;
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validationError) {
      notify("error", "Stock Validation Failed", validationError);
      return;
    }

    const selectedCustomer = customers.find((c) => c.id === customerId);
    if (!selectedCustomer) {
      notify("error", "Invalid Customer", "Please select a customer.");
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#EAF4F4] text-[#228181] rounded-xl">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-zinc-100">
                New Sales Order / Invoice
              </h3>
              <p className="text-xs text-slate-500">
                Connected workflow: Placing a sale will immediately reduce available stock & log history.
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
          {/* Customer & Warehouse Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Client / Customer <span className="text-rose-500">*</span>
              </label>
              <select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Fulfillment Godown / Warehouse <span className="text-rose-500">*</span>
              </label>
              <select
                value={godownId}
                onChange={(e) => setGodownId(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Line Items & Inventory Deduction
              </label>
              <button
                type="button"
                onClick={addLine}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Item
              </button>
            </div>

            <div className="border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden divide-y divide-slate-200 dark:divide-zinc-800">
              {lineItems.map((line, index) => {
                const currentItem = items.find((i) => i.id === line.itemId);
                const isOutOfStock = currentItem ? currentItem.currentStock < line.quantity : false;

                return (
                  <div
                    key={index}
                    className={`p-3.5 flex flex-col sm:flex-row items-start sm:items-center gap-3 ${
                      isOutOfStock ? "bg-rose-50/50 dark:bg-rose-950/20" : "bg-white dark:bg-zinc-900"
                    }`}
                  >
                    {/* Item Select */}
                    <div className="flex-1 w-full sm:w-auto">
                      <select
                        value={line.itemId}
                        onChange={(e) => handleItemChange(index, e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs sm:text-sm rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {items.map((i) => (
                          <option key={i.id} value={i.id}>
                            {i.name} ({i.sku}) - {i.currentStock} in stock
                          </option>
                        ))}
                      </select>
                      {currentItem && (
                        <div className="flex items-center gap-2 mt-1 text-[11px]">
                          <span
                            className={`font-medium ${
                              isOutOfStock
                                ? "text-rose-600 dark:text-rose-400"
                                : "text-emerald-600 dark:text-emerald-400"
                            }`}
                          >
                            Live Stock: {currentItem.currentStock} {currentItem.unit}
                          </span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-500">Min Threshold: {currentItem.minStockLevel}</span>
                        </div>
                      )}
                    </div>

                    {/* Quantity */}
                    <div className="w-24 shrink-0">
                      <label className="text-[10px] text-slate-400 block sm:hidden">Qty</label>
                      <input
                        type="number"
                        min="1"
                        value={line.quantity}
                        onChange={(e) => handleQtyChange(index, parseInt(e.target.value) || 1)}
                        className={`w-full px-2.5 py-1.5 text-xs sm:text-sm rounded-lg border text-center ${
                          isOutOfStock
                            ? "border-rose-400 bg-rose-50 text-rose-700 font-bold"
                            : "border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100"
                        } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                      />
                    </div>

                    {/* Unit Price */}
                    <div className="w-32 shrink-0">
                      <label className="text-[10px] text-slate-400 block sm:hidden">Unit Price</label>
                      <input
                        type="number"
                        min="0"
                        value={line.unitPrice}
                        onChange={(e) => handlePriceChange(index, parseFloat(e.target.value) || 0)}
                        className="w-full px-2.5 py-1.5 text-xs sm:text-sm rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 text-right focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    {/* Line Total */}
                    <div className="w-28 text-right font-medium text-xs sm:text-sm text-slate-900 dark:text-zinc-100 shrink-0">
                      {formatCurrency(line.quantity * line.unitPrice)}
                    </div>

                    {/* Remove Action */}
                    <button
                      type="button"
                      onClick={() => removeLine(index)}
                      disabled={lineItems.length === 1}
                      className="p-1.5 text-slate-400 hover:text-rose-500 disabled:opacity-30 disabled:hover:text-slate-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Validation Warning Alert if any */}
          {validationError && (
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Order Summary & Pricing Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-200 dark:border-zinc-800">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Internal Order Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Shipping instructions, client purchase PO reference, delivery requirements..."
                rows={3}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>

            <div className="bg-slate-50 dark:bg-zinc-950/60 p-4 rounded-xl border border-slate-200 dark:border-zinc-800 space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between text-slate-600 dark:text-zinc-400">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-zinc-400">
                <span>GST Tax (18% Standard)</span>
                <span>{formatCurrency(taxAmount)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-zinc-400">
                <span>Discount (₹)</span>
                <input
                  type="number"
                  min="0"
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  className="w-24 px-2 py-1 text-right text-xs rounded border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100"
                />
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-zinc-800 flex justify-between font-bold text-base text-slate-900 dark:text-zinc-100">
                <span>Total Invoice Amount</span>
                <span className="text-indigo-600 dark:text-indigo-400">{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={Boolean(validationError)}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#228181] hover:bg-[#1A6868] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-xs transition-all"
            >
              <Check className="w-4 h-4" />
              Generate Invoice & Deduct Stock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
