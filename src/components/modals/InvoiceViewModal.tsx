"use client";

import React from "react";
import { useInventory } from "@/context/InventoryContext";
import { SalesOrder, SalesStatus, PaymentStatus } from "@/types/inventory";
import { X, Printer, CheckCircle, Clock, Truck, ShieldCheck } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

interface InvoiceViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: SalesOrder | null;
}

export function InvoiceViewModal({ isOpen, onClose, order }: InvoiceViewModalProps) {
  const { customers, godowns, updateSalesStatus, updatePaymentStatus } = useInventory();

  if (!isOpen || !order) return null;

  const customer = customers.find((c) => c.id === order.customerId);
  const godown = godowns.find((g) => g.id === order.godownId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Controls Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Tax Invoice Document
            </span>
            <span className="px-2 py-0.5 text-xs font-mono font-medium rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900">
              {order.invoiceNumber}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-700 shadow-sm transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 print:p-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-slate-200 dark:border-zinc-800">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-md">
                  S
                </div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  SasthaSoft Enterprise Solutions
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Advanced Inventory Logistics & Supply Chain Automation Platform.
              </p>
            </div>

            <div className="sm:text-right">
              <div className="text-2xl font-black font-mono tracking-tight text-slate-900 dark:text-zinc-100">
                {order.invoiceNumber}
              </div>
              <div className="text-xs text-slate-500 mt-1">Date: {formatDate(order.date)}</div>
              <div className="mt-2 flex sm:justify-end gap-2">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    order.paymentStatus === "paid"
                      ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900"
                      : "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900"
                  }`}
                >
                  <ShieldCheck className="w-3 h-3" />
                  {order.paymentStatus.toUpperCase()}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    order.status === "delivered"
                      ? "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900"
                      : "bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-900"
                  }`}
                >
                  <Truck className="w-3 h-3" />
                  {order.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Billed To & Dispatched From */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs sm:text-sm">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Billed To (Client)
              </div>
              <div className="font-bold text-slate-900 dark:text-zinc-100 text-base">
                {order.customerCompany}
              </div>
              <div className="text-slate-600 dark:text-zinc-400 mt-0.5">Attn: {order.customerName}</div>
              {customer && (
                <>
                  <div className="text-slate-500 mt-1">{customer.email} • {customer.phone}</div>
                  <div className="text-slate-500">{customer.city}, India</div>
                  {customer.gstNumber && (
                    <div className="text-slate-500 font-mono mt-0.5">GSTIN: {customer.gstNumber}</div>
                  )}
                </>
              )}
            </div>

            <div className="sm:text-right">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Fulfilled & Dispatched From
              </div>
              <div className="font-semibold text-slate-900 dark:text-zinc-100">
                {godown?.name || "Central Logistics Hub"}
              </div>
              <div className="text-slate-500 mt-0.5">{godown?.location || "Main Warehouse"}</div>
              <div className="text-slate-500 font-mono mt-0.5">Hub ID: {godown?.code || "WH-01"}</div>
            </div>
          </div>

          {/* Line items table */}
          <div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-zinc-800 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <th className="py-2.5">Item & SKU</th>
                  <th className="py-2.5 text-center">Qty</th>
                  <th className="py-2.5 text-right">Unit Price</th>
                  <th className="py-2.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60 text-xs sm:text-sm">
                {order.items.map((item, index) => (
                  <tr key={index}>
                    <td className="py-3">
                      <div className="font-medium text-slate-900 dark:text-zinc-100">{item.itemName}</div>
                      <div className="text-xs font-mono text-slate-400">{item.sku}</div>
                    </td>
                    <td className="py-3 text-center font-medium">{item.quantity}</td>
                    <td className="py-3 text-right">{formatCurrency(item.unitPrice)}</td>
                    <td className="py-3 text-right font-medium">{formatCurrency(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Breakdown */}
          <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-zinc-800">
            <div className="w-full sm:w-72 space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>GST Tax (18%)</span>
                <span>{formatCurrency(order.taxAmount)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Special Discount</span>
                  <span>-{formatCurrency(order.discountAmount)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-200 dark:border-zinc-800 flex justify-between font-bold text-base text-slate-900 dark:text-zinc-100">
                <span>Grand Total</span>
                <span className="text-indigo-600 dark:text-indigo-400">
                  {formatCurrency(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {order.notes && (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-200 dark:border-zinc-800 text-xs text-slate-600 dark:text-zinc-400">
              <span className="font-semibold text-slate-700 dark:text-zinc-300">Order Notes: </span>
              {order.notes}
            </div>
          )}

          {/* Status quick switcher in modal footer */}
          <div className="pt-6 border-t border-slate-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <span className="text-slate-500 font-medium">Update Fulfillment:</span>
              <select
                value={order.status}
                onChange={(e) => updateSalesStatus(order.id, e.target.value as SalesStatus)}
                className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100"
              >
                <option value="pending">Pending</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-slate-500 font-medium">Update Payment:</span>
              <select
                value={order.paymentStatus}
                onChange={(e) => updatePaymentStatus(order.id, e.target.value as PaymentStatus)}
                className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100"
              >
                <option value="paid">Paid</option>
                <option value="partial">Partial</option>
                <option value="unpaid">Unpaid</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
