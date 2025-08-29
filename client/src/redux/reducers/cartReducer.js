// src/redux/reducers/cartReducer.js
const initial = {
  items: JSON.parse(localStorage.getItem("cart") || "[]"),
};

export const cartReducer = (state = initial, action) => {
  switch (action.type) {
    case "CART_ADD": {
      const p = action.payload;
      const exists = state.items.find((x) => x._id === p._id);
      const items = exists
        ? state.items.map((x) =>
            x._id === p._id ? { ...x, qty: (x.qty || 1) + (p.qty || 1) } : x
          )
        : [...state.items, { ...p, qty: p.qty || 1 }];
      return { ...state, items };
    }

    case "CART_REMOVE":
      return { ...state, items: state.items.filter((x) => x._id !== action.payload) };

    case "CART_SET_QTY":
      return {
        ...state,
        items: state.items.map((x) =>
          x._id === action.payload.id ? { ...x, qty: Number(action.payload.qty) } : x
        ),
      };

    case "CART_CLEAR":
      return { ...state, items: [] };

    default:
      return state;
  }
};
export default cartReducer;