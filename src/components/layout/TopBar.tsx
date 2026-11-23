"use client";

import React from "react";
import {
  Menu,
  Search,
  Plus,
  ShoppingCart,
  Truck,
  PackagePlus,
  Sparkles,
} from "lucide-react";

interface TopBarProps {
  activeTab: string;
  onOpenMobileMenu: () => void;
  onOpenCommandPalette: () => void;
  onOpenCreateSale: () => void;
  onOpenCreatePO: () => void;
  onOpenAddItem: () => void;
}

const TAB_TITLES: Record<string, { title: string; subtitle: string }> = {
  dashboard: {
    title: "Executive Dashboard",
    subtitle: "Real-time stock valuation, low stock triggers and order activity",
  },
  sales: {
    title: "Sales Orders & Invoicing",
    subtitle: "Customer orders, tax invoices, and automatic stock deduction",
  },
  purchase: {
    title: "Purchase Orders & Restock",
    subtitle: "Vendor procurement, receiving actions, and warehouse stock increment",
  },
  stock: {
    title: "Inventory Catalog & Audit Ledger",
    subtitle: "Real-time SKU quantities, minimum thresholds, and chronological history",
  },
  reports: {
    title: "Analytics & Business Intelligence",
    subtitle: "Valuation reports, top performers, expense breakdown, and CSV exports",
  },
  godowns: {
    title: "Regional Godowns & Warehouses",
    subtitle: "Multi-facility storage capacities and inter-godown inventory transfers",
  },
  contacts: {
    title: "Clients & Vendor Directory",
    subtitle: "Corporate customer profiles, suppliers and contact details",
  },
};

export function TopBar({
  activeTab,
  onOpenMobileMenu,
  onOpenCommandPalette,
  onOpenCreateSale,
  onOpenCreatePO,
  onOpenAddItem,
}: TopBarProps) {
  const currentInfo = TAB_TITLES[activeTab] || {
    title: "Inventory Suite",
    subtitle: "SasthaSoft Enterprise Management",
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Mobile Menu & Titles */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 -ml-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-900 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-zinc-100 truncate">
            {currentInfo.title}
          </h1>
          <p className="text-[11px] text-slate-400 dark:text-zinc-400 truncate hidden md:block">
            {currentInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Global Search / Action Bar */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Command Search Trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-400 bg-slate-100 dark:bg-zinc-900 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-xl border border-slate-200/80 dark:border-zinc-800 transition-colors"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">Search anything...</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded text-slate-500">
            Ctrl+K
          </kbd>
        </button>

        {/* Quick CTA: New Sale */}
        <button
          onClick={onOpenCreateSale}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-600/20 transition-all"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Sale</span>
        </button>

        {/* Quick CTA: New PO */}
        <button
          onClick={onOpenCreatePO}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm shadow-emerald-600/20 transition-all"
        >
          <Truck className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New PO</span>
        </button>

        {/* Quick CTA: Add Item */}
        <button
          onClick={onOpenAddItem}
          className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-zinc-200 bg-slate-100 dark:bg-zinc-900 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-800 transition-all"
        >
          <PackagePlus className="w-3.5 h-3.5 text-amber-500" />
          <span>Add SKU</span>
        </button>
      </div>
    </header>
  );
}
