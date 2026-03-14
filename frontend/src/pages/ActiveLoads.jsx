import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchActiveLoads } from "../redux/features/loadSlice";
import { useRedirectLoggedOutUser } from "../hooks/useRedirectLoggedOutUser";
import { MdLocationOn, MdLocationOff } from "react-icons/md";

const StatusBadge = ({status}) =>{
  const colors = {
    OPEN: "bg-blue-100 text-blue-700",
    BIDDING: "bg-yellow-100 text-yellow-700",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
};

const ActiveLoads = ()=>{
  useRedirectLoggedOutUser("/login");
  const dispatch = useDispatch();
  const {activeLoads,isLoading} = useSelector((state) => state.load);
  const {user} = useSelector((state) => state.auth);
  const [locationStatus, setLocationStatus] = useState("pending"); 

  useEffect(() =>{
    if(user?.role !== "Driver"){
      dispatch(fetchActiveLoads());
      return;
    }

    if(!navigator.geolocation){
      setLocationStatus("denied");
      dispatch(fetchActiveLoads());
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position)=>{
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setLocationStatus("granted");
        dispatch(fetchActiveLoads(coords));
      },
      () =>{
        setLocationStatus("denied");
        dispatch(fetchActiveLoads());
      },
      {timeout: 8000}
    );
  },[dispatch, user?.role]);

  return (
    <section className="space-y-6">
      <div className="shadow-s1 p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-800">Active Loads</h2>
        <p className="text-sm text-gray-400 mt-1">
          {user?.role === "Driver" ? "Loads currently open for bidding." : "Your loads currently open for bidding."}
        </p>
        {user?.role === "Driver" && locationStatus === "granted" && (
          <p className="mt-2 flex items-center gap-1 text-xs text-green-600 font-medium">
            <MdLocationOn size={14} /> Showing loads within 100 km of your location
          </p>
        )}
        {user?.role === "Driver" && locationStatus === "denied" && (
          <p className="mt-2 flex items-center gap-1 text-xs text-yellow-600 font-medium">
            <MdLocationOff size={14} /> Location access denied — showing all available loads
          </p>
        )}
      </div>

      <div className="shadow-s1 p-6 rounded-lg">
        {isLoading ? (
          <p className="text-center py-10 text-gray-400 text-sm">Loading...</p>
        ) : !activeLoads?.length ? (
          <div className="text-center py-14 text-gray-400">
            <p className="text-sm">No loads open for bidding at the moment.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead>
                <tr className="text-xs uppercase text-gray-400 border-b">
                  <th className="py-2 px-3">Title</th>
                  <th className="py-2 px-3">Route</th>
                  <th className="py-2 px-3 text-center">Weight</th>
                  <th className="py-2 px-3">Vehicle</th>
                  {user?.role === "Driver" && <th className="py-2 px-3">Sender</th>}
                  <th className="py-2 px-3 text-center">Budget</th>
                  <th className="py-2 px-3 text-center">Bids</th>
                  <th className="py-2 px-3 text-center">Lowest Bid</th>
                  <th className="py-2 px-3 text-center">Bid Ends</th>
                  <th className="py-2 px-3 text-center">Status</th>
                  <th className="py-2 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {activeLoads.map((load) => (
                  <tr key={load._id} className="hover:bg-gray-50">
                    <td className="py-3 px-3 font-medium text-gray-800 max-w-[140px] truncate">{load.title}</td>
                    <td className="py-3 px-3 text-xs text-gray-400">{load.pickupLocation} → {load.dropLocation}</td>
                    <td className="py-3 px-3 text-center">{load.weight} kg</td>
                    <td className="py-3 px-3 text-xs">{load.vehicleType}</td>
                    {user?.role === "Driver" && (
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <img
                            src={load.sender?.photo || "https://cdn-icons-png.flaticon.com/512/2202/2202112.png"}
                            className="w-7 h-7 rounded-full object-cover"
                            alt={load.sender?.name}
                          />
                          <span className="text-xs capitalize">{load.sender?.name || "—"}</span>
                        </div>
                      </td>
                    )}
                    <td className="py-3 px-3 text-center text-xs">
                      {load.maxBudget ? `₹${load.maxBudget.toLocaleString()}` : "—"}
                    </td>
                    <td className="py-3 px-3 text-center">{load.totalBids ?? 0}</td>
                    <td className="py-3 px-3 text-center text-xs">
                      {load.currentLowestBid ? `₹${load.currentLowestBid.toLocaleString()}` : "—"}
                    </td>
                    <td className="py-3 px-3 text-center text-xs text-gray-400">
                      {load.bidEndTime ? new Date(load.bidEndTime).toLocaleString() : "—"}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <StatusBadge status={load.status} />
                    </td>
                    <td className="py-3 px-3 text-center">
                      <NavLink to={`/load/${load._id}`} className="text-green text-xs hover:underline">
                        {user?.role === "Driver" ? "Bid Now" : "View"}
                      </NavLink>
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

export default ActiveLoads;
