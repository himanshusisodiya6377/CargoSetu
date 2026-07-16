import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompletedLoads } from "../redux/features/loadSlice";
import { useRedirectLoggedOutUser } from "../hooks/useRedirectLoggedOutUser";

const CompletedLoads = () =>{
  useRedirectLoggedOutUser("/login");
  const dispatch = useDispatch();
  const { completedLoads, isLoading } = useSelector((state) => state.load);
  const { user } = useSelector((state) => state.auth);

  useEffect(() =>{
    dispatch(fetchCompletedLoads());
  },[dispatch]);

  return (
    <section className="space-y-6">
      <div className="shadow-s1 p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-800">Completed Loads</h2>
        <p className="text-sm text-gray-400 mt-1">
          {user?.role === "Driver" ? "Loads you have successfully delivered." : "Your loads that are assigned, ended, or delivered."}
        </p>
      </div>

      <div className="shadow-s1 p-6 rounded-lg">
        {isLoading ? (
          <p className="text-center py-10 text-gray-400 text-sm">Loading...</p>
        ) : completedLoads?.length === 0 ? (
          <div className="text-center py-14 text-gray-400">
            <p className="text-sm">No completed loads yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead>
                <tr className="text-xs uppercase text-gray-400 border-b">
                  <th className="py-2 px-3">Title</th>
                  <th className="py-2 px-3">Route</th>
                  <th className="py-2 px-3 text-center">Weight</th>
                  <th className="py-2 px-3">
                    {user?.role === "Sender" ? "Driver" : "Sender"}
                  </th>
                  <th className="py-2 px-3">Last Updated</th>
                  <th className="py-2 px-3 text-center">Status</th>
                  <th className="py-2 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {completedLoads.map((load) => {
                  const person = user?.role === "Sender" ? load.assignedDriver : load.sender;
                  const statusBadge = {
                    ASSIGNED:  { color: "bg-purple-100 text-purple-700", label: "Assigned" },
                    ENDED:     { color: "bg-gray-100 text-gray-600",   label: "Ended — No bids" },
                    DELIVERED: { color: "bg-green-100 text-green-700", label: "Delivered" },
                  }[load.status] || { color: "bg-gray-100 text-gray-600", label: load.status };

                  return (
                    <tr key={load._id} className="hover:bg-gray-50">
                      <td className="py-3 px-3 font-medium text-gray-800 max-w-[140px] truncate">{load.title}</td>
                      <td className="py-3 px-3 text-xs text-gray-400">{load.pickupLocation} → {load.dropLocation}</td>
                      <td className="py-3 px-3 text-center">{load.weight} kg</td>
                      <td className="py-3 px-3">
                        {person ? (
                          <div className="flex items-center gap-2">
                            <img
                              src={person?.photo || "https://cdn-icons-png.flaticon.com/512/2202/2202112.png"}
                              className="w-7 h-7 rounded-full object-cover"
                              alt={person?.name}
                            />
                            <span className="capitalize text-xs">{person?.name}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-xs text-gray-400">
                        {new Date(load.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge.color}`}>
                          {statusBadge.label}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <NavLink to={`/load/${load._id}`} className="text-green text-xs hover:underline">
                          View
                        </NavLink>
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

export default CompletedLoads;