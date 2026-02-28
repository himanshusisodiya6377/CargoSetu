import { Caption, Container, Heading, ProfileCard, Title } from "../../routes/index";
import { topDriversList } from "../../utils/data";

const TopDrivers = () => {
  return (
    <section className="pb-8 bg-white">
      <Container>
        <Heading title="Top Drivers" subtitle="Most reliable transport partners based on auctions won and competitive bids"/>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {topDriversList.map((driver, index) => (
            <div key={driver.id} className="relative bg-white border border-slate-200 rounded-xl p-4 flex flex-col items-center text-center hover:shadow-md transition">
              <span className="absolute top-3 right-3 text-sm font-semibold text-slate-300">
                #{index + 1}
              </span>

              <ProfileCard className="w-16 h-16 mb-3">
                <img src={driver.avatar} alt={driver.name} className="w-full h-full rounded-full object-cover"/>
              </ProfileCard>

              <Title level={6} className="text-slate-800"> {driver.name}</Title>
              
              <div className="mt-2 space-y-1">
                <Caption className="text-slate-500">
                  {driver.totalWins} auctions won
                </Caption>
                <Caption className="text-slate-500">
                  Avg Bid: ₹{driver.avgBid.toLocaleString()}
                </Caption>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default TopDrivers;
