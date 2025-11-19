import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function ProtectedRoute({ children, role }) {

  const universityToken = Cookies.get("universityToken");
  const collegeToken = Cookies.get("collegeToken");

  if (!universityToken && !collegeToken) {
    return <Navigate to="/not-verified" replace />;
  }

  if (role === "university" && !universityToken) {
    return <Navigate to="/not-verified" />;
  }

  if (role === "college" && !collegeToken) {
    return <Navigate to="/not-verified" />;
  }

  return children;
}
