import {
  FiTrendingDown,
  FiShield,
  FiZap,
  FiUsers,
  FiTarget,
  FiMapPin,
  FiMail,
  FiPhone,
  FiClock,
  FiPackage,
  FiTruck,
  FiBarChart2,
  FiBell,
} from "react-icons/fi";
import { MdVerified } from "react-icons/md";

export const menulists = [
  {
    id: 1,
    path: "/",
    link: "Home",
  },
  {
    id: 2,
    path: "/auction",
    link: "Live Auction",
  },
  {
    id: 3,
    path: "/about",
    link: "About",
  },
  {
    id: 4,
    path: "/services",
    link: "Services",
  },
  {
    id: 5,
    path: "/contact",
    link: "Contact",
  },
];

export const categorylists = [
  {
    id: 1,
    image: "/category/c1.png",
    title: "General Goods",
  },
  {
    id: 2,
    image:"/category/c2.png",
    title: "Industrial & Machinery",
  },
  {
    id: 3,
    image: "/category/c4.png",
    title: "Construction Material",
  },
  {
    id: 4,
    image: "/category/c3.png",
    title: "FMCG & Retail",
  },
  {
    id: 5,
    image: "/category/c7.png",
    title: "Whole Sale Goods",
  },
  {
    id: 6,
    image: "/category/c6.png",
    title: "Expensive Goods",
  },
  {
    id: 7,
    image: "/category/c5.png",
    title: "Vehicle Transport",
  },
];

export const topDriversList = [
  {
    id: 1,
    name: "Ravi Transport",
    avatar: "https://cdn-icons-png.flaticon.com/128/6997/6997662.png",
    totalWins: 120,
    avgBid: 42000,
  },
  {
    id: 2,
    name: "Sharma Logistics",
    avatar: "https://cdn-icons-png.flaticon.com/128/236/236832.png",
    totalWins: 98,
    avgBid: 39500,
  },
  {
    id: 3,
    name: "FastTrack Movers",
    avatar: "https://cdn-icons-png.flaticon.com/128/236/236831.png",
    totalWins: 85,
    avgBid: 46000,
  },
  {
    id: 4,
    name: "Singh Freight",
    avatar: "https://cdn-icons-png.flaticon.com/128/1154/1154448.png",
    totalWins: 76,
    avgBid: 41000,
  },
  {
    id: 5,
    name: "Metro Cargo",
    avatar: "https://cdn-icons-png.flaticon.com/128/6997/6997662.png",
    totalWins: 69,
    avgBid: 43000,
  },
];

export const processList = [
  {
    id: "01",
    title: "Post Your Load",
    desc: "Create a load with route, cargo details, vehicle type, and bidding time. The load is verified before going live.",
    cover: "https://cdn-icons-png.flaticon.com/512/1048/1048946.png",
  },
  {
    id: "02",
    title: "Auction Goes Live",
    desc: "Once approved, the load appears on the platform for verified drivers to view and bid in real time.",
    cover: "https://cdn-icons-png.flaticon.com/512/2920/2920264.png",
  },
  {
    id: "03",
    title: "Drivers Bid",
    desc: "Drivers place competitive bids during the auction window. The lowest bid is updated live for transparency.",
    cover: "https://cdn-icons-png.flaticon.com/512/1570/1570887.png",
  },
  {
    id: "04",
    title: "Lowest Bid Wins",
    desc: "After the auction ends, the lowest verified bid wins and the load is assigned for transport.",
    cover: "https://cdn-icons-png.flaticon.com/512/190/190411.png",
  },
];

import logo1 from "../../public/hero/blue.png"
import logo2 from "../../public/hero/dhel.png"
import logo3 from "../../public/hero/ecom.png"
import logo4 from "../../public/hero/mahindra.png"
import logo5 from "../../public/hero/tci.png"
import logo6 from "../../public/hero/xpress.png"

