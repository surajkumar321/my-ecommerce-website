// src/redux/reducers/wishlistReducer.js
import { load, save } from "../../utils/storage";

// localStorage key: "wishlist"
const INIT = { items: load("wishlist", []) }; // [{_id,name,price,imageUrl}]

export default function wishlistReducer(state = INIT, action) {
  switch (action.type) {
    case "WISHLIST_TOGGLE": {
      const p = action.payload;
      const exists = state.items.some((i) => i._id === p._id);
      const items = exists
        ? state.items.filter((i) => i._id !== p._id)
        : [
            {
              _id: p._id,
              name: p.name,
              price: p.price,
              imageUrl:
                // prefer multi-image first image if present
                p.images?.[0]?.url || p.imageUrl || "/placeholder.png",
            },
            ...state.items,
          ];
      save("wishlist", items);
      return { ...state, items };
    }

    case "WISHLIST_ADD": {
      const p = action.payload;
      const exists = state.items.some((i) => i._id === p._id);
      const items = exists
        ? state.items
        : [
            {
              _id: p._id,
              name: p.name,
              price: p.price,
              imageUrl: p.images?.[0]?.url || p.imageUrl || "/placeholder.png",
            },
            ...state.items,
          ];
      save("wishlist", items);
      return { ...state, items };
    }

    case "WISHLIST_REMOVE": {
      const items = state.items.filter((i) => i._id !== action.payload);
      save("wishlist", items);
      return { ...state, items };
    }

    case "WISHLIST_CLEAR": {
      save("wishlist", []);
      return { ...state, items: [] };
    }

    default:
      return state;
  }
}
