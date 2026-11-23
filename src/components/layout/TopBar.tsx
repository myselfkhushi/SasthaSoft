"use client";

import React from "react";
import {
  Menu,
  Search,
  Mail,
  Bell,
  ShoppingCart,
  Truck,
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
  onOpenMobileMenu,
  onOpenCommandPalette,
  onOpenCreateSale,
  onOpenCreatePO,
}: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-[#EAE4E3] px-4 sm:px-6 flex items-center justify-between gap-4 transition-colors">
      {/* Left: Mobile Toggle & Company Badge */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 -ml-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Company Logo Badge */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#D78EAB]/15 text-[#AD597B] font-bold text-xs flex items-center justify-center border border-[#D78EAB]/30">
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
      <div className="flex-1 max-w-md mx-2 sm:mx-6">
        <div
          onClick={onOpenCommandPalette}
          className="relative flex items-center w-full cursor-pointer group"
        >
          <Search className="absolute left-3.5 w-4 h-4 text-slate-400 group-hover:text-[#228181] transition-colors" />
          <input
            type="text"
            readOnly
            placeholder="Search products, orders, customers..."
            className="w-full pl-10 pr-12 py-2 text-xs sm:text-sm rounded-full bg-[#F4F0EF] text-[#1C2727] placeholder:text-slate-400 border border-transparent focus:outline-none cursor-pointer hover:border-[#DDD6D5] transition-colors"
          />
          <kbd className="absolute right-3 hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white border border-[#EAE4E3] rounded shadow-xs">
            Ctrl+K
          </kbd>
        </div>
      </div>

      {/* Right: Action Buttons, Badges, Profile */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {/* Quick New Sale CTA (Deep Pine Teal) */}
        <button
          onClick={onOpenCreateSale}
          className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#228181] hover:bg-[#1A6868] rounded-xl shadow-sm transition-colors"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>New Sale</span>
        </button>

        {/* Quick New PO CTA (Dusty Rose) */}
        <button
          onClick={onOpenCreatePO}
          className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#D78EAB] hover:bg-[#C27896] rounded-xl shadow-sm transition-colors"
        >
          <Truck className="w-3.5 h-3.5" />
          <span>Restock PO</span>
        </button>

        {/* Message / Mail icon with badge */}
        <button
          onClick={onOpenCommandPalette}
          className="relative p-2 rounded-full text-slate-400 hover:text-[#228181] hover:bg-slate-100 transition-colors"
          title="Messages"
        >
          <Mail className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#D78EAB] text-white text-[9px] font-bold flex items-center justify-center">
            1
          </span>
        </button>

        {/* Bell Notification icon with badge */}
        <button
          onClick={onOpenCommandPalette}
          className="relative p-2 rounded-full text-slate-400 hover:text-[#228181] hover:bg-slate-100 transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#228181] text-white text-[9px] font-bold flex items-center justify-center">
            2
          </span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2.5 pl-2 sm:border-l border-[#EAE4E3]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#228181] to-[#D78EAB] text-white font-bold text-xs flex items-center justify-center shadow-xs">
            K
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-xs font-bold text-[#1C2727] leading-tight">
              Khushi
            </div>
            <div className="text-[10px] text-slate-400">
              Procurement &amp; Full Stack Lead
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
