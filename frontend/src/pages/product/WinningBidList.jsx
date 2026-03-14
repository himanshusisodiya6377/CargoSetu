import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Title } from "../../routes/index";
import { getWonBids, updateTracking } from "../../redux/features/loadSlice";
import { useRedirectLoggedOutUser } from "../../hooks/useRedirectLoggedOutUser";
import { FiPackage, FiTruck, FiCheckCircle } from "react-icons/fi";

const STEPS = [
  { key: "ASSIGNED",   label: "Assigned",   Icon: FiPackage },
  { key: "IN_TRANSIT", label: "In Transit",  Icon: FiTruck },
  { key: "DELIVERED",  label: "Delivered",   Icon: FiCheckCircle },
];

const TrackingBar = ({ status })=>{
  const current = STEPS.findIndex((s) => s.key === status);
  return (
    <div className="flex items-center w-full">
      {STEPS.map(({ key, label, Icon }, i) =>(
        <div key={key} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${ i < current  ? "bg-green-500 border-green-500 text-white" : i === current ? "bg-white border-green-500 text-green-600" : "bg-gray-50 border-gray-200 text-gray-300" }`}>
              <Icon size={18} />
            </div>
            <span className={`text-xs font-medium whitespace-nowrap ${i <= current ? "text-green-600" : "text-gray-400"}`}>{label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`flex-1 h-0.5 mx-2 mb-4 rounded transition-all ${i < current ? "bg-green-500" : "bg-gray-200"}`} />)}
        </div>))}
    </div>
  );
};

export const WinningBidList = ()=>{
  useRedirectLoggedOutUser("/login");

  const dispatch = useDispatch();
  const {wonLoads,isLoading} = useSelector((state) => state.load);
  const {user} = useSelector((state) => state.auth);

  useEffect(()=>{
    dispatch(getWonBids());
  },[dispatch]);

  const handleStatusUpdate =(loadId,status)=>{
    const label = status === "IN_TRANSIT" ? "mark as In Transit" : "mark as Delivered";
    if(window.confirm(`Are you sure you want to ${label}?`)){
      dispatch(updateTracking({loadId,status}));
    }};

  if(isLoading) return <p className="text-center py-10 text-gray-500">Loading...</p>;

  return(
    <section className="shadow-s1 p-4 sm:p-8 rounded-lg">
      <Title level={5} className="font-semibold text-gray-700 mb-6"> {user?.role === "Sender" ? "Assigned Loads — Track Delivery" : "Loads You Won"}</Title>
      {wonLoads?.length === 0 ? (
        <div className="text-center py-14 text-gray-400">
          {user?.role === "Driver" ? "You haven't won any bids yet.": "None of your loads have been assigned yet."}
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {wonLoads?.map((bid) => {
            const loadStatus = bid.load?.status || "ASSIGNED";
            return (
              <div key={bid._id} className="border border-gray-100 rounded-2xl bg-white shadow-sm overflow-hidden">
                <div className={`px-6 py-2 text-xs font-semibold uppercase tracking-wide text-white ${loadStatus === "DELIVERED" ? "bg-green-500": loadStatus === "IN_TRANSIT" ? "bg-yellow-500": "bg-blue-500"}`}>
                  {loadStatus.replace("_", " ")}
                </div>

                <div className="p-6 flex flex-col gap-5">
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1">
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Load Details</p>
                      <h3 className="text-base font-bold text-gray-800 mb-3">{bid.load?.title}</h3>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm text-gray-600">
                        <div><span className="text-gray-400">From</span> {bid.load?.pickupLocation}</div>
                        <div><span className="text-gray-400">To</span> {bid.load?.dropLocation}</div>
                        <div><span className="text-gray-400">Weight</span> {bid.load?.weight} kg</div>
                        <div><span className="text-gray-400">Vehicle</span> {bid.load?.vehicleType}</div>
                        <div><span className="text-gray-400">Budget</span> ₹{bid.load?.maxBudget?.toLocaleString()}</div>
                        <div>
                          <span className="text-gray-400">Won At</span>{" "}
                          <span className="text-green-600 font-bold">₹{bid.amount?.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 lg:border-l lg:pl-6">
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                        {user?.role === "Sender" ? "Driver" : "Sender"}
                      </p>

                      {user?.role === "Sender" ? (
                        <div className="flex items-center gap-4">
                          <img src={bid.driver?.photo || "https://cdn-icons-png.flaticon.com/512/2202/2202112.png"} alt={bid.driver?.name} className="w-14 h-14 rounded-full object-cover border border-gray-200"/>
                          <div className="text-sm text-gray-700 space-y-0.5">
                            <p className="font-semibold text-gray-900 capitalize">{bid.driver?.name}</p>
                            <p className="text-gray-500">{bid.driver?.email}</p>
                            {bid.driver?.phone && <p className="text-gray-500">{bid.driver?.phone}</p>}
                            {bid.driver?.vehicleType && <p className="text-gray-500">{bid.driver?.vehicleType}</p>}
                            {bid.driver?.licenseNumber && <p className="text-gray-500">License: {bid.driver?.licenseNumber}</p>}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-4">
                          <img src={bid.load?.sender?.photo || "https://cdn-icons-png.flaticon.com/512/2202/2202112.png"} alt={bid.load?.sender?.name} className="w-14 h-14 rounded-full object-cover border border-gray-200"/>
                          <div className="text-sm text-gray-700 space-y-0.5">
                            <p className="font-semibold text-gray-900 capitalize">{bid.load?.sender?.name}</p>
                            <p className="text-gray-500">{bid.load?.sender?.email}</p>
                            {bid.load?.sender?.phone && <p className="text-gray-500">{bid.load?.sender?.phone}</p>}
                          </div>
                        </div>
                      )}

                      {user?.role === "Driver" && (
                        <div className="mt-4">
                          {loadStatus === "ASSIGNED" && (
                            <button onClick={() => handleStatusUpdate(bid.load._id, "IN_TRANSIT")} className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium px-5 py-2 rounded-lg transition">
                              🚚 Start Transit
                            </button>
                          )}
                          {loadStatus === "IN_TRANSIT" && (
                            <button onClick={() => handleStatusUpdate(bid.load._id, "DELIVERED")} className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition">
                              ✅ Mark as Delivered
                            </button>
                          )}
                          {loadStatus === "DELIVERED" && (
                            <span className="text-green-600 font-semibold text-sm">✔ Delivered</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="border-t pt-5">
                    <TrackingBar status={loadStatus} />
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default WinningBidList;