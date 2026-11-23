"use client";

import React, { useState, useEffect } from "react";
import { useInventory } from "@/context/InventoryContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { DashboardView } from "@/components/views/DashboardView";
import { SalesView } from "@/components/views/SalesView";
import { PurchaseView } from "@/components/views/PurchaseView";
import { StockView } from "@/components/views/StockView";
import { ReportsView } from "@/components/views/ReportsView";
import { GodownsView } from "@/components/views/GodownsView";
import { ContactsView } from "@/components/views/ContactsView";
import { CreateSaleModal } from "@/components/modals/CreateSaleModal";
import { CreatePurchaseModal } from "@/components/modals/CreatePurchaseModal";
import { AddItemModal } from "@/components/modals/AddItemModal";
import { AdjustStockModal } from "@/components/modals/AdjustStockModal";
import { TransferStockModal } from "@/components/modals/TransferStockModal";
import { InvoiceViewModal } from "@/components/modals/InvoiceViewModal";
import { CommandPalette } from "@/components/common/CommandPalette";
import { ToastContainer } from "@/components/common/ToastContainer";
import { Item, SalesOrder } from "@/types/inventory";
import { Boxes, Loader2 } from "lucide-react";

export default function Home() {
  const { isLoaded } = useInventory();

  // Navigation state
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Theme state - default to warm light theme as per reference design
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Modals state
  const [isCreateSaleOpen, setIsCreateSaleOpen] = useState(false);
  const [isCreatePOOpen, setIsCreatePOOpen] = useState(false);
  const [poPreselectedItemId, setPoPreselectedItemId] = useState<string | undefined>(undefined);

  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<Item | null>(null);

  const [isAdjustStockOpen, setIsAdjustStockOpen] = useState(false);
  const [itemToAdjust, setItemToAdjust] = useState<Item | null>(null);

  const [isTransferOpen, setIsTransferOpen] = useState(false);

  const [isInvoiceViewOpen, setIsInvoiceViewOpen] = useState(false);
  const [orderToView, setOrderToView] = useState<SalesOrder | null>(null);

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Strictly enforce bespoke light theme across all sessions
  useEffect(() => {
    localStorage.removeItem("sastha_theme");
    document.documentElement.classList.remove("dark");
  }, []);

  // Keyboard shortcut Ctrl/Cmd + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Handlers
  const handleOpenCreatePO = (preselectedItemId?: string) => {
    setPoPreselectedItemId(preselectedItemId);
    setIsCreatePOOpen(true);
  };

  const handleOpenAddItem = (editItem?: Item) => {
    setItemToEdit(editItem || null);
    setIsAddItemOpen(true);
  };

  const handleOpenAdjustStock = (item: Item) => {
    setItemToAdjust(item);
    setIsAdjustStockOpen(true);
  };

  const handleSelectOrder = (order: SalesOrder) => {
    setOrderToView(order);
    setIsInvoiceViewOpen(true);
  };

  if (!isLoaded) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-[#F8F6F5] text-[#1C2727]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#228181] flex items-center justify-center text-white shadow-lg animate-bounce">
            <Boxes className="w-6 h-6" />
          </div>
          <div>
            <div className="font-bold text-lg text-[#1C2727]">SasthaSoft InventoCore</div>
            <div className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#228181]" />
              Initializing connected inventory state...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#F8F6F5] text-[#1C2727] transition-colors">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileOpen={isMobileMenuOpen}
        setIsMobileOpen={setIsMobileMenuOpen}
        theme="light"
        toggleTheme={() => {}}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 min-h-screen">
        {/* Top Header Bar */}
        <TopBar
          activeTab={activeTab}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onOpenCreateSale={() => setIsCreateSaleOpen(true)}
          onOpenCreatePO={() => handleOpenCreatePO()}
          onOpenAddItem={() => handleOpenAddItem()}
        />

        {/* View Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === "dashboard" && (
            <DashboardView
              onOpenCreateSale={() => setIsCreateSaleOpen(true)}
              onOpenCreatePO={handleOpenCreatePO}
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === "sales" && (
            <SalesView
              onOpenCreateSale={() => setIsCreateSaleOpen(true)}
              onSelectOrder={handleSelectOrder}
            />
          )}

          {activeTab === "purchase" && (
            <PurchaseView onOpenCreatePO={() => handleOpenCreatePO()} />
          )}

          {activeTab === "stock" && (
            <StockView
              onOpenAddItem={handleOpenAddItem}
              onOpenAdjustStock={handleOpenAdjustStock}
            />
          )}

          {activeTab === "reports" && <ReportsView />}

          {activeTab === "godowns" && (
            <GodownsView onOpenTransfer={() => setIsTransferOpen(true)} />
          )}

          {activeTab === "contacts" && <ContactsView />}
        </main>
      </div>

      {/* Modals & Dialogs */}
      <CreateSaleModal
        isOpen={isCreateSaleOpen}
        onClose={() => setIsCreateSaleOpen(false)}
      />

      <CreatePurchaseModal
        isOpen={isCreatePOOpen}
        onClose={() => {
          setIsCreatePOOpen(false);
          setPoPreselectedItemId(undefined);
        }}
        preselectedItemId={poPreselectedItemId}
      />

      <AddItemModal
        isOpen={isAddItemOpen}
        onClose={() => {
          setIsAddItemOpen(false);
          setItemToEdit(null);
        }}
        editItem={itemToEdit}
      />

      <AdjustStockModal
        isOpen={isAdjustStockOpen}
        onClose={() => {
          setIsAdjustStockOpen(false);
          setItemToAdjust(null);
        }}
        item={itemToAdjust}
      />

      <TransferStockModal
        isOpen={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
      />

      <InvoiceViewModal
        isOpen={isInvoiceViewOpen}
        onClose={() => {
          setIsInvoiceViewOpen(false);
          setOrderToView(null);
        }}
        order={orderToView}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={(tab) => setActiveTab(tab)}
        onOpenCreateSale={() => setIsCreateSaleOpen(true)}
        onOpenCreatePO={() => handleOpenCreatePO()}
        onOpenAddItem={() => handleOpenAddItem()}
        onOpenTransfer={() => setIsTransferOpen(true)}
      />

      {/* Floating Notifications */}
      <ToastContainer />
    </div>
  );
}
