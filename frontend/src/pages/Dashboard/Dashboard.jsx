import { useEffect, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserLoads } from "../../redux/features/loadSlice";
import { useRedirectLoggedOutUser } from "../../hooks/useRedirectLoggedOutUser";
import { useUserProfile } from "../../hooks/useUserProfile";
import { AdminDashboard } from "./AdminDashboard";
import { BsCashCoin } from "react-icons/bs";
import { FiPackage, FiEye, FiEdit2 } from "react-icons/fi";
import { TbGavel } from "react-icons/tb";
import { DriverDashboard } from "./DriverDashboard";

const STATUS_COLORS ={
  OPEN:           "bg-blue-100 text-blue-700",
  BIDDING:        "bg-yellow-100 text-yellow-700",
  PAYMENT_PENDING:"bg-orange-100 text-orange-700",
  ASSIGNED:       "bg-purple-100 text-purple-700",
  ENDED:          "bg-gray-100 text-gray-600",
  IN_TRANSIT:     "bg-orange-100 text-orange-700",
  DELIVERED:      "bg-green-100 text-green-700",
};

export const Dashboard = () =>{
  useRedirectLoggedOutUser("/login");
  const dispatch = useDispatch();
  const {role, balance, user} = useUserProfile();
  const {userLoads, isLoading} = useSelector((state) => state.load);

  const loads = useMemo(() => userLoads?.data ?? [],[userLoads]);

  useEffect(() =>{
    if(role === "Sender"){
      dispatch(getUserLoads());
    }
  },[dispatch, role]);

  const stats = useMemo(() =>({
    total: loads.length,
    totalBids: loads.reduce((acc, l) => acc + (l.totalBids ?? 0), 0),
    delivered: loads.filter((l) => l.status === "DELIVERED").length,
  }),[loads]);

  const recentLoads = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(startOfToday.getTime() - 24 * 60 * 60 * 1000);
    const endOfToday = new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000);
    return loads
      .filter((l) => {
        const created = new Date(l.createdAt);
        return created >= startOfYesterday && created < endOfToday;
      })
      .slice(0, 5);
  },[loads]);

  if(role === "Driver") return <DriverDashboard />;
  if(role === "Admin")  return <AdminDashboard />;

  return (
    <section className="space-y-6">
      <div className="shadow-s1 p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-800 capitalize">
          Welcome, {user?.name || "Sender"}
        </h2>
        <p className="text-gray_100 text-sm mt-1">Here's a summary of your activity.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[{ icon: FiPackage,label: "Total Loads",value: stats.total },
          { icon: TbGavel,label: "Total Bids Received", value: stats.totalBids },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="shadow-s1 p-6 rounded-lg flex items-center gap-4">
            <div className="p-3 bg-green_100 rounded-lg text-green">
              <Icon size={22} />
            </div>
            <div>
              <p className="text-sm text-gray_100">{label}</p>
              <p className="text-2xl font-bold text-gray-800">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="shadow-s1 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-700">Recent Loads</h3>
          <NavLink to="/load" className="text-green text-sm hover:underline">View all →</NavLink>
        </div>

        {isLoading ? (
          <p className="text-gray_100 text-sm py-6 text-center">Loading...</p>
        ) : recentLoads.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <p className="text-sm">No loads yet.</p>
            <NavLink to="/add" className="text-green text-sm font-medium hover:underline mt-2 inline-block">
              Post your first load →
            </NavLink>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead>
                <tr className="text-xs uppercase text-gray_100 border-b">
                  <th className="py-2 px-3">Title</th>
                  <th className="py-2 px-3">Route</th>
                  <th className="py-2 px-3 text-center">Bids</th>
                  <th className="py-2 px-3 text-center">Lowest Bid</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentLoads.map((load) =>(
                  <tr key={load._id} className="hover:bg-gray-50">
                    <td className="py-3 px-3 font-medium text-gray-800 max-w-[140px] truncate">{load.title}</td>
                    <td className="py-3 px-3 text-xs text-gray_100">
                      {load.pickupLocation} → {load.dropLocation}
                    </td>
                    <td className="py-3 px-3 text-center">{load.totalBids ?? 0}</td>
                    <td className="py-3 px-3 text-center font-semibold text-green">
                      {load.currentLowestBid != null ? `₹${load.currentLowestBid}` : "—"}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[load.status] ?? "bg-gray-100 text-gray-600"}`}>
                        {load.status?.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center justify-center gap-2">
                        <NavLink to={`/load/${load._id}`} className="text-gray-500 hover:text-green" title="View">
                          <FiEye size={15} />
                        </NavLink>
                        {load.status === "OPEN" && (
                          <NavLink to={`/load/update/${load._id}`} className="text-gray-500 hover:text-green" title="Edit">
                            <FiEdit2 size={15} />
                          </NavLink>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </section>
  );
};

export const UserProduct = () => null;