"use client";

import React from "react";
import { useInventory } from "@/context/InventoryContext";
import {
  LayoutDashboard,
  Package,
  Users,
  TrendingUp,
  Truck,
  ShoppingCart,
  ArrowRightLeft,
  BarChart3,
  Building2,
  RotateCcw,
  Smartphone,
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
}: SidebarProps) {
  const { items, purchaseOrders, salesOrders, resetDemoData } = useInventory();

  const lowStockCount = items.filter(
    (i) => i.status === "low_stock" || i.status === "out_of_stock"
  ).length;

  const pendingPOCount = purchaseOrders.filter((p) => p.status === "ordered" || p.status === "pending").length;

  // Nav items matching the reference structure
  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: "stock",
      label: "Products",
      icon: Package,
      badge: lowStockCount > 0 ? `${lowStockCount}` : null,
      badgeColor: "bg-[#D78EAB] text-white font-bold shadow-xs",
    },
    {
      id: "contacts",
      label: "Customers",
      icon: Users,
      badge: null,
    },
    {
      id: "sales",
      label: "Sales",
      icon: TrendingUp,
      badge: salesOrders.length.toString(),
      badgeColor: "bg-white/20 text-white",
    },
    {
      id: "suppliers",
      label: "Supplier",
      icon: Building2,
      badge: null,
    },
    {
      id: "purchase",
      label: "Purchase",
      icon: ShoppingCart,
      badge: pendingPOCount > 0 ? `${pendingPOCount}` : null,
      badgeColor: "bg-[#228181] text-white font-bold border border-white/20",
    },
    {
      id: "godowns",
      label: "Stock Transfer",
      icon: ArrowRightLeft,
      badge: null,
    },
    {
      id: "reports",
      label: "Reports",
      icon: BarChart3,
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

      {/* Sidebar Container: Deep Pine Teal Palette (#228181 & #134B4B) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-gradient-to-b from-[#185555] via-[#144747] to-[#0D2E2E] text-white flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 shadow-2xl ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Subtle Geometric Overlay */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none overflow-hidden">
          <svg viewBox="0 0 400 800" className="w-full h-full object-cover">
            <path
              d="M0 200 L120 120 L240 260 L360 140 L400 180 L400 800 L0 800 Z"
              fill="currentColor"
            />
          </svg>
        </div>

        {/* Brand Header */}
        <div className="relative z-10 px-6 pt-6 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-white">Inven</span>
            <span className="w-6 h-6 rounded-md bg-[#D78EAB] flex items-center justify-center text-white font-black text-xs shadow-sm">
              3
            </span>
          </div>
          <p className="text-[11px] text-[#C0DBDB]/80 mt-1 font-normal tracking-wide">
            Manage your inventory the easiest way
          </p>
        </div>

        {/* Navigation Items */}
        <div className="relative z-10 flex-1 overflow-y-auto px-4 py-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || (item.id === "suppliers" && activeTab === "contacts");

            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id === "suppliers" ? "contacts" : item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#228181] text-white shadow-md shadow-[#0B2525]/30 border border-white/20 backdrop-blur-md font-semibold"
                    : "text-[#C0DBDB]/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? "text-white" : "text-[#A1C7C7]"
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Mobile App Promo Card */}
        <div className="relative z-10 p-4 space-y-3">
          <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md">
            <div className="flex items-center gap-2 text-[#D78EAB] font-bold text-xs">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Get Mobile App</span>
            </div>
            <p className="text-[11px] text-[#D5E8E8]/85 mt-1 leading-snug">
              Download app on both iOS &amp; Android to enjoy real-time scanning.
            </p>
            <div className="flex items-center gap-2 mt-2.5">
              <span className="px-2 py-1 rounded-md bg-white/10 text-[10px] text-white flex items-center gap-1 border border-white/10">
                <span className="font-semibold">iOS</span>
              </span>
              <span className="px-2 py-1 rounded-md bg-white/10 text-[10px] text-white flex items-center gap-1 border border-white/10">
                <span className="font-semibold">Android</span>
              </span>
            </div>
          </div>

          {/* Demo Reset Utility */}
          <div className="flex items-center justify-between pt-1 text-[11px] text-[#A1C7C7]/70">
            <span className="text-[10px] text-white/50">Light Theme Active</span>

            <button
              onClick={resetDemoData}
              className="flex items-center gap-1 hover:text-[#D78EAB] transition-colors"
              title="Reset Sample Data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Data</span>
            </button>
          </div>

          {/* Footer Copyright */}
          <div className="text-center text-[10px] text-[#A1C7C7]/40 pt-1">
            Help • Privacy • SasthaSoft © 2026
          </div>
        </div>
      </aside>
    </>
  );
}
