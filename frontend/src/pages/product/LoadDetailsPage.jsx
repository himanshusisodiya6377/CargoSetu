import { Body, Caption, Container, Title } from "../../routes/index";
import { commonClassNameOfInput } from "../../component/common/Design";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getLoad, getLoads, placeBidAndRefresh, sellLoad, updateTracking } from "../../redux/features/loadSlice";
import { toast } from "react-toastify";
import { FiPackage, FiTruck, FiCheckCircle } from "react-icons/fi";

const STEPS = [
  { key: "ASSIGNED",   label: "Assigned",   Icon: FiPackage },
  { key: "IN_TRANSIT", label: "In Transit",  Icon: FiTruck },
  { key: "DELIVERED",  label: "Delivered",   Icon: FiCheckCircle },
];

const TrackingBar = ({status}) =>{
  const current = STEPS.findIndex((s) => s.key === status);
  return (
    <div className="flex items-center w-full">
      {STEPS.map(({ key, label, Icon }, i)=>(
        <div key={key} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${ i < current  ? "bg-green-500 border-green-500 text-white" : i === current ? "bg-white border-green-500 text-green-600" : "bg-gray-50 border-gray-200 text-gray-300" }`}>
              <Icon size={18} />
            </div>
            <span className={`text-xs font-medium whitespace-nowrap ${i <= current ? "text-green-600" : "text-gray-400"}`}>{label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`flex-1 h-0.5 mx-2 mb-4 rounded transition-all ${
              i < current ? "bg-green-500" : "bg-gray-200"}`}/>)}
        </div>
      ))}
    </div>
  );
};

export const LoadDetailsPage = () =>{
  const [activeTab, setActiveTab] = useState("description");
  const [bidAmount, setBidAmount] = useState("");
  const [isLoadingBid, setIsLoadingBid] = useState(false);
  const [bids, setBids] = useState([]);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    ended: false,
  });

  const {id} = useParams();
  const dispatch = useDispatch();
  const pollingIntervalRef = useRef(null);

  const {load, isLoading} = useSelector((state) => state.load);
  const {user} = useSelector((state) => state.auth);

  const fetchBids = async () =>{
    try {
      const response = await fetch(`http://localhost:5000/api/bidding/${id}`,{
        credentials: "include",
      });
      const data = await response.json();
      if (data.data) setBids(data.data);
    } catch (err) {
      //silent — polling will retry
    }
  };

  useEffect(() =>{
    if(id){
      dispatch(getLoad(id));
      fetchBids();
    }
  },[id, dispatch]);

  //Poll for new bids every 8 seconds while auction is live
  useEffect(() =>{
    if(!id || !load?.bidEndTime) return;
    pollingIntervalRef.current = setInterval(fetchBids, 8000);
    return () => clearInterval(pollingIntervalRef.current);
  }, [id, load?.bidEndTime]);

  // Countdown logic
  useEffect(() =>{
    if(!load?.bidEndTime) return;

    const interval =setInterval(() =>{
      const end = new Date(load.bidEndTime).getTime();
      const now= Date.now();
      const distance = end - now;

      if(distance <= 0){
        clearInterval(interval);
        clearInterval(pollingIntervalRef.current);
        setTimeLeft((prev) =>({...prev, ended: true}));
        return;
      }

      setTimeLeft({
        days: Math.floor(distance/(1000*60*60*24)),
        hours: Math.floor(
          (distance%(1000*60*60*24))/(1000*60*60)),
        minutes: Math.floor((distance%(1000*60*60))/(1000*60)),
        seconds: Math.floor((distance%(1000*60))/1000),
        ended: false,
      });
    },1000);

    return () =>clearInterval(interval);
  },[load?.bidEndTime]);

  const handleTabClick = (tab)=>setActiveTab(tab);

  const handleBidSubmit = async (e)=>{
    e.preventDefault();
  
    if(!bidAmount){
      toast.error("Please enter a bid amount");
      return;
    }

    const bidAmountNum = Number(bidAmount);
    
    if(bidAmountNum <= 0){
      toast.error("Bid amount must be greater than 0");
      return;
    }

    //Check if bid is lower than current lowest bid
    if(bids && bids.length > 0){
      const currentLowest = Math.min(...bids.map(b => b.amount));
      if(bidAmountNum >= currentLowest){
        toast.error(`Your bid must be lower than the current lowest bid ₹${currentLowest}`);
        return;
      }}

    setIsLoadingBid(true);
    const result = await dispatch(placeBidAndRefresh({ id, amount: bidAmountNum}));
    if(result.meta.requestStatus === "fulfilled"){
      toast.success("Bid placed successfully!");
      setBidAmount("");
      fetchBids();         
      dispatch(getLoads()); 
    }else{
      toast.error(result.payload || "Failed to place bid. Try again.");
    }
    setIsLoadingBid(false)};

  const handleAssignDriver = (loadId)=>{
    if(window.confirm("Assign this load to lowest bidder?")){
      dispatch(sellLoad(loadId));
    }};

  const handleTrackingUpdate = (loadId, status)=>{
  const label = status === "IN_TRANSIT" ? "mark as In Transit" : "mark as Delivered";
  if(window.confirm(`Are you sure you want to ${label}?`)){
    dispatch(updateTracking({ loadId, status }));
  }};

  if(isLoading) return <p className="pt-24 text-center">Loading...</p>;

  if(!load) return <p className="pt-24 text-center">Load not found</p>;

  const auctionEndUTC = load?.bidEndTime ? new Date(load.bidEndTime).toUTCString() : null;

  const sortedBids =bids && bids.length > 0  ? [...bids].sort((a, b) => new Date(b.createdAt || b.bidTime) - new Date(a.createdAt || a.bidTime)) : [];

  const lowestBid = sortedBids.length > 0 ? Math.min(...sortedBids.map(b => b.amount)) : null;
  return (
    <section className="pt-24 px-4 sm:px-8">
      <Container>
        <div className="flex flex-col lg:flex-row gap-10">
          {/* IMAGE */}
          <div className="lg:w-1/2">
            <div className="h-64 sm:h-[70vh]">
              <img src={ load?.images?.[0]?.url || "https://bidout-wp.b-cdn.net/wp-content/uploads/2022/10/Image-14.jpg"} alt={load?.title} className="w-full h-full object-cover rounded-xl"/>
            </div>
          </div>

          <div className="lg:w-1/2">
            <Title level={2}>{load?.title}</Title>
            <Body className="mt-3">
              {load?.description?.slice(0, 150)}
            </Body>
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${load?.isVerified ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                {load?.isVerified ? "✔ Verified" : "Not Verified"}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                {load?.status?.replace("_", " ")}
              </span>
            </div>

            <div className="flex gap-6 mt-5 bg-gray-50 rounded-xl p-4">
              <div className="text-center">
                <p className="text-xs text-gray-400">Budget</p>
                <p className="text-lg font-bold text-gray-800">₹{load?.maxBudget?.toLocaleString()}</p>
              </div>
              <div className="w-px bg-gray-200" />
              <div className="text-center">
                <p className="text-xs text-gray-400">Lowest Bid</p>
                <p className="text-lg font-bold text-green">{lowestBid ? `₹${lowestBid?.toLocaleString()}` : "—"}</p>
              </div>
              <div className="w-px bg-gray-200" />
              <div className="text-center">
                <p className="text-xs text-gray-400">Total Bids</p>
                <p className="text-lg font-bold text-gray-800">{bids?.length || 0}</p>
              </div>
            </div>

            <div className="mt-6">
              <Caption className="text-gray-500">Time Left</Caption>
              {!timeLeft.ended ? (
                <div className="flex flex-wrap gap-3 mt-3 text-center">
                  {[{ label: "Days", value: timeLeft.days },
                    { label: "Hours", value: timeLeft.hours },
                    { label: "Minutes", value: timeLeft.minutes },
                    { label: "Seconds", value: timeLeft.seconds },
                  ].map((item, i) =>(
                    <div key={i} className="p-3 px-4 bg-white border rounded-lg shadow-sm">
                      <Title level={4}>{item.value}</Title>
                      <Caption>{item.label}</Caption>
                    </div>
                  ))}
                </div>
              ) : (
                <Caption className="text-red-500 font-semibold">
                  Bidding Ended
                </Caption>
              )}
            </div>

            <div className="mt-3">
              <Caption className="text-gray-400 text-xs"> Ends: {auctionEndUTC} </Caption>
            </div>

            {user?.role === "Driver" && load?.status === "OPEN" && !timeLeft.ended && (
              <div className="mt-6 p-6 bg-gray-50 border rounded-lg">
                {!load?.isVerified ? (
                  <Caption className="text-red-500 font-medium">
                    ⚠ This load is not yet verified by admin. Bidding will open once verified.
                  </Caption>
                ) : (
                  <>
                    <Caption className="text-gray-600 font-medium mb-3">Place Your Bid</Caption>
                    <form className="flex flex-col sm:flex-row gap-3" onSubmit={handleBidSubmit}>
                      <input
                        className={commonClassNameOfInput}
                        type="number"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        placeholder={lowestBid ? `Must be below ₹${lowestBid}` : "Enter your bid amount"}
                        min="1"
                        step="100"
                        disabled={isLoadingBid}
                      />
                      <button type="submit" disabled={isLoadingBid} className="bg-green text-white px-6 py-3 rounded-lg hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap">
                        {isLoadingBid ? "Placing..." : "Submit Bid"}
                      </button>
                    </form>
                    {lowestBid && (
                      <Caption className="text-gray-500 mt-2">
                        Current lowest bid: ₹{lowestBid} — bid lower to compete
                      </Caption>
                    )}
                  </>
                )}
              </div>
            )}

            {user?.role === "Sender" && load?.status === "OPEN" && timeLeft.ended && (
              <div className="mt-6">
                <button onClick={() => handleAssignDriver(load._id)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg transition">
                  Assign Lowest Bidder
                </button>
              </div>
            )}
    
            {["ASSIGNED", "IN_TRANSIT", "DELIVERED"].includes(load?.status) && (
              <div className="mt-6 bg-gray-50 border border-gray-100 rounded-xl p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">Delivery Tracking</p>
                <TrackingBar status={load.status} />
                {user?.role === "Driver" && String(load?.assignedDriver) === String(user?._id) && (
                  <div className="mt-5 flex gap-3">
                    {load.status === "ASSIGNED" && (
                      <button onClick={() => handleTrackingUpdate(load._id, "IN_TRANSIT")} className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium px-5 py-2 rounded-lg transition">
                        🚚 Start Transit
                      </button>
                    )}
                    {load.status === "IN_TRANSIT" && (
                      <button onClick={() => handleTrackingUpdate(load._id, "DELIVERED")} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition">
                        ✅ Mark as Delivered
                      </button>
                    )}
                    {load.status === "DELIVERED" && (
                      <span className="text-green-600 font-semibold text-sm">✔ Successfully Delivered</span>
                    )}
                  </div>
                )}

                {user?.role === "Sender" && load.status === "DELIVERED" && (
                  <p className="mt-4 text-green-600 font-semibold text-sm">
                    ✔ Your load has been delivered!
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-10">
          <div className="flex flex-wrap gap-2 sm:gap-4">
            {["description", "auctionHistory", "reviews"].map((tab) => (
              <button key={tab} className={`px-6 py-3 rounded-lg border transition ${ activeTab === tab ? "bg-green text-white" : "bg-white hover:bg-gray-100"}`} onClick={() => handleTabClick(tab)}>
                {tab === "description" ? "Description" : tab === "auctionHistory"? `Auction History (${sortedBids.length})`: "Reviews"}
              </button>
            ))}
          </div>

          <div className="mt-6">
            {activeTab === "description" && (
              <div className="shadow-s3 p-8 rounded-md">
                <Title level={4}>Description</Title>
                <br />
                <Caption className="leading-7 text-gray-600">
                  {load?.description}
                </Caption>
                <br />
                <br />

                <Title level={4}>Load Overview</Title>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
                  {/* LEFT TABLE */}
                  <div className="space-y-3">
                    <div className="flex justify-between border-b py-3">
                      <span className="font-medium">Pickup Location</span>
                      <span>{load?.pickupLocation}</span>
                    </div>

                    <div className="flex justify-between border-b py-3">
                      <span className="font-medium">Drop Location</span>
                      <span>{load?.dropLocation}</span>
                    </div>

                    <div className="flex justify-between border-b py-3">
                      <span className="font-medium">Length</span>
                      <span>{load?.dimensions?.length || "N/A"} m</span>
                    </div>

                    <div className="flex justify-between border-b py-3">
                      <span className="font-medium">Width</span>
                      <span>{load?.dimensions?.width || "N/A"} m</span>
                    </div>

                    <div className="flex justify-between border-b py-3">
                      <span className="font-medium">Height</span>
                      <span>{load?.dimensions?.height || "N/A"} m</span>
                    </div>

                    <div className="flex justify-between border-b py-3">
                      <span className="font-medium">Weight</span>
                      <span>{load?.weight} kg</span>
                    </div>

                    <div className="flex justify-between border-b py-3">
                      <span className="font-medium">Vehicle Type</span>
                      <span>{load?.vehicleType}</span>
                    </div>

                    <div className="flex justify-between border-b py-3">
                      <span className="font-medium">Cargo Type</span>
                      <span>{load?.cargoType}</span>
                    </div>

                    <div className="flex justify-between border-b py-3">
                      <span className="font-medium">Budget</span>
                      <span>₹{load?.maxBudget}</span>
                    </div>

                    <div className="flex justify-between border-b py-3">
                      <span className="font-medium">Verified</span>
                      <span>{load?.isVerified ? "Yes" : "No"}</span>
                    </div>

                    <div className="flex justify-between border-b py-3">
                      <span className="font-medium">Status</span>
                      <span>{load?.status}</span>
                    </div>

                    <div className="flex justify-between border-b py-3">
                      <span className="font-medium">Created At</span>
                      <span>{new Date(load?.createdAt).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="h-[400px]">
                    <img src={load?.images?.[0]?.url || "https://bidout-wp.b-cdn.net/wp-content/uploads/2022/10/Image-14.jpg"} alt={load?.title} className="w-full h-full object-cover rounded-xl"/>
                  </div>
                </div>
              </div>)}

            {activeTab === "auctionHistory" && (
              <AuctionHistory bids={sortedBids} />
            )}

            {activeTab === "reviews" && (
              <div className="p-6 border rounded-lg shadow-sm">
                <Title level={5} className="text-red-500"> Coming Soon!</Title>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
};

export const AuctionHistory = ({bids = []})=>{
  return (
    <div className="bg-white border rounded-xl shadow-sm p-6">
      <Title level={5}>Auction History - {bids.length} Bids</Title>
      <div className="mt-4 overflow-x-auto">
        {bids.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No bids placed yet. Be the first to bid!</p>
          </div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-600 sticky top-0">
              <tr>
                <th className="px-4 py-3">Bid Rank</th>
                <th className="px-4 py-3">Driver Name</th>
                <th className="px-4 py-3">Bid Amount</th>
                <th className="px-4 py-3">Time</th>
              </tr>
            </thead>

            <tbody>
              {bids.map((bid, index)=>(
                <tr key={bid._id} className={`border-b ${index === 0 ? 'bg-green-50' : 'hover:bg-gray-50'}`}>
                  <td className="px-4 py-3">
                    <span className={`font-bold ${index === 0 ? 'text-green-600' : ''}`}>
                      {index === 0 ? '🏆 Lowest' : `#${index + 1}`}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium">{bid?.driver?.name || "Unknown"}</td>
                  <td className="px-4 py-3 font-bold text-green">₹{bid.amount}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(bid.createdAt || bid.bidTime).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};