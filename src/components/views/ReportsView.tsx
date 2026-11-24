"use client";

import React, { useState } from "react";
import { useInventory } from "@/context/InventoryContext";
import {
  Download,
  TrendingUp,
  Package,
  Truck,
  Building2,
  Boxes,
  DollarSign,
  PieChart,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export function ReportsView() {
  const { items, salesOrders, purchaseOrders, suppliers } = useInventory();
  const [activeReportTab, setActiveReportTab] = useState<"stock" | "sales" | "purchase">("stock");

  // STOCK REPORT CALCULATIONS
  const totalCostValuation = items.reduce((acc, i) => acc + i.costPrice * i.currentStock, 0);
  const totalRetailValuation = items.reduce((acc, i) => acc + i.sellingPrice * i.currentStock, 0);
  const projectedGrossProfit = totalRetailValuation - totalCostValuation;
  const overallMarginPercent =
    totalRetailValuation > 0
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
      const headers = ["Category", "SKUs", "Total Units", "Cost Valuation (INR)", "Retail Valuation (INR)", "Projected Margin (INR)"];
      const rows = categoryList.map((c) => [
        c.category,
        c.itemCount,
        c.units,
        c.costVal,
        c.retailVal,
        c.retailVal - c.costVal,
      ]);
      downloadCSV("SasthaSoft_Stock_Valuation_Report.csv", headers, rows);
    } else if (activeReportTab === "sales") {
      const headers = ["Invoice #", "Date", "Customer Name", "Company", "Total Amount (INR)", "Status", "Items Count"];
      const rows = salesOrders.map((s) => [
        s.invoiceNumber,
        formatDate(s.date),
        s.customerName,
        s.customerCompany,
        s.totalAmount,
        s.status,
        s.items.reduce((sum, i) => sum + i.quantity, 0),
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#EAE4E3] pb-4">
        <div className="overflow-x-auto no-scrollbar max-w-full pb-1">
          <div className="flex items-center gap-1.5 p-1 bg-[#EAE4E3]/70 rounded-xl border border-[#DDD6D5] whitespace-nowrap min-w-max">
            <button
              onClick={() => setActiveReportTab("stock")}
              className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all duration-150 active:scale-95 ${
                activeReportTab === "stock"
                  ? "bg-white text-[#1C2727] shadow-sm"
                  : "text-slate-600 hover:text-[#1C2727]"
              }`}
            >
              <Package className="w-4 h-4 text-[#228181]" />
              <span>Stock Valuation Report</span>
            </button>

            <button
              onClick={() => setActiveReportTab("sales")}
              className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all duration-150 active:scale-95 ${
                activeReportTab === "sales"
                  ? "bg-white text-[#1C2727] shadow-sm"
                  : "text-slate-600 hover:text-[#1C2727]"
              }`}
            >
              <TrendingUp className="w-4 h-4 text-[#D78EAB]" />
              <span>Sales Performance Report</span>
            </button>

            <button
              onClick={() => setActiveReportTab("purchase")}
              className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all duration-150 active:scale-95 ${
                activeReportTab === "purchase"
                  ? "bg-white text-[#1C2727] shadow-sm"
                  : "text-slate-600 hover:text-[#1C2727]"
              }`}
            >
              <Truck className="w-4 h-4 text-[#165353]" />
              <span>Purchase &amp; Spend Report</span>
            </button>
          </div>
        </div>

        <button
          onClick={handleExportCurrentReport}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#228181] hover:bg-[#1A6868] active:scale-95 text-white shadow-xs hover:shadow-md transition-all duration-150"
        >
          <Download className="w-4 h-4 text-white" />
          <span>Export {activeReportTab.toUpperCase()} to CSV</span>
        </button>
      </div>

      {/* 1. STOCK REPORT TAB */}
      {activeReportTab === "stock" && (
        <div className="space-y-6">
          {/* Top Valuation Metrics (Crisp White + Circular Badges) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Asset Cost */}
            <div className="p-5 rounded-2xl bg-white border border-[#EAE4E3] shadow-[0_4px_20px_rgba(34,129,129,0.03)] hover:shadow-lg hover:border-[#228181]/40 hover:-translate-y-1 active:scale-[0.99] transition-all duration-200 cursor-pointer flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#228181] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#228181]/25">
                <span className="text-xl font-black">₹</span>
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Asset Cost Valuation
                </div>
                <div className="text-xl font-black tracking-tight text-[#1C2727] mt-0.5 truncate font-mono">
                  {formatCurrency(totalCostValuation)}
                </div>
                <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                  Capital invested in stock
                </div>
              </div>
            </div>

            {/* Potential Retail */}
            <div className="p-5 rounded-2xl bg-white border border-[#EAE4E3] shadow-[0_4px_20px_rgba(184,93,25,0.03)] hover:shadow-lg hover:border-[#B85D19]/40 hover:-translate-y-1 active:scale-[0.99] transition-all duration-200 cursor-pointer flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#B85D19] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#B85D19]/25">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Potential Retail Value
                </div>
                <div className="text-xl font-black tracking-tight text-[#B85D19] mt-0.5 truncate font-mono">
                  {formatCurrency(totalRetailValuation)}
                </div>
                <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                  Projected revenue on liquidation
                </div>
              </div>
            </div>

            {/* Projected Gross Profit */}
            <div className="p-5 rounded-2xl bg-white border border-[#EAE4E3] shadow-[0_4px_20px_rgba(34,129,129,0.03)] hover:shadow-lg hover:border-[#165353]/40 hover:-translate-y-1 active:scale-[0.99] transition-all duration-200 cursor-pointer flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#165353] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#165353]/25">
                <PieChart className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Projected Gross Profit
                </div>
                <div className="text-xl font-black tracking-tight text-[#165353] mt-0.5 truncate font-mono">
                  {formatCurrency(projectedGrossProfit)}
                </div>
                <div className="text-[11px] text-[#228181] font-bold mt-0.5">
                  +{overallMarginPercent}% gross product margin
                </div>
              </div>
            </div>

            {/* Active Catalog Units */}
            <div className="p-5 rounded-2xl bg-white border border-[#EAE4E3] shadow-[0_4px_20px_rgba(215,142,171,0.03)] hover:shadow-lg hover:border-[#D78EAB]/40 hover:-translate-y-1 active:scale-[0.99] transition-all duration-200 cursor-pointer flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#D78EAB] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#D78EAB]/25">
                <Boxes className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Active Catalog Units
                </div>
                <div className="text-xl font-black tracking-tight text-[#1C2727] mt-0.5 truncate">
                  {items.reduce((a, b) => a + b.currentStock, 0)} units
                </div>
                <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                  In {categoryList.length} categories
                </div>
              </div>
            </div>
          </div>

          {/* Category Health & Breakdown Table */}
          <div className="rounded-2xl border border-[#EAE4E3] bg-white overflow-hidden shadow-[0_4px_20px_rgba(34,129,129,0.03)]">
            <div className="p-4 border-b border-[#EAE4E3] bg-[#FAF8F7]">
              <h3 className="text-sm font-bold text-[#1C2727]">
                Inventory Valuation Breakdown by Product Category
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-[#EAE4E3] bg-[#FAF8F7] text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3 px-4">Category Name</th>
                    <th className="py-3 px-4 text-center">SKU Count</th>
                    <th className="py-3 px-4 text-center">Total Units</th>
                    <th className="py-3 px-4 text-right">Cost Value</th>
                    <th className="py-3 px-4 text-right">Retail Value</th>
                    <th className="py-3 px-4 text-right">Projected Profit</th>
                    <th className="py-3 px-4 text-center">Inventory Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE4E3]/70 text-xs sm:text-sm">
                  {categoryList.map((cat) => {
                    const profit = cat.retailVal - cat.costVal;
                    const sharePercent =
                      totalCostValuation > 0
                        ? Math.round((cat.costVal / totalCostValuation) * 100)
                        : 0;

                    return (
                      <tr
                        key={cat.category}
                        className="hover:bg-[#FAF6F4] active:bg-[#F2ECE9] transition-colors duration-150 cursor-pointer"
                      >
                        <td className="py-3 px-4 font-bold text-[#1C2727]">
                          {cat.category}
                        </td>
                        <td className="py-3 px-4 text-center font-semibold text-slate-600">
                          {cat.itemCount}
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-[#1C2727]">
                          {cat.units}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-semibold text-slate-700">
                          {formatCurrency(cat.costVal)}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-[#1C2727]">
                          {formatCurrency(cat.retailVal)}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-[#165353] font-black">
                          {formatCurrency(profit)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-16 h-2 rounded-full bg-[#EAE4E3] overflow-hidden">
                              <div
                                className="h-full rounded-full bg-[#228181]"
                                style={{ width: `${Math.min(sharePercent, 100)}%` }}
                              />
                            </div>
                            <span className="text-[11px] font-bold text-slate-600 w-8 text-right font-mono">
                              {sharePercent}%
                            </span>
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
            <div className="p-5 rounded-2xl bg-white border border-[#EAE4E3] shadow-[0_4px_20px_rgba(34,129,129,0.03)] hover:shadow-lg hover:border-[#228181]/40 hover:-translate-y-1 active:scale-[0.99] transition-all duration-200 cursor-pointer flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#228181] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#228181]/25">
                <span className="text-xl font-black">₹</span>
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Gross Sales Invoiced
                </div>
                <div className="text-2xl font-black tracking-tight text-[#1C2727] mt-0.5 truncate font-mono">
                  {formatCurrency(totalSalesRevenue)}
                </div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">
                  {salesOrders.length} Completed Invoices
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#EAE4E3] shadow-[0_4px_20px_rgba(215,142,171,0.03)] hover:shadow-lg hover:border-[#D78EAB]/40 hover:-translate-y-1 active:scale-[0.99] transition-all duration-200 cursor-pointer flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#D78EAB] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#D78EAB]/25">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Average Order Value (AOV)
                </div>
                <div className="text-2xl font-black tracking-tight text-[#7A2D4C] mt-0.5 truncate font-mono">
                  {formatCurrency(avgOrderValue)}
                </div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">
                  Average revenue per customer sale
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#EAE4E3] shadow-[0_4px_20px_rgba(34,129,129,0.03)] hover:shadow-lg hover:border-[#165353]/40 hover:-translate-y-1 active:scale-[0.99] transition-all duration-200 cursor-pointer flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#165353] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#165353]/25">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Top Purchasing Client
                </div>
                <div className="text-lg font-bold tracking-tight text-[#1C2727] mt-0.5 truncate">
                  {salesOrders[0]?.customerCompany || "N/A"}
                </div>
                <div className="text-xs text-[#165353] font-bold mt-0.5">
                  Highest volume client
                </div>
              </div>
            </div>
          </div>

          {/* Top Selling Products Table */}
          <div className="rounded-2xl border border-[#EAE4E3] bg-white overflow-hidden shadow-[0_4px_20px_rgba(34,129,129,0.03)]">
            <div className="p-4 border-b border-[#EAE4E3] bg-[#FAF8F7]">
              <h3 className="text-sm font-bold text-[#1C2727]">
                Top Selling Products Ranked by Sales Volume
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-[#EAE4E3] bg-[#FAF8F7] text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-4">Product Name &amp; SKU</th>
                    <th className="py-3.5 px-4 text-center">Units Sold</th>
                    <th className="py-3.5 px-4 text-right">Revenue Generated</th>
                    <th className="py-3.5 px-4 text-right">Revenue Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE4E3]/70 text-xs sm:text-sm">
                  {topSellingProducts.map((p) => {
                    const share =
                      totalSalesRevenue > 0
                        ? Math.round((p.totalRevenue / totalSalesRevenue) * 100)
                        : 0;

                    return (
                      <tr
                        key={p.sku}
                        className="hover:bg-[#FAF6F4] active:bg-[#F2ECE9] transition-colors duration-150 cursor-pointer"
                      >
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-[#1C2727]">{p.name}</div>
                          <div className="text-[11px] font-mono text-slate-500 font-medium">
                            {p.sku}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold font-mono text-[#1C2727]">
                          {p.totalQty} units
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-black text-[#165353]">
                          {formatCurrency(p.totalRevenue)}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono text-slate-600 font-bold">
                          {share}%
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

      {/* 3. PURCHASE REPORT TAB */}
      {activeReportTab === "purchase" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-[#EAE4E3] shadow-[0_4px_20px_rgba(215,142,171,0.03)] hover:shadow-lg hover:border-[#D78EAB]/40 hover:-translate-y-1 active:scale-[0.99] transition-all duration-200 cursor-pointer flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#D78EAB] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#D78EAB]/25">
                <span className="text-xl font-black">₹</span>
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Total Procurement Spend
                </div>
                <div className="text-2xl font-black tracking-tight text-[#1C2727] mt-0.5 truncate font-mono">
                  {formatCurrency(totalPurchaseSpend)}
                </div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">
                  {purchaseOrders.length} PO contracts
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#EAE4E3] shadow-[0_4px_20px_rgba(34,129,129,0.03)] hover:shadow-lg hover:border-[#228181]/40 hover:-translate-y-1 active:scale-[0.99] transition-all duration-200 cursor-pointer flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#228181] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#228181]/25">
                <Truck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Active Suppliers
                </div>
                <div className="text-2xl font-black tracking-tight text-[#165353] mt-0.5 truncate">
                  {suppliers.length} Vendors
                </div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">
                  Key electronics suppliers
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#EAE4E3] shadow-[0_4px_20px_rgba(34,129,129,0.03)] hover:shadow-lg hover:border-[#165353]/40 hover:-translate-y-1 active:scale-[0.99] transition-all duration-200 cursor-pointer flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#165353] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#165353]/25">
                <Package className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Received vs In-Transit
                </div>
                <div className="text-2xl font-black tracking-tight text-[#165353] mt-0.5 truncate">
                  {purchaseOrders.filter((p) => p.status === "received").length} Recv /{" "}
                  {purchaseOrders.filter((p) => p.status !== "received").length} Pending
                </div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">
                  Warehouse intake ratio
                </div>
              </div>
            </div>
          </div>

          {/* Supplier Spend Table */}
          <div className="rounded-2xl border border-[#EAE4E3] bg-white overflow-hidden shadow-[0_4px_20px_rgba(34,129,129,0.03)]">
            <div className="p-4 border-b border-[#EAE4E3] bg-[#FAF8F7]">
              <h3 className="text-sm font-bold text-[#1C2727]">
                Procurement Spend Breakdown by Vendor
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-[#EAE4E3] bg-[#FAF8F7] text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-4">Supplier Company</th>
                    <th className="py-3.5 px-4">Primary Contact</th>
                    <th className="py-3.5 px-4 text-center">Purchase Orders</th>
                    <th className="py-3.5 px-4 text-right">Total Spend (₹)</th>
                    <th className="py-3.5 px-4 text-right">Spend Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE4E3]/70 text-xs sm:text-sm">
                  {supplierSpendList.map((sup) => {
                    const share =
                      totalPurchaseSpend > 0
                        ? Math.round((sup.totalSpend / totalPurchaseSpend) * 100)
                        : 0;

                    return (
                      <tr
                        key={sup.company}
                        className="hover:bg-[#FAF6F4] active:bg-[#F2ECE9] transition-colors duration-150 cursor-pointer"
                      >
                        <td className="py-3.5 px-4 font-bold text-[#1C2727]">
                          {sup.company}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 font-medium">{sup.contact}</td>
                        <td className="py-3.5 px-4 text-center font-mono font-bold text-[#1C2727]">
                          {sup.poCount} POs
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-black text-[#1C2727]">
                          {formatCurrency(sup.totalSpend)}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-600">
                          {share}%
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
    </div>
  );
}
