// client/src/redux/store.js
import {
  legacy_createStore as createStore,
  combineReducers,
  applyMiddleware,
} from "redux";
import { composeWithDevTools } from "@redux-devtools/extension";
import { thunk } from "redux-thunk";

import { productReducer } from "./reducers/productReducer";
import { cartReducer } from "./reducers/cartReducer";
import wishlistReducer from "./reducers/wishlistReducer";
import authReducer from "./reducers/authReducer"; // ✅ default

const rootReducer = combineReducers({
  productList: productReducer,
  cart: cartReducer,
  wishlist: wishlistReducer,
  auth: authReducer,
});

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;
