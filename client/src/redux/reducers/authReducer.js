// client/src/redux/reducers/authReducer.js
const persisted = (() => {
  try { return JSON.parse(localStorage.getItem("auth")) || {}; }
  catch { return {}; }
})();

const initialState = {
  user: persisted.user || null,
  token: persisted.token || null,
  loading: false,
  error: null,
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case "AUTH_REQUEST":
      return { ...state, loading: true, error: null };
    case "AUTH_SUCCESS":
      return { ...state, loading: false, user: action.payload.user, token: action.payload.token, error: null };
    case "AUTH_FAIL":
      return { ...state, loading: false, error: action.payload || "Auth failed" };
    case "AUTH_LOGOUT":
      return { user: null, token: null, loading: false, error: null };
    default:
      return state;
  }
}
