import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

export default function ProtectedRoute({ children, allowedRole }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    axios
      .get("https://university-afflitation-dfiz.onrender.com/api/auth/check", {
        withCredentials: true,
      })
      .then((res) => {
        setIsAuthenticated(true);
        setUserRole(res.data.role); 
      })
      .catch(() => {
        setIsAuthenticated(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) return <Navigate to="/not-verified" replace />;

  if (allowedRole && allowedRole !== userRole)
    return <Navigate to="/not-verified" replace />;

  return children;
}
