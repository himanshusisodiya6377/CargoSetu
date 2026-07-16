import { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLoads } from "../redux/features/loadSlice";
import { Container, Title, Body, Caption } from "../routes/index";
import AuctionCard from "../component/Cards/AuctionCard";
import { FiFilter } from "react-icons/fi";
import { vehicleOptions,cargoOptions } from "../utils/data.jsx";
import { useWebSocket } from "../hooks/useWebSocket";

const LiveAuctions = () =>{
  const dispatch = useDispatch();
  const {loads, isLoading} = useSelector((state) => state.load);

  const [filters, setFilters] = useState({
    from: "", to: "", vehicleType: "", cargoType: "",
    minPrice: "", maxPrice: "", timeLeft: "all",
    verifiedOnly: false,
  });
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() =>{ dispatch(getLoads())},[dispatch]);

  useWebSocket(null, {
    loadUpdate: useCallback(() => {
      dispatch(getLoads());
    }, [dispatch]),
  });

  const live = useMemo(()=>{
    const now = new Date();
    const raw = Array.isArray(loads?.data) ? loads.data : Array.isArray(loads) ? loads : [];
    return raw.filter((l) => ["OPEN", "BIDDING"].includes(l.status) && new Date(l.bidEndTime) > now).map((l) =>{
        const ms = new Date(l.bidEndTime) - now;
        return { ...l, lowestBid: l.currentLowestBid, bidCount: l.totalBids, timeLeftMinutes: Math.floor(ms / 60000) };
      });
  },[loads]);

  const filtered = useMemo(() => live.filter((l) =>{
    if(filters.from && !l.pickupLocation?.toLowerCase().includes(filters.from.toLowerCase())) return false;
    if(filters.to   && !l.dropLocation?.toLowerCase().includes(filters.to.toLowerCase()))   return false;
    if(filters.vehicleType && l.vehicleType !== filters.vehicleType) return false;
    if(filters.cargoType   && l.cargoType   !== filters.cargoType)   return false;
    if(filters.minPrice && l.lowestBid !== null && l.lowestBid < Number(filters.minPrice)) return false;
    if(filters.maxPrice && l.lowestBid !== null && l.lowestBid > Number(filters.maxPrice)) return false;
    if(filters.timeLeft === "1h"  && l.timeLeftMinutes > 60) return false;
    if(filters.timeLeft === "30m" && l.timeLeftMinutes > 30) return false;
    if(filters.verifiedOnly && !l.sender?.isVerified) return false;
    return true;
  }),[live, filters]);

  const set = (key, val) =>setFilters((p) => ({...p,[key]: val}));

  return (
    <div>
      <section className="bg-slate-900 pt-24 pb-16">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="live-dot" aria-hidden="true" />
                <Caption className="text-green-400 uppercase tracking-widest">Live Now</Caption>
              </div>
              <Title level={3} className="text-white leading-tight">
                <span className="text-yellow-300">Live Freight</span> Auctions
              </Title>
              <Body className="text-slate-400 mt-3 max-w-xl">
                Browse verified loads and place competitive bids before time runs out.
              </Body>
            </div>
            <div className="flex gap-4 shrink-0">
              <div className="bg-slate-800 rounded-xl px-5 py-3 text-center">
                <p className="text-yellow-300 font-bold text-xl">{live.length}</p>
                <p className="text-slate-400 text-xs mt-0.5">Live Auctions</p>
              </div>
              <div className="bg-slate-800 rounded-xl px-5 py-3 text-center">
                <p className="text-yellow-300 font-bold text-xl">{filtered.length}</p>
                <p className="text-slate-400 text-xs mt-0.5">Matching</p>
              </div>
            </div>
          </div>
        </Container>
      </section>
      <div className="bg-white w-full h-20 rounded-t-[40px] -mt-5" />

      <section className="bg-white pb-20">
        <Container>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-slate-700">
              {filtered.length} load{filtered.length !== 1 ? "s" : ""} found
            </h2>
            <button onClick={() => setShowFilters((s) => !s)} className="flex items-center gap-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg px-4 py-2 hover:border-slate-400 transition">
              <FiFilter size={14} />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
          </div>
          {showFilters && (
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <input value={filters.from} onChange={(e) => set("from", e.target.value)}
                placeholder="From city" className={inp} />
              <input value={filters.to} onChange={(e) => set("to", e.target.value)}
                placeholder="To city" className={inp} />

              <select value={filters.vehicleType} onChange={(e) => set("vehicleType", e.target.value)} className={inp}>
                <option value="">All Vehicles</option>
                {vehicleOptions.map((v) => <option key={v} value={v}>{v.replace("_", " ")}</option>)}
              </select>

              <select value={filters.cargoType} onChange={(e) => set("cargoType", e.target.value)} className={inp}>
                <option value="">All Cargo</option>
                {cargoOptions.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>

              <input type="number" value={filters.minPrice} onChange={(e) => set("minPrice", e.target.value)}
                placeholder="Min bid (₹)" className={inp} />
              <input type="number" value={filters.maxPrice} onChange={(e) => set("maxPrice", e.target.value)}
                placeholder="Max bid (₹)" className={inp} />

              <select value={filters.timeLeft} onChange={(e) => set("timeLeft", e.target.value)} className={inp}>
                <option value="all">All Live</option>
                <option value="1h">Ending in  1 hour</option>
                <option value="30m">Ending in  30 min</option>
              </select>

              <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                <input type="checkbox" checked={filters.verifiedOnly}
                  onChange={(e) => set("verifiedOnly", e.target.checked)}
                  className="accent-green w-4 h-4" />
                Verified loads only
              </label>
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-20 text-slate-400 text-sm">Loading auctions...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <p className="text-base font-medium text-slate-500 mb-1">No auctions found</p>
              <p className="text-sm">Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((load) => <AuctionCard key={load._id} auction={load} />)}
            </div>
          )}
        </Container>
      </section>
    </div>
  );
};

const inp = "w-full px-4 py-2.5 text-sm border border-slate-200 bg-white rounded-lg outline-none focus:ring-2 focus:ring-green focus:border-green transition";

export default LiveAuctions;
