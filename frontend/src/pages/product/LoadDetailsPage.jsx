import { Body, Caption, Container, Title } from "../../routes/index";
import { commonClassNameOfInput } from "../../component/common/Design";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getLoad, placeBid, updateTracking } from "../../redux/features/loadSlice";
import { createPaymentOrder, verifyPayment, fetchPaymentDetails } from "../../redux/features/paymentSlice";
import { toast } from "react-toastify";
import { FiPackage, FiTruck, FiCheckCircle, FiCreditCard, FiCheck } from "react-icons/fi";
import { BACKEND_URL } from "../../utils/url";
import { useWebSocket } from "../../hooks/useWebSocket";
import TrackingBar from "../../component/common/TrackingBar";
import { FALLBACK_IMAGE } from "../../utils/data";
import axios from "axios";

export const LoadDetailsPage = () =>{
  const [activeTab, setActiveTab] = useState("description");
  const [bidAmount, setBidAmount] = useState("");
  const [isLoadingBid, setIsLoadingBid] = useState(false);
  const [bids, setBids] = useState([]);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    ended: false,
  });

  const {id} = useParams();
  const dispatch = useDispatch();

  const {load, isLoading} = useSelector((state) => state.load);
  const {user} = useSelector((state) => state.auth);

  const fetchBids = async () =>{
    try {
      const response = await axios.get(`${BACKEND_URL}/bidding/${id}`, {
        withCredentials: true,
        timeout: 10000,
      });
      if (response.data?.data) setBids(response.data.data);
    } catch (err) {
      console.error("Failed to fetch bids:", err);
    }
  };

  useWebSocket(id, {
    newBid: (event) => {
      setBids((prev) => {
        const exists = prev.some((b) => b._id === event.bid._id);
        if (exists) return prev;
        return [...prev, event.bid].sort(
          (a, b) => new Date(b.createdAt || b.bidTime) - new Date(a.createdAt || a.bidTime)
        );
      });
    },
    loadStatusChange: (event) => {
      dispatch(getLoad(id));
    },
  });

  useEffect(() =>{
    if(id){
      dispatch(getLoad(id));
      fetchBids();
    }
  },[id, dispatch]);

  useEffect(() => {
    if (id && ["PAYMENT_PENDING", "ASSIGNED"].includes(load?.status)) {
      dispatch(fetchPaymentDetails(id)).then((res) => {
        if (res.payload?.data) setPaymentInfo(res.payload.data);
      });
    }
  }, [id, load?.status, dispatch]);

  // Countdown logic
  useEffect(() =>{
    if(!load?.bidEndTime) return;

    const interval =setInterval(() =>{
      const end = new Date(load.bidEndTime).getTime();
      const now= Date.now();
      const distance = end - now;

      if(distance <= 0){
        clearInterval(interval);
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

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayNow = async () => {
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      toast.error("Failed to load payment gateway. Please try again.");
      return;
    }

    const result = await dispatch(createPaymentOrder(load._id));
    if (result.meta.requestStatus === "rejected") return;

    const { orderId, amount } = result.payload;

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount,
      currency: "INR",
      name: "CargoSetu",
      description: `Payment for load: ${load.title}`,
      order_id: orderId,
      handler: async (response) => {
        const verifyResult = await dispatch(verifyPayment({
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
        }));
        if (verifyResult.meta.requestStatus === "fulfilled") {
          dispatch(getLoad(load._id));
        }
      },
      modal: {
        ondismiss: () => {
          toast.info("Payment cancelled. You can try again.");
        },
      },
      theme: { color: "#5BBB7B" },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", (response) => {
      toast.error(`Payment failed: ${response.error.description}`);
    });
    rzp.open();
  };

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
      if(bidAmountNum > currentLowest){
        toast.error(`Your bid must be ₹${currentLowest} or lower`);
        return;
      }}

    setIsLoadingBid(true);
    try {
      const result = await dispatch(placeBid({ id, amount: bidAmountNum}));
      if(result.meta.requestStatus === "fulfilled"){
        toast.success("Bid placed successfully");
        setBidAmount("");
        await fetchBids();
      }else{
        toast.error(result.payload || "Failed to place bid. Try again.");
      }
    } finally {
      setIsLoadingBid(false);
    }
  };

  const handleTrackingUpdate = (loadId, status)=>{
  const label = status === "IN_TRANSIT" ? "mark as In Transit" : "mark as Delivered";
  if(window.confirm(`Are you sure you want to ${label}?`)){
    dispatch(updateTracking({ loadId, status }));
  }};

  if(isLoading) return <p className="pt-24 text-center">Loading...</p>;

  if(!load) return <p className="pt-24 text-center">Load not found</p>;

  const auctionEndUTC = load?.bidEndTime ? new Date(load.bidEndTime).toUTCString() : null;

  const sortedBids = Array.isArray(bids) && bids.length > 0  ? [...bids].sort((a, b) => new Date(b.createdAt || b.bidTime) - new Date(a.createdAt || a.bidTime)) : [];

  const lowestBid = sortedBids.length > 0 ? Math.min(...sortedBids.map(b => b.amount)) : null;
  return (
    <section className="pt-24 px-4 sm:px-8">
      <Container>
        <div className="flex flex-col lg:flex-row gap-10">
          {/* IMAGE */}
          <div className="lg:w-1/2">
            <div className="h-64 sm:h-[70vh]">
              <img src={ load?.images?.[0]?.url || FALLBACK_IMAGE} alt={load?.title} className="w-full h-full object-cover rounded-xl"/>
            </div>
          </div>

          <div className="lg:w-1/2">
            <Title level={2}>{load?.title}</Title>
            <div className="flex flex-wrap items-center justify-between gap-2 mt-4">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                {load?.status?.replace("_", " ")}
              </span>
              {load?.sender && (
                <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full">
                  <img src={load.sender.photo} alt={load.sender.name} className="w-5 h-5 rounded-full object-cover" />
                  <span className="font-medium text-gray-700">Posted by {load.sender.name}</span>
                </div>
              )}
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

            {user?.role === "Driver" && load?.status === "BIDDING" && !timeLeft.ended && (
              <div className="mt-6 p-6 bg-gray-50 border rounded-lg">
                <Caption className="text-gray-600 font-medium mb-3">Place Your Bid</Caption>
                <form className="flex flex-col sm:flex-row gap-3" onSubmit={handleBidSubmit}>
                  <input
                    className={commonClassNameOfInput}
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder={lowestBid ? `Must be ₹${lowestBid} or lower` : "Enter your bid amount"}
                    min="1"
                    step="1"
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
              </div>
            )}

            {user?.role === "Sender" && load?.status === "BIDDING" && timeLeft.ended && (
              <div className="mt-6 p-6 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
                <p className="text-sm text-yellow-800 font-medium">
                  Bidding has ended. Winner will be selected automatically — check back for payment status.
                </p>
              </div>
            )}

            {["PAYMENT_PENDING", "ASSIGNED", "IN_TRANSIT", "DELIVERED"].includes(load?.status) && load?.assignedDriver && (
              <div className="mt-6 p-6 bg-green-50 border-2 border-green-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <img
                    src={load.assignedDriver.photo || FALLBACK_IMAGE}
                    alt={load.assignedDriver.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-green-300"
                  />
                  <div>
                    <p className="text-sm font-bold text-green-800">Winner Driver</p>
                    <p className="text-base font-semibold text-gray-800">{load.assignedDriver.name}</p>
                    <p className="text-xs text-gray-500">{load.assignedDriver.email}</p>
                  </div>
                </div>
              </div>
            )}

            {user?.role === "Sender" && load?.status === "PAYMENT_PENDING" && (
              <div className="mt-6 p-6 border-2 border-yellow-300 bg-yellow-50 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <FiCreditCard size={24} className="text-yellow-600" />
                  <div>
                    <p className="font-semibold text-gray-800">Payment Pending</p>
                    <p className="text-sm text-gray-600">Complete payment to assign the driver</p>
                  </div>
                </div>
                {paymentInfo?.commissionPercentage && (
                  <div className="mb-4 p-3 bg-white rounded-lg border border-yellow-200 space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bid Amount</span>
                      <span className="font-medium">₹{paymentInfo.amount?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Platform Fee ({paymentInfo.commissionPercentage}%)</span>
                      <span className="font-medium text-orange-600">₹{paymentInfo.commissionAmount?.toLocaleString()}</span>
                    </div>
                    <hr className="border-dashed border-gray-300 my-1" />
                    <div className="flex justify-between font-semibold text-gray-800">
                      <span>Total Payable</span>
                      <span>₹{paymentInfo.amount?.toLocaleString()}</span>
                    </div>
                  </div>
                )}
                <button
                  onClick={handlePayNow}
                  className="w-full bg-green text-white font-semibold py-3 rounded-lg hover:bg-primary transition shadow-md"
                >
                  Proceed to Pay ₹{paymentInfo ? paymentInfo.amount?.toLocaleString() : load?.lowestBid?.amount?.toLocaleString() || "—"}
                </button>
              </div>
            )}

            {user?.role === "Sender" && paymentInfo?.paymentStatus === "SUCCESSFUL" && (
              <div className="mt-6 p-6 border-2 border-green-300 bg-green-50 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <FiCheck size={24} className="text-green-600" />
                  <div>
                    <p className="font-semibold text-green-800">Payment Successful</p>
                    <p className="text-sm text-green-700">
                      Transaction ID: {paymentInfo.transactionId}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      Paid on {new Date(paymentInfo.paidAt).toLocaleString()} &middot; ₹{paymentInfo.amount?.toLocaleString()}
                    </p>
                  </div>
                </div>
                {paymentInfo?.commissionPercentage && (
                  <div className="p-3 bg-white rounded-lg border border-green-200 space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bid Amount</span>
                      <span className="font-medium">₹{paymentInfo.amount?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Platform Fee ({paymentInfo.commissionPercentage}%)</span>
                      <span className="font-medium text-orange-600">-₹{paymentInfo.commissionAmount?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Driver Earnings</span>
                      <span className="font-medium text-green-600">₹{paymentInfo.driverAmount?.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
    
            {["PAYMENT_PENDING", "ASSIGNED", "IN_TRANSIT", "DELIVERED"].includes(load?.status) && (
              <div className="mt-8 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-1">Delivery Tracking</p>
                    <p className="text-sm text-gray-600">Track your shipment progress in real-time</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">{load?.status === "DELIVERED" ? <FiCheckCircle size={28} /> : load?.status === "IN_TRANSIT" ? <FiTruck size={28} /> : <FiPackage size={28} />}</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 mb-6">
                  <TrackingBar status={load.status} />
                </div>

                {user?.role === "Driver" && String(load?.assignedDriver) === String(user?._id) && (
                  <div className="flex flex-col sm:flex-row gap-3">
                    {load.status === "ASSIGNED" && (
                      <button 
                        onClick={() => handleTrackingUpdate(load._id, "IN_TRANSIT")} 
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                      >
                        Start Transit
                      </button>
                    )}
                    {load.status === "IN_TRANSIT" && (
                      <button 
                        onClick={() => handleTrackingUpdate(load._id, "DELIVERED")} 
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                      >
                        Mark as Delivered
                      </button>
                    )}
                    {load.status === "DELIVERED" && (
                      <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-md">
                        <FiCheckCircle size={20} />
                        Successfully Delivered
                      </div>
                    )}
                  </div>
                )}

                {user?.role === "Sender" && load.status === "DELIVERED" && (
                  <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-md">
                    <FiCheckCircle size={20} />
                    Your load has been delivered!
                  </div>
                )}

                <div className="mt-4 text-xs text-gray-600 bg-white rounded p-3">
                  <strong>Status:</strong> {load?.status?.replace(/_/g, " ")} 
                  {load?.deliveryDate && <> • Delivered: {new Date(load.deliveryDate).toLocaleDateString()}</>}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-10">
          <div className="flex flex-wrap gap-2 sm:gap-4">
            {["description", "auctionHistory"].map((tab) => (
              <button key={tab} className={`px-6 py-3 rounded-lg border transition ${ activeTab === tab ? "bg-green_100 text-green font-semibold" : "bg-white hover:bg-gray-100"}`} onClick={() => handleTabClick(tab)}>
                {tab === "description" ? "Description" : `Auction History (${sortedBids.length})`}
              </button>
            ))}
          </div>

          <div className="mt-6">
            {activeTab === "description" && (
              <div className="bg-white shadow-s3 p-8 rounded-md">
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
                      <span className="font-medium">Status</span>
                      <span>{load?.status}</span>
                    </div>

                    <div className="flex justify-between border-b py-3">
                      <span className="font-medium">Created At</span>
                      <span>{new Date(load?.createdAt).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="h-[400px]">
                    <img src={load?.images?.[0]?.url || FALLBACK_IMAGE} alt={load?.title} className="w-full h-full object-cover rounded-xl"/>
                  </div>
                </div>
              </div>)}

            {activeTab === "auctionHistory" && (
              <AuctionHistory bids={sortedBids} />
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
                      {index === 0 ? 'Lowest' : `#${index + 1}`}
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