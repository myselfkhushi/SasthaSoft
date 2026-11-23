"use client";

import React, { useState, useMemo } from "react";
import { useInventory } from "@/context/InventoryContext";
import { SalesOrder, SalesStatus, PaymentStatus } from "@/types/inventory";
import {
  Search,
  ShoppingCart,
  Plus,
  Filter,
  FileText,
  CheckCircle2,
  Clock,
  Truck,
  ArrowUpDown,
  Download,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

interface SalesViewProps {
  onOpenCreateSale: () => void;
  onSelectOrder: (order: SalesOrder) => void;
}

export function SalesView({ onOpenCreateSale, onSelectOrder }: SalesViewProps) {
  const { salesOrders, updateSalesStatus, updatePaymentStatus } = useInventory();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");

  const filteredOrders = useMemo(() => {
    return salesOrders.filter((order) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        order.invoiceNumber.toLowerCase().includes(q) ||
        order.customerCompany.toLowerCase().includes(q) ||
        order.customerName.toLowerCase().includes(q) ||
        order.items.some((i) => i.itemName.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q));

      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      const matchesPayment = paymentFilter === "all" || order.paymentStatus === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [salesOrders, searchQuery, statusFilter, paymentFilter]);

  const totalRevenue = salesOrders.reduce((acc, o) => acc + o.totalAmount, 0);
  const paidCount = salesOrders.filter((o) => o.paymentStatus === "paid").length;
  const pendingShipment = salesOrders.filter((o) => o.status === "pending").length;

  return (
    <div className="space-y-6">
      {/* Top Header Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#1c182b] border border-[#ece8df] dark:border-[#2a253f] shadow-[0_4px_20px_rgba(34,27,48,0.03)]">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Total Sales Invoiced
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-800 dark:text-zinc-100 mt-1">
            {formatCurrency(totalRevenue)}
          </div>
          <div className="text-xs text-slate-400 mt-0.5">{salesOrders.length} total orders recorded</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#1c182b] border border-[#ece8df] dark:border-[#2a253f] shadow-[0_4px_20px_rgba(34,27,48,0.03)]">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Paid Invoices
          </div>
          <div className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 mt-1">
            {paidCount} / {salesOrders.length}
          </div>
          <div className="text-xs text-slate-400 mt-0.5">High cash-flow collection rate</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#1c182b] border border-[#ece8df] dark:border-[#2a253f] shadow-[0_4px_20px_rgba(34,27,48,0.03)]">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Awaiting Fulfillment
          </div>
          <div className="text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400 mt-1">
            {pendingShipment} Orders
          </div>
          <div className="text-xs text-slate-400 mt-0.5">Ready for warehouse dispatch</div>
        </div>
      </div>

      {/* Filter and Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search invoice #, client, or product..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Filters and CTA */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Fulfillments</option>
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>

          {/* Payment Filter */}
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Payments</option>
            <option value="paid">Paid</option>
            <option value="partial">Partial</option>
            <option value="unpaid">Unpaid</option>
          </select>

          {/* New Sale Button */}
          <button
            onClick={onOpenCreateSale}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#228181] hover:bg-[#1A6868] rounded-xl shadow-xs transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            New Sales Order
          </button>
        </div>
      </div>

      {/* Sales Orders Table */}
      <div className="rounded-2xl border border-[#EAE4E3] bg-white overflow-hidden shadow-[0_4px_20px_rgba(34,129,129,0.03)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#EAE4E3] bg-[#FAF8F7] text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Customer & Company</th>
                <th className="py-3 px-4">Items Ordered</th>
                <th className="py-3 px-4 text-right">Invoice Amount</th>
                <th className="py-3 px-4 text-center">Payment</th>
                <th className="py-3 px-4 text-center">Fulfillment</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60 text-xs sm:text-sm">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                    No sales orders match your criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isPaid = order.paymentStatus === "paid";
                  const isPartial = order.paymentStatus === "partial";

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-zinc-800/40 transition-colors"
                    >
                      {/* Invoice # */}
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-zinc-100">
                        <button
                          onClick={() => onSelectOrder(order)}
                          className="hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline flex items-center gap-1.5"
                        >
                          <FileText className="w-3.5 h-3.5 text-slate-400" />
                          <span>{order.invoiceNumber}</span>
                        </button>
                      </td>

                      {/* Date */}
                      <td className="py-3 px-4 text-slate-500 text-xs">
                        {formatDate(order.date)}
                      </td>

                      {/* Customer */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 dark:text-zinc-100">
                          {order.customerCompany}
                        </div>
                        <div className="text-[11px] text-slate-400">{order.customerName}</div>
                      </td>

                      {/* Items */}
                      <td className="py-3 px-4 text-slate-600 dark:text-zinc-400">
                        <div className="font-medium text-xs">
                          {order.items.length} product(s) ({order.items.reduce((a, b) => a + b.quantity, 0)} units)
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-xs">
                          {order.items.map((i) => `${i.itemName} (x${i.quantity})`).join(", ")}
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-zinc-100 font-mono">
                        {formatCurrency(order.totalAmount)}
                      </td>

                      {/* Payment Status */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            isPaid
                              ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900"
                              : isPartial
                              ? "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900"
                              : "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900"
                          }`}
                        >
                          {order.paymentStatus.toUpperCase()}
                        </span>
                      </td>

                      {/* Fulfillment Status */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                            order.status === "delivered"
                              ? "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900"
                              : order.status === "shipped"
                              ? "bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-900"
                              : "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              order.status === "delivered"
                                ? "bg-blue-500"
                                : order.status === "shipped"
                                ? "bg-purple-500"
                                : "bg-amber-500"
                            }`}
                          />
                          {order.status.toUpperCase()}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onSelectOrder(order)}
                          className="px-2.5 py-1 text-xs font-semibold text-[#228181] bg-[#EAF4F4] hover:bg-[#D5EAEA] rounded-lg transition-colors"
                        >
                          View Invoice
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
