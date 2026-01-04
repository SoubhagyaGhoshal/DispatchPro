# 📦 DispatchPro
### Precision Order Fulfillment System

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?style=for-the-badge)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)

**DispatchPro** is a modern, high-performance inventory dispatch implementation designed to enforce **100% accuracy** in order fulfillment. By integrating barcode verification directly into the dispatch workflow, it eliminates human error and ensures that every package leaves the warehouse exactly as ordered.

---

## ✨ Key Features

- **🛡 Zero-Error Policy**: The system physically blocks dispatch until every single item in the order is scanned and verified.
- **⚡ Real-Time Validation**: Instant feedback on scans.
    - ✅ **Success**: Visual green glow + audio cue (planned).
    - ❌ **Error**: Immediate "Shake" animation & alert for wrong items.
    - ⚠️ **Surplus Protection**: Prevents scanning more items than ordered.
- **🎨 Premium UX**: A "Dark Mode First" interface featuring glassmorphism, smooth micro-interactions, and the **Outfit** typeface for optimal readability.
- **📝 Audit Ledger**: Every scan (successful or failed) is logged with a timestamp for complete operational transparency.
- **📱 Responsive**: Works seamlessly on desktop terminals and handheld scanner interfaces.

---

## 🛠 Tech Stack

- **Frontend**: React 18 (Vite)
- **Styling**: Vanilla CSS Variables (Modern Design System)
- **Icons**: Lucide React
- **Data**: In-Memory Mock Store (Scalable to REST/GraphQL)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SoubhagyaGhoshal/DispatchPro.git
   cd DispatchPro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the Development Server**
   ```bash
   npm run dev
   ```

4. **Open the App**
   Navigate to `http://localhost:5173` in your browser.

---

## 📖 Usage Guide

1. **Dashboard**: automatically loads pending orders.
2. **Select Order**: Click any card (e.g., `ORD-2024-001`).
3. **Scan Items**: 
   - Focus is auto-set to the scanner input.
   - Use a handheld barcode scanner OR type the SKU manually.
   - **Test SKUs**:
     - `123456789012` (Wireless Mouse)
     - `987654321098` (Mechanical Keyboard)
     - `111222333444` (USB-C Hub)
4. **Dispatch**: Once all progress bars reach 100%, the **Dispatch Order** button unlocks.

---

## 💾 Database Schema

The project includes a production-ready SQL schema definition in `schema.sql` covering:
- `products` (SKU, barcode, meta)
- `orders` & `order_items`
- `dispatch_ledger` (audit trail)

---

## 🔮 Future Roadmap

- [ ] Backyard Database Integration (PostgreSQL/Supabase)
- [ ] Sound Effects API (Success/Error beeps)
- [ ] Multi-device WebSocket synchronisation
- [ ] PDF Label Generation upon Dispatch

---

Developed with ❤️ by **Soubhagya Ghoshal**
