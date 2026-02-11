import { useState,useEffect,useRef } from "react";
import { useLocation } from "react-router-dom";
import { AiOutlineMenu,AiOutlineClose } from "react-icons/ai";
import { IoSearchOutline } from "react-icons/io5";
import { Container,CustomNavLink,CustomNavLinkList,ProfileCard } from "../../routes";
import logo from "../../../public/logo.png";
import { menulists } from "../../utils/data";

const Header = () => {
  const [isOpen,setIsOpen] = useState(false);
  const [isScrolled,setIsScrolled] = useState(false);
  const location = useLocation();
  const menuRef = useRef(null);
  const isHomePage = location.pathname === "/";
  const role = "buyer";
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  const toggleMenu =()=> setIsOpen(prev => !prev);

  const handleScroll =()=> {
    setIsScrolled(window.scrollY > 10);
  };

  const closeMenuOutside =e=> {
    if(menuRef.current && !menuRef.current.contains(e.target)){
      setIsOpen(false);
    }
  };

  const handleLogout =()=> {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  useEffect(()=> {
    document.addEventListener("mousedown", closeMenuOutside);
    window.addEventListener("scroll", handleScroll);
    return ()=> {
      document.removeEventListener("mousedown", closeMenuOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  },[]);

  const textColor = isScrolled || !isHomePage ? "text-slate-800" : "text-white";

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled || !isHomePage ? "bg-white shadow-md" : "bg-slate-900"}`}>
      <Container>
        <nav className="flex items-center justify-between px-4 py-2">

          {/* LEFT */}
          <div className="flex items-center gap-12">
            <a href="/" className="flex gap-2 items-center">
              <img src={logo} alt="Logo" className="h-8 sm:h-10 shrink-0"/>
              <p className="text-white font-semibold text-md sm:text-xl">CargoSetu</p>
            </a>

            <ul className="hidden lg:flex items-center gap-8">
              {menulists.map(item => (
                <li key={item.id} className="list-none">
                  <CustomNavLinkList href={item.path} isActive={location.pathname === item.path} className={`${textColor} text-sm font-medium hover:opacity-80 transition`}>
                    {item.link}
                  </CustomNavLinkList>
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT */}
          <div className="hidden lg:flex items-center gap-6 whitespace-nowrap">
            {!isLoggedIn ? (
              <>
                <IoSearchOutline size={22} className={textColor} />

                {role === "buyer" && (
                  <CustomNavLink href="/seller/login" className={`${textColor} text-sm font-medium`}> Become a Seller</CustomNavLink>
                )}

                <CustomNavLink href="/login" className={`${textColor} text-sm font-medium`}> Sign in </CustomNavLink>

                <CustomNavLink href="/register" className={`px-6 py-2 rounded-full text-sm font-semibold leading-none flex items-center justify-center transition ${
                    isScrolled || !isHomePage
                      ? "bg-slate-900 text-white"
                      : "bg-white text-slate-900"
                  }`}>
                  Join
                </CustomNavLink>
              </>
            ):(
              <>
                <CustomNavLink href="/dashboard"><ProfileCard /></CustomNavLink>

                <button onClick={handleLogout} className={`${textColor} text-sm font-medium`}>Logout</button>
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

            <div className="space-y-4">
              {menulists.map(item => (
                <CustomNavLink key={item.id} href={item.path} className="block text-sm font-medium" onClick={() => setIsOpen(false)}>
                  {item.link}
                </CustomNavLink>
              ))}
            </div>

            <div className="h-px bg-white/20"/>

            <div className="space-y-3 flex flex-col items-center">
              {!isLoggedIn ? (
                <>
                  {role === "buyer" && (
                    <CustomNavLink href="/seller/login" className="block text-sm font-medium" onClick={() => setIsOpen(false)}>
                      Become a Seller
                    </CustomNavLink>
                  )}
                  <CustomNavLink href="/login" className="block text-sm font-medium" onClick={() => setIsOpen(false)}>
                    Sign in
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
