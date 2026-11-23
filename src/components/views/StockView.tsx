"use client";

import React, { useState, useMemo } from "react";
import { useInventory } from "@/context/InventoryContext";
import { Item } from "@/types/inventory";
import {
  Search,
  Package,
  Plus,
  Sliders,
  Edit2,
  Trash2,
  History,
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

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "Laptops & Desktops":
        return "bg-[#EAF4F4] text-[#165353] border border-[#228181]/25";
      case "Processors & GPUs":
        return "bg-[#FAF0F4] text-[#7A2D4C] border border-[#D78EAB]/25";
      case "Monitors & Displays":
        return "bg-[#FAF7F0] text-[#785E22] border border-[#E0D8C3]";
      case "Storage & NAS":
        return "bg-[#EEF7F7] text-[#1E5D61] border border-[#A1C7C7]/30";
      case "Networking Gear":
        return "bg-[#F8F1FA] text-[#69397D] border border-[#D9B5E6]/40";
      case "Peripherals & Accessories":
        return "bg-[#FAF4F0] text-[#7B4D25] border border-[#F2CBB0]/40";
      default:
        return "bg-[#F4F1EE] text-slate-700 border border-[#DDD6D5]";
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Sub-Tab Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#EAE4E3] pb-4">
        <div className="flex items-center gap-1.5 p-1 bg-[#EAE4E3]/70 rounded-xl border border-[#DDD6D5]">
          <button
            onClick={() => setActiveSubTab("catalog")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all duration-150 active:scale-95 ${
              activeSubTab === "catalog"
                ? "bg-white text-[#1C2727] shadow-sm font-bold"
                : "text-slate-600 hover:text-[#1C2727]"
            }`}
          >
            <Package className="w-4 h-4 text-[#228181]" />
            <span>Active Catalog ({items.length} SKUs)</span>
          </button>

          <button
            onClick={() => setActiveSubTab("history")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all duration-150 active:scale-95 ${
              activeSubTab === "history"
                ? "bg-white text-[#1C2727] shadow-sm font-bold"
                : "text-slate-600 hover:text-[#1C2727]"
            }`}
          >
            <History className="w-4 h-4 text-[#D78EAB]" />
            <span>Stock History &amp; Audit Trail</span>
          </button>
        </div>

        {activeSubTab === "catalog" && (
          <button
            onClick={() => onOpenAddItem()}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#228181] hover:bg-[#1A6868] active:scale-95 rounded-xl shadow-xs hover:shadow-md transition-all duration-150"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product (SKU)</span>
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
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by SKU, product name, or category..."
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-[#EAE4E3] bg-[#FAF8F7] text-[#1C2727] placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#228181] focus:border-[#228181] transition-all"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2.5">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-[#EAE4E3] bg-[#FAF8F7] text-[#1C2727] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#228181] transition-all cursor-pointer"
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
                className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-[#EAE4E3] bg-[#FAF8F7] text-[#1C2727] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#228181] transition-all cursor-pointer"
              >
                <option value="all">All Stock Statuses</option>
                <option value="in_stock">In Stock</option>
                <option value="low_stock">Low Stock Alerts ({lowStockCount})</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>

              <select
                value={godownFilter}
                onChange={(e) => setGodownFilter(e.target.value)}
                className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-[#EAE4E3] bg-[#FAF8F7] text-[#1C2727] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#228181] transition-all cursor-pointer"
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
          <div className="rounded-2xl border border-[#EAE4E3] bg-white overflow-hidden shadow-[0_4px_20px_rgba(34,129,129,0.03)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#EAE4E3] bg-[#FAF8F7] text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-4">SKU / Item</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Godown Location</th>
                    <th className="py-3.5 px-4 text-center">Available Stock</th>
                    <th className="py-3.5 px-4 text-center">Threshold</th>
                    <th className="py-3.5 px-4 text-right">Cost (₹)</th>
                    <th className="py-3.5 px-4 text-right">Retail (₹)</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE4E3]/70 text-xs sm:text-sm">
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-slate-500 text-xs font-medium">
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
                          className="hover:bg-[#FAF6F4] active:bg-[#F2ECE9] transition-colors duration-150 cursor-pointer"
                        >
                          {/* SKU & Name */}
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-[#1C2727]">
                              {item.name}
                            </div>
                            <div className="text-[11px] font-mono text-slate-500 font-medium">
                              {item.sku}
                            </div>
                          </td>

                          {/* Category (Soft Pastel Pill - NO BLACK) */}
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-bold ${getCategoryBadge(
                                item.category
                              )}`}
                            >
                              {item.category}
                            </span>
                          </td>

                          {/* Godown */}
                          <td className="py-3.5 px-4 text-slate-700 font-medium text-xs">
                            {godown?.name || "Central Warehouse"}
                          </td>

                          {/* Available Stock */}
                          <td className="py-3.5 px-4 text-center">
                            <div className="font-black text-sm font-mono text-[#1C2727]">
                              {item.currentStock} {item.unit}
                            </div>
                          </td>

                          {/* Min Threshold */}
                          <td className="py-3.5 px-4 text-center text-slate-500 text-xs font-mono font-semibold">
                            {item.minStockLevel} {item.unit}
                          </td>

                          {/* Cost */}
                          <td className="py-3.5 px-4 text-right font-mono text-slate-600 font-semibold text-xs">
                            {formatCurrency(item.costPrice)}
                          </td>

                          {/* Retail Price */}
                          <td className="py-3.5 px-4 text-right font-mono font-black text-[#1C2727]">
                            {formatCurrency(item.sellingPrice)}
                            <div className="text-[10px] text-[#165353] font-bold">
                              +{marginPercent}% margin
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4 text-center">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${
                                isOut
                                  ? "bg-[#FAF0F4] text-[#AD597B] border border-[#F0D5DF]"
                                  : isLow
                                  ? "bg-[#FFF6F0] text-[#B85D19] border border-[#F2CBB0]"
                                  : "bg-[#EAF4F4] text-[#165353] border border-[#228181]/20"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  isOut
                                    ? "bg-[#AD597B]"
                                    : isLow
                                    ? "bg-[#B85D19]"
                                    : "bg-[#228181]"
                                }`}
                              />
                              {item.status.replace("_", " ").toUpperCase()}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => onOpenAdjustStock(item)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-[#228181] hover:bg-[#EAF4F4] active:scale-90 transition-all"
                                title="Adjust Stock Quantity"
                              >
                                <Sliders className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => onOpenAddItem(item)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-[#228181] hover:bg-[#EAF4F4] active:scale-90 transition-all"
                                title="Edit Product Details"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Delete SKU ${item.sku}?`)) {
                                    deleteItem(item.id);
                                  }
                                }}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 active:scale-90 transition-all"
                                title="Delete Item"
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

      {/* HISTORY VIEW */}
      {activeSubTab === "history" && (
        <div className="space-y-4">
          {/* History Search & Type Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search history by item, SKU, reference ID or reason..."
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-[#EAE4E3] bg-[#FAF8F7] text-[#1C2727] placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#228181] focus:border-[#228181] transition-all"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={historyTypeFilter}
                onChange={(e) => setHistoryTypeFilter(e.target.value)}
                className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-[#EAE4E3] bg-[#FAF8F7] text-[#1C2727] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#228181] transition-all cursor-pointer"
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
          <div className="rounded-2xl border border-[#EAE4E3] bg-white overflow-hidden shadow-[0_4px_20px_rgba(34,129,129,0.03)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#EAE4E3] bg-[#FAF8F7] text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-4">Timestamp</th>
                    <th className="py-3.5 px-4">Item &amp; SKU</th>
                    <th className="py-3.5 px-4">Change Event</th>
                    <th className="py-3.5 px-4 text-center">Delta (Qty)</th>
                    <th className="py-3.5 px-4 text-center">Balance</th>
                    <th className="py-3.5 px-4">Document Ref</th>
                    <th className="py-3.5 px-4">Facility</th>
                    <th className="py-3.5 px-4">Audit Memo / Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE4E3]/70 text-xs sm:text-sm">
                  {filteredHistory.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-500 text-xs font-medium">
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
                          className="hover:bg-[#FAF6F4] active:bg-[#F2ECE9] transition-colors duration-150 cursor-pointer"
                        >
                          {/* Timestamp */}
                          <td className="py-3.5 px-4 text-slate-600 text-xs whitespace-nowrap font-medium">
                            {formatDateTime(entry.timestamp)}
                          </td>

                          {/* Item & SKU */}
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-[#1C2727]">
                              {entry.itemName}
                            </div>
                            <div className="text-[11px] font-mono text-slate-500 font-medium">
                              {entry.sku}
                            </div>
                          </td>

                          {/* Event Type */}
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold ${
                                isPurchase
                                  ? "bg-[#EAF4F4] text-[#165353] border border-[#228181]/25"
                                  : isSale
                                  ? "bg-[#FAF0F4] text-[#7A2D4C] border border-[#D78EAB]/25"
                                  : isAdjustment
                                  ? "bg-[#EEF7F7] text-[#1E5D61] border border-[#A1C7C7]/30"
                                  : "bg-[#F4F1EE] text-slate-700 border border-[#DDD6D5]"
                              }`}
                            >
                              {entry.changeType.replace("_", " ").toUpperCase()}
                            </span>
                          </td>

                          {/* Delta */}
                          <td className="py-3.5 px-4 text-center font-mono font-bold">
                            <span
                              className={
                                entry.quantityDelta > 0
                                  ? "text-[#165353]"
                                  : entry.quantityDelta < 0
                                  ? "text-[#AD597B]"
                                  : "text-slate-500"
                              }
                            >
                              {entry.quantityDelta > 0 ? `+${entry.quantityDelta}` : entry.quantityDelta}
                            </span>
                          </td>

                          {/* Balance */}
                          <td className="py-3.5 px-4 text-center font-mono text-[#1C2727] font-black">
                            {entry.resultingStock}
                          </td>

                          {/* Document Ref */}
                          <td className="py-3.5 px-4 font-mono text-xs text-[#228181] font-bold">
                            {entry.referenceId}
                          </td>

                          {/* Warehouse */}
                          <td className="py-3.5 px-4 text-slate-700 text-xs font-medium">
                            {entry.godownName}
                          </td>

                          {/* Audit Notes */}
                          <td className="py-3.5 px-4 text-slate-600 text-xs max-w-xs truncate font-medium">
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
