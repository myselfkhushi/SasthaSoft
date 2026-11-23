"use client";

import React, { useState } from "react";
import { useInventory } from "@/context/InventoryContext";
import {
  Users,
  Truck,
  Building,
  Mail,
  Phone,
  MapPin,
  FileText,
  Plus,
  ShieldCheck,
  Check,
} from "lucide-react";

export function ContactsView() {
  const { customers, suppliers, addCustomer, addSupplier } = useInventory();
  const [tab, setTab] = useState<"customers" | "suppliers">("customers");

  // Quick Add State
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [extraField, setExtraField] = useState(""); // GSTIN for customer, lead time for supplier

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tab === "customers") {
      addCustomer({
        name,
        company,
        email,
        phone,
        city,
        gstNumber: extraField || "27AABCU1234E1Z1",
      });
    } else {
      addSupplier({
        name,
        company,
        email,
        phone,
        city,
        leadTimeDays: parseInt(extraField) || 5,
      });
    }
    setShowAddModal(false);
    setName("");
    setCompany("");
    setEmail("");
    setPhone("");
    setCity("");
    setExtraField("");
  };

  return (
    <div className="space-y-6">
      {/* Tab Switcher & CTA */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#EAE4E3] pb-4">
        <div className="flex items-center gap-2 p-1 bg-[#F0ECEB] rounded-xl">
          <button
            onClick={() => setTab("customers")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              tab === "customers"
                ? "bg-white text-[#1C2727] shadow-xs"
                : "text-slate-500 hover:text-[#1C2727]"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Corporate Clients ({customers.length})</span>
          </button>

          <button
            onClick={() => setTab("suppliers")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              tab === "suppliers"
                ? "bg-white text-[#1C2727] shadow-xs"
                : "text-slate-500 hover:text-[#1C2727]"
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Vendors &amp; Suppliers ({suppliers.length})</span>
          </button>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#228181] hover:bg-[#1A6868] rounded-xl shadow-xs transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add {tab === "customers" ? "Client Company" : "Supplier Vendor"}
        </button>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tab === "customers" ? (
          customers.map((c) => (
            <div
              key={c.id}
              className="p-5 rounded-2xl bg-white dark:bg-[#1c182b] border border-[#ece8df] dark:border-[#2a253f] shadow-[0_4px_20px_rgba(34,27,48,0.03)] flex flex-col justify-between gap-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="font-bold text-sm text-slate-900 dark:text-zinc-100">
                    {c.company}
                  </div>
                  <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                    <Building className="w-4 h-4" />
                  </span>
                </div>
                <div className="text-xs text-slate-600 dark:text-zinc-300 font-medium mt-1">
                  Contact: {c.name}
                </div>

                <div className="mt-4 space-y-2 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{c.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{c.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{c.city}, India</span>
                  </div>
                </div>
              </div>

              {c.gstNumber && (
                <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">GSTIN:</span>
                  <span className="font-mono font-medium text-slate-700 dark:text-zinc-300">
                    {c.gstNumber}
                  </span>
                </div>
              )}
            </div>
          ))
        ) : (
          suppliers.map((s) => (
            <div
              key={s.id}
              className="p-5 rounded-2xl bg-white dark:bg-[#1c182b] border border-[#ece8df] dark:border-[#2a253f] shadow-[0_4px_20px_rgba(34,27,48,0.03)] flex flex-col justify-between gap-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="font-bold text-sm text-slate-900 dark:text-zinc-100">
                    {s.company}
                  </div>
                  <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                    <Truck className="w-4 h-4" />
                  </span>
                </div>
                <div className="text-xs text-slate-600 dark:text-zinc-300 font-medium mt-1">
                  Representative: {s.name}
                </div>

                <div className="mt-4 space-y-2 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{s.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{s.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{s.city}, India</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Delivery Lead Time:</span>
                <span className="font-medium text-emerald-600 dark:text-emerald-400 font-mono">
                  ~{s.leadTimeDays} days
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quick Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">
                Add New {tab === "customers" ? "Client Profile" : "Vendor / Supplier"}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Company / Entity Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Acme Tech Solutions Ltd"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Contact Person <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contact@domain.com"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 00000"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Mumbai"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    {tab === "customers" ? "GST Number" : "Lead Time (Days)"}
                  </label>
                  <input
                    type="text"
                    value={extraField}
                    onChange={(e) => setExtraField(e.target.value)}
                    placeholder={tab === "customers" ? "27AABCU1234E1Z1" : "5"}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all"
                >
                  <Check className="w-4 h-4" />
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
