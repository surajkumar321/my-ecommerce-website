// client/src/redux/actions/authActions.js
import api from "../../api";

export const loginUser = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: "AUTH_REQUEST" });
    const { data } = await api.post(
      "/users/login",
      { email, password },
      { headers: { "Content-Type": "application/json" } }
    );
    dispatch({ type: "AUTH_SUCCESS", payload: data }); // { user, token }
    localStorage.setItem("auth", JSON.stringify(data));
  } catch (err) {
    dispatch({
      type: "AUTH_FAIL",
      payload: err.response?.data?.message || err.message,
    });
  }
};

export const registerUser = (name, email, password) => async (dispatch) => {
  try {
    dispatch({ type: "AUTH_REQUEST" });
    const { data } = await api.post(
      "/users/register",
      { name, email, password },
      { headers: { "Content-Type": "application/json", "X-Register-Intent": "1" } }
    );
    dispatch({ type: "AUTH_SUCCESS", payload: data });
    localStorage.setItem("auth", JSON.stringify(data));
  } catch (err) {
    dispatch({
      type: "AUTH_FAIL",
      payload: err.response?.data?.message || err.message,
    });
  }
};

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem("auth");
  dispatch({ type: "AUTH_LOGOUT" });
};
