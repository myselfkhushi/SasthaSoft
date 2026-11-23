"use client";

import React from "react";
import { useInventory } from "@/context/InventoryContext";
import { SalesOrder } from "@/types/inventory";
import { X, Printer, ShieldCheck, Truck } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

interface InvoiceViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: SalesOrder | null;
}

export function InvoiceViewModal({ isOpen, onClose, order }: InvoiceViewModalProps) {
  const { customers, godowns, updateSalesStatus } = useInventory();

  if (!isOpen || !order) return null;

  const customer = customers.find((c) => c.id === order.customerId);
  const godown = godowns.find((g) => g.id === order.godownId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-3xl bg-white border border-[#EAE4E3] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Controls Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-[#EAE4E3] bg-[#FAF8F7]">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Tax Invoice Document
            </span>
            <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded-full bg-[#EAF4F4] text-[#165353] border border-[#228181]/20">
              {order.invoiceNumber}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-white border border-[#DDD6D5] text-[#1C2727] hover:bg-[#FAF8F7] active:scale-95 shadow-xs transition-all"
            >
              <Printer className="w-3.5 h-3.5 text-[#228181]" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-[#EAE4E3]/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-white text-[#1C2727] print:p-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-[#EAE4E3]">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#228181] flex items-center justify-center text-white font-black text-sm shadow-xs">
                  SS
                </div>
                <h2 className="text-xl font-bold tracking-tight text-[#1C2727]">
                  SasthaSoft Enterprise Solutions Ltd
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-sm font-medium">
                Advanced Inventory Logistics &amp; Supply Chain Automation Platform.
              </p>
            </div>

            <div className="sm:text-right">
              <div className="text-2xl font-black font-mono tracking-tight text-[#1C2727]">
                {order.invoiceNumber}
              </div>
              <div className="text-xs text-slate-500 mt-1 font-medium">Date: {formatDate(order.date)}</div>
              <div className="mt-2 flex sm:justify-end gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EAF4F4] text-[#165353] border border-[#228181]/20">
                  <ShieldCheck className="w-3 h-3 text-[#228181]" />
                  {order.paymentStatus.toUpperCase()}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FAF0F4] text-[#7A2D4C] border border-[#D78EAB]/20">
                  <Truck className="w-3 h-3 text-[#D78EAB]" />
                  {order.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Parties Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs">
            <div>
              <div className="font-bold uppercase tracking-wider text-slate-500 mb-1">
                Billed To Client:
              </div>
              <div className="font-bold text-sm text-[#1C2727]">
                {order.customerCompany}
              </div>
              <div className="text-slate-600 mt-0.5 font-medium">Attn: {order.customerName}</div>
              <div className="text-slate-500 mt-0.5 font-medium">{customer?.email}</div>
              <div className="text-slate-500 font-medium">{customer?.phone}</div>
              {customer?.gstNumber && (
                <div className="text-slate-600 mt-1 font-mono font-bold">
                  GSTIN: {customer.gstNumber}
                </div>
              )}
            </div>

            <div className="sm:text-right">
              <div className="font-bold uppercase tracking-wider text-slate-500 mb-1">
                Fulfilled From Facility:
              </div>
              <div className="font-bold text-sm text-[#1C2727]">
                {godown?.name || "Central Warehouse Hub"}
              </div>
              <div className="text-slate-600 mt-0.5 font-medium">Code: {godown?.code}</div>
              <div className="text-slate-500 mt-0.5 font-medium">{godown?.location}</div>
              <div className="text-slate-500 font-medium">Facility Manager: {godown?.manager}</div>
            </div>
          </div>

          {/* Items Table */}
          <div className="rounded-xl border border-[#EAE4E3] overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#EAE4E3] bg-[#FAF8F7] font-bold text-slate-500">
                  <th className="py-2.5 px-3">Item Description</th>
                  <th className="py-2.5 px-3">SKU</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Unit Price</th>
                  <th className="py-2.5 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE4E3]/70">
                {order.items.map((item, index) => (
                  <tr key={index}>
                    <td className="py-3 px-3 font-bold text-[#1C2727]">{item.itemName}</td>
                    <td className="py-3 px-3 font-mono text-slate-500">{item.sku}</td>
                    <td className="py-3 px-3 text-center font-bold text-[#1C2727]">{item.quantity}</td>
                    <td className="py-3 px-3 text-right font-mono text-slate-700">
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-[#1C2727]">
                      {formatCurrency(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end text-xs">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-slate-600 font-medium">
                <span>Subtotal:</span>
                <span className="font-mono font-bold text-[#1C2727]">
                  {formatCurrency(order.subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 font-medium">
                <span>GST Tax (18%):</span>
                <span className="font-mono font-bold text-[#1C2727]">
                  {formatCurrency(order.taxAmount)}
                </span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-[#AD597B] font-bold">
                  <span>Discount:</span>
                  <span className="font-mono">-{formatCurrency(order.discountAmount)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-[#EAE4E3] flex justify-between font-black text-sm text-[#1C2727]">
                <span>Total Amount:</span>
                <span className="font-mono text-base text-[#165353]">
                  {formatCurrency(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Notes & Footer */}
          {order.notes && (
            <div className="p-3.5 rounded-xl bg-[#FAF8F7] border border-[#EAE4E3] text-xs">
              <span className="font-bold text-slate-600">Order Notes: </span>
              <span className="text-slate-600">{order.notes}</span>
            </div>
          )}
        </div>

        {/* Footer Status Updater */}
        <div className="p-4 border-t border-[#EAE4E3] bg-[#FAF8F7] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">Update Status:</span>
            <select
              value={order.status}
              onChange={(e) => updateSalesStatus(order.id, e.target.value as any)}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-[#EAE4E3] bg-white text-[#1C2727] focus:ring-1 focus:ring-[#228181]"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-[#1C2727] bg-white border border-[#DDD6D5] hover:bg-[#FAF8F7] active:scale-95 transition-all"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
}
