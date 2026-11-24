"use client";

import React, { useEffect, useState } from "react";
import {
  Menu,
  Search,
  Mail,
  Bell,
  ShoppingCart,
  Truck,
  Plus,
} from "lucide-react";

interface TopBarProps {
  activeTab: string;
  onOpenMobileMenu: () => void;
  onOpenCommandPalette: () => void;
  onOpenCreateSale: () => void;
  onOpenCreatePO: () => void;
  onOpenAddItem: () => void;
}

export function TopBar({
  activeTab,
  onOpenMobileMenu,
  onOpenCommandPalette,
  onOpenCreateSale,
  onOpenCreatePO,
}: TopBarProps) {
  // Animated top progress line that fires whenever activeTab changes
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    setIsNavigating(true);
    const timer = setTimeout(() => setIsNavigating(false), 450);
    return () => clearTimeout(timer);
  }, [activeTab]);

  return (
    <>
      {/* Linear / YouTube style top progress bar on tab change */}
      {isNavigating && (
        <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-gradient-to-r from-[#228181] via-[#D78EAB] to-[#228181] animate-top-progress" />
      )}

      <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-[#EAE4E3] px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4 transition-all">
        {/* Left: Mobile Toggle & Company Badge */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink-0">
          <button
            onClick={onOpenMobileMenu}
            className="p-2 -ml-1 sm:-ml-2 rounded-xl text-slate-500 hover:text-[#1C2727] hover:bg-[#FAF8F7] active:scale-95 transition-all lg:hidden"
            aria-label="Toggle Navigation Drawer"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Company Logo Badge */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#D78EAB]/25 to-[#228181]/25 text-[#165353] font-black text-xs flex items-center justify-center border border-[#D78EAB]/40 shadow-xs">
              SS
            </div>
            <div className="hidden sm:block">
              <h2 className="text-sm font-bold text-[#1C2727] tracking-tight">
                SasthaSoft Enterprise Ltd
              </h2>
            </div>
          </div>
        </div>

        {/* Center: Search Bar with Cashmere pill style */}
        <div className="flex-1 max-w-xs sm:max-w-md mx-1 sm:mx-4">
          <div
            onClick={onOpenCommandPalette}
            className="relative flex items-center w-full cursor-pointer group active:scale-[0.99] transition-all"
          >
            <Search className="absolute left-3 w-4 h-4 text-slate-400 group-hover:text-[#228181] transition-colors" />
            <input
              type="text"
              readOnly
              placeholder="Search products, orders... (Ctrl+K)"
              className="w-full pl-9 pr-3 sm:pr-12 py-1.5 sm:py-2 text-xs sm:text-sm rounded-full bg-[#FAF8F7] text-[#1C2727] placeholder:text-slate-400 border border-[#EAE4E3] focus:outline-none cursor-pointer group-hover:border-[#228181]/50 group-hover:bg-white transition-all shadow-xs"
            />
            <kbd className="absolute right-3 hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-500 bg-white border border-[#EAE4E3] rounded shadow-xs font-bold">
              Ctrl+K
            </kbd>
          </div>
        </div>

        {/* Right: Action Buttons, Badges, Profile */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Quick New Sale CTA (Desktop & Tablet) */}
          <button
            onClick={onOpenCreateSale}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:py-2 text-xs font-bold text-white bg-[#228181] hover:bg-[#1A6868] active:scale-95 rounded-xl shadow-xs hover:shadow-md transition-all duration-150"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>New Sale</span>
          </button>

          {/* Quick New PO CTA (Desktop & Tablet) */}
          <button
            onClick={onOpenCreatePO}
            className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:py-2 text-xs font-bold text-white bg-[#D78EAB] hover:bg-[#C27896] active:scale-95 rounded-xl shadow-xs hover:shadow-md transition-all duration-150"
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Restock PO</span>
          </button>

          {/* Compact Mobile Quick Plus Button (Mobile only) */}
          <button
            onClick={onOpenCreateSale}
            className="sm:hidden p-2 rounded-xl bg-[#228181] text-white active:scale-95 shadow-xs"
            title="Create Sale"
          >
            <Plus className="w-4 h-4" />
          </button>

          {/* Message / Mail icon with badge */}
          <button
            onClick={onOpenCommandPalette}
            className="relative p-2 rounded-full text-slate-400 hover:text-[#228181] hover:bg-[#FAF8F7] active:scale-90 transition-all"
            title="Messages"
          >
            <Mail className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#D78EAB] text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
              1
            </span>
          </button>

          {/* Bell Notification icon with badge */}
          <button
            onClick={onOpenCommandPalette}
            className="relative p-2 rounded-full text-slate-400 hover:text-[#228181] hover:bg-[#FAF8F7] active:scale-90 transition-all"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#228181] text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
              2
            </span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-2 pl-1.5 sm:pl-3 sm:border-l border-[#EAE4E3]">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#228181] to-[#D78EAB] text-white font-bold text-xs flex items-center justify-center shadow-xs">
              K
            </div>
            <div className="hidden xl:block text-left">
              <div className="text-xs font-bold text-[#1C2727] leading-tight">
                Khushi
              </div>
              <div className="text-[10px] text-slate-500 font-medium">
                Procurement &amp; Full Stack Lead
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
