import { useEffect, useCallback } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserLoads, deleteLoad } from "../../../redux/features/loadSlice";
import { useRedirectLoggedOutUser } from "../../../hooks/useRedirectLoggedOutUser";
import { useWebSocket } from "../../../hooks/useWebSocket";
import { FiPlusCircle, FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";
import { STATUS_COLORS } from "../../../utils/data";

const LoadList = () =>{
  useRedirectLoggedOutUser("/login");
  const dispatch = useDispatch();
  const {userLoads, isLoading} = useSelector((state) => state.load);
  const load = userLoads?.data ?? [];

  useEffect(() =>{
    dispatch(getUserLoads());
  },[dispatch]);

  useWebSocket(null, {
    loadUpdate: useCallback(() => { dispatch(getUserLoads()); }, [dispatch]),
    trackingUpdate: useCallback(() => { dispatch(getUserLoads()); }, [dispatch]),
  });

  const delLoad =(id)=>{
    if(window.confirm("Are you sure you want to delete this load?")){
      dispatch(deleteLoad(id)).then(() => {
        dispatch(getUserLoads());
      });
    }
  };

  return(
    <section className="space-y-6">
      <div className="shadow-s1 p-6 rounded-lg flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">My Loads</h2>
          <p className="text-gray_100 text-sm mt-1">Manage all your posted loads.</p>
        </div>
        <NavLink to="/add" className="flex items-center gap-2 bg-green text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-primary transition shadow-md">
          <FiPlusCircle size={16} />
          Post Load
        </NavLink>
      </div>

      <div className="shadow-s1 p-6 rounded-lg">
        {isLoading ? (<p className="text-gray_100 text-sm py-6 text-center">Loading...</p>) : load.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <p className="text-sm">No loads found.</p>
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
                  <th className="py-2 px-3 text-center">Budget</th>
                  <th className="py-2 px-3 text-center">Bids</th>
                  <th className="py-2 px-3 text-center">Lowest Bid</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3 text-center">Assignment</th>
                  <th className="py-2 px-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {load.map((item) =>(
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="py-3 px-3 font-medium text-gray-800 max-w-[130px] truncate">
                      {item.title || "Untitled"}
                    </td>
                    <td className="py-3 px-3 text-xs text-gray_100">
                      {item.pickupLocation} → {item.dropLocation}
                    </td>
                    <td className="py-3 px-3 text-center font-medium text-gray-700">
                      ₹{item.maxBudget ?? "—"}
                    </td>
                    <td className="py-3 px-3 text-center">{item.totalBids ?? 0}</td>
                    <td className="py-3 px-3 text-center font-semibold text-green">
                      {item.currentLowestBid != null ? `₹${item.currentLowestBid}` : "—"}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[item.status] ?? "bg-gray-100 text-gray-600"}`}>
                        {item.status?.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      {item.status === "DELIVERED" ? (
                        <span className="text-xs text-green-600 font-medium">Delivered</span>
                      ) : ["ASSIGNED", "PAYMENT_PENDING", "IN_TRANSIT"].includes(item.status) ? (
                        <span className="text-xs text-orange-500 font-medium">Assigned</span>
                      ) : item.status === "ENDED" ? (
                        <span className="text-xs text-gray-400 font-medium">Ended</span>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center justify-center gap-2">
                        <NavLink to={`/load/${item._id}`} className="text-gray-400 hover:text-green" title="View">
                          <FiEye size={15} />
                        </NavLink>
                        {item.status === "OPEN" && (item.totalBids ?? 0) === 0 && (
                          <NavLink to={`/load/update/${item._id}`} className="text-gray-400 hover:text-green" title="Edit">
                            <FiEdit2 size={15} />
                          </NavLink>
                        )}
                        <button onClick={() => delLoad(item._id)} disabled={["ASSIGNED", "PAYMENT_PENDING"].includes(item.status) || (item.totalBids ?? 0)>0} title={(item.totalBids ?? 0) > 0 ? "Cannot delete: bids placed" : "Delete"} className={`${["ASSIGNED", "PAYMENT_PENDING"].includes(item.status) || (item.totalBids ?? 0) > 0 ? "text-gray-300 cursor-not-allowed" : "text-gray-400 hover:text-red-500"}`}>
                          <FiTrash2 size={15} />
                        </button>
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

export default LoadList;