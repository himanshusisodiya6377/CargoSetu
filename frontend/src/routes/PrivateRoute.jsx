import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children }) =>{
  const { isLoggedIn, isLoading, user } = useSelector((state) => state.auth);
  if (isLoading && !user) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn){
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;