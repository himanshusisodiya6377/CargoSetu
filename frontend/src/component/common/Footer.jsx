import { Container, Title } from "./Design";
import { FiPhoneOutgoing } from "react-icons/fi";
import { IoLocationOutline } from "react-icons/io5";
import { FaInstagram } from "react-icons/fa";
import { CiLinkedin, CiTwitter } from "react-icons/ci";
import { AiOutlineYoutube } from "react-icons/ai";
import { useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <footer className="relative bg-slate-900 text-gray-200">
      {isHomePage && (
        <div className="absolute top-0 w-full h-6 bg-white rounded-b-[40px]" />
      )}

      <Container
        className={`relative z-10 pt-20 pb-12 ${
          isHomePage ? "mt-24" : ""
        }`}>
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="w-full lg:w-1/3">
            <Title level={4} className="text-white mb-3">
              CargoSetu
            </Title>

            <p className="text-sm text-gray-300 leading-relaxed">
              CargoSetu is a transparent freight bidding platform where senders
              post loads and drivers compete with real-time bids to offer the
              best price.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 w-full lg:w-2/3">
            <div>
              <Title level={6} className="text-white mb-4"> Platform </Title>
              <ul className="space-y-3 text-sm">
                <li>Live Auctions</li>
                <li>Post a Load</li>
                <li>Find Drivers</li>
                <li>Pricing</li>
              </ul>
            </div>

            <div>
              <Title level={6} className="text-white mb-4"> Company </Title>
              <ul className="space-y-3 text-sm">
                <li>About Us</li>
                <li>How It Works</li>
                <li>Careers</li>
                <li>Blog</li>
              </ul>
            </div>

            <div>
              <Title level={6} className="text-white mb-4"> Support</Title>
              <ul className="space-y-3 text-sm">
                <li>Help Center</li>
                <li>FAQs</li>
                <li>Terms & Conditions</li>
                <li>Privacy Policy</li>
              </ul>
            </div>

            <div>
              <Title level={6} className="text-white mb-4"> Contact </Title>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <FiPhoneOutgoing />
                  <span>+91 90000 00000</span>
                </div>

                <div className="flex items-center gap-2">
                  <IoLocationOutline />
                  <span>India</span>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-5">
                
                  <AiOutlineYoutube size={40} />
                  <FaInstagram size={40} />
                  <CiTwitter size={40} />
                  <CiLinkedin size={40} />
              
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-white/20 pt-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} CargoSetu. All rights reserved.
        </div>
      </Container>
    </footer>
  );
};

export default Footer;