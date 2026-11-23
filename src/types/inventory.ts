export type ItemStatus = "in_stock" | "low_stock" | "out_of_stock";

export interface Item {
  id: string;
  sku: string;
  name: string;
  category: string;
  description: string;
  unit: string; // e.g. "pcs", "boxes", "sets"
  costPrice: number;
  sellingPrice: number;
  currentStock: number;
  minStockLevel: number;
  godownId: string;
  status: ItemStatus;
  lastUpdated: string;
}

export interface Godown {
  id: string;
  name: string;
  code: string;
  location: string;
  manager: string;
  capacityUnits: number;
  contactPhone: string;
}

export interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  city: string;
  gstNumber?: string;
}

export interface Supplier {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  city: string;
  leadTimeDays: number;
}

export interface OrderItem {
  itemId: string;
  itemName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export type SalesStatus = "pending" | "shipped" | "delivered" | "cancelled";
export type PaymentStatus = "paid" | "partial" | "unpaid";

export interface SalesOrder {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  customerCompany: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  status: SalesStatus;
  paymentStatus: PaymentStatus;
  godownId: string;
  notes?: string;
}

export type PurchaseStatus = "ordered" | "received" | "pending" | "cancelled";

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  supplierCompany: string;
  date: string;
  receivedDate?: string;
  items: OrderItem[];
  totalAmount: number;
  status: PurchaseStatus;
  godownId: string;
  notes?: string;
}

export type StockChangeType =
  | "purchase_received"
  | "sale_fulfilled"
  | "transfer_in"
  | "transfer_out"
  | "manual_adjustment"
  | "initial_stock";

export interface StockHistoryEntry {
  id: string;
  timestamp: string;
  itemId: string;
  itemName: string;
  sku: string;
  changeType: StockChangeType;
  quantityDelta: number; // + for incoming, - for outgoing
  resultingStock: number;
  referenceId: string; // PO number, Invoice number, or Adjustment ref
  godownName: string;
  notes: string;
}

export interface StockTransfer {
  id: string;
  transferNumber: string;
  date: string;
  itemId: string;
  itemName: string;
  sku: string;
  quantity: number;
  fromGodownId: string;
  fromGodownName: string;
  toGodownId: string;
  toGodownName: string;
  status: "completed" | "in_transit";
  notes?: string;
}
