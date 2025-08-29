import { getImageUrl } from "../../utils/img";

// persist helper
const persist = (getState) =>
  localStorage.setItem("cart", JSON.stringify(getState().cart.items));

export const addToCart = (product, qty = 1) => (dispatch, getState) => {
  const payload = {
    _id: product._id,
    name: product.name,
    price: Number(product.price || 0),
    stock: Number(product.stock ?? 0),
    qty: Number(qty || 1),
    imageUrl: getImageUrl(product), // ✅ always a safe image
  };

  dispatch({ type: "CART_ADD", payload });
  persist(getState);
};

export const removeFromCart = (id) => (dispatch, getState) => {
  dispatch({ type: "CART_REMOVE", payload: id });
  persist(getState);
};

export const setQty = (id, qty) => (dispatch, getState) => {
  dispatch({ type: "CART_SET_QTY", payload: { id, qty: Number(qty || 1) } });
  persist(getState);
};

export const clearCart = () => (dispatch) => {
  dispatch({ type: "CART_CLEAR" });
  localStorage.setItem("cart", JSON.stringify([]));
};

