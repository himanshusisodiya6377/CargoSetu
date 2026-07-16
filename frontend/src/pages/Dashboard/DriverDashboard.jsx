import { useEffect, useMemo, useCallback } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getWonBids, fetchCompletedLoads, fetchMyBids, updateTracking } from "../../redux/features/loadSlice";
import { useUserProfile } from "../../hooks/useUserProfile";
import { useWebSocket } from "../../hooks/useWebSocket";
import { TbTruckDelivery } from "react-icons/tb";
import { FiCheckCircle, FiEye } from "react-icons/fi";
import { TbGavel } from "react-icons/tb";
import { MdOutlineGavel } from "react-icons/md";
import { STATUS_COLORS } from "../../utils/data";
import TrackingBar from "../../component/common/TrackingBar";

export const DriverDashboard = ()=>{
  const dispatch = useDispatch();
  const {user} = useUserProfile();
  const {wonLoads, completedLoads, myBids, isLoading} = useSelector((state) => state.load);

  useEffect(() =>{
    dispatch(getWonBids());
    dispatch(fetchCompletedLoads());
    dispatch(fetchMyBids());
  },[dispatch]);

  const refresh = useCallback(() => {
    dispatch(getWonBids());
    dispatch(fetchCompletedLoads());
    dispatch(fetchMyBids());
  }, [dispatch]);

  useWebSocket(null, {
    bidWon: refresh,
    loadUpdate: refresh,
    trackingUpdate: refresh,
  });

  const stats = useMemo(() =>{
    const won = wonLoads?.length ?? 0;
    const inTransit = wonLoads?.filter((b) => b.load?.status === "IN_TRANSIT").length ?? 0;
    const delivered = completedLoads?.length ?? 0;
    const bidsPlaced = myBids?.length ?? 0;
    return {won,inTransit,delivered,bidsPlaced};
  },[wonLoads, completedLoads, myBids]);

  const recentWon = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    return (wonLoads ?? []).filter((bid) => {
      const d = new Date(bid.createdAt || bid.bidTime || bid.updatedAt);
      return d >= yesterday && d < new Date(today.getTime() + 86400000);
    }).slice(0, 5);
  }, [wonLoads]);

  const handleStatusUpdate = (loadId, status)=>{
    const label = status === "IN_TRANSIT" ? "mark as In Transit" : "mark as Delivered";
    if(window.confirm(`Are you sure you want to ${label}?`)){
      dispatch(updateTracking({ loadId, status }));
    }
  };

  return (
    <section className="space-y-6">
      <div className="shadow-s1 p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 capitalize">
              Welcome, {user?.name || "Driver"}
            </h2>
            <p className="text-gray_100 text-sm mt-1">Here's a summary of your activity.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[{ icon: MdOutlineGavel,label: "Bids Placed",value: stats.bidsPlaced,href: "/my-bids" },
          { icon: TbGavel,label: "Loads Won",value: stats.won,href: "/winning-products" },
          { icon: TbTruckDelivery, label: "In Transit",value: stats.inTransit,href: null },
          { icon: FiCheckCircle,label: "Delivered",value: stats.delivered,href: "/completed-loads" },
        ].map(({ icon: Icon,label,value,href }) =>{
          const inner = (
            <div className="shadow-s1 p-4 rounded-lg flex items-center gap-3 hover:shadow-md transition h-full">
              <div className="p-2.5 bg-green_100 rounded-lg text-green shrink-0">
                <Icon size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray_100 truncate">{label}</p>
                <p className="text-xl font-bold text-gray-800 truncate">{value}</p>
              </div>
            </div>
          );
          return href ? <NavLink key={label} to={href} className="block">{inner}</NavLink>: <div key={label}>{inner}</div>})}
      </div>

      <div className="shadow-s1 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-700">Recent Won Loads</h3>
          <NavLink to="/winning-products" className="text-green text-sm hover:underline">
            View all →
          </NavLink>
        </div>

        {isLoading ? (
          <p className="text-gray_100 text-sm py-6 text-center">Loading...</p>) : recentWon.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <p className="text-sm">You haven't won any bids yet.</p>
            <NavLink to="/active-loads" className="text-green text-sm font-medium hover:underline mt-2 inline-block">
              Browse active loads →
            </NavLink>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead>
                <tr className="text-xs uppercase text-gray_100 border-b">
                  <th className="py-2 px-3">Title</th>
                  <th className="py-2 px-3">Route</th>
                  <th className="py-2 px-3 text-center">Winning Bid</th>
                  <th className="py-2 px-3">Progress</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentWon.map((bid) =>{
                  const load = bid.load;
                  const status = load?.status;
                  return (
                    <tr key={bid._id} className="hover:bg-gray-50">
                      <td className="py-3 px-3 font-medium text-gray-800 max-w-[120px] truncate">
                        {load?.title}
                      </td>
                      <td className="py-3 px-3 text-xs text-gray_100 max-w-[140px] truncate">
                        {load?.pickupLocation} → {load?.dropLocation}
                      </td>
                      <td className="py-3 px-3 text-center font-semibold text-green">
                        ₹{bid.amount?.toLocaleString()}
                      </td>
                      <td className="py-3 px-3">
                        <TrackingBar status={status} compact />
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[status] ?? "bg-gray-100 text-gray-600"}`}>
                          {status?.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center justify-center gap-3">
                          <NavLink to={`/load/${load?._id}`} className="text-gray-500 hover:text-green" title="View">
                            <FiEye size={15} />
                          </NavLink>
                          {status === "ASSIGNED" && (
                            <button onClick={() => handleStatusUpdate(load._id, "IN_TRANSIT")} className="text-xs bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded-lg">
                              Start
                            </button>
                          )}
                          {status === "IN_TRANSIT" && (
                            <button onClick={() => handleStatusUpdate(load._id, "DELIVERED")} className="text-xs bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-lg">
                              Deliver
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </section>
  );
};
