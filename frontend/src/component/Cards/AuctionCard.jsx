import { IoLocationOutline, IoTimeOutline } from "react-icons/io5";

const AuctionCard = ({ auction }) => {
  const { title,pickupLocation,dropLocation,vehicleType,cargoType,lowestBid,timeLeftMinutes,isVerified,totalBids = 0,
  } = auction;

  const timeLabel = timeLeftMinutes<=0 ? "Ended" : timeLeftMinutes<60 ? `${timeLeftMinutes} min left`
      : `${Math.floor(timeLeftMinutes/60)}h ${timeLeftMinutes%60}m left`;

  return (
    <div className="relative bg-slate-100 rounded-2xl shadow-md p-5 flex flex-col justify-between border border-slate-100 hover:shadow-xl transition">
      {timeLeftMinutes>0 && (
        <span className="absolute top-4 right-4 text-xs font-semibold bg-red-100 text-red-600 px-3 py-1 rounded-full">
          LIVE
        </span>
      )}

      <div className="mb-4">
        <h3 className="font-semibold text-slate-800 text-base line-clamp-1">
          {title || "Freight Load"}
        </h3>

        <div className="flex items-center gap-2 text-slate-600 mt-1">
          <IoLocationOutline className="text-slate-500" />
          <span className="text-sm">
            {pickupLocation} → {dropLocation}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm text-slate-600 mb-4">
        <div>
          <p className="text-xs text-slate-400">Vehicle</p>
          <p className="font-medium">{vehicleType}</p>
        </div>

        <div>
          <p className="text-xs text-slate-400">Cargo</p>
          <p className="font-medium">{cargoType}</p>
        </div>
      </div>

      <div className="mb-4">
        {lowestBid !== null ? (
          <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3">
            <p className="text-xs text-slate-500">Current Lowest Bid</p>
            <p className="text-green-700 text-lg font-semibold"> ₹{lowestBid.toLocaleString()}</p>
            <p className="text-xs text-slate-500">{totalBids} bids placed</p>
          </div>) : (
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
            <p className="text-sm text-slate-400">No bids yet</p>
          </div>
        )}

        {isVerified && (
          <p className="mt-2 text-xs text-blue-600 font-medium"> ✔ Verified Load</p>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div className="flex items-center gap-1 text-slate-500 text-sm">
          <IoTimeOutline />
          <span>{timeLabel}</span>
        </div>

        <button
          disabled={timeLeftMinutes <= 0}
          className={`px-5 py-2 rounded-full text-sm font-medium transition ${timeLeftMinutes <= 0 ? "bg-slate-300 text-slate-500 cursor-not-allowed" : "bg-slate-900 text-white hover:bg-slate-800"}`}>
          Place Bid
        </button>
      </div>
    </div>
  );
};

export default AuctionCard;
