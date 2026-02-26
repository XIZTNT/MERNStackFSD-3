import express from "express";
const router = express.Router();

router.post("/", (req, res) => {
  res
    .clearCookie("accessToken", {
      httpOnly: true,
      secure: false, 
      sameSite: "lax",
      path: "/",          // ← important for clearing the cookie in all routes
    })
    .clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    })
    .status(200)
    .set("Access-Control-Allow-Credentials", "true")
    .set("Access-Control-Allow-Origin", "http://localhost:5173") 
    .json({ message: "Logged out successfully" });
});

export default router;
