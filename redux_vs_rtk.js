/**
 * DAY 30: REDUX VS REDUX TOOLKIT (RTK) SIMULATOR
 * Executable Node.js Demonstration Script
 * 
 * Demonstrates:
 * 1. Legacy Redux Architecture (Action Types, Creators, Reducer with Spread)
 * 2. Modern Redux Toolkit Architecture (createSlice with Immer-style mutations)
 * 3. Boilerplate & Lines of Code Benchmark Comparison
 * 4. Dispatching Actions and Verifying State Transformations
 */

console.log("=================================================");
console.log("DAY 30: REDUX VS REDUX TOOLKIT (RTK) SIMULATOR");
console.log("=================================================\n");

// -----------------------------------------------------------------
// 1. LEGACY (VANILLA) REDUX SIMULATION
// -----------------------------------------------------------------
console.log("--- 1. Legacy Redux Implementation ---");

// A. Action Types
const LEGACY_ADD = 'cart/ADD_ITEM';
const LEGACY_REMOVE = 'cart/REMOVE_ITEM';

// B. Action Creators
const legacyAddItem = (item) => ({ type: LEGACY_ADD, payload: item });
const legacyRemoveItem = (id) => ({ type: LEGACY_REMOVE, payload: id });

// C. Pure Reducer with Spread Gymnastics
function legacyCartReducer(state = { items: [], total: 0 }, action) {
  switch (action.type) {
    case LEGACY_ADD:
      return {
        ...state,
        items: [...state.items, action.payload],
        total: state.total + action.payload.price
      };
    case LEGACY_REMOVE:
      const filtered = state.items.filter(i => i.id !== action.payload);
      const removed = state.items.find(i => i.id === action.payload);
      return {
        ...state,
        items: filtered,
        total: state.total - (removed ? removed.price : 0)
      };
    default:
      return state;
  }
}

// Execute Legacy Actions
let legacyState = legacyCartReducer(undefined, { type: '@@INIT' });
legacyState = legacyCartReducer(legacyState, legacyAddItem({ id: 101, title: 'Mechanical Keyboard', price: 120 }));
legacyState = legacyCartReducer(legacyState, legacyAddItem({ id: 102, title: 'Gaming Mouse', price: 60 }));

console.log("Legacy Redux State after 2 items added:");
console.log(legacyState);

legacyState = legacyCartReducer(legacyState, legacyRemoveItem(101));
console.log("Legacy Redux State after removing item #101:");
console.log(legacyState);

// -----------------------------------------------------------------
// 2. MODERN REDUX TOOLKIT (RTK) SIMULATION
// -----------------------------------------------------------------
console.log("\n--- 2. Modern Redux Toolkit (RTK) createSlice Simulation ---");

// Simulating createSlice engine with Immer draft proxy
function simulateCreateSlice({ name, initialState, reducers }) {
  const actions = {};

  // Generate action creators
  Object.keys(reducers).forEach((key) => {
    const actionType = `${name}/${key}`;
    actions[key] = (payload) => ({ type: actionType, payload });
  });

  // Reducer function supporting direct mutations (Immer-style draft cloning)
  const reducer = (state = initialState, action) => {
    const actionKey = action.type.split('/')[1];
    if (reducers[actionKey]) {
      // Create draft clone for safe mutation
      const draft = JSON.parse(JSON.stringify(state));
      reducers[actionKey](draft, action);
      return draft;
    }
    return state;
  };

  return { actions, reducer };
}

// RTK Slice Definition (Clean, concise, and mutable syntax)
const cartSlice = simulateCreateSlice({
  name: 'cart',
  initialState: { items: [], total: 0 },
  reducers: {
    addItem(state, action) {
      // Direct push! No spread needed!
      state.items.push(action.payload);
      state.total += action.payload.price;
    },
    removeItem(state, action) {
      const idx = state.items.findIndex(i => i.id === action.payload);
      if (idx !== -1) {
        state.total -= state.items[idx].price;
        state.items.splice(idx, 1);
      }
    }
  }
});

const { addItem, removeItem } = cartSlice.actions;

// Execute RTK Actions
let rtkState = cartSlice.reducer(undefined, { type: '@@INIT' });
rtkState = cartSlice.reducer(rtkState, addItem({ id: 201, title: 'UltraWide Monitor', price: 450 }));
rtkState = cartSlice.reducer(rtkState, addItem({ id: 202, title: 'Desk Mat', price: 30 }));

console.log("Redux Toolkit State after 2 items added:");
console.log(rtkState);

rtkState = cartSlice.reducer(rtkState, removeItem(201));
console.log("Redux Toolkit State after removing item #201:");
console.log(rtkState);

// -----------------------------------------------------------------
// 3. ARCHITECTURAL COMPARISON SUMMARY
// -----------------------------------------------------------------
console.log("\n--- 3. Boilerplate & Developer Experience Metrics ---");
console.log(`
┌─────────────────────────┬──────────────────┬────────────────────────┐
│ Metric                  │ Legacy Redux     │ Redux Toolkit (RTK)    │
├─────────────────────────┼──────────────────┼────────────────────────┤
│ Action Types            │ Manual constants │ Auto-generated         │
│ Action Creators         │ Manual functions │ Auto-generated         │
│ Immutability            │ Manual ...spread │ Auto via Immer.js      │
│ Redux DevTools Setup    │ Complex config   │ Built-in zero config   │
│ Code Volume Reduction   │ Baseline (100%)  │ ~65% - 75% Less Code   │
└─────────────────────────┴──────────────────┴────────────────────────┘
`);

console.log("=================================================");
console.log("✅ Day 30 Redux vs RTK Simulator Completed!");
console.log("🎉 Congratulations on completing Day 30!");
console.log("=================================================");
