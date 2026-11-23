"use client";

import React, { useState, useMemo } from "react";
import { useInventory } from "@/context/InventoryContext";
import { PurchaseOrder } from "@/types/inventory";
import {
  Search,
  Truck,
  Plus,
  CheckCircle2,
  Clock,
  Building2,
  PackageCheck,
  AlertCircle,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

interface PurchaseViewProps {
  onOpenCreatePO: () => void;
}

export function PurchaseView({ onOpenCreatePO }: PurchaseViewProps) {
  const { purchaseOrders, godowns, receivePurchaseOrder } = useInventory();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredPOs = useMemo(() => {
    return purchaseOrders.filter((po) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        po.poNumber.toLowerCase().includes(q) ||
        po.supplierCompany.toLowerCase().includes(q) ||
        po.supplierName.toLowerCase().includes(q) ||
        po.items.some((i) => i.itemName.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q));

      const matchesStatus = statusFilter === "all" || po.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [purchaseOrders, searchQuery, statusFilter]);

  const totalSpend = purchaseOrders.reduce((acc, p) => acc + p.totalAmount, 0);
  const pendingPOs = purchaseOrders.filter((p) => p.status === "ordered" || p.status === "pending");
  const receivedPOs = purchaseOrders.filter((p) => p.status === "received");

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Procurement Spend
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-100 mt-1">
            {formatCurrency(totalSpend)}
          </div>
          <div className="text-xs text-slate-400 mt-0.5">{purchaseOrders.length} total purchase orders</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Stock Received
          </div>
          <div className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 mt-1">
            {receivedPOs.length} / {purchaseOrders.length} POs
          </div>
          <div className="text-xs text-slate-400 mt-0.5">Physical items added to stock ledger</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Pending Delivery
          </div>
          <div className="text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400 mt-1">
            {pendingPOs.length} POs Awaiting
          </div>
          <div className="text-xs text-slate-400 mt-0.5">Ready for warehouse intake</div>
        </div>
      </div>

      {/* Connected Workflow Banner */}
      <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 flex items-start gap-3">
        <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 shrink-0">
          <PackageCheck className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs sm:text-sm font-bold text-emerald-900 dark:text-emerald-200">
            Automated Stock Reception Protocol
          </h4>
          <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5 leading-relaxed">
            When a supplier delivers items, click <strong>&quot;Receive &amp; Restock&quot;</strong>. The system automatically increments the inventory quantities of all line items, updates the stock ledger, and logs the audit history.
          </p>
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
            placeholder="Search PO #, vendor, or item..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Filters and CTA */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Statuses</option>
            <option value="received">Received</option>
            <option value="ordered">Ordered</option>
            <option value="pending">Pending</option>
          </select>

          <button
            onClick={onOpenCreatePO}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/20 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            New Purchase Order
          </button>
        </div>
      </div>

      {/* Purchase Orders Table */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50/75 dark:bg-zinc-950/50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">PO #</th>
                <th className="py-3 px-4">Date Placed</th>
                <th className="py-3 px-4">Supplier & Vendor</th>
                <th className="py-3 px-4">Destination Hub</th>
                <th className="py-3 px-4">Items & Units</th>
                <th className="py-3 px-4 text-right">Valuation</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Receiving Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60 text-xs sm:text-sm">
              {filteredPOs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                    No purchase orders match your criteria.
                  </td>
                </tr>
              ) : (
                filteredPOs.map((po) => {
                  const isReceived = po.status === "received";
                  const targetGodown = godowns.find((g) => g.id === po.godownId);

                  return (
                    <tr
                      key={po.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-zinc-800/40 transition-colors"
                    >
                      {/* PO # */}
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-zinc-100">
                        {po.poNumber}
                      </td>

                      {/* Date */}
                      <td className="py-3 px-4 text-slate-500 text-xs">
                        {formatDate(po.date)}
                        {po.receivedDate && (
                          <div className="text-[10px] text-emerald-600 dark:text-emerald-400">
                            Recv: {formatDate(po.receivedDate)}
                          </div>
                        )}
                      </td>

                      {/* Supplier */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 dark:text-zinc-100">
                          {po.supplierCompany}
                        </div>
                        <div className="text-[11px] text-slate-400">{po.supplierName}</div>
                      </td>

                      {/* Destination Godown */}
                      <td className="py-3 px-4 text-slate-600 dark:text-zinc-300">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>{targetGodown?.name || "Central Warehouse"}</span>
                        </div>
                      </td>

                      {/* Items */}
                      <td className="py-3 px-4 text-slate-600 dark:text-zinc-400">
                        <div className="font-medium text-xs">
                          {po.items.length} item(s) ({po.items.reduce((a, b) => a + b.quantity, 0)} units)
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-xs">
                          {po.items.map((i) => `${i.itemName} (x${i.quantity})`).join(", ")}
                        </div>
                      </td>

                      {/* Total */}
                      <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-zinc-100 font-mono">
                        {formatCurrency(po.totalAmount)}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                            isReceived
                              ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900"
                              : "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isReceived ? "bg-emerald-500" : "bg-amber-500"
                            }`}
                          />
                          {po.status.toUpperCase()}
                        </span>
                      </td>

                      {/* Receiving Action */}
                      <td className="py-3 px-4 text-right">
                        {isReceived ? (
                          <div className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Stock In</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => receivePurchaseOrder(po.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-all"
                          >
                            <PackageCheck className="w-3.5 h-3.5" />
                            Receive &amp; Restock
                          </button>
                        )}
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
