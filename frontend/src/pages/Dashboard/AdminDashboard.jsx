import { useEffect, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../redux/features/authSlice";
import { fetchAdminLoads } from "../../redux/features/loadSlice";
import { useUserProfile } from "../../hooks/useUserProfile";
import { FiUsers, FiPackage, FiEye } from "react-icons/fi";
import { TbGavel } from "react-icons/tb";
import { BsCashCoin } from "react-icons/bs";
import { User2 } from "../../component/hero/Hero";

const ROLE_COLORS ={
  Sender: "bg-blue-100 text-blue-700",
  Driver: "bg-green-100 text-green-700",
  Admin:  "bg-purple-100 text-purple-700",
};

const STATUS_COLORS ={
  OPEN:           "bg-blue-100 text-blue-700",
  BIDDING:        "bg-yellow-100 text-yellow-700",
  PAYMENT_PENDING:"bg-orange-100 text-orange-700",
  ASSIGNED:       "bg-purple-100 text-purple-700",
  ENDED:          "bg-gray-100 text-gray-600",
  IN_TRANSIT:     "bg-orange-100 text-orange-700",
  DELIVERED:      "bg-green-100 text-green-700",
};

export const AdminDashboard = () =>{
  const dispatch = useDispatch();
  const {user, commission} = useUserProfile();
  const {users, isLoading: usersLoading} = useSelector((state) => state.auth);
  const {adminLoads, isLoading: loadsLoading } = useSelector((state) => state.load);

  useEffect(() =>{
    dispatch(getAllUsers());
    dispatch(fetchAdminLoads());
  },[dispatch]);

  const allLoads = useMemo(() => adminLoads ?? [],[adminLoads]);
  const allUsers = useMemo(() => users ?? [], [users]);

  const stats = useMemo(() =>({
    totalUsers: allUsers.length,
    totalSenders: allUsers.filter((u) => u.role === "Sender").length,
    totalDrivers: allUsers.filter((u) => u.role === "Driver").length,
    totalLoads: allLoads.length,
    openLoads: allLoads.filter((l) => l.status === "OPEN" || l.status === "BIDDING").length,
    deliveredLoads:allLoads.filter((l) => l.status === "DELIVERED").length,
    commission,
  }),[allUsers, allLoads, commission]);

  const recentUsers = useMemo(() =>allUsers.slice(0, 5),[allUsers]);
  const recentLoads = useMemo(() =>allLoads.slice(0, 5),[allLoads]);

  return (
    <section className="space-y-6">
      <div className="shadow-s1 p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-800 capitalize">
          Welcome, {user?.name || "Admin"}
        </h2>
        <p className="text-gray_100 text-sm mt-1">Platform overview and management.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[{ icon: FiUsers,label: "Total Users", value: stats.totalUsers },
          { icon: FiUsers,label: "Senders",value: stats.totalSenders },
          { icon: FiUsers,label: "Drivers",value: stats.totalDrivers },
          { icon: FiPackage,label: "Total Loads",value: stats.totalLoads },
          { icon: TbGavel,label: "Open / Bidding",value: stats.openLoads },
          { icon: BsCashCoin,label: "Commission Earned",value: `₹${stats.commission}` },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="shadow-s1 p-5 rounded-lg flex items-center gap-4">
            <div className="p-3 bg-green_100 rounded-lg text-green shrink-0">
              <Icon size={20} />
            </div>
            <div>
              <p className="text-xs text-gray_100">{label}</p>
              <p className="text-2xl font-bold text-gray-800">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="shadow-s1 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-700">Recent Users</h3>
            <NavLink to="/userlist" className="text-green text-sm hover:underline">View all →</NavLink>
          </div>

          {usersLoading ? (<p className="text-sm text-gray_100 py-4 text-center">Loading...</p>) : recentUsers.length === 0 ? (<p className="text-sm text-gray-400 py-4 text-center">No users found.</p>) : (
            <div className="space-y-3">
              {recentUsers.map((u) => (
                <div key={u._id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={u.photo || User2} alt={u.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-800 capitalize">{u.name}</p>
                      <p className="text-xs text-gray_100">{u.email}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ROLE_COLORS[u.role] ?? "bg-gray-100 text-gray-600"}`}>
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="shadow-s1 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-700">Recent Loads</h3>
            <NavLink to="/product/admin" className="text-green text-sm hover:underline">View all →</NavLink>
          </div>

          {loadsLoading ? (<p className="text-sm text-gray_100 py-4 text-center">Loading...</p>) : recentLoads.length === 0 ? (<p className="text-sm text-gray-400 py-4 text-center">No loads found.</p>) : (
            <div className="space-y-3">
              {recentLoads.map((load) => (
                <div key={load._id} className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{load.title}</p>
                    <p className="text-xs text-gray_100 truncate">
                      {load.pickupLocation} → {load.dropLocation}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[load.status] ?? "bg-gray-100 text-gray-600"}`}>
                      {load.status?.replace("_", " ")}
                    </span>
                    <NavLink to={`/load/${load._id}`} className="text-gray-400 hover:text-green">
                      <FiEye size={15} />
                    </NavLink>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
