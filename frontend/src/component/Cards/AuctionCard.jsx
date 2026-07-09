import { NavLink } from "react-router-dom";
import { IoLocationOutline, IoTimeOutline } from "react-icons/io5";

const AuctionCard = ({ auction }) =>{
  const { _id, title, pickupLocation, dropLocation, vehicleType, cargoType, lowestBid, timeLeftMinutes, totalBids = 0, sender } = auction;

  const timeLabel = timeLeftMinutes<=0 ? "Ended" : timeLeftMinutes<60 ? `${timeLeftMinutes} min left`
      : `${Math.floor(timeLeftMinutes/60)}h ${timeLeftMinutes%60}m left`;

  return (
    <div className="relative bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col justify-between hover:shadow-md transition">
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
        {lowestBid != null ? (
          <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3">
            <p className="text-xs text-slate-500">Current Lowest Bid</p>
            <p className="text-green-700 text-lg font-semibold"> ₹{Number(lowestBid).toLocaleString()}</p>
            <p className="text-xs text-slate-500">{totalBids} bids placed</p>
          </div>) : (
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
            <p className="text-sm text-slate-400">No bids yet</p>
          </div>
        )}

        {sender && (
          <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
            <img src={sender.photo} alt={sender.name} className="w-5 h-5 rounded-full object-cover" />
            <span className="font-medium text-gray-700">Posted by {sender.name}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div className="flex items-center gap-1 text-slate-500 text-sm">
          <IoTimeOutline />
          <span>{timeLabel}</span>
        </div>

        {timeLeftMinutes > 0 ? (
          <NavLink to={`/load/${_id}`} className="px-5 py-2 rounded-full text-sm font-medium bg-slate-900 text-white hover:bg-slate-700 transition">
            Place Bid
          </NavLink>
        ) : (
          <span className="px-5 py-2 rounded-full text-sm font-medium bg-slate-200 text-slate-400 cursor-not-allowed">
            Ended
          </span>
        )}
      </div>
    </div>
  );
};

export default AuctionCard;
