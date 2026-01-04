export const PRODUCTS = [
  {
    sku: 'SKU-001',
    barcode: '123456789012',
    name: 'Wireless Ergonomic Mouse',
    description: 'Precision optical sensor, 2.4GHz wireless.',
    image: 'https://placehold.co/100x100/3b82f6/white?text=Mouse'
  },
  {
    sku: 'SKU-002',
    barcode: '987654321098',
    name: 'Mechanical Keyboard (Blue Switch)',
    description: 'RGB Backlit, Tactile Clicky Switches.',
    image: 'https://placehold.co/100x100/10b981/white?text=Keyboard'
  },
  {
    sku: 'SKU-003',
    barcode: '456123789012',
    name: '27-inch 4K Monitor',
    description: 'IPS Panel, 144Hz Refresh Rate.',
    image: 'https://placehold.co/100x100/f59e0b/white?text=Monitor'
  },
  {
    sku: 'SKU-004',
    barcode: '111222333444',
    name: 'USB-C Hub Multiport Adapter',
    description: 'HDMI, 3x USB 3.0, SD Card Reader.',
    image: 'https://placehold.co/100x100/ef4444/white?text=Hub'
  },
  {
    sku: 'SKU-005',
    barcode: '555666777888',
    name: 'Noise Cancelling Headphones',
    description: 'Over-ear, 30h battery life.',
    image: 'https://placehold.co/100x100/8b5cf6/white?text=Headphones'
  }
];

export const MOCK_ORDERS = [
  {
    order_id: 'ORD-2024-001',
    customer_name: 'Alice Johnson',
    status: 'PENDING',
    items: [
      { sku: 'SKU-001', qty_required: 2, qty_scanned: 0 },
      { sku: 'SKU-004', qty_required: 1, qty_scanned: 0 }
    ]
  },
  {
    order_id: 'ORD-2024-002',
    customer_name: 'Bob Smith',
    status: 'PENDING',
    items: [
      { sku: 'SKU-002', qty_required: 1, qty_scanned: 0 },
      { sku: 'SKU-003', qty_required: 1, qty_scanned: 0 },
      { sku: 'SKU-005', qty_required: 1, qty_scanned: 0 }
    ]
  },
  {
    order_id: 'ORD-2024-003',
    customer_name: 'Charlie Brown',
    status: 'DISPATCHED',
    items: [
      { sku: 'SKU-001', qty_required: 5, qty_scanned: 5 }
    ]
  }
];
