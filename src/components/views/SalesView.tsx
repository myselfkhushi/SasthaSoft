"use client";

import React, { useState, useMemo } from "react";
import { useInventory } from "@/context/InventoryContext";
import { SalesOrder } from "@/types/inventory";
import {
  Search,
  Plus,
  Eye,
  TrendingUp,
  CheckCircle2,
  Clock,
  FileText,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

interface SalesViewProps {
  onOpenCreateSale: () => void;
  onSelectOrder: (order: SalesOrder) => void;
}

export function SalesView({ onOpenCreateSale, onSelectOrder }: SalesViewProps) {
  const { salesOrders } = useInventory();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");

  const filteredOrders = useMemo(() => {
    return salesOrders.filter((order) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        order.invoiceNumber.toLowerCase().includes(q) ||
        order.customerName.toLowerCase().includes(q) ||
        order.customerCompany.toLowerCase().includes(q) ||
        order.items.some((i) => i.itemName.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q));

      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      const matchesPayment = paymentFilter === "all" || order.paymentStatus === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [salesOrders, searchQuery, statusFilter, paymentFilter]);

  const totalRevenue = salesOrders.reduce((acc, order) => acc + order.totalAmount, 0);
  const paidCount = salesOrders.filter((o) => o.paymentStatus === "paid").length;
  const pendingShipment = salesOrders.filter((o) => o.status === "pending").length;

  return (
    <div className="space-y-6">
      {/* 3 Metric Cards (Crisp White + Circular Badges + High Contrast) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Total Invoiced */}
        <div className="p-5 rounded-2xl bg-white border border-[#EAE4E3] shadow-[0_4px_20px_rgba(34,129,129,0.04)] hover:shadow-lg hover:border-[#228181]/40 hover:-translate-y-1 active:scale-[0.99] transition-all duration-200 cursor-pointer flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#228181] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#228181]/25">
            <span className="text-xl font-black">₹</span>
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Invoiced Revenue
            </div>
            <div className="text-2xl font-black tracking-tight text-[#1C2727] mt-0.5 truncate font-mono">
              {formatCurrency(totalRevenue)}
            </div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">
              Across {salesOrders.length} commercial orders
            </div>
          </div>
        </div>

        {/* Collections */}
        <div className="p-5 rounded-2xl bg-white border border-[#EAE4E3] shadow-[0_4px_20px_rgba(34,129,129,0.04)] hover:shadow-lg hover:border-[#165353]/40 hover:-translate-y-1 active:scale-[0.99] transition-all duration-200 cursor-pointer flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#165353] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#165353]/25">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Paid Collections
            </div>
            <div className="text-2xl font-black tracking-tight text-[#165353] mt-0.5 truncate">
              {paidCount} / {salesOrders.length}
            </div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">
              High cash-flow collection rate
            </div>
          </div>
        </div>

        {/* Awaiting Fulfillment */}
        <div className="p-5 rounded-2xl bg-white border border-[#EAE4E3] shadow-[0_4px_20px_rgba(215,142,171,0.04)] hover:shadow-lg hover:border-[#D78EAB]/40 hover:-translate-y-1 active:scale-[0.99] transition-all duration-200 cursor-pointer flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#D78EAB] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#D78EAB]/25">
            <Clock className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Awaiting Fulfillment
            </div>
            <div className="text-2xl font-black tracking-tight text-[#7A2D4C] mt-0.5 truncate">
              {pendingShipment} Orders
            </div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">
              Ready for warehouse dispatch
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search invoice #, client, or product..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-[#EAE4E3] bg-[#FAF8F7] text-[#1C2727] placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#228181] focus:border-[#228181] transition-all"
          />
        </div>

        {/* Filters and CTA */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-[#EAE4E3] bg-[#FAF8F7] text-[#1C2727] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#228181] transition-all cursor-pointer"
          >
            <option value="all">All Fulfillments</option>
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-[#EAE4E3] bg-[#FAF8F7] text-[#1C2727] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#228181] transition-all cursor-pointer"
          >
            <option value="all">All Payments</option>
            <option value="paid">Paid</option>
            <option value="partial">Partial</option>
            <option value="unpaid">Unpaid</option>
          </select>

          <button
            onClick={onOpenCreateSale}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-[#228181] hover:bg-[#1A6868] active:scale-95 rounded-xl shadow-xs hover:shadow-md transition-all duration-150 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>New Sales Order</span>
          </button>
        </div>
      </div>

      {/* Sales Orders Table */}
      <div className="rounded-2xl border border-[#EAE4E3] bg-white overflow-hidden shadow-[0_4px_20px_rgba(34,129,129,0.03)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#EAE4E3] bg-[#FAF8F7] text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4">Invoice #</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Customer &amp; Company</th>
                <th className="py-3.5 px-4">Items Ordered</th>
                <th className="py-3.5 px-4 text-right">Invoice Amount</th>
                <th className="py-3.5 px-4 text-center">Payment</th>
                <th className="py-3.5 px-4 text-center">Fulfillment</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE4E3]/70 text-xs sm:text-sm">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 text-xs font-medium">
                    No sales orders match your criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isDelivered = order.status === "delivered";
                  const isShipped = order.status === "shipped";
                  const isPending = order.status === "pending";
                  const isPaid = order.paymentStatus === "paid";

                  return (
                    <tr
                      key={order.id}
                      onClick={() => onSelectOrder(order)}
                      className="hover:bg-[#FAF6F4] active:bg-[#F2ECE9] transition-colors duration-150 cursor-pointer"
                    >
                      {/* Invoice # */}
                      <td className="py-3.5 px-4 font-mono font-bold text-[#1C2727]">
                        {order.invoiceNumber}
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-slate-600 text-xs font-medium">
                        {formatDate(order.date)}
                      </td>

                      {/* Customer */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#1C2727]">
                          {order.customerCompany}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          {order.customerName}
                        </div>
                      </td>

                      {/* Items */}
                      <td className="py-3.5 px-4 text-slate-700">
                        <div className="font-bold text-xs text-[#1C2727]">
                          {order.items.length} item(s) ({order.items.reduce((a, b) => a + b.quantity, 0)} units)
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-xs font-medium">
                          {order.items.map((i) => `${i.itemName} (x${i.quantity})`).join(", ")}
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4 text-right font-black text-[#1C2727] font-mono">
                        {formatCurrency(order.totalAmount)}
                      </td>

                      {/* Payment */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            isPaid
                              ? "bg-[#EAF4F4] text-[#165353] border border-[#228181]/20"
                              : "bg-[#FFF6F0] text-[#B85D19] border border-[#F2CBB0]"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isPaid ? "bg-[#228181]" : "bg-[#B85D19]"
                            }`}
                          />
                          {order.paymentStatus.toUpperCase()}
                        </span>
                      </td>

                      {/* Fulfillment */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${
                            isDelivered
                              ? "bg-[#EAF4F4] text-[#165353] border border-[#228181]/20"
                              : isShipped
                              ? "bg-[#FAF0F4] text-[#7A2D4C] border border-[#D78EAB]/20"
                              : isPending
                              ? "bg-[#FFF6F0] text-[#B85D19] border border-[#F2CBB0]"
                              : "bg-[#FAF0F4] text-[#AD597B]"
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectOrder(order);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold text-[#165353] hover:text-[#228181] hover:bg-[#EAF4F4] active:scale-90 rounded-lg transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Invoice</span>
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
