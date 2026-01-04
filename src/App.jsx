import { useState, useRef, useEffect } from 'react';
import { Package, Scan, CheckCircle, AlertOctagon, ArrowLeft, History, Truck } from 'lucide-react';
import { PRODUCTS, MOCK_ORDERS } from './mockData';

// Sound effects (simulated with visual feedback for now, can add Audio later)
// const successSound = new Audio('/success.mp3'); 
// const errorSound = new Audio('/error.mp3');

function App() {
  const [view, setView] = useState('DASHBOARD'); // DASHBOARD | DISPATCH
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [scannedItems, setScannedItems] = useState({}); // { sku: qty }
  const [scanHistory, setScanHistory] = useState([]); // [{ barcode, time, status, sku }]
  const [lastScanStatus, setLastScanStatus] = useState(null); // 'SUCCESS' | 'ERROR' | 'SURPLUS'
  const [errorMessage, setErrorMessage] = useState('');

  const inputRef = useRef(null);

  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
    // Initialize scanned items from order (if resuming) or 0
    // For prototype, we reset every time or load from order.items.qty_scanned
    // Mapping current logic:
    const initialScans = {};
    order.items.forEach(item => {
      initialScans[item.sku] = item.qty_scanned || 0;
    });
    setScannedItems(initialScans);
    setScanHistory([]);
    setLastScanStatus(null);
    setErrorMessage('');
    setView('DISPATCH');
  };

  const handleBack = () => {
    setView('DASHBOARD');
    setSelectedOrder(null);
  };

  const handleScan = (e) => {
    e.preventDefault();
    const barcode = e.target.value.trim();
    if (!barcode) return;

    processScan(barcode);
    e.target.value = ''; // Clear input
  };

  const processScan = (barcode) => {
    // 1. Identify Product
    const product = PRODUCTS.find(p => p.barcode === barcode);

    if (!product) {
      setLastScanStatus('ERROR');
      setErrorMessage(`Unknown Barcode: ${barcode}`);
      addToHistory(barcode, 'INVALID_PRODUCT', null);
      return;
    }

    // 2. Check if product is in order
    const orderItem = selectedOrder.items.find(item => item.sku === product.sku);

    if (!orderItem) {
      setLastScanStatus('ERROR');
      setErrorMessage(`Item NOT in Order: ${product.name}`);
      addToHistory(barcode, 'INVALID_ITEM_FOR_ORDER', product.sku);
      return;
    }

    // 3. Check Quantity
    const currentScanned = scannedItems[product.sku] || 0;
    if (currentScanned >= orderItem.qty_required) {
      setLastScanStatus('SURPLUS');
      setErrorMessage(`Already Fullfilled: ${product.name}`);
      addToHistory(barcode, 'SURPLUS_SCAN', product.sku);
      return;
    }

    // 4. Success
    setScannedItems(prev => ({
      ...prev,
      [product.sku]: currentScanned + 1
    }));
    setLastScanStatus('SUCCESS');
    setErrorMessage('');
    addToHistory(barcode, 'SUCCESS', product.sku);
  };

  const addToHistory = (barcode, status, sku) => {
    setScanHistory(prev => [{
      id: Date.now(),
      time: new Date().toLocaleTimeString(),
      barcode,
      status,
      sku
    }, ...prev]);
  };

  const isOrderComplete = () => {
    if (!selectedOrder) return false;
    return selectedOrder.items.every(item => {
      const scanned = scannedItems[item.sku] || 0;
      return scanned === item.qty_required;
    });
  };

  const handleDispatch = () => {
    alert(`Order ${selectedOrder.order_id} Dispatched Successfully! \n Audit Log generated.`);
    // In real app: call API
    setView('DASHBOARD');
  };

  // Focus input on load and click
  useEffect(() => {
    if (view === 'DISPATCH' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [view, lastScanStatus]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="flex-between" style={{
        padding: '1.25rem 2rem',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'rgba(9, 9, 11, 0.8)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div className="flex-center" style={{ gap: '1rem' }}>
          <div className="flex-center" style={{
            padding: '0.6rem',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)',
            borderRadius: '12px',
            boxShadow: '0 4px 12px var(--primary-glow)'
          }}>
            <Package size={24} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', marginBottom: -4 }}>DispatchPro</h1>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>ORDER FULFILLMENT</div>
          </div>
        </div>
        <div className="flex-center" style={{ gap: '1.5rem' }}>
          <div className="flex-center" style={{ gap: '0.5rem', padding: '0.5rem 1rem', background: 'var(--bg-input)', borderRadius: '99px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ width: 8, height: 8, background: 'var(--success)', borderRadius: '50%', boxShadow: '0 0 10px var(--success)' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>ONLINE</span>
          </div>
        </div>
      </header>

      <main className="container animate-in" style={{ flex: 1, paddingTop: '2rem' }}>
        {view === 'DASHBOARD' && (
          <div>
            <div className="flex-between" style={{ marginBottom: '2rem' }}>
              <h2>Pending Orders</h2>
              <div className="btn-icon"><Scan size={20} /></div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {MOCK_ORDERS.map(order => (
                <div key={order.order_id} className="card card-interactive" onClick={() => handleSelectOrder(order)}>
                  <div className="flex-between" style={{ marginBottom: '1.25rem' }}>
                    <span style={{ fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.05em' }}>{order.order_id}</span>
                    <span className={`badge ${order.status === 'DISPATCHED' ? 'badge-success' : 'badge-pending'}`}>
                      {order.status}
                    </span>
                  </div>
                  <h3 style={{ marginBottom: '0.75rem' }}>{order.customer_name}</h3>
                  <div className="flex-between" style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      {order.items.length} Items
                    </div>
                    <ArrowLeft size={16} style={{ transform: 'rotate(180deg)', opacity: 0.5 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'DISPATCH' && selectedOrder && (
          <div style={{ height: 'calc(100vh - 140px)', display: 'grid', gridTemplateRows: 'auto 1fr', gap: '1.5rem' }}>
            {/* Toolbar */}
            <div className="flex-center" style={{ justifyContent: 'flex-start', gap: '1rem' }}>
              <button onClick={handleBack} className="btn-icon" style={{ cursor: 'pointer' }}>
                <ArrowLeft size={22} />
              </button>
              <div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{selectedOrder.customer_name}</h2>
                <span style={{ color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{selectedOrder.order_id}</span>
              </div>
            </div>

            {/* Main Split */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '2rem', height: '100%', minHeight: 0 }}>

              {/* Left: Scanning & List */}
              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0', padding: 0, overflow: 'hidden' }}>

                {/* Scanner Input Area */}
                <div
                  className={`scanner-zone ${lastScanStatus === 'SUCCESS' ? 'success' : lastScanStatus === 'ERROR' || lastScanStatus === 'SURPLUS' ? 'error' : ''}`}
                  style={{
                    margin: '1.5rem',
                    padding: '2.5rem',
                    textAlign: 'center',
                    cursor: 'text'
                  }}
                  onClick={() => inputRef.current?.focus()}
                >
                  <div style={{ marginBottom: '1rem', display: 'inline-flex', padding: '1rem', background: 'var(--bg-input)', borderRadius: '50%' }}>
                    <Scan size={32} color="var(--primary)" />
                  </div>
                  <h3 style={{ marginBottom: '0.5rem' }}>Scan Barcode</h3>
                  <p className="text-muted" style={{ marginBottom: '1.5rem', fontSize: '0.95rem' }}>Focus here to scan or type SKU</p>

                  {errorMessage && (
                    <div className="animate-shake" style={{ color: 'var(--error)', fontWeight: 'bold', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <AlertOctagon size={20} />
                      {errorMessage}
                    </div>
                  )}
                  {lastScanStatus === 'SUCCESS' && (
                    <div className="animate-in" style={{ color: 'var(--success)', fontWeight: 'bold', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <CheckCircle size={20} />
                      Item Verified!
                    </div>
                  )}

                  <input
                    ref={inputRef}
                    type="text"
                    onKeyDown={(e) => e.key === 'Enter' && handleScan(e)}
                    style={{
                      position: 'absolute',
                      opacity: 0,
                      top: 0, left: 0, width: '100%', height: '100%',
                      cursor: 'text'
                    }}
                    autoFocus
                  />
                </div>

                {/* Items List */}
                <div style={{ flex: 1, overflowY: 'auto', borderTop: '1px solid var(--border-subtle)' }}>
                  <table className="w-full" style={{ borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th className="table-header" style={{ padding: '1rem 1.5rem', textAlign: 'left' }}>Product</th>
                        <th className="table-header" style={{ padding: '1rem', textAlign: 'left' }}>SKU</th>
                        <th className="table-header" style={{ padding: '1rem', textAlign: 'center' }}>Qty</th>
                        <th className="table-header" style={{ padding: '1rem', textAlign: 'right' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map(item => {
                        const product = PRODUCTS.find(p => p.sku === item.sku);
                        const scanned = scannedItems[item.sku] || 0;
                        const isComplete = scanned === item.qty_required;

                        return (
                          <tr key={item.sku} className={`table-row ${isComplete ? 'table-row-complete' : ''}`}>
                            <td style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                              <div style={{
                                width: 48, height: 48, borderRadius: 8, overflow: 'hidden',
                                background: 'var(--bg-input)', border: '1px solid var(--border-subtle)'
                              }}>
                                <img src={product?.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              </div>
                              <div>
                                <div style={{ fontWeight: '500', marginBottom: 2 }}>{product?.name}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{product?.barcode}</div>
                              </div>
                            </td>
                            <td style={{ padding: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>{item.sku}</td>
                            <td style={{ padding: '1rem', textAlign: 'center' }}>
                              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: isComplete ? 'var(--success)' : 'white' }}>
                                {scanned}
                              </span>
                              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}> / {item.qty_required}</span>
                            </td>
                            <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                              {isComplete ? (
                                <div className="flex-center" style={{ color: 'var(--success)', display: 'inline-flex' }}>
                                  <CheckCircle size={20} />
                                </div>
                              ) : (
                                <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid var(--border-subtle)', display: 'inline-block' }} />
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right: Actions & Log */}
              <div className="flex-col" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* Action Card */}
                <div className="card">
                  <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Dispatch Controls</h3>

                  <div style={{ marginBottom: '2rem' }}>
                    <div className="flex-between" style={{ marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                      <span className="text-muted">Completion</span>
                      <span className="font-bold">
                        {Math.round(
                          (Object.values(scannedItems).reduce((a, b) => a + b, 0) /
                            selectedOrder.items.reduce((a, b) => a + b.qty_required, 0)) * 100
                        )}%
                      </span>
                    </div>
                    <div style={{ width: '100%', height: 6, background: 'var(--bg-input)', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        background: 'linear-gradient(90deg, var(--primary), var(--success))',
                        width: `${(Object.values(scannedItems).reduce((a, b) => a + b, 0) / selectedOrder.items.reduce((a, b) => a + b.qty_required, 0)) * 100}%`,
                        transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: '0 0 10px var(--primary-glow)'
                      }} />
                    </div>
                  </div>

                  <button
                    className="btn btn-primary w-full"
                    disabled={!isOrderComplete()}
                    onClick={handleDispatch}
                    style={{ height: '3.5rem', fontSize: '1.1rem' }}
                  >
                    {!isOrderComplete() ? (
                      <>Scan All Items</>
                    ) : (
                      <><Truck style={{ marginRight: '10px' }} size={20} /> Dispatch Order</>
                    )}
                  </button>
                </div>

                {/* Audit Log */}
                <div className="card" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: 0 }}>
                  <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.2)' }}>
                    <div className="flex-center" style={{ justifyContent: 'flex-start', gap: '0.75rem' }}>
                      <History size={16} color="var(--text-secondary)" />
                      <h4 style={{ fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Audit Log</h4>
                    </div>
                  </div>

                  <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem' }}>
                    {scanHistory.map(entry => (
                      <div key={entry.id} className="animate-in" style={{
                        padding: '0.75rem 1rem',
                        fontSize: '0.9rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 4,
                        borderRadius: 8,
                        background: entry.status === 'SUCCESS' ? 'rgba(16, 185, 129, 0.05)' : entry.status.includes('INVALID') ? 'rgba(239, 68, 68, 0.05)' : 'transparent'
                      }}>
                        <div>
                          <div style={{ fontWeight: 600, color: entry.status === 'SUCCESS' ? 'var(--success)' : 'var(--error)' }}>
                            {entry.status === 'SUCCESS' ? 'Verified' : 'Rejected'}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                            {entry.barcode}
                          </div>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          {entry.time}
                        </div>
                      </div>
                    ))}
                    {scanHistory.length === 0 && (
                      <div className="flex-center" style={{ height: '100%', color: 'var(--text-muted)', fontSize: '0.9rem', flexDirection: 'column', gap: '1rem', opacity: 0.5 }}>
                        <div style={{ width: 40, height: 2, background: 'var(--border-subtle)' }} />
                        No activity yet
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
