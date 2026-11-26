import React, { useState } from 'react';
import styles from './ReduxVsRTKMastery.module.css';

const SAMPLE_PRODUCTS = [
  { id: 1, name: 'Mechanical Keyboard', price: 120 },
  { id: 2, name: 'Wireless Gaming Mouse', price: 65 },
  { id: 3, name: '4K IPS Monitor', price: 380 },
  { id: 4, name: 'Noise-Cancelling Headphones', price: 190 }
];

export default function ReduxVsRTKMastery() {
  const [activeTab, setActiveTab] = useState('demo');

  // Simulated Redux Store State
  const [cartState, setCartState] = useState({
    items: [{ id: 1, name: 'Mechanical Keyboard', price: 120, qty: 1 }],
    total: 120
  });

  // Action History Log (Simulating Redux DevTools)
  const [actionHistory, setActionHistory] = useState([
    { type: '@@INIT', time: '10:00:00' },
    { type: 'cart/addItem', payload: { id: 1, name: 'Mechanical Keyboard', price: 120 }, time: '10:00:01' }
  ]);

  // Redux Toolkit Style Actions
  const dispatchAction = (type, payload) => {
    const time = new Date().toLocaleTimeString();
    setActionHistory((prev) => [...prev, { type, payload, time }]);

    if (type === 'cart/addItem') {
      const existing = cartState.items.find((i) => i.id === payload.id);
      let updatedItems;
      if (existing) {
        updatedItems = cartState.items.map((i) =>
          i.id === payload.id ? { ...i, qty: i.qty + 1 } : i
        );
      } else {
        updatedItems = [...cartState.items, { ...payload, qty: 1 }];
      }
      setCartState({
        items: updatedItems,
        total: cartState.total + payload.price
      });
    } else if (type === 'cart/removeItem') {
      const target = cartState.items.find((i) => i.id === payload);
      if (target) {
        setCartState({
          items: cartState.items.filter((i) => i.id !== payload),
          total: cartState.total - target.price * target.qty
        });
      }
    } else if (type === 'cart/clearCart') {
      setCartState({ items: [], total: 0 });
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Day 30: Redux vs Redux Toolkit (RTK) Mastery</h1>
          <p className={styles.subtitle}>
            Interactive Store Dispatcher, Immer.js Mutation Engine, and Architectural Comparison
          </p>
        </div>
        {/* Redux Logo SVG */}
        <svg className={styles.reduxIcon} viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="45" stroke="#764abc" strokeWidth="6"/>
          <path d="M50 25 C63 25 75 37 75 50 C75 63 63 75 50 75 C37 75 25 63 25 50 Z" stroke="#c084fc" strokeWidth="5"/>
        </svg>
      </header>

      <nav className={styles.tabs}>
        <button
          className={`${styles.tabBtn} ${activeTab === 'demo' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('demo')}
        >
          Interactive RTK Store & DevTools
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'comparison' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('comparison')}
        >
          Side-by-Side Code Comparison
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'matrix' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('matrix')}
        >
          Architecture Comparison Matrix
        </button>
      </nav>

      {/* TAB 1: INTERACTIVE DEMO */}
      {activeTab === 'demo' && (
        <section className={styles.panel}>
          <h3>Simulated Redux Toolkit Cart Slice</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Actions dispatched below mutate state via Immer draft proxies and stream to the simulated DevTools timeline.
          </p>

          <h4 style={{ margin: '16px 0 8px 0', color: '#a78bfa' }}>Product Catalog</h4>
          <div className={styles.catalogGrid}>
            {SAMPLE_PRODUCTS.map((prod) => (
              <div key={prod.id} className={styles.productCard}>
                <div>
                  <strong>{prod.name}</strong>
                  <div style={{ color: '#38bdf8', fontSize: '0.9rem', marginTop: '4px' }}>
                    ${prod.price}
                  </div>
                </div>
                <button
                  onClick={() => dispatchAction('cart/addItem', prod)}
                  className={styles.button}
                  style={{ marginTop: '10px' }}
                >
                  + dispatch(addItem)
                </button>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', marginBottom: '8px' }}>
            <h4 style={{ margin: 0, color: '#34d399' }}>Shopping Cart ({cartState.items.length} items)</h4>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#f8fafc' }}>
              Total: ${cartState.total}
            </div>
          </div>

          <div className={styles.cartList}>
            {cartState.items.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '16px' }}>
                Cart is currently empty. Dispatch an action above!
              </div>
            ) : (
              cartState.items.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  <div>
                    <strong>{item.name}</strong> (${item.price} x {item.qty})
                  </div>
                  <button
                    onClick={() => dispatchAction('cart/removeItem', item.id)}
                    className={`${styles.button} ${styles.dangerBtn}`}
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <button
              onClick={() => dispatchAction('cart/clearCart')}
              disabled={cartState.items.length === 0}
              className={`${styles.button} ${styles.dangerBtn}`}
            >
              dispatch(clearCart)
            </button>
          </div>

          {/* Redux DevTools Simulator */}
          <h4 style={{ margin: '16px 0 8px 0', color: '#c084fc' }}>Redux DevTools Action Stream</h4>
          <div className={styles.actionLogList}>
            {actionHistory.map((act, index) => (
              <div key={index} style={{ marginBottom: '4px' }}>
                <span style={{ color: '#94a3b8' }}>[{act.time}]</span>{' '}
                <strong style={{ color: '#38bdf8' }}>{act.type}</strong>{' '}
                {act.payload && (
                  <span style={{ color: '#fbbf24' }}>
                    ➔ {JSON.stringify(act.payload)}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 2: CODE COMPARISON */}
      {activeTab === 'comparison' && (
        <section className={styles.panel}>
          <h3>Side-by-Side: Legacy Redux vs Modern Redux Toolkit</h3>
          <div className={styles.codeCompareGrid}>
            <div>
              <h4 style={{ color: '#f87171' }}>Legacy (Vanilla) Redux</h4>
              <pre className={styles.codeBox}>
{`// 1. Action Types
const ADD_ITEM = 'cart/ADD_ITEM';

// 2. Action Creators
const addItem = (item) => ({
  type: ADD_ITEM,
  payload: item
});

// 3. Reducer with deep spread
function cartReducer(state = { items: [] }, action) {
  switch (action.type) {
    case ADD_ITEM:
      return {
        ...state,
        items: [...state.items, action.payload]
      };
    default:
      return state;
  }
}`}
              </pre>
            </div>

            <div>
              <h4 style={{ color: '#34d399' }}>Redux Toolkit (createSlice)</h4>
              <pre className={styles.codeBox}>
{`import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] },
  reducers: {
    // Immer allows direct mutations!
    addItem(state, action) {
      state.items.push(action.payload);
    }
  }
});

