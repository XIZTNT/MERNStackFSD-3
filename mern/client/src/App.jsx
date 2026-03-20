import { Outlet } from "react-router-dom";
import Navbar from "./components/Admin/Navbar";
import Unauthorized from "./components/Admin/Unauthorized";
import { useState, useEffect } from "react";
import axios from "axios";


const App = () => {
  const [authState, setAuthState] = useState("loading"); 
  // "loading" | "authorized" | "unauthorized"

  // Called when user clicks "Back to Login" button
  const handleBackToLogin = () => {
    setAuthState("unauthorized"); // stay on Unauthorized
  };

  useEffect(() => {
    axios
      .get("/authrefresh", { withCredentials: true })
      .then((res) => {
        if (res.status === 200) {
          setAuthState("authorized");
        } else {
          setAuthState("unauthorized"); // no cookie → Unauthorized
        }
      })
      .catch(() => setAuthState("unauthorized")); // no cookie / error → Unauthorized
  }, []);

  if (authState === "loading") return <div>Checking authentication...</div>;

  if (authState === "unauthorized") {
    return <Unauthorized onBackToLogin={handleBackToLogin} />;
  }

  // authorized
  return (
    <div className="w-full p-6">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default App;