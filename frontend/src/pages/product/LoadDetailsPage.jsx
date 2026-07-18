import { Body, Caption, Container, Title } from "../../routes/index";
import { commonClassNameOfInput } from "../../component/common/Design";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getLoad, refreshLoad, placeBid, updateTracking } from "../../redux/features/loadSlice";
import { createPaymentOrder, verifyPayment, fetchPaymentDetails } from "../../redux/features/paymentSlice";
import { toast } from "react-toastify";
import { FiPackage, FiTruck, FiCheckCircle, FiCreditCard, FiCheck } from "react-icons/fi";
import { BACKEND_URL } from "../../utils/url";
import { useWebSocket } from "../../hooks/useWebSocket";
import TrackingBar from "../../component/common/TrackingBar";
import { FALLBACK_IMAGE } from "../../utils/data";
import axios from "axios";

const Shimmer = ({ className }) => <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;

const LoadSkeleton = () => (
  <section className="pt-24 px-4 sm:px-8">
    <Container>
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="lg:w-1/2">
          <Shimmer className="h-64 sm:h-[70vh] w-full rounded-xl" />
        </div>
        <div className="lg:w-1/2 space-y-5">
          <Shimmer className="h-8 w-3/4" />
          <div className="flex gap-2">
            <Shimmer className="h-6 w-20 rounded-full" />
            <Shimmer className="h-6 w-40 rounded-full" />
          </div>
          <div className="flex gap-6 p-4 bg-gray-50 rounded-xl">
            <div className="space-y-2"><Shimmer className="h-3 w-12" /><Shimmer className="h-6 w-20" /></div>
            <div className="w-px bg-gray-200" />
            <div className="space-y-2"><Shimmer className="h-3 w-12" /><Shimmer className="h-6 w-20" /></div>
            <div className="w-px bg-gray-200" />
            <div className="space-y-2"><Shimmer className="h-3 w-12" /><Shimmer className="h-6 w-12" /></div>
          </div>
          <div className="space-y-3">
            <Shimmer className="h-4 w-20" />
            <div className="flex gap-3">
              {[1,2,3,4].map(i => <Shimmer key={i} className="h-16 w-16 rounded-lg" />)}
            </div>
          </div>
          <Shimmer className="h-24 w-full rounded-lg" />
        </div>
      </div>
    </Container>
  </section>
);

export const LoadDetailsPage = () =>{
  const [activeTab, setActiveTab] = useState("description");
  const [bidAmount, setBidAmount] = useState("");
  const [isLoadingBid, setIsLoadingBid] = useState(false);
  const [bids, setBids] = useState([]);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [flashBidId, setFlashBidId] = useState(null);
  const flashTimer = useRef(null);
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

  const flashBid = (bidId) => {
    setFlashBidId(bidId);
    if (flashTimer.current) clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setFlashBidId(null), 2000);
  };

  useWebSocket(id, {
    newBid: (event) => {
      setBids((prev) => {
        const idx = prev.findIndex((b) => b._id === event.bid._id);
        if (idx !== -1) {
          const updated = [...prev];
          updated[idx] = { ...updated[idx], ...event.bid };
          flashBid(event.bid._id);
          return updated.sort(
            (a, b) => new Date(b.createdAt || b.bidTime) - new Date(a.createdAt || a.bidTime)
          );
        }
        flashBid(event.bid._id);
        return [...prev, event.bid].sort(
          (a, b) => new Date(b.createdAt || b.bidTime) - new Date(a.createdAt || a.bidTime)
        );
      });
    },
    bidDeleted: (event) => {
      setBids((prev) => prev.filter((b) => b._id !== event.bidId));
    },
    loadStatusChange: () => {
      dispatch(refreshLoad(id));
    },
    trackingUpdate: () => {
      dispatch(refreshLoad(id));
    },
    bidWon: () => {
      dispatch(refreshLoad(id));
    },
    loadUpdate: () => {
      dispatch(refreshLoad(id));
      fetchBids();
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

  if(isLoading) return <LoadSkeleton />;

  if(!load) return (
    <section className="pt-24 px-4 sm:px-8">
      <Container>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-6xl mb-4 text-gray-300">📦</div>
          <Title level={3} className="text-gray-500">Load not found</Title>
          <Caption className="text-gray-400 mt-2">This load may have been removed or doesn't exist.</Caption>
        </div>
      </Container>
    </section>
  );

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
                  <button type="submit" disabled={isLoadingBid} className="bg-green text-white px-6 py-3 rounded-lg hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center justify-center gap-2 min-w-[130px]">
                    {isLoadingBid ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                        </svg>
                        Placing...
                      </>
                    ) : "Submit Bid"}
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
              <AuctionHistory bids={sortedBids} flashBidId={flashBidId} userId={user?._id} />
            )}
          </div>
        </div>
      </Container>
    </section>
  );
};

const timeAgo = (date) => {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return new Date(date).toLocaleString();
};

export const AuctionHistory = ({bids = [], flashBidId, userId})=>{
  return (
    <div className="bg-white border rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <Title level={5}>Auction History — {bids.length} Bid{bids.length !== 1 ? "s" : ""}</Title>
        {bids.length > 0 && (
          <span className="text-xs text-gray-400">
            Lowest: <span className="text-green font-bold">₹{Math.min(...bids.map(b => b.amount)).toLocaleString()}</span>
          </span>
        )}
      </div>
      <div className="mt-2 overflow-x-auto">
        {bids.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <svg className="w-12 h-12 mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium">No bids placed yet</p>
            <p className="text-xs mt-1">Be the first to bid!</p>
          </div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-600 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-xs uppercase tracking-wider">Rank</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider">Driver</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider">Bid Amount</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider">Time</th>
              </tr>
            </thead>

            <tbody>
              {bids.map((bid, index)=> {
                const isLowest = index === 0;
                const isCurrentDriver = userId && bid.driver?._id === userId;
                const isFlashing = flashBidId === bid._id;

                return (
                  <tr key={bid._id}
                    className={`border-b transition-all duration-700 ${
                      isFlashing
                        ? 'bg-yellow-100'
                        : isLowest
                          ? 'bg-green-50'
                          : 'hover:bg-gray-50'
                    } ${isCurrentDriver ? 'ring-1 ring-inset ring-green-300' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 font-bold text-xs ${
                        isLowest ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {isLowest && (
                          <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" />
                          </svg>
                        )}
                        {isLowest ? "Lowest" : `#${index + 1}`}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {bid.driver?.photo && (
                          <img src={bid.driver.photo} alt="" className="w-6 h-6 rounded-full object-cover" />
                        )}
                        <span className={`font-medium truncate max-w-[120px] ${isCurrentDriver ? 'text-green-700' : ''}`}>
                          {bid.driver?.name || "Unknown"}
                          {isCurrentDriver && (
                            <span className="ml-1.5 text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-semibold">You</span>
                          )}
                        </span>
                      </div>
                    </td>
                    <td className={`px-4 py-3 font-bold ${isLowest ? 'text-green' : 'text-gray-800'}`}>
                      <span className={isFlashing ? 'text-yellow-600' : ''}>
                        ₹{bid.amount?.toLocaleString()}
                      </span>
                      {bid.updatedAt && bid.createdAt !== bid.updatedAt && (
                        <span className="ml-1.5 text-[10px] text-gray-400 font-normal">(updated)</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                      {timeAgo(bid.createdAt || bid.bidTime)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};