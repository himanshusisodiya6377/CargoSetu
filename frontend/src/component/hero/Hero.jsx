import { Body, Caption, Container, ProfileCard, Title } from "../../routes/index";
import { AiOutlinePropertySafety } from "react-icons/ai";
import { CiCirclePlus } from "react-icons/ci";
import PropTypes from "prop-types";
import hero2 from "../../../public/hero2.png";

export const User1 = "https://cdn-icons-png.flaticon.com/128/6997/6997662.png";
export const User2 = "https://cdn-icons-png.flaticon.com/128/236/236832.png";
export const User3 = "https://cdn-icons-png.flaticon.com/128/236/236831.png";
export const User4 = "https://cdn-icons-png.flaticon.com/128/1154/1154448.png";

const Hero = () => {
  return (
    <>
      <section className="bg-slate-900 pt-24 pb-16">
        <Container className="flex flex-col md:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2 text-white">
            <Title level={3} className="text-white text-3xl sm:text-4xl leading-tight">
              <span className="text-yellow-300">Smart Freight Bidding</span>{" "}
              <span className="text-white">for Faster & Cheaper Transport</span>
            </Title>

            <Body className="text-slate-400 leading-7 my-6 max-w-xl">
              A modern freight platform where senders post loads, drivers bid
              competitively, and the lowest bid wins — ensuring
              cost-effective and reliable transport.
            </Body>

            <div className="flex flex-wrap gap-10 mt-10">
              <Stat value="1K+" label="Loads Posted" />
              <Stat value="500+" label="Verified Drivers" />
              <Stat value="50" label="Active Cities" />
            </div>
          </div>

          <div className="w-full hidden lg:block md:w-1/2 relative">
            <img src={hero2} alt="Hero" className="rounded-2xl object-cover shadow-lg"/>

            <div className="absolute top-6 left-4 lg:top-10 lg:left-0">
              <Box
                title="Trusted Community"
                desc="Community-rated loads and trusted transport partners"/>
            </div>

            <div className="absolute bottom-20 right-4 lg:bottom-24 lg:right-0">
              <Box
                title="Secure Payments & Fair Bidding"
                desc="Transparent bids with platform-controlled commission"/>
            </div>

            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 lg:left-6 lg:translate-x-0 bg-white shadow-md rounded-xl px-5 py-4 flex items-center gap-4">
              <Title level={6}>Trusted by Logistics Partners</Title>
              <div className="flex items-center">
                {[User1, User2, User3, User4].map((user, i) => (
                  <ProfileCard key={i} className={`border-2 border-white ${i !== 0 ? "-ml-4" : ""}`}>
                    <img src={user} alt="User" className="w-full h-full object-cover"/>
                  </ProfileCard>
                ))}

                <ProfileCard className="border-2 border-white -ml-4 flex items-center justify-center">
                  <CiCirclePlus size={22} />
                </ProfileCard>
              </div>
            </div>
          </div>

        </Container>
      </section>

      <div className="bg-white w-full h-20 rounded-t-[40px] -mt-5" />
    </>
  );
};

const Stat = ({value, label}) => (
  <div>
    <Title level={4} className="text-white"> {value} </Title>
    <Caption className="text-slate-400">{label}</Caption>
  </div>
);

const Box = ({title,desc}) =>{
  return (
    <div className="bg-white shadow-md rounded-xl px-3 py-2 flex items-start gap-3 max-w-xs">
      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
        <AiOutlinePropertySafety size={16} className="text-slate-700" />
      </div>
      <div>
        <Title level={6}>{title}</Title>
        <Caption>{desc}</Caption>
      </div>
    </div>
  );
};

Box.propTypes ={
  title: PropTypes.string,
  desc: PropTypes.string,
};

Stat.propTypes ={
  value: PropTypes.string,
  label: PropTypes.string,
};

export default Hero;
