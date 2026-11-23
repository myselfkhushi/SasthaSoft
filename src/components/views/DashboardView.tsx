"use client";

import React, { useState } from "react";
import { useInventory } from "@/context/InventoryContext";
import {
  TrendingUp,
  Package,
  AlertTriangle,
  ShoppingCart,
  Truck,
  ArrowUpRight,
  ArrowDownRight,
  Boxes,
  Clock,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";

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
  const { items, salesOrders, purchaseOrders, stockHistory, receivePurchaseOrder } = useInventory();
  const [activityFilter, setActivityFilter] = useState<"all" | "sales" | "purchases" | "adjustments">("all");

  // Calculations
  const totalInventoryValuation = items.reduce(
    (acc, item) => acc + item.costPrice * item.currentStock,
    0
  );
  const totalInventoryRetailValue = items.reduce(
    (acc, item) => acc + item.sellingPrice * item.currentStock,
    0
  );
  const totalUnits = items.reduce((acc, item) => acc + item.currentStock, 0);

  const lowStockItems = items.filter(
    (i) => i.status === "low_stock" || i.status === "out_of_stock"
  );
  const outOfStockItems = items.filter((i) => i.status === "out_of_stock");

  const totalSalesRevenue = salesOrders.reduce((acc, s) => acc + s.totalAmount, 0);
  const totalPurchaseSpend = purchaseOrders.reduce((acc, p) => acc + p.totalAmount, 0);

  const pendingPurchases = purchaseOrders.filter(
    (p) => p.status === "ordered" || p.status === "pending"
  );

  // Filtered Activity Feed
  const filteredHistory = stockHistory.filter((entry) => {
    if (activityFilter === "sales") return entry.changeType === "sale_fulfilled";
    if (activityFilter === "purchases") return entry.changeType === "purchase_received";
    if (activityFilter === "adjustments")
      return entry.changeType === "manual_adjustment" || entry.changeType === "transfer_out" || entry.changeType === "transfer_in";
    return true;
  }).slice(0, 7);

  return (
    <div className="space-y-6">
      {/* Welcome Banner & Quick Action Highlights */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 border border-slate-800 shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live Reactive Inventory Engine
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Operations & Supply Chain Command Center
          </h2>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Every purchase automatically increments physical warehouse stock. Every sales order validates available quantities, deducts inventory, and syncs low-stock alerts in real time.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={onOpenCreateSale}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all"
            >
              <ShoppingCart className="w-4 h-4" />
              Dispatch Sales Order
            </button>
            <button
              onClick={() => onOpenCreatePO()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold backdrop-blur-sm border border-white/15 transition-all"
            >
              <Truck className="w-4 h-4 text-emerald-400" />
              Procure Restock (PO)
            </button>
          </div>
        </div>

        {/* Ambient Decorative background glow */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none hidden sm:block" />
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Inventory Valuation */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Inventory Valuation</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
              {formatCurrency(totalInventoryValuation)}
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
              <span>{totalUnits} units across {items.length} SKUs</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Sales Revenue */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Sales Invoiced</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
              {formatCurrency(totalSalesRevenue)}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>{salesOrders.length} Completed Invoices</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Purchase Spend */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Purchase Spend</span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
              {formatCurrency(totalPurchaseSpend)}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500">
              <span>{purchaseOrders.length} Total POs ({pendingPurchases.length} awaiting delivery)</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Low Stock Alerts */}
        <div
          onClick={() => onNavigate("stock")}
          className={`p-5 rounded-2xl border shadow-sm hover:shadow-md transition-all cursor-pointer ${
            lowStockItems.length > 0
              ? "bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60"
              : "bg-white dark:bg-zinc-900 border-slate-200/80 dark:border-zinc-800"
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              Stock Warnings
            </span>
            <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-400">
              {lowStockItems.length} Products
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
              <span>{outOfStockItems.length} out of stock • {lowStockItems.length - outOfStockItems.length} critical low</span>
            </div>
          </div>
        </div>
      </div>

      {/* Urgent Low Stock Alert Panel */}
      {lowStockItems.length > 0 && (
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-rose-200/80 dark:border-rose-900/40 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-rose-100 dark:border-rose-950">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                  Critical Low Stock Alerts (Requires Replenishment)
                </h3>
                <p className="text-xs text-slate-500">
                  Items currently below minimum safety stock levels. One-click restock creates pre-filled Purchase Orders.
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate("stock")}
              className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline self-start sm:self-auto"
            >
              View Full Stock Table ➔
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowStockItems.map((item) => {
              const isOut = item.currentStock === 0;
              const percent = Math.min(100, Math.round((item.currentStock / item.minStockLevel) * 100));

              return (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl border border-slate-200/80 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950/40 flex flex-col justify-between gap-3"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-semibold text-xs text-slate-900 dark:text-zinc-100 line-clamp-1">
                        {item.name}
                      </div>
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          isOut
                            ? "bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300"
                            : "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300"
                        }`}
                      >
                        {isOut ? "OUT OF STOCK" : "LOW STOCK"}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 mt-0.5">{item.sku}</div>

                    {/* Progress Bar of Stock vs Min Level */}
                    <div className="mt-3 space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-500">
                        <span>On Hand: <strong className={isOut ? "text-rose-600 font-bold" : "text-amber-600 font-bold"}>{item.currentStock} {item.unit}</strong></span>
                        <span>Threshold: {item.minStockLevel} {item.unit}</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-zinc-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            isOut ? "bg-rose-500" : "bg-amber-500"
                          }`}
                          style={{ width: `${Math.max(5, percent)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenCreatePO(item.id)}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    Quick Reorder PO
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Two Column Layout: Connected Orders & Recent Stock History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Pending Purchase Orders (Restock Workflow) */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-sm flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                Pending Purchase Receipts (Restock Queue)
              </h3>
            </div>
            <button
              onClick={() => onNavigate("purchase")}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              All Purchases ➔
            </button>
          </div>

          <div className="flex-1 divide-y divide-slate-100 dark:divide-zinc-800/60 mt-2">
            {pendingPurchases.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No pending shipments. All purchase orders are fully received!
              </div>
            ) : (
              pendingPurchases.map((po) => (
                <div key={po.id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900 dark:text-zinc-100">
                        {po.poNumber}
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-600 dark:text-zinc-300 font-medium">
                        {po.supplierCompany}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {po.items.length} item(s) • Valuation: {formatCurrency(po.totalAmount)} • Date: {formatDate(po.date)}
                    </div>
                  </div>

                  <button
                    onClick={() => receivePurchaseOrder(po.id)}
                    className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Receive & Restock
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Recent Stock Activity Feed (Audit Trail) */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-sm flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                Connected Stock Audit Trail
              </h3>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-zinc-800 p-0.5 rounded-lg text-[11px]">
              {(["all", "sales", "purchases"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActivityFilter(tab)}
                  className={`px-2 py-0.5 rounded-md capitalize font-medium transition-colors ${
                    activityFilter === tab
                      ? "bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 divide-y divide-slate-100 dark:divide-zinc-800/60 mt-2">
            {filteredHistory.map((entry) => {
              const isSale = entry.changeType === "sale_fulfilled";
              const isPurchase = entry.changeType === "purchase_received";
              const isAdjustment = entry.changeType === "manual_adjustment";

              return (
                <div key={entry.id} className="py-2.5 flex items-start justify-between gap-3 text-xs">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div
                      className={`mt-0.5 p-1 rounded-md shrink-0 ${
                        isPurchase
                          ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400"
                          : isSale
                          ? "bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400"
                          : "bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {isPurchase && <Truck className="w-3.5 h-3.5" />}
                      {isSale && <ShoppingCart className="w-3.5 h-3.5" />}
                      {!isPurchase && !isSale && <Boxes className="w-3.5 h-3.5" />}
                    </div>

                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 dark:text-zinc-100 truncate">
                        {entry.itemName}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        Ref: <span className="font-mono">{entry.referenceId}</span> • {entry.godownName}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`font-bold font-mono ${
                        entry.quantityDelta > 0
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {entry.quantityDelta > 0 ? `+${entry.quantityDelta}` : entry.quantityDelta}
                    </span>
                    <div className="text-[10px] text-slate-400">
                      Bal: {entry.resultingStock}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 text-center">
            <button
              onClick={() => onNavigate("stock")}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Explore Full Audit Ledger & History ➔
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