export const trustList = [
  {
    id: 1,
    name: "Blue Dart Logistics",
    logo: logo1,
  },
  {
    id: 2,
    name: "Delhivery",
    logo: logo2,
  },
  {
    id: 3,
    name: "Ecom Express",
    logo: logo3,
  },
  {
    id: 4,
    name: "XpressBees",
    logo: logo6,
  },
  {
    id: 5,
    name: "Mahindra Logistics",
    logo: logo4,
  },
  {
    id: 6,
    name: "TCI Freight",
    logo: logo5,
  },
];



export const stats = [
  { value: "1K+", label: "Loads Posted" },
  { value: "500+", label: "Verified Drivers" },
  { value: "50", label: "Active Cities" },
  { value: "98%", label: "On-Time Delivery" },
];

export const values =[
  {
    icon: <FiTrendingDown size={28} />,
    title: "Cost Efficiency",
    desc: "Our reverse-auction model ensures senders always get the most competitive freight rates through transparent driver bidding.",
  },
  {
    icon: <FiShield size={28} />,
    title: "Trust & Safety",
    desc: "Every driver is verified and every load is admin-approved before going live, ensuring a safe and reliable experience.",
  },
  {
    icon: <FiZap size={28} />,
    title: "Speed & Simplicity",
    desc: "Post a load in minutes. Bids come in real time. No negotiation delays, no middlemen — just fast, direct logistics.",
  },
  {
    icon: <FiUsers size={28} />,
    title: "Driver First",
    desc: "We empower drivers with fair bidding opportunities, live load visibility, and transparent assignment processes.",
  },
  {
    icon: <MdVerified size={28} />,
    title: "Admin Oversight",
    desc: "Platform admins verify all loads and manage commissions, keeping the ecosystem honest and accountable.",
  },
  {
    icon: <FiTarget size={28} />,
    title: "Nationwide Reach",
    desc: "From small-city pickups to inter-state freight, CargoSetu connects logistics partners across India.",
  },
];

export const milestones = [
  {
    year: "2023",
    title: "Platform Founded",
    desc: "CargoSetu was born out of the need to digitise India's fragmented freight market and cut out inefficient intermediaries.",
  },
  {
    year: "2024",
    title: "500 Drivers Onboarded",
    desc: "Crossed 500 verified driver registrations and expanded active operations to 50 cities across 12 states.",
  },
  {
    year: "2025",
    title: "1,000 Loads Completed",
    desc: "Crossed the milestone of 1,000 successfully completed loads with a 98% on-time delivery record.",
  },
  {
    year: "2026",
    title: "Nationwide Expansion",
    desc: "Scaling to 100+ cities with new features: real-time tracking, mobile apps, and enterprise freight contracts.",
  },
];


export const contactInfo =[
  { icon: <FiMapPin size={20} />, label: "Office", value: "12, Cargo Hub, Sector 44\nGurugram, Haryana 122003" },
  { icon: <FiMail size={20} />, label: "Email", value: "support@cargosetu.in" },
  { icon: <FiPhone size={20} />, label: "Phone", value: "+91 98765 43210" },
  { icon: <FiClock size={20} />, label: "Hours", value: "Mon - Sat: 9 AM - 6 PM" },
];

export const vehicleOptions = ["TRUCK", "CONTAINER", "MINI_TRUCK", "PICKUP", "TRAILER"];
export const cargoOptions   = ["GENERAL", "HEAVY", "FRAGILE", "REFRIGERATED", "HAZARDOUS"];

export const BID_DURATIONS = [
  { value: "30", label: "30 minutes" },
  { value: "60", label: "1 hour" },
  { value: "120", label: "2 hours" },
  { value: "360", label: "6 hours" },
  { value: "1440", label: "24 hours" },
];

