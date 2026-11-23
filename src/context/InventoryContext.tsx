"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  Item,
  Godown,
  Customer,
  Supplier,
  SalesOrder,
  PurchaseOrder,
  StockHistoryEntry,
  StockTransfer,
  SalesStatus,
  PaymentStatus,
  PurchaseStatus,
  ItemStatus,
} from "@/types/inventory";
import {
  initialItems,
  initialGodowns,
  initialCustomers,
  initialSuppliers,
  initialSalesOrders,
  initialPurchaseOrders,
  initialStockHistory,
  initialTransfers,
} from "@/data/seedData";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  description?: string;
  timestamp: number;
}

interface InventoryContextType {
  isLoaded: boolean;
  items: Item[];
  godowns: Godown[];
  customers: Customer[];
  suppliers: Supplier[];
  salesOrders: SalesOrder[];
  purchaseOrders: PurchaseOrder[];
  stockHistory: StockHistoryEntry[];
  transfers: StockTransfer[];
  toasts: ToastMessage[];

  // Action methods
  addSalesOrder: (
    order: Omit<SalesOrder, "id" | "invoiceNumber">
  ) => { success: boolean; error?: string; orderId?: string };
  updateSalesStatus: (orderId: string, status: SalesStatus) => void;
  updatePaymentStatus: (orderId: string, status: PaymentStatus) => void;

  addPurchaseOrder: (
    po: Omit<PurchaseOrder, "id" | "poNumber">
  ) => { success: boolean; error?: string; poId?: string };
  receivePurchaseOrder: (poId: string) => { success: boolean; error?: string };
  updatePurchaseStatus: (poId: string, status: PurchaseStatus) => void;

  addItem: (item: Omit<Item, "id" | "status" | "lastUpdated">) => void;
  updateItem: (item: Item) => void;
  deleteItem: (itemId: string) => void;
  adjustStock: (itemId: string, quantityDelta: number, reason: string) => void;

  transferStock: (data: {
    itemId: string;
    quantity: number;
    fromGodownId: string;
    toGodownId: string;
    notes?: string;
  }) => { success: boolean; error?: string };

  addCustomer: (customer: Omit<Customer, "id">) => void;
  addSupplier: (supplier: Omit<Supplier, "id">) => void;
  addGodown: (godown: Omit<Godown, "id">) => void;

  resetDemoData: () => void;
  dismissToast: (id: string) => void;
  notify: (
    type: "success" | "error" | "info" | "warning",
    title: string,
    description?: string
  ) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ITEMS: "sastha_inventory_items_v1",
  GODOWNS: "sastha_inventory_godowns_v1",
  CUSTOMERS: "sastha_inventory_customers_v1",
  SUPPLIERS: "sastha_inventory_suppliers_v1",
  SALES: "sastha_inventory_sales_v1",
  PURCHASES: "sastha_inventory_purchases_v1",
  HISTORY: "sastha_inventory_history_v1",
  TRANSFERS: "sastha_inventory_transfers_v1",
};

