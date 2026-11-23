"use client";

import React, { useState, useEffect } from "react";
import { useInventory } from "@/context/InventoryContext";
import { Item } from "@/types/inventory";
import { X, Package, Check } from "lucide-react";

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  editItem?: Item | null;
}

const CATEGORIES = [
  "Laptops & Desktops",
  "Processors & GPUs",
  "Monitors & Displays",
  "Storage & NAS",
  "Networking Gear",
  "Peripherals & Accessories",
];

export function AddItemModal({ isOpen, onClose, editItem }: AddItemModalProps) {
  const { godowns, addItem, updateItem, notify } = useInventory();

  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [unit, setUnit] = useState("pcs");
  const [costPrice, setCostPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [initialStock, setInitialStock] = useState("");
  const [minStockLevel, setMinStockLevel] = useState("");
  const [godownId, setGodownId] = useState(godowns[0]?.id || "");

  useEffect(() => {
    if (editItem) {
      setName(editItem.name);
      setSku(editItem.sku);
      setCategory(editItem.category);
      setDescription(editItem.description);
      setUnit(editItem.unit);
      setCostPrice(editItem.costPrice.toString());
      setSellingPrice(editItem.sellingPrice.toString());
      setInitialStock(editItem.currentStock.toString());
      setMinStockLevel(editItem.minStockLevel.toString());
      setGodownId(editItem.godownId);
    } else {
      setName("");
      setSku(`SKU-${Math.floor(1000 + Math.random() * 9000)}`);
      setCategory(CATEGORIES[0]);
      setDescription("");
      setUnit("pcs");
      setCostPrice("");
      setSellingPrice("");
      setInitialStock("10");
      setMinStockLevel("5");
      setGodownId(godowns[0]?.id || "");
    }
  }, [editItem, isOpen, godowns]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cost = parseFloat(costPrice);
    const selling = parseFloat(sellingPrice);
    const stock = parseInt(initialStock);
    const minLevel = parseInt(minStockLevel);

    if (isNaN(cost) || isNaN(selling) || isNaN(stock) || isNaN(minLevel)) {
      notify("error", "Validation Error", "Please provide valid numbers for pricing and quantities.");
      return;
    }

    if (selling < cost) {
      notify("warning", "Negative Margin Warning", "Retail price is lower than cost price.");
    }

    if (editItem) {
      updateItem({
        ...editItem,
        name,
        sku,
        category,
        description,
        unit,
        costPrice: cost,
        sellingPrice: selling,
        currentStock: stock,
        minStockLevel: minLevel,
        godownId,
      });
    } else {
      addItem({
        name,
        sku,
        category,
        description,
        unit,
        costPrice: cost,
        sellingPrice: selling,
        currentStock: stock,
        minStockLevel: minLevel,
        godownId,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white border border-[#EAE4E3] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAE4E3] bg-[#FAF8F7]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#FAF4F0] text-[#B85D19] border border-[#F2CBB0] rounded-xl">
              <Package className="w-5 h-5 text-[#B85D19]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1C2727]">
                {editItem ? "Edit Product Details" : "Add New Inventory Item (SKU)"}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Manage stock thresholds, unit economics and warehouse placement.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-[#EAE4E3]/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Product Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Apple MacBook Pro 16 M3"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#EAE4E3] bg-[#FAF8F7] text-[#1C2727] placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#228181] focus:border-[#228181] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                SKU / Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g. LAP-MBP-16"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#EAE4E3] bg-[#FAF8F7] text-[#1C2727] font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#228181] focus:border-[#228181] transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#EAE4E3] bg-[#FAF8F7] text-[#1C2727] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#228181] transition-all"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Fulfillment Facility / Godown
              </label>
              <select
                value={godownId}
                onChange={(e) => setGodownId(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#EAE4E3] bg-[#FAF8F7] text-[#1C2727] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#228181] transition-all"
              >
                {godowns.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name} ({g.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Cost Price (₹) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="any"
                required
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                placeholder="25000"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#EAE4E3] bg-[#FAF8F7] text-[#1C2727] font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#228181] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Retail Price (₹) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="any"
                required
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
                placeholder="32000"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#EAE4E3] bg-[#FAF8F7] text-[#1C2727] font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#228181] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Initial Stock <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                required
                value={initialStock}
                onChange={(e) => setInitialStock(e.target.value)}
                placeholder="10"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#EAE4E3] bg-[#FAF8F7] text-[#1C2727] font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#228181] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Min Threshold <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                required
                value={minStockLevel}
                onChange={(e) => setMinStockLevel(e.target.value)}
                placeholder="5"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#EAE4E3] bg-[#FAF8F7] text-[#1C2727] font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#228181] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Description / Specifications
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. 16-inch Liquid Retina XDR, Apple M3 Max, 36GB Unified Memory"
              rows={2}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#EAE4E3] bg-[#FAF8F7] text-[#1C2727] placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#228181] resize-none transition-all"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EAE4E3]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-[#1C2727] hover:bg-[#FAF8F7] active:scale-95 rounded-xl border border-[#DDD6D5] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-[#228181] hover:bg-[#1A6868] active:scale-95 rounded-xl shadow-xs hover:shadow-md transition-all"
            >
              <Check className="w-4 h-4" />
              <span>{editItem ? "Save Changes" : "Create SKU"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
