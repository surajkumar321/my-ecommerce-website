import api from "../../api";

export const registerUser = (name, email, password) => async (dispatch) => {
  try {
    dispatch({ type: "AUTH_REQUEST" });
    const { data } = await api.post("/users/register", { name, email, password });
    // data: { user, token }
    localStorage.setItem("auth", JSON.stringify(data));
    dispatch({ type: "AUTH_SUCCESS", payload: data });
  } catch (err) {
    dispatch({
      type: "AUTH_FAIL",
      payload: err.userMessage || err.response?.data?.message || err.message,
    });
  }
};

export const loginUser = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: "AUTH_REQUEST" });
    const { data } = await api.post("/users/login", { email, password });
    localStorage.setItem("auth", JSON.stringify(data));
    dispatch({ type: "AUTH_SUCCESS", payload: data });
  } catch (err) {
    dispatch({
      type: "AUTH_FAIL",
      payload: err.userMessage || err.response?.data?.message || err.message,
    });
  }
};

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem("auth");
  dispatch({ type: "AUTH_LOGOUT" });
};
