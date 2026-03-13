import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function useSessionCheck() {
  const navigate = useNavigate();

  useEffect(() => {
    async function checkSession() {
      try {
        // Call backend to validate session; backend will read session_token cookie automatically
        const res = await fetch("http://localhost:5050/validate_token", {
          credentials: "include", // important: sends cookies along
        });

        const data = await res.json();

        if (!data.data?.valid) {
          navigate("/admin/login"); // redirect if session invalid or missing
        }
      } catch (err) {
        console.error("Session validation error:", err);
        navigate("/admin/login");
      }
    }

    checkSession();
  }, [navigate]);
}