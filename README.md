# InventoCore — Enterprise Inventory & Supply Chain Management System
### Built for SasthaSoft Technical Evaluation

> **Live Demo**: [Deploy to Vercel in 1-Click](https://vercel.com)  
> **Author**: Khushi ([Portfolio](https://www.myselfkhushi.dev/))  
> **Tech Stack**: Next.js 16 (App Router), TypeScript, Tailwind CSS, Lucide Icons  

---

## 🚀 Overview

**InventoCore** is a modern, reactive inventory management web application built to enterprise standards. Inspired by the design systems of Linear, Stripe, and Vercel, it combines clean data density with intuitive workflows, real-time threshold monitoring, and a fully connected operational state engine.

---

## ⚡ Connected Core Workflows

The application features a tightly coupled data loop where every transaction has immediate, ripple effects across the entire platform:

1. **Procurement & Stock Receiving (Stock IN)**:
   - When a Purchase Order (`PO`) is created as "Received" or updated via the 1-click **"Receive & Restock"** button, the system automatically increments the physical quantities of all line items.
   - Automatically logs an immutable `purchase_received` audit entry with reference ID, timestamp, and facility tag.
   - Immediately recalculates inventory asset valuation on the Executive Dashboard.

2. **Sales Invoicing & Stock Depletion (Stock OUT)**:
   - Placing a Sales Order validates real-time on-hand stock limits before submission.
   - Upon confirmation, stock balances are decremented immediately.
   - An immutable `sale_fulfilled` entry is appended to the audit ledger.
   - If stock drops to or below the safety threshold, a **Critical Low Stock Warning** is triggered across the Dashboard and Sidebar.

3. **Multi-Facility & Inter-Godown Transfers**:
   - Supports decentralized inventory stationed across **Central Hub Mumbai**, **North Depot Delhi**, and **South Terminal Bengaluru**.
   - The **Inter-Godown Transfer** workflow relocates physical units between hubs with origin and destination tracking.

4. **Dynamic Reporting & Instant CSV Export**:
   - Live valuation and margin analysis across categories.
   - One-click export of structured `.csv` files for Stock Valuation, Sales Invoices, and Purchase Orders.

---

## 📦 Modules Included

| Module | Features & Capabilities |
| :--- | :--- |
| **1. Executive Dashboard** | Total inventory valuation, active SKU count, procurement spend, low-stock alerts with 1-click **Quick Reorder PO**, pending shipment intake queue, and recent audit activity feed. |
| **2. Sales & Invoices** | Invoice ledger, multi-item order creation with stock validation, GST tax calculation, fulfillment & payment status tags, and printable/save-to-PDF invoice modal. |
| **3. Purchase Orders** | Vendor procurement orders, lead time tracking, multi-warehouse destination assignment, and 1-click **Receive & Restock** action. |
| **4. Stock & Catalog** | **Catalog View**: SKU master table, threshold monitors, profit margin % calculation, manual stock cycle-count adjustment modal (+/-).<br>**Audit Ledger View**: Chronological ledger of all inventory transactions. |
| **5. Analytics & Reports** | Stock Valuation breakdown by category, Sales performance (revenue, AOV, top-selling items), and Purchase spend by vendor with CSV data exports. |
| **6. Regional Godowns** | Warehouse facility capacities, utilization progress meters, and inter-facility stock transfers. |
| **7. Clients & Vendors** | Corporate client profiles (GSTIN, contact info) and supplier directory with lead times. |

---

## 🎨 UI/UX Features & Enterprise Polish

- **Keyboard-First Command Palette**: Press `Ctrl + K` (or `Cmd + K`) anywhere to open a spotlight search for quick actions, instant SKU lookup, and module navigation.
- **Micro-Interactions & Notifications**: Non-intrusive floating toast notifications with contextual icons for every state update.
- **Theme Engine**: Support for crisp Light Mode and high-contrast Enterprise Dark Mode with `localStorage` persistence.
- **Demo State Reset**: 1-click button to reset the app back to a clean, realistic seed dataset at any time.
- **Fully Responsive**: Adaptive layouts optimized for desktop widescreen, tablets (with slide-over drawer navigation), and mobile devices.

---

## 🛠️ Getting Started Locally

### Prerequisites
- Node.js (v18+ or v20+)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <your-repo-link>
cd sasthasoft-inventory

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to explore the application.

### Production Build
```bash
npm run build
npm run start
```

---

## 📁 Project Architecture

```
sasthasoft-inventory/
├── src/
│   ├── app/
│   │   ├── globals.css         # Theme tokens and Tailwind imports
│   │   ├── layout.tsx          # Root layout with Provider & metadata
│   │   └── page.tsx            # Main shell & modal orchestration
│   ├── components/
│   │   ├── common/             # ToastContainer, CommandPalette
│   │   ├── layout/             # Sidebar, TopBar navigation
│   │   ├── modals/             # CreateSale, CreatePO, AddItem, AdjustStock, TransferStock, InvoiceView
│   │   └── views/              # Dashboard, Sales, Purchase, Stock, Reports, Godowns, Contacts
│   ├── context/
│   │   └── InventoryContext.tsx # Centralized reactive state engine & localStorage sync
│   ├── data/
│   │   └── seedData.ts         # Enterprise electronics distributor seed dataset
│   ├── lib/
│   │   └── utils.ts            # Formatting utilities (currency, dates, cn)
│   └── types/
│       └── inventory.ts        # Strongly typed TypeScript domain models
├── public/                     # Static assets
├── package.json
└── README.md
```

---

*Designed & developed by [Khushi](https://www.myselfkhushi.dev/) for SasthaSoft Technical Review.*