// Auto-generated actions & reducer
export const { addItem } = cartSlice.actions;
export default cartSlice.reducer;`}
              </pre>
            </div>
          </div>
        </section>
      )}

      {/* TAB 3: MATRIX */}
      {activeTab === 'matrix' && (
        <section className={styles.panel}>
          <h3>Architectural Comparison Matrix</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Feature</th>
                <th>Legacy Redux</th>
                <th>Redux Toolkit (RTK)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Action Creators & Types</strong></td>
                <td>Written manually across multiple files</td>
                <td>Generated automatically by <code>createSlice</code></td>
              </tr>
              <tr>
                <td><strong>Immutability</strong></td>
                <td>Manual object spreads (prone to accidental mutations)</td>
                <td>Built-in <strong>Immer.js</strong> (safe direct mutations)</td>
              </tr>
              <tr>
                <td><strong>Store Configuration</strong></td>
                <td><code>createStore</code> with manual middleware composition</td>
                <td><code>configureStore</code> with DevTools & Thunk enabled</td>
              </tr>
              <tr>
                <td><strong>Async Operations</strong></td>
                <td>Manual <code>redux-thunk</code> dispatches</td>
                <td><code>createAsyncThunk</code> with automatic lifecycles</td>
              </tr>
              <tr>
                <td><strong>Boilerplate</strong></td>
                <td>Very high (~100 lines per feature)</td>
                <td>Low (~25 lines per feature, ~75% reduction)</td>
              </tr>
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}
