"use client";

import React, { useState } from "react";
import { useInventory } from "@/context/InventoryContext";
import {
  BarChart3,
  Download,
  TrendingUp,
  Package,
  Truck,
  Building2,
  Calendar,
  FileSpreadsheet,
  PieChart,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export function ReportsView() {
  const { items, salesOrders, purchaseOrders, godowns, customers, suppliers } = useInventory();
  const [activeReportTab, setActiveReportTab] = useState<"stock" | "sales" | "purchase">("stock");

  // STOCK REPORT CALCULATIONS
  const totalCostValuation = items.reduce((acc, i) => acc + i.costPrice * i.currentStock, 0);
  const totalRetailValuation = items.reduce((acc, i) => acc + i.sellingPrice * i.currentStock, 0);
  const projectedGrossProfit = totalRetailValuation - totalCostValuation;
  const overallMarginPercent = totalRetailValuation > 0
    ? Math.round((projectedGrossProfit / totalRetailValuation) * 100)
    : 0;

  // Category breakdown
  const categorySummary = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = { category: item.category, units: 0, costVal: 0, retailVal: 0, itemCount: 0 };
    }
    acc[item.category].units += item.currentStock;
    acc[item.category].costVal += item.costPrice * item.currentStock;
    acc[item.category].retailVal += item.sellingPrice * item.currentStock;
    acc[item.category].itemCount += 1;
    return acc;
  }, {} as Record<string, { category: string; units: number; costVal: number; retailVal: number; itemCount: number }>);

  const categoryList = Object.values(categorySummary).sort((a, b) => b.costVal - a.costVal);

  // SALES REPORT CALCULATIONS
  const totalSalesRevenue = salesOrders.reduce((acc, s) => acc + s.totalAmount, 0);
  const avgOrderValue = salesOrders.length > 0 ? Math.round(totalSalesRevenue / salesOrders.length) : 0;

  // Product sales performance aggregator
  const productSalesMap = salesOrders.reduce((acc, order) => {
    order.items.forEach((item) => {
      if (!acc[item.itemId]) {
        acc[item.itemId] = {
          name: item.itemName,
          sku: item.sku,
          totalQty: 0,
          totalRevenue: 0,
        };
      }
      acc[item.itemId].totalQty += item.quantity;
      acc[item.itemId].totalRevenue += item.total;
    });
    return acc;
  }, {} as Record<string, { name: string; sku: string; totalQty: number; totalRevenue: number }>);

  const topSellingProducts = Object.values(productSalesMap).sort((a, b) => b.totalRevenue - a.totalRevenue);

  // PURCHASE REPORT CALCULATIONS
  const totalPurchaseSpend = purchaseOrders.reduce((acc, p) => acc + p.totalAmount, 0);

  const supplierSpendMap = purchaseOrders.reduce((acc, po) => {
    if (!acc[po.supplierId]) {
      acc[po.supplierId] = {
        company: po.supplierCompany,
        contact: po.supplierName,
        totalSpend: 0,
        poCount: 0,
      };
    }
    acc[po.supplierId].totalSpend += po.totalAmount;
    acc[po.supplierId].poCount += 1;
    return acc;
  }, {} as Record<string, { company: string; contact: string; totalSpend: number; poCount: number }>);

  const supplierSpendList = Object.values(supplierSpendMap).sort((a, b) => b.totalSpend - a.totalSpend);

  // CSV EXPORT GENERATOR
  const downloadCSV = (filename: string, headers: string[], rows: (string | number)[][]) => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.map((val) => `"${val}"`).join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportCurrentReport = () => {
    if (activeReportTab === "stock") {
      const headers = ["SKU", "Item Name", "Category", "Godown", "Stock Qty", "Min Level", "Cost Price (INR)", "Selling Price (INR)", "Total Valuation (INR)", "Status"];
      const rows = items.map((i) => {
        const g = godowns.find((gd) => gd.id === i.godownId);
        return [
          i.sku,
          i.name,
          i.category,
          g?.name || "Main Godown",
          i.currentStock,
          i.minStockLevel,
          i.costPrice,
          i.sellingPrice,
          i.costPrice * i.currentStock,
          i.status,
        ];
      });
      downloadCSV("SasthaSoft_Inventory_Stock_Report.csv", headers, rows);
    } else if (activeReportTab === "sales") {
      const headers = ["Invoice Number", "Date", "Customer Company", "Contact Person", "Items Summary", "Total Amount (INR)", "Payment Status", "Fulfillment Status"];
      const rows = salesOrders.map((s) => [
        s.invoiceNumber,
        formatDate(s.date),
        s.customerCompany,
        s.customerName,
        s.items.map((it) => `${it.itemName} (${it.quantity})`).join("; "),
        s.totalAmount,
        s.paymentStatus,
        s.status,
      ]);
      downloadCSV("SasthaSoft_Sales_Orders_Report.csv", headers, rows);
    } else {
      const headers = ["PO Number", "Date", "Supplier Company", "Contact Person", "Items Summary", "Total Valuation (INR)", "Status", "Received Date"];
      const rows = purchaseOrders.map((p) => [
        p.poNumber,
        formatDate(p.date),
        p.supplierCompany,
        p.supplierName,
        p.items.map((it) => `${it.itemName} (${it.quantity})`).join("; "),
        p.totalAmount,
        p.status,
        p.receivedDate ? formatDate(p.receivedDate) : "Pending",
      ]);
      downloadCSV("SasthaSoft_Procurement_Purchase_Report.csv", headers, rows);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Switcher & Export Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-zinc-800 pb-4">
        <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-zinc-900 rounded-xl">
          <button
            onClick={() => setActiveReportTab("stock")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeReportTab === "stock"
                ? "bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Stock Valuation Report</span>
          </button>

          <button
            onClick={() => setActiveReportTab("sales")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeReportTab === "sales"
                ? "bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Sales Performance Report</span>
          </button>

          <button
            onClick={() => setActiveReportTab("purchase")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeReportTab === "purchase"
                ? "bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Purchase &amp; Spend Report</span>
          </button>
        </div>

        <button
          onClick={handleExportCurrentReport}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-700 shadow-sm transition-all"
        >
          <Download className="w-4 h-4 text-indigo-500" />
          <span>Export {activeReportTab.toUpperCase()} to CSV</span>
        </button>
      </div>

      {/* 1. STOCK REPORT TAB */}
      {activeReportTab === "stock" && (
        <div className="space-y-6">
          {/* Top Valuation Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Asset Cost Valuation
              </div>
              <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-100 mt-1">
                {formatCurrency(totalCostValuation)}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">Capital invested in physical stock</div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Potential Retail Value
              </div>
              <div className="text-2xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400 mt-1">
                {formatCurrency(totalRetailValuation)}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">Projected revenue upon 100% liquidation</div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Projected Gross Profit
              </div>
              <div className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 mt-1">
                {formatCurrency(projectedGrossProfit)}
              </div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">
                +{overallMarginPercent}% gross product margin
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Active Catalog Units
              </div>
              <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-100 mt-1">
                {items.reduce((a, b) => a + b.currentStock, 0)} units
              </div>
              <div className="text-xs text-slate-400 mt-0.5">Spread across {categoryList.length} categories</div>
            </div>
          </div>

          {/* Category Health & Breakdown Table */}
          <div className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-200 dark:border-zinc-800 bg-slate-50/75 dark:bg-zinc-950/50">
              <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                Inventory Valuation Breakdown by Product Category
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-zinc-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-4">Category Name</th>
                    <th className="py-3 px-4 text-center">SKU Count</th>
                    <th className="py-3 px-4 text-center">Total Units</th>
                    <th className="py-3 px-4 text-right">Cost Value</th>
                    <th className="py-3 px-4 text-right">Retail Value</th>
                    <th className="py-3 px-4 text-right">Projected Profit</th>
                    <th className="py-3 px-4 text-center">Inventory Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60 text-xs sm:text-sm">
                  {categoryList.map((cat) => {
                    const profit = cat.retailVal - cat.costVal;
                    const sharePercent = totalCostValuation > 0
                      ? Math.round((cat.costVal / totalCostValuation) * 100)
                      : 0;

                    return (
                      <tr key={cat.category} className="hover:bg-slate-50/80 dark:hover:bg-zinc-800/40">
                        <td className="py-3 px-4 font-semibold text-slate-900 dark:text-zinc-100">
                          {cat.category}
                        </td>
                        <td className="py-3 px-4 text-center text-slate-500">{cat.itemCount}</td>
                        <td className="py-3 px-4 text-center font-bold text-slate-900 dark:text-zinc-100">
                          {cat.units}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-slate-600 dark:text-zinc-400">
                          {formatCurrency(cat.costVal)}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-medium text-slate-900 dark:text-zinc-100">
                          {formatCurrency(cat.retailVal)}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                          {formatCurrency(profit)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-16 h-2 rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden">
                              <div
                                className="h-full bg-indigo-500 rounded-full"
                                style={{ width: `${Math.max(5, sharePercent)}%` }}
                              />
                            </div>
                            <span className="text-[11px] font-mono text-slate-500">{sharePercent}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. SALES PERFORMANCE TAB */}
      {activeReportTab === "sales" && (
        <div className="space-y-6">
          {/* Sales KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Gross Sales Invoiced
              </div>
              <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-100 mt-1">
                {formatCurrency(totalSalesRevenue)}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">{salesOrders.length} Completed Invoices</div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Average Order Value (AOV)
              </div>
              <div className="text-2xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400 mt-1">
                {formatCurrency(avgOrderValue)}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">Average revenue per customer sale</div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Top Client
              </div>
              <div className="text-lg font-bold tracking-tight text-slate-900 dark:text-zinc-100 mt-1 truncate">
                {salesOrders[0]?.customerCompany || "N/A"}
              </div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">
                Highest purchasing volume
              </div>
            </div>
          </div>

          {/* Top Selling Products Table */}
          <div className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-200 dark:border-zinc-800 bg-slate-50/75 dark:bg-zinc-950/50">
              <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                Top Selling Products Ranked by Sales Volume
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-zinc-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-4">Product Name &amp; SKU</th>
                    <th className="py-3 px-4 text-center">Units Sold</th>
                    <th className="py-3 px-4 text-right">Revenue Generated</th>
                    <th className="py-3 px-4 text-right">Revenue Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60 text-xs sm:text-sm">
                  {topSellingProducts.map((p) => {
                    const share = totalSalesRevenue > 0
                      ? Math.round((p.totalRevenue / totalSalesRevenue) * 100)
                      : 0;

                    return (
                      <tr key={p.sku} className="hover:bg-slate-50/80 dark:hover:bg-zinc-800/40">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900 dark:text-zinc-100">{p.name}</div>
                          <div className="text-[11px] font-mono text-slate-400">{p.sku}</div>
                        </td>
                        <td className="py-3 px-4 text-center font-bold font-mono">{p.totalQty} units</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          {formatCurrency(p.totalRevenue)}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-slate-500">{share}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. PURCHASE REPORT TAB */}
      {activeReportTab === "purchase" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Total Spend
              </div>
              <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-100 mt-1">
                {formatCurrency(totalPurchaseSpend)}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">{purchaseOrders.length} PO contracts</div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Active Suppliers
              </div>
              <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-100 mt-1">
                {suppliers.length} Vendors
              </div>
              <div className="text-xs text-slate-400 mt-0.5">Key regional electronics suppliers</div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Received vs In-Transit
              </div>
              <div className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 mt-1">
                {purchaseOrders.filter((p) => p.status === "received").length} Recv / {purchaseOrders.filter((p) => p.status !== "received").length} Pending
              </div>
              <div className="text-xs text-slate-400 mt-0.5">Warehouse intake ratio</div>
            </div>
          </div>

          {/* Supplier Spend Table */}
          <div className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-200 dark:border-zinc-800 bg-slate-50/75 dark:bg-zinc-950/50">
              <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                Procurement Spend Breakdown by Vendor
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-zinc-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-4">Supplier Company</th>
                    <th className="py-3 px-4">Primary Contact</th>
                    <th className="py-3 px-4 text-center">Purchase Orders</th>
                    <th className="py-3 px-4 text-right">Total Spend (₹)</th>
                    <th className="py-3 px-4 text-right">Spend Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60 text-xs sm:text-sm">
                  {supplierSpendList.map((sup) => {
                    const share = totalPurchaseSpend > 0
                      ? Math.round((sup.totalSpend / totalPurchaseSpend) * 100)
                      : 0;

                    return (
                      <tr key={sup.company} className="hover:bg-slate-50/80 dark:hover:bg-zinc-800/40">
                        <td className="py-3 px-4 font-semibold text-slate-900 dark:text-zinc-100">
                          {sup.company}
                        </td>
                        <td className="py-3 px-4 text-slate-500">{sup.contact}</td>
                        <td className="py-3 px-4 text-center font-mono">{sup.poCount} POs</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-zinc-100">
                          {formatCurrency(sup.totalSpend)}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-slate-500">{share}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