function calculateItemStatus(stock: number, minLevel: number): ItemStatus {
  if (stock <= 0) return "out_of_stock";
  if (stock <= minLevel) return "low_stock";
  return "in_stock";
}

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState<Item[]>(initialItems);
  const [godowns, setGodowns] = useState<Godown[]>(initialGodowns);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>(initialSalesOrders);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(initialPurchaseOrders);
  const [stockHistory, setStockHistory] = useState<StockHistoryEntry[]>(initialStockHistory);
  const [transfers, setTransfers] = useState<StockTransfer[]>(initialTransfers);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const storedItems = localStorage.getItem(STORAGE_KEYS.ITEMS);
      if (storedItems) setItems(JSON.parse(storedItems));

      const storedGodowns = localStorage.getItem(STORAGE_KEYS.GODOWNS);
      if (storedGodowns) setGodowns(JSON.parse(storedGodowns));

      const storedCustomers = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
      if (storedCustomers) setCustomers(JSON.parse(storedCustomers));

      const storedSuppliers = localStorage.getItem(STORAGE_KEYS.SUPPLIERS);
      if (storedSuppliers) setSuppliers(JSON.parse(storedSuppliers));

      const storedSales = localStorage.getItem(STORAGE_KEYS.SALES);
      if (storedSales) setSalesOrders(JSON.parse(storedSales));

      const storedPurchases = localStorage.getItem(STORAGE_KEYS.PURCHASES);
      if (storedPurchases) setPurchaseOrders(JSON.parse(storedPurchases));

      const storedHistory = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (storedHistory) setStockHistory(JSON.parse(storedHistory));

      const storedTransfers = localStorage.getItem(STORAGE_KEYS.TRANSFERS);
      if (storedTransfers) setTransfers(JSON.parse(storedTransfers));
    } catch (err) {
      console.error("Error reading localStorage:", err);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
      localStorage.setItem(STORAGE_KEYS.GODOWNS, JSON.stringify(godowns));
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
      localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(suppliers));
      localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(salesOrders));
      localStorage.setItem(STORAGE_KEYS.PURCHASES, JSON.stringify(purchaseOrders));
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(stockHistory));
      localStorage.setItem(STORAGE_KEYS.TRANSFERS, JSON.stringify(transfers));
    } catch (err) {
      console.error("Error writing localStorage:", err);
    }
  }, [items, godowns, customers, suppliers, salesOrders, purchaseOrders, stockHistory, transfers, isLoaded]);

  const notify = (type: "success" | "error" | "info" | "warning", title: string, description?: string) => {
    const newToast: ToastMessage = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      title,
      description,
      timestamp: Date.now(),
    };
    setToasts((prev) => [newToast, ...prev].slice(0, 5));

    setTimeout(() => {
      dismissToast(newToast.id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Connected Workflow: Add Sales Order (reduces stock, logs history, updates alerts)
  const addSalesOrder = (orderData: Omit<SalesOrder, "id" | "invoiceNumber">) => {
    // 1. Stock validation check
    for (const orderItem of orderData.items) {
      const liveItem = items.find((i) => i.id === orderItem.itemId);
      if (!liveItem) {
        notify("error", "Item not found", `Product "${orderItem.itemName}" does not exist in inventory.`);
        return { success: false, error: `Product "${orderItem.itemName}" not found.` };
      }
      if (liveItem.currentStock < orderItem.quantity) {
        notify(
          "error",
          "Insufficient Stock",
          `Only ${liveItem.currentStock} units of "${liveItem.name}" available. Requested: ${orderItem.quantity}.`
        );
        return {
          success: false,
          error: `Insufficient stock for ${liveItem.name}. Available: ${liveItem.currentStock}.`,
        };
      }
    }

    const orderId = `so-${Date.now()}`;
    const invoiceNumber = `INV-2026-${String(salesOrders.length + 84).padStart(3, "0")}`;
    const newOrder: SalesOrder = {
      ...orderData,
      id: orderId,
      invoiceNumber,
    };

    const newHistoryEntries: StockHistoryEntry[] = [];
    const updatedItems = items.map((item) => {
      const match = orderData.items.find((oi) => oi.itemId === item.id);
      if (!match) return item;

      const newStock = Math.max(0, item.currentStock - match.quantity);
      const newStatus = calculateItemStatus(newStock, item.minStockLevel);
      const godown = godowns.find((g) => g.id === item.godownId);

      newHistoryEntries.push({
        id: `hist-${Date.now()}-${match.itemId}`,
        timestamp: new Date().toISOString(),
        itemId: item.id,
        itemName: item.name,
        sku: item.sku,
        changeType: "sale_fulfilled",
        quantityDelta: -match.quantity,
        resultingStock: newStock,
        referenceId: invoiceNumber,
        godownName: godown ? godown.name : "Warehouse",
        notes: `Sale dispatched for invoice #${invoiceNumber} (${orderData.customerCompany})`,
      });

      return {
        ...item,
        currentStock: newStock,
        status: newStatus,
        lastUpdated: new Date().toISOString(),
      };
    });

    setItems(updatedItems);
    setSalesOrders((prev) => [newOrder, ...prev]);
    setStockHistory((prev) => [...newHistoryEntries, ...prev]);

    notify(
      "success",
      `Invoice #${invoiceNumber} Created`,
      `Stock reduced for ${orderData.items.length} product(s). Connected to inventory.`
    );

    return { success: true, orderId };
  };

  const updateSalesStatus = (orderId: string, status: SalesStatus) => {
    setSalesOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status } : order))
    );
    notify("info", "Sales Order Updated", `Order status updated to ${status.toUpperCase()}.`);
  };

  const updatePaymentStatus = (orderId: string, paymentStatus: PaymentStatus) => {
    setSalesOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, paymentStatus } : order))
    );
    notify("info", "Payment Status Updated", `Payment marked as ${paymentStatus.toUpperCase()}.`);
  };

  // Connected Workflow: Add Purchase Order
  const addPurchaseOrder = (poData: Omit<PurchaseOrder, "id" | "poNumber">) => {
    const poId = `po-${Date.now()}`;
    const poNumber = `PO-2026-${String(purchaseOrders.length + 104).padStart(3, "0")}`;

    const isImmediatelyReceived = poData.status === "received";
    const newPO: PurchaseOrder = {
      ...poData,
      id: poId,
      poNumber,
      receivedDate: isImmediatelyReceived ? new Date().toISOString() : undefined,
    };

    if (isImmediatelyReceived) {
      const newHistoryEntries: StockHistoryEntry[] = [];
      const updatedItems = items.map((item) => {
        const match = poData.items.find((pi) => pi.itemId === item.id);
        if (!match) return item;

        const newStock = item.currentStock + match.quantity;
        const newStatus = calculateItemStatus(newStock, item.minStockLevel);
        const godown = godowns.find((g) => g.id === (poData.godownId || item.godownId));

        newHistoryEntries.push({
          id: `hist-${Date.now()}-${match.itemId}`,
          timestamp: new Date().toISOString(),
          itemId: item.id,
          itemName: item.name,
          sku: item.sku,
          changeType: "purchase_received",
          quantityDelta: match.quantity,
          resultingStock: newStock,
          referenceId: poNumber,
          godownName: godown ? godown.name : "Warehouse",
          notes: `Purchase received & verified via PO #${poNumber} (${poData.supplierCompany})`,
        });

        return {
          ...item,
          currentStock: newStock,
          status: newStatus,
          lastUpdated: new Date().toISOString(),
        };
      });

      setItems(updatedItems);
      setStockHistory((prev) => [...newHistoryEntries, ...prev]);
    }

    setPurchaseOrders((prev) => [newPO, ...prev]);

    notify(
      "success",
      `PO #${poNumber} Created`,
      isImmediatelyReceived
        ? `Stock automatically incremented for ${poData.items.length} items.`
        : `Purchase order placed with ${poData.supplierCompany}. Awaiting delivery.`
    );

    return { success: true, poId };
  };

  // Connected Workflow: Receive Purchase Order (increases stock and logs audit trail)
  const receivePurchaseOrder = (poId: string) => {
    const targetPO = purchaseOrders.find((p) => p.id === poId);
    if (!targetPO) {
      notify("error", "PO Not Found", "Purchase order could not be located.");
      return { success: false, error: "PO not found." };
    }
    if (targetPO.status === "received") {
      notify("info", "Already Received", `PO #${targetPO.poNumber} has already been received.`);
      return { success: true };
    }

    const nowIso = new Date().toISOString();
    const newHistoryEntries: StockHistoryEntry[] = [];
    const destinationGodown = godowns.find((g) => g.id === targetPO.godownId);

    const updatedItems = items.map((item) => {
      const match = targetPO.items.find((pi) => pi.itemId === item.id);
      if (!match) return item;

      const newStock = item.currentStock + match.quantity;
      const newStatus = calculateItemStatus(newStock, item.minStockLevel);

      newHistoryEntries.push({
        id: `hist-${Date.now()}-${match.itemId}`,
        timestamp: nowIso,
        itemId: item.id,
        itemName: item.name,
        sku: item.sku,
        changeType: "purchase_received",
        quantityDelta: match.quantity,
        resultingStock: newStock,
        referenceId: targetPO.poNumber,
        godownName: destinationGodown ? destinationGodown.name : "Warehouse",
        notes: `PO #${targetPO.poNumber} received. Stock added to ${destinationGodown?.name || "inventory"}.`,
      });

      return {
        ...item,
        currentStock: newStock,
        status: newStatus,
        lastUpdated: nowIso,
      };
    });

    setItems(updatedItems);
    setPurchaseOrders((prev) =>
      prev.map((po) =>
        po.id === poId ? { ...po, status: "received", receivedDate: nowIso } : po
      )
    );
    setStockHistory((prev) => [...newHistoryEntries, ...prev]);

    notify(
      "success",
      `Stock Updated! PO #${targetPO.poNumber} Received`,
      `Added ${targetPO.items.reduce((acc, i) => acc + i.quantity, 0)} units into stock ledger.`
    );

    return { success: true };
  };

  const updatePurchaseStatus = (poId: string, status: PurchaseStatus) => {
    if (status === "received") {
      receivePurchaseOrder(poId);
      return;
    }
    setPurchaseOrders((prev) =>
      prev.map((po) => (po.id === poId ? { ...po, status } : po))
    );
    notify("info", "PO Status Changed", `PO status updated to ${status.toUpperCase()}.`);
  };

  // Stock CRUD & Manual Adjustment
  const addItem = (itemData: Omit<Item, "id" | "status" | "lastUpdated">) => {
    const id = `item-${Date.now()}`;
    const status = calculateItemStatus(itemData.currentStock, itemData.minStockLevel);
    const nowIso = new Date().toISOString();

    const newItem: Item = {
      ...itemData,
      id,
      status,
      lastUpdated: nowIso,
    };

    setItems((prev) => [newItem, ...prev]);

    if (itemData.currentStock > 0) {
      const godown = godowns.find((g) => g.id === itemData.godownId);
      const historyEntry: StockHistoryEntry = {
        id: `hist-${Date.now()}`,
        timestamp: nowIso,
        itemId: id,
        itemName: itemData.name,
        sku: itemData.sku,
        changeType: "initial_stock",
        quantityDelta: itemData.currentStock,
        resultingStock: itemData.currentStock,
        referenceId: `NEW-SKU-${itemData.sku}`,
        godownName: godown ? godown.name : "Central Godown",
        notes: `New item catalog creation with opening balance`,
      };
      setStockHistory((prev) => [historyEntry, ...prev]);
    }

    notify("success", "Item Added", `SKU ${itemData.sku} added to catalog.`);
  };

  const updateItem = (updatedItem: Item) => {
    const newStatus = calculateItemStatus(updatedItem.currentStock, updatedItem.minStockLevel);
    const itemWithStatus: Item = {
      ...updatedItem,
      status: newStatus,
      lastUpdated: new Date().toISOString(),
    };

    setItems((prev) => prev.map((item) => (item.id === updatedItem.id ? itemWithStatus : item)));
    notify("success", "Item Updated", `Changes saved for ${updatedItem.name}.`);
  };

  const deleteItem = (itemId: string) => {
    const item = items.find((i) => i.id === itemId);
    setItems((prev) => prev.filter((i) => i.id !== itemId));
    notify("info", "Item Removed", `Product ${item?.name || ""} removed from active catalog.`);
  };

  const adjustStock = (itemId: string, quantityDelta: number, reason: string) => {
    const targetItem = items.find((i) => i.id === itemId);
    if (!targetItem) return;

    const newStock = Math.max(0, targetItem.currentStock + quantityDelta);
    const newStatus = calculateItemStatus(newStock, targetItem.minStockLevel);
    const nowIso = new Date().toISOString();
    const godown = godowns.find((g) => g.id === targetItem.godownId);

    const historyEntry: StockHistoryEntry = {
      id: `hist-${Date.now()}`,
      timestamp: nowIso,
      itemId: targetItem.id,
      itemName: targetItem.name,
      sku: targetItem.sku,
      changeType: "manual_adjustment",
      quantityDelta,
      resultingStock: newStock,
      referenceId: `ADJ-${Date.now().toString().slice(-4)}`,
      godownName: godown ? godown.name : "Warehouse",
      notes: reason || "Manual cycle count adjustment",
    };

    setItems((prev) =>
      prev.map((i) =>
        i.id === itemId
          ? { ...i, currentStock: newStock, status: newStatus, lastUpdated: nowIso }
          : i
      )
    );
    setStockHistory((prev) => [historyEntry, ...prev]);

    notify(
      "success",
      "Stock Adjusted",
      `${targetItem.name}: ${quantityDelta > 0 ? "+" : ""}${quantityDelta} units. New balance: ${newStock}.`
    );
  };

  const transferStock = (data: {
    itemId: string;
    quantity: number;
    fromGodownId: string;
    toGodownId: string;
    notes?: string;
  }) => {
    const targetItem = items.find((i) => i.id === data.itemId);
    if (!targetItem) {
      notify("error", "Transfer Failed", "Selected item was not found.");
      return { success: false, error: "Item not found" };
    }

    if (data.fromGodownId === data.toGodownId) {
      notify("warning", "Invalid Transfer", "Source and destination godowns must be different.");
      return { success: false, error: "Source and destination cannot be identical" };
    }

    const fromGodown = godowns.find((g) => g.id === data.fromGodownId);
    const toGodown = godowns.find((g) => g.id === data.toGodownId);
    const transferNumber = `TR-2026-${String(transfers.length + 2).padStart(2, "0")}`;
    const nowIso = new Date().toISOString();

    const newTransfer: StockTransfer = {
      id: `tr-${Date.now()}`,
      transferNumber,
      date: nowIso,
      itemId: targetItem.id,
      itemName: targetItem.name,
      sku: targetItem.sku,
      quantity: data.quantity,
      fromGodownId: data.fromGodownId,
      fromGodownName: fromGodown?.name || "Origin Godown",
      toGodownId: data.toGodownId,
      toGodownName: toGodown?.name || "Destination Godown",
      status: "completed",
      notes: data.notes || "Inter-warehouse stock balancing",
    };

    const historyEntry: StockHistoryEntry = {
      id: `hist-${Date.now()}`,
      timestamp: nowIso,
      itemId: targetItem.id,
      itemName: targetItem.name,
      sku: targetItem.sku,
      changeType: "transfer_out",
      quantityDelta: 0, // Godown shift without altering total global inventory
      resultingStock: targetItem.currentStock,
      referenceId: transferNumber,
      godownName: `${fromGodown?.code || "SRC"} ➔ ${toGodown?.code || "DST"}`,
      notes: `Transfer of ${data.quantity} units from ${fromGodown?.name} to ${toGodown?.name}`,
    };

    setTransfers((prev) => [newTransfer, ...prev]);
    setStockHistory((prev) => [historyEntry, ...prev]);

    notify(
      "success",
      `Transfer ${transferNumber} Completed`,
      `Moved ${data.quantity} units to ${toGodown?.name}.`
    );

    return { success: true };
  };

  const addCustomer = (customerData: Omit<Customer, "id">) => {
    const newCust: Customer = {
      ...customerData,
      id: `cust-${Date.now()}`,
    };
    setCustomers((prev) => [newCust, ...prev]);
    notify("success", "Customer Added", `${newCust.name} (${newCust.company}) saved.`);
  };

  const addSupplier = (supplierData: Omit<Supplier, "id">) => {
    const newSup: Supplier = {
      ...supplierData,
      id: `sup-${Date.now()}`,
    };
    setSuppliers((prev) => [newSup, ...prev]);
    notify("success", "Supplier Added", `${newSup.company} saved to vendor list.`);
  };

  const addGodown = (godownData: Omit<Godown, "id">) => {
    const newGodown: Godown = {
      ...godownData,
      id: `godown-${Date.now()}`,
    };
    setGodowns((prev) => [newGodown, ...prev]);
    notify("success", "Godown Added", `Facility "${newGodown.name}" created.`);
  };

  const resetDemoData = () => {
    setItems(initialItems);
    setGodowns(initialGodowns);
    setCustomers(initialCustomers);
    setSuppliers(initialSuppliers);
    setSalesOrders(initialSalesOrders);
    setPurchaseOrders(initialPurchaseOrders);
    setStockHistory(initialStockHistory);
    setTransfers(initialTransfers);

    try {
      localStorage.removeItem(STORAGE_KEYS.ITEMS);
      localStorage.removeItem(STORAGE_KEYS.GODOWNS);
      localStorage.removeItem(STORAGE_KEYS.CUSTOMERS);
      localStorage.removeItem(STORAGE_KEYS.SUPPLIERS);
      localStorage.removeItem(STORAGE_KEYS.SALES);
      localStorage.removeItem(STORAGE_KEYS.PURCHASES);
      localStorage.removeItem(STORAGE_KEYS.HISTORY);
      localStorage.removeItem(STORAGE_KEYS.TRANSFERS);
    } catch (e) {
      console.error(e);
    }

    notify("info", "Demo State Reset", "Restored pristine enterprise sample dataset.");
  };

  return (
    <InventoryContext.Provider
      value={{
        isLoaded,
        items,
        godowns,
        customers,
        suppliers,
        salesOrders,
        purchaseOrders,
        stockHistory,
        transfers,
        toasts,
        addSalesOrder,
        updateSalesStatus,
        updatePaymentStatus,
        addPurchaseOrder,
        receivePurchaseOrder,
        updatePurchaseStatus,
        addItem,
        updateItem,
        deleteItem,
        adjustStock,
        transferStock,
        addCustomer,
        addSupplier,
        addGodown,
        resetDemoData,
        dismissToast,
        notify,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
}
