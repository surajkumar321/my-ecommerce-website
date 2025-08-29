const initial = (() => {
  try {
    return JSON.parse(localStorage.getItem("auth")) || { user: null, token: null };
  } catch {
    return { user: null, token: null };
  }
})();

export default function authReducer(
  state = { user: initial.user || null, token: initial.token || null, loading: false, error: null },
  action
) {
  switch (action.type) {
    case "AUTH_REQUEST":
      return { ...state, loading: true, error: null };
    case "AUTH_SUCCESS":
      return {
        ...state,
        loading: false,
        error: null,
        user: action.payload.user,
        token: action.payload.token,
      };
    case "AUTH_FAIL":
      return { ...state, loading: false, error: action.payload || "Auth failed" };
    case "AUTH_LOGOUT":
      return { user: null, token: null, loading: false, error: null };
    default:
      return state;
  }
}
