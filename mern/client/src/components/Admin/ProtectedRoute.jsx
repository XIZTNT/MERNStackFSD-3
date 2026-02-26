import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5050/record", {
      credentials: "include",
    })
      .then((res) => setIsAuth(res.status === 200))
      .catch(() => setIsAuth(false));
  }, []);

  if (isAuth === null) return <div>Checking authentication...</div>;

  if (!isAuth) return <Navigate to="/admin/login" />;

  return children;
};

export default ProtectedRoute;
