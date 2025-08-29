// src/redux/reducers/productReducer.js
const initialState = { loading: false, error: null, products: null };

export const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case "PRODUCT_LIST_REQUEST":
      return { ...state, loading: true, error: null };
    case "PRODUCT_LIST_SUCCESS":
      return { ...state, loading: false, products: action.payload };
    case "PRODUCT_LIST_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default productReducer;