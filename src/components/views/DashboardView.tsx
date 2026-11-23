"use client";

import React, { useState } from "react";
import { useInventory } from "@/context/InventoryContext";
import {
  TrendingUp,
  Package,
  AlertTriangle,
  Boxes,
  MoreHorizontal,
  ChevronDown,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

interface DashboardViewProps {
  onOpenCreateSale: () => void;
  onOpenCreatePO: (preselectedItemId?: string) => void;
  onNavigate: (module: string) => void;
}

export function DashboardView({
  onOpenCreateSale,
  onOpenCreatePO,
  onNavigate,
}: DashboardViewProps) {
  const { items, salesOrders, purchaseOrders, receivePurchaseOrder } = useInventory();
  const [timeframe, setTimeframe] = useState<"This week" | "This month" | "This quarter">("This week");

  // Calculations
  const totalStockOnHandValuation = items.reduce(
    (acc, item) => acc + item.costPrice * item.currentStock,
    0
  );
  const totalCosts = purchaseOrders.reduce((acc, p) => acc + p.totalAmount, 0);
  const totalSales = salesOrders.reduce((acc, s) => acc + s.totalAmount, 0);
  const totalProductsSold = salesOrders.reduce(
    (acc, s) => acc + s.items.reduce((sum, i) => sum + i.quantity, 0),
    0
  );

  const lowStockItems = items.filter(
    (i) => i.status === "low_stock" || i.status === "out_of_stock"
  );

  return (
    <div className="space-y-6">
      {/* Dashboard Top Title & Timeframe Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1C2727] tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time operations, inventory valuation &amp; fulfillment tracking
          </p>
        </div>

        {/* Timeframe Pill Dropdown */}
        <div className="relative">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as any)}
            className="appearance-none bg-white border border-[#EAE4E3] text-[#1C2727] text-xs font-semibold px-4 py-2 pr-8 rounded-xl shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#228181]"
          >
            <option value="This week">This week</option>
            <option value="This month">This month</option>
            <option value="This quarter">This quarter</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Urgent Low Stock Alert Banner (Dusty Rose Accent #D78EAB) */}
      {lowStockItems.length > 0 && (
        <div className="p-4 rounded-2xl bg-[#FAF0F4] border border-[#F0D5DF] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#D78EAB] text-white flex items-center justify-center shrink-0 shadow-sm">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#7A2D4C]">
                Low Stock Alert ({lowStockItems.length} Products Below Safety Threshold)
              </div>
              <div className="text-[11px] text-[#A34B70]">
                {lowStockItems.map((i) => `${i.name} (${i.currentStock} left)`).join(" • ")}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              onClick={() => onOpenCreatePO(lowStockItems[0]?.id)}
              className="px-3.5 py-1.5 rounded-xl bg-[#228181] hover:bg-[#1A6868] text-white font-bold text-xs shadow-xs transition-colors"
            >
              Quick Reorder PO
            </button>
            <button
              onClick={() => onNavigate("stock")}
              className="px-3 py-1.5 rounded-xl bg-white text-[#7A2D4C] font-semibold text-xs border border-[#F0D5DF] hover:bg-[#FAF0F4] transition-colors"
            >
              View Stock
            </button>
          </div>
        </div>
      )}

      {/* 4 Top Metric Cards (Precise Coolors Palette) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total costs (Dusty Rose Circle #D78EAB) */}
        <div className="p-5 rounded-2xl bg-white border border-[#EAE4E3] shadow-[0_4px_20px_rgba(215,142,171,0.06)] flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-[#D78EAB] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#D78EAB]/25">
            <span className="text-lg font-bold">₹</span>
          </div>
          <div className="min-w-0">
            <div className="text-xs font-medium text-slate-400">Total costs</div>
            <div className="text-xl font-bold text-[#1C2727] tracking-tight mt-0.5 truncate">
              {formatCurrency(totalCosts)}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-[#228181] font-semibold mt-0.5">
              <span>↑ +40% this week</span>
            </div>
          </div>
        </div>

        {/* Card 2: Total sales (Deep Pine Teal Circle #228181) */}
        <div className="p-5 rounded-2xl bg-white border border-[#EAE4E3] shadow-[0_4px_20px_rgba(34,129,129,0.06)] flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-[#228181] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#228181]/25">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-medium text-slate-400">Total sales</div>
            <div className="text-xl font-bold text-[#1C2727] tracking-tight mt-0.5 truncate">
              {formatCurrency(totalSales)}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-[#228181] font-semibold mt-0.5">
              <span>↑ +60% this week</span>
            </div>
          </div>
        </div>

        {/* Card 3: Products sold (Teal Shade Circle #329999) */}
        <div className="p-5 rounded-2xl bg-white border border-[#EAE4E3] shadow-[0_4px_20px_rgba(34,129,129,0.06)] flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-[#329999] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#329999]/25">
            <Package className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-medium text-slate-400">Products sold</div>
            <div className="text-xl font-bold text-[#1C2727] tracking-tight mt-0.5 truncate">
              {totalProductsSold > 0 ? totalProductsSold : 2500}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-[#228181] font-semibold mt-0.5">
              <span>↑ +40% this week</span>
            </div>
          </div>
        </div>

        {/* Card 4: Stock on hand (Cashmere / Slate Tone #857B7A) */}
        <div className="p-5 rounded-2xl bg-white border border-[#EAE4E3] shadow-[0_4px_20px_rgba(221,214,213,0.12)] flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-[#857B7A] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#857B7A]/25">
            <Boxes className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-medium text-slate-400">Stock on hand</div>
            <div className="text-xl font-bold text-[#1C2727] tracking-tight mt-0.5 truncate">
              {formatCurrency(totalStockOnHandValuation)}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-[#228181] font-semibold mt-0.5">
              <span>↑ +50% this week</span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row Cards: Revenue vs Costs (Chart 1) | Purchase Summary (Chart 2) | Purchase Orders (List) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Card 1: Revenue vs Costs SVG Chart (5 Cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-white border border-[#EAE4E3] shadow-[0_4px_20px_rgba(34,129,129,0.03)] flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2">
            <div>
              <h3 className="text-sm font-bold text-[#1C2727]">
                Revenue vs Costs
              </h3>
              <div className="flex items-center gap-4 mt-1 text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#228181]" />
                  <span>Total revenue</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D78EAB]" />
                  <span>Total costs</span>
                </div>
              </div>
            </div>
            <button className="p-1 rounded text-slate-400 hover:text-slate-600">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* SVG Smooth Multi-line Chart */}
          <div className="mt-4 pt-2">
            <div className="relative h-44 w-full">
              <svg viewBox="0 0 400 160" className="w-full h-full overflow-visible">
                {/* Horizontal guide lines */}
                <line x1="30" y1="20" x2="390" y2="20" stroke="#f1eeea" strokeDasharray="3 3" />
                <line x1="30" y1="65" x2="390" y2="65" stroke="#f1eeea" strokeDasharray="3 3" />
                <line x1="30" y1="110" x2="390" y2="110" stroke="#f1eeea" strokeDasharray="3 3" />
                <line x1="30" y1="140" x2="390" y2="140" stroke="#eae4e3" />

                {/* Y-axis labels */}
                <text x="5" y="24" fontSize="10" fill="#94a3b8" fontFamily="inherit">40k</text>
                <text x="5" y="69" fontSize="10" fill="#94a3b8" fontFamily="inherit">20k</text>
                <text x="15" y="140" fontSize="10" fill="#94a3b8" fontFamily="inherit">0k</text>

                {/* Pine Teal Line: Total Revenue (Smooth Bezier) */}
                <path
                  d="M 35 95 C 90 90, 130 65, 190 75 C 240 85, 300 45, 385 40"
                  fill="none"
                  stroke="#228181"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Dusty Rose Line: Total Costs (Smooth Bezier) */}
                <path
                  d="M 35 125 C 90 120, 130 95, 190 105 C 250 115, 300 75, 385 70"
                  fill="none"
                  stroke="#D78EAB"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Circular dots */}
                <circle cx="190" cy="75" r="3.5" fill="#228181" />
                <circle cx="385" cy="40" r="3.5" fill="#228181" />
                <circle cx="190" cy="105" r="3.5" fill="#D78EAB" />
                <circle cx="385" cy="70" r="3.5" fill="#D78EAB" />
              </svg>
            </div>

            {/* X-axis dates */}
            <div className="flex justify-between pl-8 pr-2 pt-2 text-[10px] text-slate-400 font-medium">
              <span>Jun 10</span>
              <span>Jun 11</span>
              <span>Jun 12</span>
              <span>Jun 13</span>
              <span>Jun 14</span>
            </div>
          </div>
        </div>

        {/* Card 2: Purchase Summary (3 Cols) */}
        <div className="lg:col-span-3 p-5 rounded-2xl bg-white border border-[#EAE4E3] shadow-[0_4px_20px_rgba(34,129,129,0.03)] flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-sm font-bold text-[#1C2727]">
              Purchase Summary
            </h3>
            <button className="p-1 rounded text-slate-400 hover:text-slate-600">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-4 pt-2">
            <div className="relative h-44 w-full">
              <svg viewBox="0 0 240 160" className="w-full h-full overflow-visible">
                {/* Horizontal guides */}
                <line x1="25" y1="20" x2="230" y2="20" stroke="#f1eeea" strokeDasharray="3 3" />
                <line x1="25" y1="75" x2="230" y2="75" stroke="#f1eeea" strokeDasharray="3 3" />
                <line x1="25" y1="135" x2="230" y2="135" stroke="#eae4e3" />

                {/* Y-axis labels */}
                <text x="2" y="24" fontSize="10" fill="#94a3b8">15k</text>
                <text x="2" y="79" fontSize="10" fill="#94a3b8">10k</text>
                <text x="5" y="135" fontSize="10" fill="#94a3b8">0k</text>

                {/* Pine Teal Line with round vertices */}
                <path
                  d="M 30 115 L 80 125 L 130 75 L 180 85 L 225 50"
                  fill="none"
                  stroke="#228181"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Points */}
                <circle cx="30" cy="115" r="3.5" fill="#ffffff" stroke="#228181" strokeWidth="2" />
                <circle cx="80" cy="125" r="3.5" fill="#ffffff" stroke="#228181" strokeWidth="2" />
                <circle cx="130" cy="75" r="3.5" fill="#ffffff" stroke="#228181" strokeWidth="2" />
                <circle cx="180" cy="85" r="3.5" fill="#ffffff" stroke="#228181" strokeWidth="2" />
                <circle cx="225" cy="50" r="3.5" fill="#ffffff" stroke="#228181" strokeWidth="2" />
              </svg>
            </div>

            {/* X-axis */}
            <div className="flex justify-between pl-6 pr-1 pt-2 text-[10px] text-slate-400 font-medium">
              <span>Jun 10</span>
              <span>Jun 11</span>
              <span>Jun 12</span>
              <span>Jun 13</span>
            </div>
          </div>
        </div>

        {/* Card 3: Purchase Orders List (4 Cols) */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-white border border-[#EAE4E3] shadow-[0_4px_20px_rgba(34,129,129,0.03)] flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-[#EAE4E3]">
            <h3 className="text-sm font-bold text-[#1C2727]">
              Purchase Orders
            </h3>
            <button
              onClick={() => onNavigate("purchase")}
              className="text-xs text-[#228181] font-semibold hover:underline"
            >
              See all
            </button>
          </div>

          <div className="divide-y divide-[#EAE4E3]/60 my-2">
            <div className="py-2.5 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400">
              <span>Order ID</span>
              <span>Amount</span>
            </div>

            {purchaseOrders.slice(0, 3).map((po) => {
              const isReceived = po.status === "received";

              return (
                <div key={po.id} className="py-2.5 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#1C2727] font-mono">
                      {po.poNumber}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      {po.supplierCompany}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-bold text-[#1C2727] font-mono">
                      {formatCurrency(po.totalAmount)}
                    </div>
                    {!isReceived ? (
                      <button
                        onClick={() => receivePurchaseOrder(po.id)}
                        className="text-[10px] font-bold text-[#228181] hover:underline"
                      >
                        Receive
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-400">Received</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => onOpenCreatePO()}
            className="w-full mt-2 py-2 rounded-xl text-xs font-semibold bg-[#EAF4F4] text-[#165353] hover:bg-[#D5EAEA] transition-colors text-center"
          >
            + Create New Purchase Order
          </button>
        </div>
      </div>

      {/* Bottom Row Cards: Sales Orders Table & Sales by Category Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Card: Sales Orders Table (7 Cols) */}
        <div className="lg:col-span-8 p-5 rounded-2xl bg-white border border-[#EAE4E3] shadow-[0_4px_20px_rgba(34,129,129,0.03)]">
          <div className="flex items-center justify-between pb-3 border-b border-[#EAE4E3]">
            <h3 className="text-sm font-bold text-[#1C2727]">
              Sales Orders
            </h3>
            <button
              onClick={() => onNavigate("sales")}
              className="p-1 rounded text-slate-400 hover:text-slate-600"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-x-auto mt-2">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#EAE4E3] text-[11px] font-bold text-slate-400 bg-[#FAF8F7]">
                  <th className="py-2.5 px-3">Order ID</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Tracking</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-right">Order total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE4E3]/60">
                {salesOrders.slice(0, 5).map((order) => {
                  const trackingId = `TRK-${order.invoiceNumber.replace("INV-", "")}`;
                  const isDelivered = order.status === "delivered";
                  const isShipped = order.status === "shipped";
                  const isPending = order.status === "pending";

                  return (
                    <tr key={order.id} className="hover:bg-[#FAF8F7]">
                      <td className="py-3 px-3 font-semibold text-[#1C2727] font-mono">
                        {order.invoiceNumber}
                      </td>
                      <td className="py-3 px-3 text-slate-700 font-medium">
                        {order.customerName}
                      </td>
                      <td className="py-3 px-3 text-slate-400 text-[11px]">
                        {formatDate(order.date)}
                      </td>
                      <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                        {trackingId}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-[10px] font-semibold ${
                            isDelivered
                              ? "bg-[#EAF4F4] text-[#165353]"
                              : isShipped
                              ? "bg-[#F3EFF0] text-[#7A2D4C]"
                              : isPending
                              ? "bg-[#FFF6F0] text-[#B85D19]"
                              : "bg-[#FAEBF1] text-[#AD597B]"
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-[#1C2727] font-mono">
                        {formatCurrency(order.totalAmount)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Card: Sales by Category Donut Chart (5 Cols) */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-white border border-[#EAE4E3] shadow-[0_4px_20px_rgba(34,129,129,0.03)] flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#EAE4E3]">
            <h3 className="text-sm font-bold text-[#1C2727]">
              Sales by category
            </h3>
            <button className="p-1 rounded text-slate-400 hover:text-slate-600">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* SVG Donut Chart with center value */}
          <div className="py-4 flex flex-col items-center justify-center">
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {/* Segment 1: Computers (Deep Pine Teal #228181) ~42% */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#228181"
                  strokeWidth="15"
                  strokeDasharray="100 140"
                  strokeDashoffset="0"
                />
                {/* Segment 2: Phones / GPUs (Dusty Rose #D78EAB) ~28% */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#D78EAB"
                  strokeWidth="15"
                  strokeDasharray="66 174"
                  strokeDashoffset="-102"
                />
                {/* Segment 3: Electronics (Teal Shade #38A1A1) ~18% */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#38A1A1"
                  strokeWidth="15"
                  strokeDasharray="42 198"
                  strokeDashoffset="-170"
                />
                {/* Segment 4: Gadgets / Storage (Cashmere #DDD6D5) ~12% */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#DDD6D5"
                  strokeWidth="15"
                  strokeDasharray="28 212"
                  strokeDashoffset="-214"
                />
              </svg>

              {/* Center Callout Badge */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="px-3 py-1.5 rounded-lg bg-white shadow-md border border-[#EAE4E3] text-center">
                  <div className="text-sm font-black text-[#1C2727] font-mono">
                    ₹18.4L
                  </div>
                  <div className="text-[9px] text-slate-400 font-semibold uppercase">
                    Total
                  </div>
                </div>
              </div>
            </div>

            {/* Legend Dots with the Coolors Palette */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-4 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#228181]" />
                <span className="text-[11px] font-medium">Computers</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#38A1A1]" />
                <span className="text-[11px] font-medium">Electronics</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D78EAB]" />
                <span className="text-[11px] font-medium">Processors</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#DDD6D5]" />
                <span className="text-[11px] font-medium">Gadgets</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#EAE4E3] text-center">
            <button
              onClick={() => onNavigate("reports")}
              className="text-xs text-[#228181] font-semibold hover:underline"
            >
              View Full Analytics Report ➔
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
