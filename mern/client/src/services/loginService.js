import axios from "axios";

export const loginUser = async (email, password) => {
  try {
    const res = await axios.post("/login", { email, password });
    console.log("Login successful:", res.data);
    return res.data;
  } catch (err) {
    console.error("Login failed:", err.response?.data || err);
    throw err;
  }
};
