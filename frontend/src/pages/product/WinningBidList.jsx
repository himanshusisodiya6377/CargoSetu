import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Title } from "../../routes/index";
import { getWonBids, refreshWonBids, updateTracking } from "../../redux/features/loadSlice";
import { useRedirectLoggedOutUser } from "../../hooks/useRedirectLoggedOutUser";
import { useWebSocket } from "../../hooks/useWebSocket";
import { FiPackage, FiTruck, FiCheckCircle } from "react-icons/fi";
import TrackingBar from "../../component/common/TrackingBar";

export const WinningBidList = ()=>{
  useRedirectLoggedOutUser("/login");
  const [loadingId, setLoadingId] = useState(null);

  const dispatch = useDispatch();
  const {wonLoads,isLoading} = useSelector((state) => state.load);
  const {user} = useSelector((state) => state.auth);

  useEffect(()=>{
    dispatch(getWonBids());
  },[dispatch]);

  useWebSocket(null, {
    loadUpdate: useCallback(() => { dispatch(getWonBids()); }, [dispatch]),
    bidWon: useCallback(() => { dispatch(getWonBids()); }, [dispatch]),
    trackingUpdate: useCallback(() => { dispatch(refreshWonBids()); }, [dispatch]),
  });

  const handleStatusUpdate =(loadId,status)=>{
    const label = status === "IN_TRANSIT" ? "mark as In Transit" : "mark as Delivered";
    if(window.confirm(`Are you sure you want to ${label}?`)){
      setLoadingId(loadId);
      dispatch(updateTracking({loadId,status})).finally(() => setLoadingId(null));
    }};

  if(isLoading) return <p className="text-center py-10 text-gray-500">Loading...</p>;

  return(
    <section className="p-4 sm:p-8 min-h-screen bg-gray-50">
      <div className="mb-8">
        <Title level={3} className="font-bold text-gray-900 mb-2"> 
          {user?.role === "Sender" ? "Assigned Loads" : "Loads You Won"}
        </Title>
        <p className="text-gray-600">
          {user?.role === "Sender" ? "Drivers have been assigned to your loads. Track delivery progress and monitor shipments in real time." : "Manage your winning bids and update delivery status"}
        </p>
      </div>
      {wonLoads?.length === 0 ? (
        <div className="text-center py-14 text-gray-400">
          {user?.role === "Driver" ? "You haven't won any bids yet.": "None of your loads have been assigned yet."}
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {wonLoads?.map((bid) => {
            const loadStatus = bid.load?.status || "ASSIGNED";
            return (
              <div key={bid._id} className="border-2 border-gray-100 rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-lg overflow-hidden hover:shadow-xl transition-all">
                <div className={`px-6 py-3 text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2 ${loadStatus === "DELIVERED" ? "bg-gradient-to-r from-green to-green": loadStatus === "IN_TRANSIT" ? "bg-gradient-to-r from-yellow-500 to-yellow-600": loadStatus === "PAYMENT_PENDING" ? "bg-gradient-to-r from-orange-500 to-orange-600": "bg-gradient-to-r from-blue-500 to-blue-600"}`}>
                  {loadStatus === "DELIVERED" && <FiCheckCircle size={18} />}
                  {loadStatus === "IN_TRANSIT" && <FiTruck size={18} />}
                  {loadStatus === "ASSIGNED" && <FiPackage size={18} />}
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
                        <div className="mt-6 flex flex-col gap-2">
                          {bid.commissionPercentage && (
                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-1 text-sm mb-2">
                              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Earnings Breakdown</p>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Bid Amount</span>
                                <span className="font-medium">₹{bid.amount?.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Platform Fee ({bid.commissionPercentage}%)</span>
                                <span className="font-medium text-orange-600">-₹{bid.commissionAmount?.toLocaleString()}</span>
                              </div>
                              <hr className="border-dashed border-gray-300 my-1" />
                              <div className="flex justify-between font-semibold text-green-600">
                                <span>Estimated Earnings</span>
                                <span>₹{bid.driverAmount?.toLocaleString()}</span>
                              </div>
                            </div>
                          )}
                          {loadStatus === "ASSIGNED" && (
                            <button 
                              onClick={() => handleStatusUpdate(bid.load._id, "IN_TRANSIT")}
                              disabled={loadingId === bid.load._id}
                              className="w-full bg-green hover:bg-primary text-white font-bold text-base py-3 px-6 rounded-lg transition-colors shadow-md"
                            >
                              Start Transit
                            </button>
                          )}
                          {loadStatus === "IN_TRANSIT" && (
                            <button 
                              onClick={() => handleStatusUpdate(bid.load._id, "DELIVERED")}
                              disabled={loadingId === bid.load._id}
                              className="w-full bg-green hover:bg-primary text-white font-bold text-base py-3 px-6 rounded-lg transition-colors shadow-md"
                            >
                              Mark as Delivered
                            </button>
                          )}
                          {loadStatus === "DELIVERED" && (
                            <div className="flex flex-col gap-2">
                              <div className="w-full bg-green text-white font-bold text-base py-3 px-6 rounded-lg text-center shadow-md">
                                Delivered
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="border-t-2 border-gray-200 pt-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 -m-6 mt-0">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-3">Delivery Progress</p>
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