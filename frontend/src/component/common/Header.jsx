import { useState,useEffect,useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineMenu,AiOutlineClose } from "react-icons/ai";
import { Container,CustomNavLink,CustomNavLinkList,ProfileCard } from "../../routes";
import logo from "../../../public/logo.png";
import { menulists } from "../../utils/data.jsx";
import { User1 } from "../hero/Hero";
import { useUserProfile } from "../../hooks/useUserProfile";
import { logout, selectIsLoggedIn } from "../../redux/features/authSlice";
import { useDispatch,useSelector } from "react-redux";

const Header = () =>{
  const [isOpen,setIsOpen] = useState(false);
  const [isScrolled,setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const isHomePage = location.pathname === "/";
  const isLoggedIn = useSelector(selectIsLoggedIn)

  const dispatch = useDispatch();

  const toggleMenu =()=> setIsOpen(prev => !prev);

  const handleScroll =()=>{
    setIsScrolled(window.scrollY > 10);
  };

  const closeMenuOutside =e=>{
    if(menuRef.current && !menuRef.current.contains(e.target)){
      setIsOpen(false);
    }
  };

  const handleLogout =()=>{
    dispatch(logout());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login")
  };

  useEffect(()=>{
    document.addEventListener("mousedown", closeMenuOutside);
    window.addEventListener("scroll", handleScroll);
    return ()=> {
      document.removeEventListener("mousedown", closeMenuOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  },[]);

  const {user} = useSelector((state) => state.auth);

  const {role} = useUserProfile();
  // console.log(role)

  const textColor = isScrolled || !isHomePage ? "text-slate-800" : "text-white";

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled || !isHomePage ? "bg-white shadow-md" : "bg-slate-900"}`}>
      <Container>
        <nav className="flex items-center justify-between px-4 py-2">

          {/* LEFT */}
          <div className="flex items-center gap-12">
            <Link to="/" className="flex gap-2 items-center">
              <img src={logo} alt="Logo" className="h-8 sm:h-10 shrink-0"/>
              <p className={`${textColor} font-semibold text-md sm:text-xl`}>CargoSetu</p>
            </Link>

            <ul className="hidden lg:flex items-center gap-8">
              {menulists.map(item => {
                const isActive = location.pathname === item.path;
                const onDark = !isScrolled && isHomePage;
                return (
                  <li key={item.id} className="list-none">
                    <Link to={item.path} className={`text-[15px] font-medium pb-0.5 transition-all ${
                        isActive ? onDark ? "text-white border-b-2 border-white" : "text-green border-b-2 border-green": `${textColor} hover:opacity-70`}`}>
                      {item.link}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* RIGHT */}
          <div className="hidden lg:flex items-center gap-5 whitespace-nowrap">
            {!isLoggedIn ? (
              <>
                <CustomNavLink href="/login" className={`${textColor} text-sm font-medium`}>Login</CustomNavLink>
                <CustomNavLink href="/register" className={`px-5 py-2 rounded-full text-sm font-semibold leading-none flex items-center justify-center transition ${
                  isScrolled || !isHomePage ? "bg-slate-900 text-white hover:bg-slate-700" : "bg-white text-slate-900 hover:bg-gray-100"}`}>
                  Register
                </CustomNavLink>
              </>
            ) : (
              <>
                {role === "Driver" && (
                  <CustomNavLink href="/sender/login" className={`${textColor} text-sm font-medium`}>Become a Sender</CustomNavLink>
                )}
                <CustomNavLink href="/dashboard">
                  <ProfileCard>
                    <img src={user?.photo || User1} alt="" className="w-full h-full object-cover rounded-full"/>
                  </ProfileCard>
                </CustomNavLink>
                <button onClick={handleLogout} className={`${textColor} text-sm font-medium hover:opacity-70 transition`}>Logout</button>
              </>
            )}
          </div>

          {/* MOBILE BUTTON */}
          <button onClick={toggleMenu} className="lg:hidden w-10 h-10 flex items-center justify-center rounded-md bg-slate-900 text-white">
            {isOpen ? <AiOutlineClose size={22}/> : <AiOutlineMenu size={22}/>}
          </button>
        </nav>

        {/* MOBILE MENU */}
        {isOpen && (
          <div ref={menuRef} className="lg:hidden bg-slate-900 text-white flex items-center flex-col px-6 py-5 space-y-6">

            <div className="space-y-1">
              {menulists.map(item => {
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.id} to={item.path} onClick={() => setIsOpen(false)} className={`block text-[15px] font-medium px-2 py-1.5 rounded transition ${isActive ? "text-white bg-white/15" : "text-gray-300 hover:text-white"}`}>
                    {item.link}
                  </Link>
                );
              })}
            </div>

            <div className="h-px bg-white/20"/>

            <div className="space-y-3 flex flex-col items-center">
              {!isLoggedIn ? (
                <>
                  {role === "Driver" && (
                    <CustomNavLink href="/sender/login" className="block text-sm font-medium" onClick={() => setIsOpen(false)}>
                      Become a Sender
                    </CustomNavLink>
                  )}
                  <CustomNavLink href="/login" className="block text-sm font-medium" onClick={() => setIsOpen(false)}>
                    Login
                  </CustomNavLink>
                  <CustomNavLink href="/register" className="block text-center py-2 min-w-28 rounded-full bg-white text-slate-900 text-sm font-semibold" onClick={() => setIsOpen(false)}>
                    Join
                  </CustomNavLink>
                </>
              ):(
                <>
                  <CustomNavLink href="/dashboard" className="block text-sm font-medium" onClick={() => setIsOpen(false)}>
                    Dashboard
                  </CustomNavLink>

                  <button onClick={handleLogout} className="block text-left text-sm font-medium">
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </Container>
    </header>
  );
};

export default Header;
