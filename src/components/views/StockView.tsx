"use client";

import React, { useState, useMemo } from "react";
import { useInventory } from "@/context/InventoryContext";
import { Item, StockChangeType } from "@/types/inventory";
import {
  Search,
  Package,
  Plus,
  Sliders,
  Edit2,
  Trash2,
  AlertTriangle,
  History,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  CheckCircle2,
  Boxes,
} from "lucide-react";
import { formatCurrency, formatDateTime } from "@/lib/utils";

interface StockViewProps {
  onOpenAddItem: (editItem?: Item) => void;
  onOpenAdjustStock: (item: Item) => void;
}

export function StockView({ onOpenAddItem, onOpenAdjustStock }: StockViewProps) {
  const { items, godowns, stockHistory, deleteItem } = useInventory();

  const [activeSubTab, setActiveSubTab] = useState<"catalog" | "history">("catalog");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [godownFilter, setGodownFilter] = useState("all");
  const [historyTypeFilter, setHistoryTypeFilter] = useState("all");

  const categories = useMemo(() => {
    return Array.from(new Set(items.map((i) => i.category)));
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        item.name.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);

      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      const matchesGodown = godownFilter === "all" || item.godownId === godownFilter;

      return matchesSearch && matchesCategory && matchesStatus && matchesGodown;
    });
  }, [items, searchQuery, categoryFilter, statusFilter, godownFilter]);

  const filteredHistory = useMemo(() => {
    return stockHistory.filter((entry) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        entry.itemName.toLowerCase().includes(q) ||
        entry.sku.toLowerCase().includes(q) ||
        entry.referenceId.toLowerCase().includes(q) ||
        entry.notes.toLowerCase().includes(q);

      const matchesType = historyTypeFilter === "all" || entry.changeType === historyTypeFilter;
      return matchesSearch && matchesType;
    });
  }, [stockHistory, searchQuery, historyTypeFilter]);

  const lowStockCount = items.filter(
    (i) => i.status === "low_stock" || i.status === "out_of_stock"
  ).length;

  return (
    <div className="space-y-6">
      {/* Top Sub-Tab Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-zinc-800 pb-4">
        <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-zinc-900 rounded-xl">
          <button
            onClick={() => setActiveSubTab("catalog")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeSubTab === "catalog"
                ? "bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Active Catalog ({items.length} SKUs)</span>
          </button>

          <button
            onClick={() => setActiveSubTab("history")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeSubTab === "history"
                ? "bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <History className="w-4 h-4" />
            <span>Stock History &amp; Audit Trail</span>
          </button>
        </div>

        {activeSubTab === "catalog" && (
          <button
            onClick={() => onOpenAddItem()}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add New Product (SKU)
          </button>
        )}
      </div>

      {/* CATALOG VIEW */}
      {activeSubTab === "catalog" && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by SKU, product name, or category..."
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Stock Statuses</option>
                <option value="in_stock">In Stock</option>
                <option value="low_stock">Low Stock Alerts ({lowStockCount})</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>

              <select
                value={godownFilter}
                onChange={(e) => setGodownFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Godowns</option>
                {godowns.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Catalog Table */}
          <div className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50/75 dark:bg-zinc-950/50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-4">SKU / Item</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Godown Location</th>
                    <th className="py-3 px-4 text-center">Available Stock</th>
                    <th className="py-3 px-4 text-center">Threshold</th>
                    <th className="py-3 px-4 text-right">Cost (₹)</th>
                    <th className="py-3 px-4 text-right">Retail (₹)</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60 text-xs sm:text-sm">
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-slate-400 text-xs">
                        No products match your search or filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item) => {
                      const godown = godowns.find((g) => g.id === item.godownId);
                      const isOut = item.status === "out_of_stock";
                      const isLow = item.status === "low_stock";
                      const marginPercent = Math.round(
                        ((item.sellingPrice - item.costPrice) / item.sellingPrice) * 100
                      );

                      return (
                        <tr
                          key={item.id}
                          className="hover:bg-slate-50/80 dark:hover:bg-zinc-800/40 transition-colors"
                        >
                          {/* SKU & Name */}
                          <td className="py-3 px-4">
                            <div className="font-semibold text-slate-900 dark:text-zinc-100">
                              {item.name}
                            </div>
                            <div className="text-[11px] font-mono text-slate-400">
                              {item.sku}
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-3 px-4 text-slate-500 text-xs">
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300">
                              {item.category}
                            </span>
                          </td>

                          {/* Godown */}
                          <td className="py-3 px-4 text-slate-500 text-xs">
                            {godown?.name || "Central Warehouse"}
                          </td>

                          {/* Available Stock */}
                          <td className="py-3 px-4 text-center">
                            <div className="font-bold text-sm font-mono text-slate-900 dark:text-zinc-100">
                              {item.currentStock} {item.unit}
                            </div>
                          </td>

                          {/* Min Threshold */}
                          <td className="py-3 px-4 text-center text-slate-400 text-xs font-mono">
                            {item.minStockLevel} {item.unit}
                          </td>

                          {/* Cost */}
                          <td className="py-3 px-4 text-right font-mono text-slate-500 text-xs">
                            {formatCurrency(item.costPrice)}
                          </td>

                          {/* Retail Price */}
                          <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900 dark:text-zinc-100">
                            {formatCurrency(item.sellingPrice)}
                            <div className="text-[10px] text-emerald-600 dark:text-emerald-400">
                              +{marginPercent}% margin
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                                isOut
                                  ? "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900"
                                  : isLow
                                  ? "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900"
                                  : "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  isOut ? "bg-rose-500" : isLow ? "bg-amber-500" : "bg-emerald-500"
                                }`}
                              />
                              {isOut ? "OUT OF STOCK" : isLow ? "LOW STOCK" : "IN STOCK"}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right">
                            <div className="inline-flex items-center gap-1">
                              <button
                                onClick={() => onOpenAdjustStock(item)}
                                title="Adjust Physical Stock (+ / -)"
                                className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors"
                              >
                                <Sliders className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => onOpenAddItem(item)}
                                title="Edit Product Details"
                                className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteItem(item.id)}
                                title="Remove SKU"
                                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
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
      )}

      {/* STOCK HISTORY / AUDIT TRAIL VIEW */}
      {activeSubTab === "history" && (
        <div className="space-y-4">
          {/* History Search & Type Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search history by item, SKU, reference ID or reason..."
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={historyTypeFilter}
                onChange={(e) => setHistoryTypeFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Movement Types</option>
                <option value="purchase_received">Purchase Received (Stock In)</option>
                <option value="sale_fulfilled">Sale Fulfilled (Stock Out)</option>
                <option value="manual_adjustment">Manual Adjustment</option>
                <option value="transfer_out">Godown Transfer</option>
                <option value="initial_stock">Initial Migration</option>
              </select>
            </div>
          </div>

          {/* Audit Ledger Table */}
          <div className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50/75 dark:bg-zinc-950/50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Item & SKU</th>
                    <th className="py-3 px-4">Change Event</th>
                    <th className="py-3 px-4 text-center">Delta (Qty)</th>
                    <th className="py-3 px-4 text-center">Balance</th>
                    <th className="py-3 px-4">Document Ref</th>
                    <th className="py-3 px-4">Facility</th>
                    <th className="py-3 px-4">Audit Memo / Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60 text-xs sm:text-sm">
                  {filteredHistory.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                        No audit history logs match your search.
                      </td>
                    </tr>
                  ) : (
                    filteredHistory.map((entry) => {
                      const isPurchase = entry.changeType === "purchase_received";
                      const isSale = entry.changeType === "sale_fulfilled";
                      const isAdjustment = entry.changeType === "manual_adjustment";

                      return (
                        <tr
                          key={entry.id}
                          className="hover:bg-slate-50/80 dark:hover:bg-zinc-800/40 transition-colors"
                        >
                          {/* Timestamp */}
                          <td className="py-3 px-4 text-slate-500 text-xs whitespace-nowrap">
                            {formatDateTime(entry.timestamp)}
                          </td>

                          {/* Item & SKU */}
                          <td className="py-3 px-4">
                            <div className="font-semibold text-slate-900 dark:text-zinc-100">
                              {entry.itemName}
                            </div>
                            <div className="text-[11px] font-mono text-slate-400">{entry.sku}</div>
                          </td>

                          {/* Event Type */}
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium ${
                                isPurchase
                                  ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900"
                                  : isSale
                                  ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900"
                                  : isAdjustment
                                  ? "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900"
                                  : "bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300"
                              }`}
                            >
                              {entry.changeType.replace("_", " ").toUpperCase()}
                            </span>
                          </td>

                          {/* Delta */}
                          <td className="py-3 px-4 text-center font-mono font-bold">
                            <span
                              className={
                                entry.quantityDelta > 0
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : entry.quantityDelta < 0
                                  ? "text-rose-600 dark:text-rose-400"
                                  : "text-slate-500"
                              }
                            >
                              {entry.quantityDelta > 0 ? `+${entry.quantityDelta}` : entry.quantityDelta}
                            </span>
                          </td>

                          {/* Balance */}
                          <td className="py-3 px-4 text-center font-mono text-slate-900 dark:text-zinc-100 font-semibold">
                            {entry.resultingStock}
                          </td>

                          {/* Document Ref */}
                          <td className="py-3 px-4 font-mono text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                            {entry.referenceId}
                          </td>

                          {/* Warehouse */}
                          <td className="py-3 px-4 text-slate-500 text-xs">
                            {entry.godownName}
                          </td>

                          {/* Audit Notes */}
                          <td className="py-3 px-4 text-slate-500 text-xs max-w-xs truncate">
                            {entry.notes}
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
      )}
    </div>
  );
}
