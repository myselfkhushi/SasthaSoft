"use client";

import React from "react";
import { useInventory } from "@/context/InventoryContext";
import {
  LayoutDashboard,
  ShoppingCart,
  Truck,
  Package,
  BarChart3,
  Building2,
  Users,
  RotateCcw,
  Boxes,
  Sun,
  Moon,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export function Sidebar({
  activeTab,
  setActiveTab,
  isMobileOpen,
  setIsMobileOpen,
  theme,
  toggleTheme,
}: SidebarProps) {
  const { items, purchaseOrders, salesOrders, resetDemoData } = useInventory();

  const lowStockCount = items.filter(
    (i) => i.status === "low_stock" || i.status === "out_of_stock"
  ).length;

  const pendingPOCount = purchaseOrders.filter((p) => p.status === "ordered" || p.status === "pending").length;

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: "sales",
      label: "Sales & Invoices",
      icon: ShoppingCart,
      badge: salesOrders.length.toString(),
      badgeColor: "bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400",
    },
    {
      id: "purchase",
      label: "Purchase Orders",
      icon: Truck,
      badge: pendingPOCount > 0 ? `${pendingPOCount} pending` : null,
      badgeColor: "bg-amber-500/10 text-amber-500 border border-amber-500/20",
    },
    {
      id: "stock",
      label: "Stock & Inventory",
      icon: Package,
      badge: lowStockCount > 0 ? `${lowStockCount} alerts` : null,
      badgeColor: "bg-rose-500/15 text-rose-500 border border-rose-500/20 font-bold",
    },
    {
      id: "reports",
      label: "Analytics & Reports",
      icon: BarChart3,
      badge: null,
    },
    {
      id: "godowns",
      label: "Godowns & Transfers",
      icon: Building2,
      badge: null,
    },
    {
      id: "contacts",
      label: "Clients & Vendors",
      icon: Users,
      badge: null,
    },
  ];

  const handleSelect = (id: string) => {
    setActiveTab(id);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden animate-in fade-in"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white dark:bg-zinc-950 border-r border-slate-200 dark:border-zinc-800 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-200 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                SasthaSoft <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900">ERP</span>
              </div>
              <div className="text-[11px] text-slate-400 font-medium">InventoCore Suite</div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-400">
            Main Modules
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30"
                    : "text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-900 hover:text-slate-900 dark:hover:text-zinc-200"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? "text-white" : "text-slate-400 dark:text-zinc-500"
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                      isActive ? "bg-white/20 text-white" : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Utility Actions */}
        <div className="p-3 border-t border-slate-200 dark:border-zinc-800 space-y-2">
          {/* Theme & Demo Data Toggle */}
          <div className="flex items-center justify-between gap-2 px-2">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors"
              title="Toggle Light/Dark Theme"
            >
              {theme === "dark" ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-500" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>

            <button
              onClick={resetDemoData}
              className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
              title="Reset to pristine sample data"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Developer Card (Khushi's Portfolio & Profile) */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                  K
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-zinc-200">
                    Khushi
                  </div>
                  <div className="text-[10px] text-slate-400">Full Stack Developer</div>
                </div>
              </div>
              <a
                href="https://www.myselfkhushi.dev/"
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-indigo-500 transition-colors"
                title="View Portfolio"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
