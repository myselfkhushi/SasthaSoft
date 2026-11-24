"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  Package,
  TrendingUp,
  Plus,
  Menu,
  ShoppingCart,
  Truck,
  Boxes,
  ArrowRightLeft,
  X,
} from "lucide-react";
import { useInventory } from "@/context/InventoryContext";

interface MobileNavBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenMobileMenu: () => void;
  onOpenCreateSale: () => void;
  onOpenCreatePO: () => void;
  onOpenAddItem: () => void;
  onOpenTransfer: () => void;
}

export function MobileNavBar({
  activeTab,
  setActiveTab,
  onOpenMobileMenu,
  onOpenCreateSale,
  onOpenCreatePO,
  onOpenAddItem,
  onOpenTransfer,
}: MobileNavBarProps) {
  const { items, purchaseOrders } = useInventory();
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);

  const lowStockCount = items.filter(
    (i) => i.status === "low_stock" || i.status === "out_of_stock"
  ).length;

  const pendingPOCount = purchaseOrders.filter(
    (p) => p.status === "ordered" || p.status === "pending"
  ).length;

  return (
    <>
      {/* Quick Action Sheet Modal on Mobile */}
      {isActionSheetOpen && (
        <div
          onClick={() => setIsActionSheetOpen(false)}
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex flex-col justify-end p-4 lg:hidden animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full bg-white rounded-3xl p-5 border border-[#EAE4E3] shadow-2xl space-y-4 animate-in slide-in-from-bottom duration-200"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE4E3]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#228181] text-white flex items-center justify-center font-black text-sm shadow-sm">
                  +
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1C2727]">
                    Quick Enterprise Action
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Select a connected workflow transaction
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsActionSheetOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-[#FAF8F7]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {/* New Sale Button */}
              <button
                onClick={() => {
                  setIsActionSheetOpen(false);
                  onOpenCreateSale();
                }}
                className="flex flex-col items-start p-3.5 rounded-2xl bg-[#EAF4F4] hover:bg-[#D5EAEA] active:scale-95 border border-[#228181]/20 transition-all text-left"
              >
                <div className="w-8 h-8 rounded-xl bg-[#228181] text-white flex items-center justify-center mb-2 shadow-xs">
                  <ShoppingCart className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-[#165353]">New Sale</span>
                <span className="text-[10px] text-slate-500 font-medium">
                  Invoice &amp; stock out
                </span>
              </button>

              {/* Restock PO Button */}
              <button
                onClick={() => {
                  setIsActionSheetOpen(false);
                  onOpenCreatePO();
                }}
                className="flex flex-col items-start p-3.5 rounded-2xl bg-[#FAF0F4] hover:bg-[#F5E2EC] active:scale-95 border border-[#D78EAB]/20 transition-all text-left"
              >
                <div className="w-8 h-8 rounded-xl bg-[#D78EAB] text-white flex items-center justify-center mb-2 shadow-xs">
                  <Truck className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-[#7A2D4C]">Restock PO</span>
                <span className="text-[10px] text-slate-500 font-medium">
                  Procure inventory
                </span>
              </button>

              {/* Add New SKU */}
              <button
                onClick={() => {
                  setIsActionSheetOpen(false);
                  onOpenAddItem();
                }}
                className="flex flex-col items-start p-3.5 rounded-2xl bg-[#FAF8F7] hover:bg-[#F2ECE9] active:scale-95 border border-[#EAE4E3] transition-all text-left"
              >
                <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center mb-2 shadow-xs">
                  <Boxes className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-[#1C2727]">New Product</span>
                <span className="text-[10px] text-slate-500 font-medium">
                  Create SKU in catalog
                </span>
              </button>

              {/* Transfer Stock */}
              <button
                onClick={() => {
                  setIsActionSheetOpen(false);
                  onOpenTransfer();
                }}
                className="flex flex-col items-start p-3.5 rounded-2xl bg-[#FAF8F7] hover:bg-[#F2ECE9] active:scale-95 border border-[#EAE4E3] transition-all text-left"
              >
                <div className="w-8 h-8 rounded-xl bg-[#165353] text-white flex items-center justify-center mb-2 shadow-xs">
                  <ArrowRightLeft className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-[#1C2727]">Godown Shift</span>
                <span className="text-[10px] text-slate-500 font-medium">
                  Inter-warehouse move
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Nav Bar on Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-white/95 backdrop-blur-md border-t border-[#EAE4E3] px-3 py-2 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {/* Dashboard */}
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all duration-150 active:scale-90 ${
              activeTab === "dashboard"
                ? "text-[#228181] font-bold"
                : "text-slate-400 hover:text-slate-600 font-medium"
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px]">Dashboard</span>
          </button>

          {/* Products / Stock */}
          <button
            onClick={() => setActiveTab("stock")}
            className={`relative flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all duration-150 active:scale-90 ${
              activeTab === "stock"
                ? "text-[#228181] font-bold"
                : "text-slate-400 hover:text-slate-600 font-medium"
            }`}
          >
            <Package className="w-5 h-5" />
            <span className="text-[10px]">Products</span>
            {lowStockCount > 0 && (
              <span className="absolute top-0.5 right-1 w-2 h-2 rounded-full bg-[#D78EAB] animate-ping" />
            )}
          </button>

          {/* Center Floating Plus Action */}
          <button
            onClick={() => setIsActionSheetOpen(true)}
            className="w-12 h-12 -mt-5 rounded-2xl bg-gradient-to-tr from-[#228181] to-[#165353] text-white flex items-center justify-center shadow-lg shadow-[#228181]/40 active:scale-90 transition-all"
            aria-label="Quick Actions"
          >
            <Plus className="w-6 h-6" />
          </button>

          {/* Sales */}
          <button
            onClick={() => setActiveTab("sales")}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all duration-150 active:scale-90 ${
              activeTab === "sales"
                ? "text-[#228181] font-bold"
                : "text-slate-400 hover:text-slate-600 font-medium"
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span className="text-[10px]">Sales</span>
          </button>

          {/* Menu / All Modules Drawer */}
          <button
            onClick={onOpenMobileMenu}
            className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-slate-400 hover:text-slate-600 font-medium transition-all duration-150 active:scale-90"
          >
            <Menu className="w-5 h-5" />
            <span className="text-[10px]">Modules</span>
          </button>
        </div>
      </nav>
    </>
  );
}
