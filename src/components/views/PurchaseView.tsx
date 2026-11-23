"use client";

import React, { useState, useMemo } from "react";
import { useInventory } from "@/context/InventoryContext";
import {
  Search,
  Plus,
  CheckCircle2,
  Clock,
  Building2,
  PackageCheck,
  TrendingDown,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

interface PurchaseViewProps {
  onOpenCreatePO: () => void;
}

export function PurchaseView({ onOpenCreatePO }: PurchaseViewProps) {
  const { purchaseOrders, godowns, receivePurchaseOrder } = useInventory();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredPOs = useMemo(() => {
    return purchaseOrders.filter((po) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        po.poNumber.toLowerCase().includes(q) ||
        po.supplierCompany.toLowerCase().includes(q) ||
        po.supplierName.toLowerCase().includes(q) ||
        po.items.some(
          (i) =>
            i.itemName.toLowerCase().includes(q) ||
            i.sku.toLowerCase().includes(q)
        );

      const matchesStatus = statusFilter === "all" || po.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [purchaseOrders, searchQuery, statusFilter]);

  const totalSpend = purchaseOrders.reduce((acc, p) => acc + p.totalAmount, 0);
  const pendingPOs = purchaseOrders.filter(
    (p) => p.status === "ordered" || p.status === "pending"
  );
  const receivedPOs = purchaseOrders.filter((p) => p.status === "received");

  return (
    <div className="space-y-6">
      {/* 3 Metric Cards (Crisp White + Circular Badges + High Contrast) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Card 1: Total Spend (Dusty Rose Circle) */}
        <div className="p-5 rounded-2xl bg-white border border-[#EAE4E3] shadow-[0_4px_20px_rgba(215,142,171,0.04)] hover:shadow-lg hover:border-[#D78EAB]/50 hover:-translate-y-1 active:scale-[0.99] transition-all duration-200 cursor-pointer flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#D78EAB] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#D78EAB]/25">
            <span className="text-xl font-black">₹</span>
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Procurement Spend
            </div>
            <div className="text-2xl font-black tracking-tight text-[#1C2727] mt-0.5 truncate font-mono">
              {formatCurrency(totalSpend)}
            </div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">
              {purchaseOrders.length} total purchase orders
            </div>
          </div>
        </div>

        {/* Card 2: Stock Received (Deep Pine Teal Circle) */}
        <div className="p-5 rounded-2xl bg-white border border-[#EAE4E3] shadow-[0_4px_20px_rgba(34,129,129,0.04)] hover:shadow-lg hover:border-[#228181]/50 hover:-translate-y-1 active:scale-[0.99] transition-all duration-200 cursor-pointer flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#228181] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#228181]/25">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Stock Received
            </div>
            <div className="text-2xl font-black tracking-tight text-[#165353] mt-0.5 truncate">
              {receivedPOs.length} / {purchaseOrders.length} POs
            </div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">
              Physical items added to stock ledger
            </div>
          </div>
        </div>

        {/* Card 3: Pending Delivery (Warm Cashmere / Amber Circle) */}
        <div className="p-5 rounded-2xl bg-white border border-[#EAE4E3] shadow-[0_4px_20px_rgba(184,93,25,0.04)] hover:shadow-lg hover:border-[#B85D19]/50 hover:-translate-y-1 active:scale-[0.99] transition-all duration-200 cursor-pointer flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#B85D19] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#B85D19]/25">
            <Clock className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Pending Delivery
            </div>
            <div className="text-2xl font-black tracking-tight text-[#B85D19] mt-0.5 truncate">
              {pendingPOs.length} POs Awaiting
            </div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">
              Ready for warehouse intake
            </div>
          </div>
        </div>
      </div>

      {/* Connected Workflow Banner */}
      <div className="p-4 rounded-2xl bg-[#EAF4F4] border border-[#C5E4E4] flex items-start gap-3.5 shadow-xs">
        <div className="p-2.5 rounded-xl bg-[#228181] text-white shrink-0 shadow-xs">
          <PackageCheck className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs sm:text-sm font-bold text-[#165353]">
            Automated Stock Reception Protocol
          </h4>
          <p className="text-xs text-[#206060] mt-0.5 leading-relaxed font-medium">
            When a supplier delivers items, click <strong>&quot;Receive &amp; Restock&quot;</strong>. The system automatically increments the inventory quantities of all line items, updates the warehouse stock ledger, and logs the audit history.
          </p>
        </div>
      </div>

      {/* Filter and Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search PO #, vendor, or item..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-[#EAE4E3] bg-[#FAF8F7] text-[#1C2727] placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#228181] focus:border-[#228181] transition-all"
          />
        </div>

        {/* Filters and CTA */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-[#EAE4E3] bg-[#FAF8F7] text-[#1C2727] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#228181] transition-all cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="received">Received</option>
            <option value="ordered">Ordered</option>
            <option value="pending">Pending</option>
          </select>

          <button
            onClick={onOpenCreatePO}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-[#228181] hover:bg-[#1A6868] active:scale-95 rounded-xl shadow-xs hover:shadow-md transition-all duration-150 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>New Purchase Order</span>
          </button>
        </div>
      </div>

      {/* Purchase Orders Table */}
      <div className="rounded-2xl border border-[#EAE4E3] bg-white overflow-hidden shadow-[0_4px_20px_rgba(34,129,129,0.03)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#EAE4E3] bg-[#FAF8F7] text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4">PO #</th>
                <th className="py-3.5 px-4">Date Placed</th>
                <th className="py-3.5 px-4">Supplier &amp; Vendor</th>
                <th className="py-3.5 px-4">Destination Hub</th>
                <th className="py-3.5 px-4">Items &amp; Units</th>
                <th className="py-3.5 px-4 text-right">Valuation</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Receiving Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE4E3]/70 text-xs sm:text-sm">
              {filteredPOs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 text-xs font-medium">
                    No purchase orders match your criteria.
                  </td>
                </tr>
              ) : (
                filteredPOs.map((po) => {
                  const isReceived = po.status === "received";
                  const targetGodown = godowns.find((g) => g.id === po.godownId);

                  return (
                    <tr
                      key={po.id}
                      className="hover:bg-[#FAF6F4] active:bg-[#F2ECE9] transition-colors duration-150 cursor-pointer"
                    >
                      {/* PO # */}
                      <td className="py-3.5 px-4 font-mono font-bold text-[#1C2727]">
                        {po.poNumber}
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-slate-600 text-xs font-medium">
                        {formatDate(po.date)}
                        {po.receivedDate && (
                          <div className="text-[10px] text-[#165353] font-bold">
                            Recv: {formatDate(po.receivedDate)}
                          </div>
                        )}
                      </td>

                      {/* Supplier */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#1C2727]">
                          {po.supplierCompany}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          {po.supplierName}
                        </div>
                      </td>

                      {/* Destination Godown */}
                      <td className="py-3.5 px-4 text-slate-700">
                        <div className="flex items-center gap-1.5 text-xs font-medium">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>{targetGodown?.name || "Central Warehouse"}</span>
                        </div>
                      </td>

                      {/* Items */}
                      <td className="py-3.5 px-4 text-slate-700">
                        <div className="font-bold text-xs text-[#1C2727]">
                          {po.items.length} item(s) ({po.items.reduce((a, b) => a + b.quantity, 0)} units)
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-xs font-medium">
                          {po.items.map((i) => `${i.itemName} (x${i.quantity})`).join(", ")}
                        </div>
                      </td>

                      {/* Total */}
                      <td className="py-3.5 px-4 text-right font-black text-[#1C2727] font-mono">
                        {formatCurrency(po.totalAmount)}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${
                            isReceived
                              ? "bg-[#EAF4F4] text-[#165353] border border-[#228181]/20"
                              : "bg-[#FFF6F0] text-[#B85D19] border border-[#F2CBB0]"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isReceived ? "bg-[#228181]" : "bg-[#B85D19]"
                            }`}
                          />
                          {po.status.toUpperCase()}
                        </span>
                      </td>

                      {/* Receiving Action */}
                      <td className="py-3.5 px-4 text-right">
                        {isReceived ? (
                          <div className="inline-flex items-center gap-1.5 text-xs text-[#165353] font-bold">
                            <CheckCircle2 className="w-4 h-4 text-[#228181]" />
                            <span>Stock In</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => receivePurchaseOrder(po.id)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-[#228181] hover:bg-[#1A6868] active:scale-95 rounded-xl shadow-xs hover:shadow-md transition-all duration-150"
                          >
                            <PackageCheck className="w-4 h-4" />
                            Receive &amp; Restock
                          </button>
                        )}
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
  );
}
