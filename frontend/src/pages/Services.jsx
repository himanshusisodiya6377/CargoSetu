import { Container, Title, Body, Caption, Heading } from "../routes/index";
import { NavLink } from "react-router-dom";
import { FiCheckCircle, FiArrowRight } from "react-icons/fi";
import { MdVerified } from "react-icons/md";
import { services,forCards,workflow } from "../utils/data.jsx";


const Services = () =>{
  return (
    <div>
      <section className="bg-slate-900 pt-24 pb-16">
        <Container className="text-center text-white">
          <Caption className="text-green-400 uppercase tracking-widest mb-3">Our Services</Caption>
          <Title level={3} className="text-white text-3xl sm:text-4xl leading-tight max-w-2xl mx-auto">
            Everything You Need for <span className="text-yellow-300">Smarter Freight</span>
          </Title>
          <Body className="text-slate-400 leading-7 mt-5 max-w-xl mx-auto">
            From load posting to delivery confirmation, CargoSetu handles every step of the freight journey — transparently and efficiently.
          </Body>
        </Container>
      </section>
      <div className="bg-white w-full h-20 rounded-t-[40px] -mt-5" />

      <section className="bg-white pb-16">
        <Container>
          <Heading title="What We Offer" subtitle="Six core services that power the CargoSetu freight platform." />
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) =>(
              <div key={i} className="border border-slate-100 rounded-xl p-6 hover:shadow-s2 transition flex flex-col gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-yellow-300">
                  {s.icon}
                </div>
                <div>
                  <Title level={6} className="text-slate-800 mb-1">{s.title}</Title>
                  <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
                </div>
                <ul className="flex flex-col gap-1.5 mt-auto pt-3 border-t border-slate-100">
                  {s.points.map((p, j) =>(
                    <li key={j} className="flex items-start gap-2 text-xs text-slate-500">
                      <FiCheckCircle size={13} className="text-green mt-0.5 shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>
      <section className="relative bg-slate-900 pb-32">
        <div className="absolute top-0 w-full h-20 bg-white rounded-b-[40px]" />
        <Container className="relative z-10 pt-24 text-white">
          <div className="text-center mb-10">
            <Title level={4} className="text-white">How It Works</Title>
            <Caption className="text-slate-400 mt-2 max-w-md mx-auto">The full journey from posting a load to successful delivery.</Caption>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {workflow.map((w, i) => (
              <div key={i} className="bg-slate-800 rounded-xl p-6 flex gap-4 hover:-translate-y-1 transition">
                <span className="text-2xl font-bold text-yellow-300 shrink-0">{w.step}</span>
                <div>
                  <Title level={6} className="text-white mb-1">{w.title}</Title>
                  <p className="text-sm text-slate-400 leading-relaxed">{w.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
        <div className="absolute bottom-0 w-full h-20 bg-white rounded-t-[40px]" />
      </section>
      <section className="bg-white pb-16">
        <Container>
          <Heading title="Built for Everyone" subtitle="Whether you're shipping cargo or driving freight, CargoSetu works for you." />
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {forCards.map((card, i) => (
              <div key={i} className={`${card.color} rounded-2xl p-8`}>
                <MdVerified size={28} className="text-yellow-300 mb-4" />
                <Title level={5} className={`${card.textColor} mb-5`}>{card.audience}</Title>
                <ul className="flex flex-col gap-3">
                  {card.items.map((item, j) => (
                    <li key={j} className={`flex items-center gap-3 text-sm ${card.subColor}`}>
                      <FiCheckCircle size={15} className="text-yellow-300 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-slate-900 py-20">
        <Container className="text-center text-white">
          <Title level={4} className="text-white mb-4">Ready to Get Started?</Title>
          <Body className="text-slate-400 max-w-md mx-auto mb-8">
            Join CargoSetu today and experience smarter, cheaper, and faster freight — for senders and drivers alike.
          </Body>
          <div className="flex flex-wrap gap-4 justify-center">
            <NavLink to="/register" className="bg-yellow-300 text-slate-900 font-semibold px-8 py-3 rounded-full hover:bg-yellow-400 transition text-sm flex items-center gap-2">
              Create an Account <FiArrowRight size={15} />
            </NavLink>
            <NavLink to="/auction" className="border border-slate-500 text-white font-semibold px-8 py-3 rounded-full hover:border-white transition text-sm">
              Browse Live Auctions
            </NavLink>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Services;