export const STATUS_COLORS = {
  OPEN:           "bg-blue-100 text-blue-700",
  BIDDING:        "bg-yellow-100 text-yellow-700",
  PAYMENT_PENDING:"bg-orange-100 text-orange-700",
  ASSIGNED:       "bg-purple-100 text-purple-700",
  ENDED:          "bg-gray-100 text-gray-600",
  IN_TRANSIT:     "bg-orange-100 text-orange-700",
  DELIVERED:      "bg-green-100 text-green-700",
};

export const FALLBACK_IMAGE = "https://bidout-wp.b-cdn.net/wp-content/uploads/2022/10/Image-14.jpg";

export const services = [
  {
    icon: <FiPackage size={28} />,
    title: "Load Posting",
    desc: "Senders create detailed load listings — including route, cargo type, weight, vehicle requirement, and bidding window. Every load goes through admin verification before going live.",
    points: ["Cargo & vehicle type selection", "Custom bid start & end time", "Admin verification before listing"],
  },
  {
    icon: <FiTruck size={28} />,
    title: "Freight Bidding",
    desc: "Verified drivers browse open loads and place competitive bids in real time. The lowest bid at the end of the auction window wins the contract.",
    points: ["Real-time competitive bidding", "Lowest bid wins automatically", "Driver-verified assignments only"],
  },
  {
    icon: <FiMapPin size={28} />,
    title: "Live Tracking",
    desc: "Once a load is assigned, drivers update the status through each stage. Senders can follow progress from their dashboard in real time.",
    points: ["Status: Assigned → In Transit → Delivered", "Sender dashboard tracking", "Driver-controlled status updates"],
  },
  {
    icon: <FiBarChart2 size={28} />,
    title: "Transparent Pricing",
    desc: "No hidden fees. Platform commission is set and communicated upfront by the admin. Both senders and drivers always know exactly what they're paying and earning.",
    points: ["Admin-controlled commission rates", "No middlemen or hidden charges", "Clear bid breakdown per load"],
  },
  {
    icon: <FiShield size={28} />,
    title: "Verified Ecosystem",
    desc: "Every driver is verified before gaining platform access. Every load is reviewed before bidding opens. This keeps the marketplace trustworthy for all participants.",
    points: ["KYC-verified driver profiles", "Load admin approval process", "Dispute resolution support"],
  },
  {
    icon: <FiBell size={28} />,
    title: "Email Notifications",
    desc: "Automated emails keep all parties informed at every stage — from bid won and load assigned, to delivery confirmation for the sender.",
    points: ["Bid won notification to driver", "Assignment confirmation to sender", "Delivery confirmation email"],
  },
];

export const workflow = [
  { step: "01", title: "Post a Load", desc: "Sender fills in all cargo and route details and submits for admin review." },
  { step: "02", title: "Admin Approves", desc: "Admin verifies and approves the load, making it live for drivers to bid on." },
  { step: "03", title: "Drivers Bid", desc: "Verified drivers place competitive bids during the defined auction window." },
  { step: "04", title: "Lowest Bid Wins", desc: "Auction closes, lowest bid wins, and the load is assigned to the driver." },
  { step: "05", title: "Driver Delivers", desc: "Driver picks up the load and updates status at every stage." },
  { step: "06", title: "Delivery Confirmed", desc: "Sender receives a delivery confirmation email and the load is marked complete." },
];

export const forCards = [
  {
    audience: "For Senders",
    color: "bg-slate-900",
    textColor: "text-white",
    subColor: "text-slate-400",
    items: [
      "Post loads in minutes",
      "Get lowest competitive freight rates",
      "Track your cargo in real time",
      "Receive delivery confirmation emails",
      "Manage all loads from your dashboard",
    ],
  },
  {
    audience: "For Drivers",
    color: "bg-green",
    textColor: "text-white",
    subColor: "text-green-100",
    items: [
      "Browse all verified open loads",
      "Bid competitively and win contracts",
      "Update load status on the go",
      "View all your won and active loads",
      "Build a trusted delivery track record",
    ],
  },
];