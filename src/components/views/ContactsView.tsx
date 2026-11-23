"use client";

import React, { useState } from "react";
import { useInventory } from "@/context/InventoryContext";
import {
  Users,
  Building,
  Truck,
  Plus,
  Mail,
  Phone,
  MapPin,
  Check,
  Building2,
  X,
} from "lucide-react";

export function ContactsView() {
  const { customers, suppliers, addCustomer, addSupplier } = useInventory();
  const [tab, setTab] = useState<"customers" | "suppliers">("customers");
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [extraField, setExtraField] = useState(""); // GST for customer, lead time for supplier

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !company || !email) return;

    if (tab === "customers") {
      addCustomer({
        name,
        company,
        email,
        phone,
        city: city || "Mumbai",
        gstNumber: extraField || undefined,
      });
    } else {
      addSupplier({
        name,
        company,
        email,
        phone,
        city: city || "Delhi",
        leadTimeDays: Number(extraField) || 5,
      });
    }

    // Reset and close
    setName("");
    setCompany("");
    setEmail("");
    setPhone("");
    setCity("");
    setExtraField("");
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & View Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Toggle Pills */}
        <div className="inline-flex p-1 bg-[#EAE4E3]/70 rounded-xl border border-[#DDD6D5]">
          <button
            onClick={() => setTab("customers")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-150 active:scale-95 ${
              tab === "customers"
                ? "bg-white text-[#1C2727] shadow-sm font-bold"
                : "text-slate-600 hover:text-[#1C2727]"
            }`}
          >
            <Users className="w-4 h-4 text-[#228181]" />
            <span>Corporate Clients ({customers.length})</span>
          </button>
          <button
            onClick={() => setTab("suppliers")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-150 active:scale-95 ${
              tab === "suppliers"
                ? "bg-white text-[#1C2727] shadow-sm font-bold"
                : "text-slate-600 hover:text-[#1C2727]"
            }`}
          >
            <Truck className="w-4 h-4 text-[#D78EAB]" />
            <span>Vendors &amp; Suppliers ({suppliers.length})</span>
          </button>
        </div>

        {/* Add Contact CTA */}
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#228181] hover:bg-[#1A6868] active:scale-95 rounded-xl shadow-sm hover:shadow-md transition-all duration-150 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add {tab === "customers" ? "Client Company" : "Supplier Vendor"}</span>
        </button>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {tab === "customers" ? (
          customers.map((c) => (
            <div
              key={c.id}
              className="p-5 rounded-2xl bg-white border border-[#EAE4E3] shadow-[0_4px_20px_rgba(34,129,129,0.03)] hover:shadow-[0_8px_30px_rgba(34,129,129,0.08)] hover:border-[#228181]/40 hover:-translate-y-1 active:scale-[0.99] transition-all duration-200 flex flex-col justify-between gap-4 cursor-pointer group"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="font-bold text-base text-[#1C2727] group-hover:text-[#228181] transition-colors">
                    {c.company}
                  </div>
                  <span className="p-2 rounded-xl bg-[#EAF4F4] text-[#165353] border border-[#228181]/15 group-hover:bg-[#228181] group-hover:text-white transition-all">
                    <Building className="w-4 h-4" />
                  </span>
                </div>
                <div className="text-xs text-[#228181] font-bold mt-1">
                  Contact: {c.name}
                </div>

                <div className="mt-4 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate font-medium">{c.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-medium">{c.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-medium">{c.city}, India</span>
                  </div>
                </div>
              </div>

              {c.gstNumber && (
                <div className="pt-3 border-t border-[#EAE4E3] flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-medium">GSTIN:</span>
                  <span className="font-mono font-bold text-[#1C2727] bg-[#FAF8F7] px-2 py-0.5 rounded border border-[#EAE4E3]">
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
              className="p-5 rounded-2xl bg-white border border-[#EAE4E3] shadow-[0_4px_20px_rgba(215,142,171,0.03)] hover:shadow-[0_8px_30px_rgba(215,142,171,0.08)] hover:border-[#D78EAB]/40 hover:-translate-y-1 active:scale-[0.99] transition-all duration-200 flex flex-col justify-between gap-4 cursor-pointer group"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="font-bold text-base text-[#1C2727] group-hover:text-[#D78EAB] transition-colors">
                    {s.company}
                  </div>
                  <span className="p-2 rounded-xl bg-[#FAF0F4] text-[#7A2D4C] border border-[#D78EAB]/20 group-hover:bg-[#D78EAB] group-hover:text-white transition-all">
                    <Truck className="w-4 h-4" />
                  </span>
                </div>
                <div className="text-xs text-[#7A2D4C] font-bold mt-1">
                  Representative: {s.name}
                </div>

                <div className="mt-4 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate font-medium">{s.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-medium">{s.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-medium">{s.city}, India</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#EAE4E3] flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-medium">Standard SLA:</span>
                <span className="font-semibold text-[#7A2D4C] bg-[#FAF0F4] px-2 py-0.5 rounded border border-[#F0D5DF]">
                  {s.leadTimeDays} Days Lead Time
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Contact Modal (Luxurious Light Theme) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white border border-[#EAE4E3] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="p-5 border-b border-[#EAE4E3] flex items-center justify-between bg-[#FAF8F7]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#228181] text-white flex items-center justify-center shadow-xs">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#1C2727]">
                    Register New {tab === "customers" ? "Client Company" : "Supplier"}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Add verified corporate counterparty to enterprise directory
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-[#EAE4E3]/60 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Company / Entity Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Acme Tech Solutions Ltd"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#EAE4E3] bg-[#FAF8F7] text-[#1C2727] placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#228181] focus:border-[#228181] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Primary Contact Person <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#EAE4E3] bg-[#FAF8F7] text-[#1C2727] placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#228181] focus:border-[#228181] transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contact@domain.com"
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#EAE4E3] bg-[#FAF8F7] text-[#1C2727] placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#228181] focus:border-[#228181] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Contact Phone <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 00000"
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#EAE4E3] bg-[#FAF8F7] text-[#1C2727] placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#228181] focus:border-[#228181] transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    City Location
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Mumbai"
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#EAE4E3] bg-[#FAF8F7] text-[#1C2727] placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#228181] focus:border-[#228181] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    {tab === "customers" ? "GSTIN Number" : "Lead Time (Days)"}
                  </label>
                  <input
                    type="text"
                    value={extraField}
                    onChange={(e) => setExtraField(e.target.value)}
                    placeholder={tab === "customers" ? "27AABCU1234E1Z1" : "5"}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#EAE4E3] bg-[#FAF8F7] text-[#1C2727] placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#228181] focus:border-[#228181] transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EAE4E3]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-[#1C2727] hover:bg-[#FAF8F7] active:scale-95 rounded-xl border border-[#DDD6D5] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-[#228181] hover:bg-[#1A6868] active:scale-95 rounded-xl shadow-sm hover:shadow-md transition-all"
                >
                  <Check className="w-4 h-4" />
                  Save {tab === "customers" ? "Client" : "Supplier"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
