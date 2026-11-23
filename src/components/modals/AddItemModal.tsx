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

export function AddItemModal({ isOpen, onClose, editItem }: AddItemModalProps) {
  const { godowns, addItem, updateItem } = useInventory();

  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Processors & GPUs");
  const [description, setDescription] = useState("");
  const [unit, setUnit] = useState("pcs");
  const [costPrice, setCostPrice] = useState<number>(1000);
  const [sellingPrice, setSellingPrice] = useState<number>(1500);
  const [currentStock, setCurrentStock] = useState<number>(10);
  const [minStockLevel, setMinStockLevel] = useState<number>(5);
  const [godownId, setGodownId] = useState(godowns[0]?.id || "");

  useEffect(() => {
    if (editItem) {
      setSku(editItem.sku);
      setName(editItem.name);
      setCategory(editItem.category);
      setDescription(editItem.description);
      setUnit(editItem.unit);
      setCostPrice(editItem.costPrice);
      setSellingPrice(editItem.sellingPrice);
      setCurrentStock(editItem.currentStock);
      setMinStockLevel(editItem.minStockLevel);
      setGodownId(editItem.godownId);
    } else {
      setSku(`SKU-${Math.floor(1000 + Math.random() * 9000)}`);
      setName("");
      setCategory("Processors & GPUs");
      setDescription("");
      setUnit("pcs");
      setCostPrice(5000);
      setSellingPrice(7500);
      setCurrentStock(15);
      setMinStockLevel(5);
      setGodownId(godowns[0]?.id || "");
    }
  }, [editItem, godowns, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editItem) {
      updateItem({
        ...editItem,
        sku,
        name,
        category,
        description,
        unit,
        costPrice,
        sellingPrice,
        currentStock,
        minStockLevel,
        godownId,
      });
    } else {
      addItem({
        sku,
        name,
        category,
        description,
        unit,
        costPrice,
        sellingPrice,
        currentStock,
        minStockLevel,
        godownId,
      });
    }

    onClose();
  };

  const categories = [
    "Laptops & Desktops",
    "Processors & GPUs",
    "Monitors & Displays",
    "Networking Gear",
    "Storage",
    "Peripherals",
    "Accessories",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-xl">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-zinc-100">
                {editItem ? "Edit Product Details" : "Add New Inventory Item (SKU)"}
              </h3>
              <p className="text-xs text-slate-500">
                Manage stock thresholds, unit economics and warehouse placement.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Item Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Apple MacBook Pro 16&quot;"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                SKU / Serial Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g. LAP-MBP-16M3"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Unit of Measure
              </label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="pcs, boxes, sets"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Godown Location
              </label>
              <select
                value={godownId}
                onChange={(e) => setGodownId(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {godowns.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Purchase / Cost Price (₹) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                required
                value={costPrice}
                onChange={(e) => setCostPrice(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Retail / Selling Price (₹) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                required
                value={sellingPrice}
                onChange={(e) => setSellingPrice(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Current On-Hand Quantity <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                required
                value={currentStock}
                onChange={(e) => setCurrentStock(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Minimum Stock Alert Level <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                required
                value={minStockLevel}
                onChange={(e) => setMinStockLevel(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Triggers Low Stock warning when inventory drops to or below this amount.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Specifications & Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Key specifications, warranty info, packaging details..."
              rows={2}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#228181] hover:bg-[#1A6868] rounded-xl shadow-xs transition-all"
            >
              <Check className="w-4 h-4" />
              {editItem ? "Save Changes" : "Save Item to Inventory"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
