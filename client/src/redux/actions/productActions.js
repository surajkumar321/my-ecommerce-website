// src/redux/actions/productActions.js
import api from "../../api";

// Server-side listing with query params
export const fetchProducts = (params = {}) => async (dispatch) => {
  try {
    dispatch({ type: "PRODUCT_LIST_REQUEST" });

    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== "" && v != null))
    ).toString();

    const { data } = await api.get(`/products${qs ? `?${qs}` : ""}`);
    dispatch({ type: "PRODUCT_LIST_SUCCESS", payload: data });
  } catch (e) {
    dispatch({
      type: "PRODUCT_LIST_FAIL",
      payload: e.response?.data?.message || e.message,
    });
  }
};
