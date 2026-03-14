import { Container, Title, Body, Caption, Heading } from "../routes/index";
import { FiShield , FiUsers, FiTrendingDown } from "react-icons/fi";
import { MdVerified } from "react-icons/md";
import { trustList } from "../utils/data.jsx";
import { milestones } from "../utils/data.jsx";
import { values } from "../utils/data.jsx";
import { stats } from "../utils/data.jsx";

const About = () => {
  return (
    <div>
      <section className="bg-slate-900 pt-24 pb-16">
        <Container className="text-center text-white">
          <Caption className="text-green-400 uppercase tracking-widest mb-3">About CargoSetu</Caption>
          <Title level={3} className="text-white text-3xl sm:text-4xl leading-tight max-w-3xl mx-auto">
            Connecting <span className="text-yellow-300">Senders & Drivers</span> Through Smart Freight Bidding
          </Title>
          <Body className="text-slate-400 leading-7 mt-6 max-w-2xl mx-auto">
            CargoSetu is India's modern freight bidding platform that eliminates middlemen and connects cargo senders directly with verified drivers — transparently, efficiently, and at the lowest competitive rates.
          </Body>

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto">
            {stats.map((s) => (
              <div key={s.label} className="bg-slate-800 rounded-xl py-5 px-4">
                <Title level={4} className="text-yellow-300">{s.value}</Title>
                <Caption className="text-slate-400 text-sm">{s.label}</Caption>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <div className="bg-white w-full h-20 rounded-t-[40px] -mt-5" />
      <section className="bg-white pb-16">
        <Container>
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-1/2">
              <Caption className="text-green uppercase tracking-widest mb-2">Our Story</Caption>
              <Title level={4} className="leading-tight mb-5">
                Built to Fix a Broken Freight System
              </Title>
              <Body className="text-slate-500 leading-7 mb-4">
                India's freight market has long been dominated by agents, phone calls, and opaque pricing.
                Senders overpay. Drivers under-earn. Trust is low. CargoSetu was built to change that.
              </Body>
              <Body className="text-slate-500 leading-7">
                By digitising the entire bidding-to-delivery workflow — with admin-verified loads, transparent
                real-time bids, and direct driver assignment — we give both senders and drivers a level playing
                field. No hidden charges. No phone-based negotiations. Just fair, data-driven freight.
              </Body>
            </div>

            <div className="w-full md:w-1/2 grid grid-cols-2 gap-4">
              <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col justify-between min-h-[160px]">
                <FiUsers size={32} className="text-yellow-300" />
                <div>
                  <Title level={5} className="text-white">For Senders</Title>
                  <Caption className="text-slate-400 text-sm mt-1">Post loads & get lowest verified bids</Caption>
                </div>
              </div>
              <div className="bg-green rounded-2xl p-6 flex flex-col justify-between min-h-[160px]">
                <FiTrendingDown size={32} className="text-white" />
                <div>
                  <Title level={5} className="text-white">For Drivers</Title>
                  <Caption className="text-green-100 text-sm mt-1">Bid on loads & win fair contracts</Caption>
                </div>
              </div>
              <div className="bg-yellow-300 rounded-2xl p-6 flex flex-col justify-between min-h-[160px]">
                <MdVerified size={32} className="text-slate-900" />
                <div>
                  <Title level={5} className="text-slate-900">Admin Verified</Title>
                  <Caption className="text-slate-700 text-sm mt-1">Every load reviewed before going live</Caption>
                </div>
              </div>
              <div className="bg-slate-100 rounded-2xl p-6 flex flex-col justify-between min-h-[160px]">
                <FiShield size={32} className="text-green" />
                <div>
                  <Title level={5}>Secure Platform</Title>
                  <Caption className="text-slate-400 text-sm mt-1">Encrypted, role-based, and audited</Caption>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="relative bg-slate-900 pb-32">
        <div className="absolute top-0 w-full h-20 bg-white rounded-b-[40px]" />
        <Container className="relative z-10 pt-24 text-white">
          <Heading title="Our Core Values" subtitle="Everything we build and every decision we make is guided by these six principles." />
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <div key={i} className="bg-slate-700 rounded-xl p-8 flex flex-col gap-4 transition hover:-translate-y-1">
                <div className="w-14 h-14 rounded-full bg-slate-600 flex items-center justify-center text-yellow-300">
                  {v.icon}
                </div>
                <Title level={5} className="text-white font-medium">{v.title}</Title>
                <p className="text-sm text-gray-300 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </Container>
        <div className="absolute bottom-0 w-full h-20 bg-white rounded-t-[40px]" />
      </section>

      <section className="bg-white py-16">
        <Container>
          <Heading title="Our Journey" subtitle="From a startup idea to a growing national freight platform — here's how we got here." />
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {milestones.map((m, i) => (
              <div key={i} className="relative border border-slate-100 rounded-xl p-6 hover:shadow-s2 transition">
                <span className="inline-block bg-yellow-300 text-slate-900 text-xs font-bold px-3 py-1 rounded-full mb-4">
                  {m.year}
                </span>
                <Title level={6} className="text-slate-800 mb-2">{m.title}</Title>
                <p className="text-sm text-slate-500 leading-relaxed">{m.desc}</p>
                <div className="absolute top-6 right-6 w-6 h-6 rounded-full bg-green opacity-20 text-xs flex items-center justify-center font-bold text-white">
                  {i + 1}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-white pb-16">
        <Container>
          <Heading
            title="Trusted by Logistics Partners"
            subtitle="Leading transport and logistics companies rely on CargoSetu for transparent and cost-effective freight bidding."
          />
          <div className="mt-7 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
            {trustList.map((item) => (
              <div key={item.id} className="flex items-center justify-center p-4 rounded-lg border border-slate-200 bg-white hover:shadow-md transition">
                <img src={item.logo} alt={item.name} className="h-10 max-w-[140px] object-contain" />
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-slate-900 py-20">
        <Container className="text-center text-white">
          <Title level={4} className="text-white mb-4">
            Ready to Move Smarter?
          </Title>
          <Body className="text-slate-400 max-w-xl mx-auto mb-8">
            Join thousands of senders and drivers who are already saving time and money on every shipment.
          </Body>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="/register" className="bg-yellow-300 text-slate-900 font-semibold px-8 py-3 rounded-full hover:bg-yellow-400 transition text-sm">
              Get Started Free
            </a>
            <a href="/auction" className="border border-slate-500 text-white font-semibold px-8 py-3 rounded-full hover:border-white transition text-sm">
              Browse Live Auctions
            </a>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default About;
