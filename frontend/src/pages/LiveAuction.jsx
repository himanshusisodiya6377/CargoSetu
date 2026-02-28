import { useEffect, useState } from "react";
import { Container, Title, Body } from "../routes/index";
import AuctionCard from "../component/Cards/AuctionCard";

const LiveAuctions = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    from: "",
    to: "",
    vehicleType: "",
    cargoType: "",
    minPrice: "",
    maxPrice: "",
    timeLeft: "all",
    verifiedOnly: false,
  });

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/Loads`);
        const response = await res.json();
        const loads = response.data || [];
    
        const processed = loads.filter(load => new Date(load.bidEndTime)>new Date()).map(load =>{
            const timeLeftMs = new Date(load.bidEndTime)-new Date();

            return {
              ...load,
              lowestBid: load.currentLowestBid,
              bidCount: load.totalBids,
              timeLeftMinutes: Math.floor(timeLeftMs/60000),
            };
          });

        setAuctions(processed);
      } catch (err) {
        console.error("Failed to load auctions", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  const filteredAuctions = auctions.filter(load => {
    if (
      filters.from && !load.pickupLocation.toLowerCase().includes(filters.from.toLowerCase())
    ) return false;

    if (
      filters.to && !load.dropLocation.toLowerCase().includes(filters.to.toLowerCase())
    ) return false;

    if (filters.vehicleType && load.vehicleType !== filters.vehicleType)
      return false;

    if (filters.cargoType && load.cargoType !== filters.cargoType)
      return false;

    if ( filters.minPrice && load.lowestBid !== null && load.lowestBid < Number(filters.minPrice)) return false;

    if (filters.maxPrice && load.lowestBid !== null && load.lowestBid>Number(filters.maxPrice)) return false;

    if (filters.timeLeft === "1h" && load.timeLeftMinutes > 60) return false;

    if (filters.timeLeft === "30m" && load.timeLeftMinutes > 30) return false;
  
    if (filters.verifiedOnly && !load.isVerified) return false;

    return true;
  });

  return (
    <section className="bg-slate-900 pt-24 pb-20 min-h-screen">
      <Container>
        <div className="mb-10">
          <Title level={3} className="text-white">
            <span className="text-yellow-300">Live Freight Auctions</span>
          </Title>
          <Body className="text-slate-400 mt-2 max-w-2xl">
            Browse live load auctions and place competitive bids before time runs out.
          </Body>
        </div>

        <div className="bg-slate-800 rounded-xl p-5 mb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <input placeholder="From city" className="bg-slate-900 text-white p-3 rounded-lg outline-none"
            onChange={e => setFilters({ ...filters, from: e.target.value })}/>

          <input placeholder="To city" className="bg-slate-900 text-white p-3 rounded-lg outline-none"
            onChange={e => setFilters({ ...filters, to: e.target.value })}/>

          <select className="bg-slate-900 text-white p-3 rounded-lg outline-none" onChange={e => setFilters({ ...filters, vehicleType: e.target.value })}>
            <option value="">All Vehicles</option>
            <option value="TRUCK">Truck</option>
            <option value="CONTAINER">Container</option>
            <option value="MINI_TRUCK">Mini Truck</option>
          </select>

          <select className="bg-slate-900 text-white p-3 rounded-lg outline-none" onChange={e => setFilters({ ...filters, cargoType: e.target.value })}>
            <option value="">All Cargo</option>
            <option value="HEAVY">Heavy</option>
            <option value="FRAGILE">Fragile</option>
            <option value="REFRIGERATED">Refrigerated</option>
          </select>

          <select className="bg-slate-900 text-white p-3 rounded-lg outline-none" onChange={e => setFilters({ ...filters, timeLeft: e.target.value })}>
            <option value="all">All Live</option>
            <option value="1h">Ending ≤ 1 Hour</option>
            <option value="30m">Ending ≤ 30 Minutes</option>
          </select>

          <input type="number" placeholder="Min Bid" className="bg-slate-900 text-white p-3 rounded-lg outline-none"
            onChange={e => setFilters({ ...filters, minPrice: e.target.value })}/>

          <input type="number" placeholder="Max Bid" className="bg-slate-900 text-white p-3 rounded-lg outline-none"
            onChange={e => setFilters({ ...filters, maxPrice: e.target.value })}/>

          <label className="flex items-center gap-2 text-slate-300 text-sm">
            <input type="checkbox" className="accent-yellow-400" onChange={e =>
                setFilters({ ...filters, verifiedOnly: e.target.checked })
              }/>
            Verified loads only
          </label>
        </div>

        {loading ? (
          <p className="text-slate-400 text-center"> Loading live auctions...</p>) : filteredAuctions.length === 0 ? (
          <p className="text-slate-400 text-center">No auctions match the selected filters.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredAuctions.map(load => (<AuctionCard key={load._id} auction={load} />))}
          </div>
        )}
      </Container>
    </section>
  );
};

export default LiveAuctions;
