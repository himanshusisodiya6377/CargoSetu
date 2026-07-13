import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../redux/features/authSlice";

export const useUserProfile = () => {
  const { user, isLoading } = useSelector((state) => state.auth);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const role = user?.role || null;
  const commission = user?.commissionBalance || 0;

  return {user,role,commission,isLoggedIn,isLoading,};
};