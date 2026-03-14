import { Caption, CustomNavLink, Title } from "../common/Design";
import { CiGrid41 } from "react-icons/ci";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineCategory } from "react-icons/md";
import { RiAuctionLine } from "react-icons/ri";
import { IoIosHeartEmpty } from "react-icons/io";
import { User1 } from "../hero/Hero";
import { IoIosLogOut } from "react-icons/io";
import { CgProductHunt } from "react-icons/cg";
import { TbCurrencyDollar } from "react-icons/tb";
import { FiUser } from "react-icons/fi";
import { FaPlusCircle } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {RESET,getUserProfile,logout} from "../../redux/features/authSlice"
import { useRedirectLoggedOutUser } from "../../hooks/useRedirectLoggedOutUser";
import { useEffect } from "react";
import { useUserProfile } from "../../hooks/useUserProfile";
import { TbTruckDelivery } from "react-icons/tb";
import { FiCheckCircle } from "react-icons/fi";

export const Sidebar = ({onNavigate}) =>{
  useRedirectLoggedOutUser("/login");
  const location = useLocation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {role,isLoggedIn}=useUserProfile();

  
  const { user } = useSelector((state) => state.auth);
  
    if(!isLoggedIn) return <p>You need to log to access this page.</p>
  
    const logoutUser = async () =>{
      dispatch(RESET());
      await dispatch(logout());
      navigate("/");
    };

    const handleNav = () => { if (onNavigate) onNavigate(); };

    console.log(role);

  const className = "flex items-center gap-3 mb-2 p-3 lg:p-4 rounded-full";

  return (
    <section className="sidebar flex flex-col overflow-visible">
      {/* Profile */}
      <div className="profile flex items-center text-center justify-center gap-4 flex-col mb-6">
        <img src={user?.photo} alt="" className="w-20 h-20 lg:w-32 lg:h-32 rounded-full object-cover" />
        <div>
          <Title className="capitalize text-base lg:text-xl">{user?.name}</Title>
          <Caption className="text-xs lg:text-sm">{user?.email}</Caption>
        </div>
      </div>

      {/* Menu */}
      <div className="flex flex-col" onClick={handleNav}>
        <CustomNavLink href="/dashboard" isActive={location.pathname === "/dashboard"} className={className}>
          <CiGrid41 size={22} />
          <span>Dashboard</span>
        </CustomNavLink>

        {role === "Sender" && (
          <>
            <CustomNavLink href="/load" isActive={location.pathname === "/product"} className={className}>
              <MdOutlineCategory size={22} />
              <span>My Products</span>
            </CustomNavLink>

            <CustomNavLink href="/add" isActive={location.pathname === "/add"} className={className}>
              <FaPlusCircle size={22} />
              <span>Create Product</span>
            </CustomNavLink>
          </>
        )}

        {role === "Admin" && (
          <>
            <CustomNavLink href="/userlist" isActive={location.pathname === "/userlist"} className={className}>
              <FiUser size={22} />
              <span>All User</span>
            </CustomNavLink>

            <CustomNavLink href="/product/admin" isActive={location.pathname === "/product/admin"} className={className}>
              <CgProductHunt size={22} />
              <span>All Product List</span>
            </CustomNavLink>
          </>
        )}

        {role !== "Admin" && (
          <>
            <CustomNavLink href="/winning-products" isActive={location.pathname === "/winning-products"} className={className}>
              <RiAuctionLine size={22} />
              <span>{role === "Driver" ? "Assigned Loads" : "Winning Bids"}</span>
            </CustomNavLink>

            <CustomNavLink href="/active-loads" isActive={location.pathname === "/active-loads"} className={className}>
              <TbTruckDelivery size={22} />
              <span>Active Loads</span>
            </CustomNavLink>

            <CustomNavLink href="/completed-loads" isActive={location.pathname === "/completed-loads"} className={className}>
              <FiCheckCircle size={22} />
              <span>Completed Loads</span>
            </CustomNavLink>
          </>
        )}

        <CustomNavLink href="/profile" isActive={location.pathname === "/profile"} className={className}>
          <IoSettingsOutline size={22} />
          <span>Personal Profile</span>
        </CustomNavLink>

      </div>

      {/* Logout */}
      <button onClick={logoutUser} className="flex items-center w-full gap-3 mt-4 bg-red-500 mb-3 hover:text-white p-4 rounded-full text-white">
        <IoIosLogOut size={22} />
        <span>Log Out</span>
      </button>

    </section>
  );
};