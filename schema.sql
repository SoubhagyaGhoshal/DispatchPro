-- Database Schema for Dispatch Scanning Feature

CREATE TABLE IF NOT EXISTS products (
    sku VARCHAR(50) PRIMARY KEY,
    barcode VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT
);

CREATE TABLE IF NOT EXISTS orders (
    order_id VARCHAR(50) PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, PARTIALLY_DISPATCHED, DISPATCHED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(50) REFERENCES orders(order_id),
    sku VARCHAR(50) REFERENCES products(sku),
    qty_required INT NOT NULL CHECK (qty_required > 0),
    qty_scanned INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'PENDING' -- PENDING, FULFILLED
);

-- Dispatch Ledger for Auditing
CREATE TABLE IF NOT EXISTS dispatch_ledger (
    scan_id SERIAL PRIMARY KEY,
    order_id VARCHAR(50) REFERENCES orders(order_id),
    sku VARCHAR(50) REFERENCES products(sku),
    barcode VARCHAR(100) NOT NULL,
    scanned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL, -- SUCCESS, INVALID_ITEM, SURPLUS
    device_id VARCHAR(50), -- Optional: to track which scanner/device was used
    user_id VARCHAR(50)    -- Optional: to track who scanned
);

-- Indexes for performance
CREATE INDEX idx_products_barcode ON products(barcode);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_dispatch_ledger_order_id ON dispatch_ledger(order_id);
