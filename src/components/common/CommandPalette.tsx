"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useInventory } from "@/context/InventoryContext";
import {
  Search,
  Package,
  ShoppingCart,
  Truck,
  RotateCcw,
  ArrowRight,
  PlusCircle,
  Building2,
  X,
  Layers,
} from "lucide-react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (module: string) => void;
  onOpenCreateSale: () => void;
  onOpenCreatePO: () => void;
  onOpenAddItem: () => void;
  onOpenTransfer: () => void;
}

export function CommandPalette({
  isOpen,
  onClose,
  onNavigate,
  onOpenCreateSale,
  onOpenCreatePO,
  onOpenAddItem,
  onOpenTransfer,
}: CommandPaletteProps) {
  const { items, salesOrders, purchaseOrders, resetDemoData } = useInventory();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Filter items and orders based on query
  const filteredItems = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    ).slice(0, 4);
  }, [items, query]);

  const filteredSales = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return salesOrders.filter(
      (s) =>
        s.invoiceNumber.toLowerCase().includes(q) ||
        s.customerCompany.toLowerCase().includes(q) ||
        s.customerName.toLowerCase().includes(q)
    ).slice(0, 3);
  }, [salesOrders, query]);

  const filteredPurchases = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return purchaseOrders.filter(
      (p) =>
        p.poNumber.toLowerCase().includes(q) ||
        p.supplierCompany.toLowerCase().includes(q)
    ).slice(0, 3);
  }, [purchaseOrders, query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white border border-[#EAE4E3] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#EAE4E3]">
          <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, product name, SKU, invoice #, or supplier..."
            autoFocus
            className="w-full bg-transparent text-sm sm:text-base outline-none text-[#1C2727] placeholder:text-slate-400"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="hidden sm:inline-block text-[11px] font-medium text-slate-400 bg-[#F4F0EF] px-2 py-0.5 rounded ml-2">
            ESC
          </span>
        </div>

        {/* Content list */}
        <div className="overflow-y-auto p-2 space-y-4 text-sm divide-y divide-slate-100 dark:divide-zinc-800/60">
          {/* Quick Actions */}
          <div className="space-y-1">
            <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Quick Actions
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenCreateSale();
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-700 dark:text-zinc-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
            >
              <div className="flex items-center gap-2.5">
                <PlusCircle className="w-4 h-4 text-indigo-500" />
                <span className="font-medium">New Sales Order / Invoice</span>
              </div>
              <span className="text-xs text-slate-400">Sale</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenCreatePO();
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-700 dark:text-zinc-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors text-left"
            >
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-emerald-500" />
                <span className="font-medium">New Purchase Order (Restock)</span>
              </div>
              <span className="text-xs text-slate-400">Purchase</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenAddItem();
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors text-left"
            >
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4 text-amber-500" />
                <span className="font-medium">Add New Inventory Item (SKU)</span>
              </div>
              <span className="text-xs text-slate-400">Catalog</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenTransfer();
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors text-left"
            >
              <div className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4 text-purple-500" />
                <span className="font-medium">Transfer Stock Between Godowns</span>
              </div>
              <span className="text-xs text-slate-400">Warehouse</span>
            </button>
          </div>

          {/* Search Results: Products */}
          {filteredItems.length > 0 && (
            <div className="pt-2 space-y-1">
              <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Products Matching &quot;{query}&quot;
              </div>
              {filteredItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onClose();
                    onNavigate("stock");
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <Package className="w-4 h-4 text-slate-400" />
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-slate-400">
                        {item.sku} • {item.currentStock} in stock • ₹{item.sellingPrice.toLocaleString("en-IN")}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </button>
              ))}
            </div>
          )}

          {/* Search Results: Invoices */}
          {filteredSales.length > 0 && (
            <div className="pt-2 space-y-1">
              <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Invoices Matching &quot;{query}&quot;
              </div>
              {filteredSales.map((sale) => (
                <button
                  key={sale.id}
                  onClick={() => {
                    onClose();
                    onNavigate("sales");
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <ShoppingCart className="w-4 h-4 text-indigo-400" />
                    <div>
                      <div className="font-medium">{sale.invoiceNumber}</div>
                      <div className="text-xs text-slate-400">
                        {sale.customerCompany} • ₹{sale.totalAmount.toLocaleString("en-IN")} • {sale.status.toUpperCase()}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </button>
              ))}
            </div>
          )}

          {/* Search Results: Purchases */}
          {filteredPurchases.length > 0 && (
            <div className="pt-2 space-y-1">
              <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Purchase Orders Matching &quot;{query}&quot;
              </div>
              {filteredPurchases.map((po) => (
                <button
                  key={po.id}
                  onClick={() => {
                    onClose();
                    onNavigate("purchase");
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <Truck className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div className="font-medium">{po.poNumber}</div>
                      <div className="text-xs text-slate-400">
                        {po.supplierCompany} • ₹{po.totalAmount.toLocaleString("en-IN")} • {po.status.toUpperCase()}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </button>
              ))}
            </div>
          )}

          {/* Navigation Shortcuts */}
          <div className="pt-2 space-y-1">
            <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Go To Module
            </div>
            <div className="grid grid-cols-2 gap-1">
              <button
                onClick={() => {
                  onClose();
                  onNavigate("dashboard");
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 text-left"
              >
                <Layers className="w-4 h-4 text-slate-400" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => {
                  onClose();
                  onNavigate("sales");
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 text-left"
              >
                <ShoppingCart className="w-4 h-4 text-slate-400" />
                <span>Sales Orders</span>
              </button>
              <button
                onClick={() => {
                  onClose();
                  onNavigate("purchase");
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 text-left"
              >
                <Truck className="w-4 h-4 text-slate-400" />
                <span>Purchases</span>
              </button>
              <button
                onClick={() => {
                  onClose();
                  onNavigate("stock");
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 text-left"
              >
                <Package className="w-4 h-4 text-slate-400" />
                <span>Stock & Ledger</span>
              </button>
              <button
                onClick={() => {
                  onClose();
                  onNavigate("reports");
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 text-left"
              >
                <ArrowRight className="w-4 h-4 text-slate-400" />
                <span>Analytics & Reports</span>
              </button>
              <button
                onClick={() => {
                  onClose();
                  onNavigate("godowns");
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 text-left"
              >
                <Building2 className="w-4 h-4 text-slate-400" />
                <span>Godowns & Facilities</span>
              </button>
            </div>
          </div>

          {/* Reset Demo State Option */}
          <div className="pt-2">
            <button
              onClick={() => {
                onClose();
                resetDemoData();
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors text-left"
            >
              <div className="flex items-center gap-2.5">
                <RotateCcw className="w-4 h-4" />
                <span>Reset Application to Clean Demo State</span>
              </div>
              <span className="text-xs text-slate-400">Default Data</span>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-zinc-950 border-t border-slate-200 dark:border-zinc-800 text-xs text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-mono text-[10px]">Ctrl+K</kbd> anywhere</span>
          </div>
          <span>SasthaSoft Trial Evaluation</span>
        </div>
      </div>
    </div>
  );
}
