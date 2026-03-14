import { Container } from "./Design";
import { FiPhoneOutgoing, FiMapPin } from "react-icons/fi";
import { FaInstagram } from "react-icons/fa";
import { CiLinkedin, CiTwitter } from "react-icons/ci";
import { AiOutlineYoutube } from "react-icons/ai";
import { Link, useLocation } from "react-router-dom";

const Footer = () =>{
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <footer className="relative bg-slate-900 text-gray-300">
      {isHomePage && (
        <div className="absolute top-0 w-full h-6 bg-white rounded-b-[40px]" />
      )}

      <Container className={`relative z-10 pt-16 pb-10 ${isHomePage ? "mt-24" : ""}`}>
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Brand */}
          <div className="w-full lg:w-1/3">
            <p className="text-white text-xl font-bold mb-3">CargoSetu</p>
            <p className="text-sm text-gray-400 leading-relaxed">
              A transparent freight bidding platform where senders post loads and drivers compete with real-time bids to offer the best price.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 w-full lg:w-2/3">

            <div>
              <p className="text-white text-sm font-semibold mb-3">Platform</p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/auction" className="hover:text-white transition">Live Auctions</Link></li>
                <li><Link to="/add" className="hover:text-white transition">Post a Load</Link></li>
                <li><Link to="/services" className="hover:text-white transition">Services</Link></li>
              </ul>
            </div>

            <div>
              <p className="text-white text-sm font-semibold mb-3">Company</p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
              </ul>
            </div>

            <div>
              <p className="text-white text-sm font-semibold mb-3">Contact</p>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <FiPhoneOutgoing size={14} />
                  <span>+91 90000 00000</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiMapPin size={14} />
                  <span>India</span>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-4 text-gray-400">
                <AiOutlineYoutube size={20} className="hover:text-white transition cursor-pointer" />
                <FaInstagram size={18} className="hover:text-white transition cursor-pointer" />
                <CiTwitter size={20} className="hover:text-white transition cursor-pointer" />
                <CiLinkedin size={20} className="hover:text-white transition cursor-pointer" />
              </div>
            </div>

          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-5 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} CargoSetu. All rights reserved.
        </div>
      </Container>
    </footer>
  );
};

export default Footer;