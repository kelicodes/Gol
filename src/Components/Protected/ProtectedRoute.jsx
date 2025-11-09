import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../Context/Authcontext.jsx";

const ProtectedRoute = ({ children }) => {
  const { token } = useContext(AuthContext);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
