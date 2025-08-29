// src/redux/actions/wishlistActions.js

// Single-button toggle (add if not present, else remove)
export const toggleWishlist = (product) => ({
  type: "WISHLIST_TOGGLE",
  payload: product,
});

// Optional granular actions (useful in Wishlist page)
export const addToWishlist = (product) => ({
  type: "WISHLIST_ADD",
  payload: product,
});

export const removeFromWishlist = (id) => ({
  type: "WISHLIST_REMOVE",
  payload: id,
});

export const clearWishlist = () => ({
  type: "WISHLIST_CLEAR",
});
