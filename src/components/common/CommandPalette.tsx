"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useInventory } from "@/context/InventoryContext";
import {
  Search,
  PlusCircle,
  Truck,
  Package,
  ArrowRightLeft,
  LayoutDashboard,
  ShoppingCart,
  BarChart3,
  Building2,
  Users,
  RotateCcw,
  Sparkles,
  Command,
} from "lucide-react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCreateSale: () => void;
  onOpenCreatePO: () => void;
  onOpenAddItem: () => void;
  onOpenTransfer: () => void;
  onNavigate: (module: string) => void;
}

export function CommandPalette({
  isOpen,
  onClose,
  onOpenCreateSale,
  onOpenCreatePO,
  onOpenAddItem,
  onOpenTransfer,
  onNavigate,
}: CommandPaletteProps) {
  const { items, salesOrders, purchaseOrders, resetDemoData } = useInventory();
  const [query, setQuery] = useState("");

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Reset query on open
  useEffect(() => {
    if (isOpen) setQuery("");
  }, [isOpen]);

  // Filtered lists for quick search
  const filteredItems = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    return items
      .filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.sku.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q)
      )
      .slice(0, 4);
  }, [items, query]);

  const filteredSales = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    return salesOrders
      .filter(
        (s) =>
          s.invoiceNumber.toLowerCase().includes(q) ||
          s.customerName.toLowerCase().includes(q) ||
          s.customerCompany.toLowerCase().includes(q)
      )
      .slice(0, 3);
  }, [salesOrders, query]);

  const filteredPOs = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    return purchaseOrders
      .filter(
        (p) =>
          p.poNumber.toLowerCase().includes(q) ||
          p.supplierCompany.toLowerCase().includes(q)
      )
      .slice(0, 3);
  }, [purchaseOrders, query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-xl bg-white border border-[#EAE4E3] rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[75vh]">
        {/* Search Input Box */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#EAE4E3] bg-[#FAF8F7]">
          <Search className="w-5 h-5 text-[#228181] shrink-0 mr-3" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, product name, SKU, invoice #, or supplier..."
            className="flex-1 bg-transparent text-sm text-[#1C2727] placeholder:text-slate-400 focus:outline-none font-medium"
          />
          <kbd className="px-2 py-0.5 rounded text-[11px] font-mono text-slate-500 bg-white border border-[#DDD6D5] shadow-xs">
            ESC
          </kbd>
        </div>

        {/* Content list */}
        <div className="overflow-y-auto p-3 space-y-4 text-sm divide-y divide-[#EAE4E3]/60">
          {/* Quick Actions */}
          <div className="space-y-1">
            <div className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-500">
              Quick Actions
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenCreateSale();
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[#1C2727] hover:bg-[#EAF4F4] hover:text-[#165353] active:scale-[0.99] transition-all text-left group"
            >
              <div className="flex items-center gap-2.5">
                <PlusCircle className="w-4 h-4 text-[#228181]" />
                <span className="font-semibold text-xs sm:text-sm">New Sales Order / Invoice</span>
              </div>
              <span className="text-xs font-bold text-[#228181] bg-[#EAF4F4] px-2 py-0.5 rounded">Sale</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenCreatePO();
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[#1C2727] hover:bg-[#FAF0F4] hover:text-[#7A2D4C] active:scale-[0.99] transition-all text-left group"
            >
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-[#D78EAB]" />
                <span className="font-semibold text-xs sm:text-sm">New Purchase Order (Restock)</span>
              </div>
              <span className="text-xs font-bold text-[#7A2D4C] bg-[#FAF0F4] px-2 py-0.5 rounded">Purchase</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenAddItem();
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[#1C2727] hover:bg-[#FAF6F4] hover:text-[#228181] active:scale-[0.99] transition-all text-left"
            >
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4 text-[#B85D19]" />
                <span className="font-semibold text-xs sm:text-sm">Add New Inventory Item (SKU)</span>
              </div>
              <span className="text-xs font-bold text-slate-500 bg-[#F4F1EE] px-2 py-0.5 rounded">Catalog</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenTransfer();
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[#1C2727] hover:bg-[#FAF6F4] hover:text-[#228181] active:scale-[0.99] transition-all text-left"
            >
              <div className="flex items-center gap-2.5">
                <ArrowRightLeft className="w-4 h-4 text-[#165353]" />
                <span className="font-semibold text-xs sm:text-sm">Transfer Stock Between Godowns</span>
              </div>
              <span className="text-xs font-bold text-slate-500 bg-[#F4F1EE] px-2 py-0.5 rounded">Warehouse</span>
            </button>
          </div>

          {/* Module Navigation */}
          <div className="pt-3 space-y-1">
            <div className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-500">
              Go To Module
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => {
                  onClose();
                  onNavigate("dashboard");
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 hover:bg-[#FAF6F4] hover:text-[#1C2727] active:scale-[0.98] transition-all text-left text-xs font-semibold"
              >
                <LayoutDashboard className="w-4 h-4 text-[#228181]" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onNavigate("sales");
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 hover:bg-[#FAF6F4] hover:text-[#1C2727] active:scale-[0.98] transition-all text-left text-xs font-semibold"
              >
                <ShoppingCart className="w-4 h-4 text-[#228181]" />
                <span>Sales Orders</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onNavigate("purchase");
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 hover:bg-[#FAF6F4] hover:text-[#1C2727] active:scale-[0.98] transition-all text-left text-xs font-semibold"
              >
                <Truck className="w-4 h-4 text-[#228181]" />
                <span>Purchases</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onNavigate("stock");
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 hover:bg-[#FAF6F4] hover:text-[#1C2727] active:scale-[0.98] transition-all text-left text-xs font-semibold"
              >
                <Package className="w-4 h-4 text-[#228181]" />
                <span>Stock &amp; Ledger</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onNavigate("reports");
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 hover:bg-[#FAF6F4] hover:text-[#1C2727] active:scale-[0.98] transition-all text-left text-xs font-semibold"
              >
                <BarChart3 className="w-4 h-4 text-[#228181]" />
                <span>Analytics &amp; Reports</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onNavigate("godowns");
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 hover:bg-[#FAF6F4] hover:text-[#1C2727] active:scale-[0.98] transition-all text-left text-xs font-semibold"
              >
                <Building2 className="w-4 h-4 text-[#228181]" />
                <span>Godowns &amp; Facilities</span>
              </button>
            </div>
          </div>

          {/* Reset Demo State Option */}
          <div className="pt-3">
            <button
              onClick={() => {
                onClose();
                resetDemoData();
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50 active:scale-[0.99] transition-all text-left"
            >
              <div className="flex items-center gap-2.5">
                <RotateCcw className="w-4 h-4" />
                <span className="font-semibold text-xs sm:text-sm">Reset Application to Clean Demo State</span>
              </div>
              <span className="text-xs text-slate-400 font-medium">Default Data</span>
            </button>
          </div>
        </div>

        {/* Footer info (Warm Cashmere / Light Theme - NO BLACK) */}
        <div className="px-4 py-2.5 bg-[#FAF8F7] border-t border-[#EAE4E3] text-xs text-slate-600 flex items-center justify-between font-medium">
          <div className="flex items-center gap-2">
            <span>
              Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#DDD6D5] text-[#1C2727] font-mono text-[10px] font-bold shadow-xs">Ctrl+K</kbd> anywhere
            </span>
          </div>
          <span className="text-[#228181] font-bold">SasthaSoft Trial Evaluation</span>
        </div>
      </div>
    </div>
  );
}
