"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LoginButton } from "./Button";
import Image from "next/image";
import { RxAvatar } from "react-icons/rx";
import { FiMenu, FiX, FiLogOut } from "react-icons/fi";
import { useAuth } from "@Context/AuthContext/AuthContext";

const HERO_PAGES = ["/Explore", "/About", "/Contact", "/hotels"];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLogin, userName, isOwner, isAdmin, isDropdownOpen, setIsDropdownOpen, handleLogout } =
    useAuth();
  const [showNavbar, setShowNavbar] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [loggingOut, setLoggingOut] = useState(false);
  const pathname = usePathname();

  const isHeroPage = HERO_PAGES.includes(pathname);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 40);

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleMenuClick = () => {
    setIsMenuOpen(false);
  };

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Explore", path: "/Explore" },
    { name: "Hotel", path: "/hotels" },
    { name: "About", path: "/About" },
    { name: "Contact", path: "/Contact" },
    { name: "Reservation", path: "/reservations", requiresLogin: true },
    { name: "Management", path: "/OwnerDashboard", requiresOwner: true },
    { name: "Hotel View", path: "/ChooseHotel", requiresOwner: true },
    { name: "Admin Panel", path: "/role", requiresAdmin: true },
  ];

  // Derive active menu directly from the current path — no state/localStorage delay
  const activeMenu =
    menuItems.find((item) =>
      item.path === "/" ? pathname === "/" : pathname.startsWith(item.path)
    )?.name || "Home";

  // Determine visual state: transparent or solid
  const isTransparent = isHeroPage && !scrolled;

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-out ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      } ${
        isTransparent
          ? "bg-transparent"
          : "bg-white/95 backdrop-blur-md shadow-[0_1px_20px_rgba(0,0,0,0.06)]"
      }`}
    >
      <div className="w-10/12 mx-auto flex justify-between items-center h-[62px]">
        {/* Logo */}
        <Link href="/" className="relative shrink-0">
          <Image
            src="/logo/logo.png"
            alt="logo"
            width={80}
            height={80}
            className={`transition-all duration-300 ${
              isTransparent ? "brightness-0 invert" : ""
            }`}
          />
        </Link>

        {/* Hamburger Menu for Mobile */}
        <button
          className="lg:hidden relative z-50"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <FiX size={24} className={isTransparent && !isMenuOpen ? "text-white" : "text-gray-800"} />
          ) : (
            <FiMenu size={24} className={isTransparent ? "text-white" : "text-gray-800"} />
          )}
        </button>

        {/* Navigation Menu */}
        <nav
          className={`${
            isMenuOpen
              ? "flex flex-col absolute top-full left-0 w-full bg-white shadow-xl py-4 px-8 gap-1 lg:shadow-none lg:py-0 lg:px-0"
              : "hidden"
          } lg:flex lg:static lg:flex-row lg:items-center lg:gap-1`}
        >
          {menuItems.map((menu, index) => {
            if (menu.requiresLogin && !isLogin) return null;
            if (menu.requiresOwner && !isOwner) return null;
            if (menu.requiresAdmin && !isAdmin) return null;
            const isActive = activeMenu === menu.name;
            return (
              <Link
                key={index}
                href={menu.path}
                onClick={() => handleMenuClick()}
                className={`relative px-4 py-2 text-[13px] font-medium tracking-wide uppercase transition-colors duration-300 ${
                  isActive
                    ? isTransparent
                      ? "text-[#c4a96a]"
                      : "text-[#857749]"
                    : isTransparent
                    ? "text-white/80 hover:text-white"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {menu.name}
                {/* Active underline indicator */}
                <span
                  className={`absolute left-4 right-4 -bottom-0.5 h-[2px] rounded-full transition-all duration-300 ${
                    isActive
                      ? isTransparent
                        ? "bg-[#c4a96a] scale-x-100"
                        : "bg-[#857749] scale-x-100"
                      : "bg-transparent scale-x-0"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* User Authentication Section */}
        <div className="hidden lg:flex items-center gap-3">
          {isLogin ? (
            <div className="flex items-center gap-3 relative">
              <button
                className={`flex items-center gap-2.5 px-4 py-2 rounded-xl border transition-all duration-300 cursor-pointer ${
                  isTransparent
                    ? "border-white/30 text-white hover:bg-white/10"
                    : "border-gray-200 text-gray-700 hover:border-[#857749]/30 hover:text-[#857749]"
                }`}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <RxAvatar size={22} />
                <span className="text-sm font-medium">{userName}</span>
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden min-w-[180px] z-[1000]">
                  {isAdmin && (
                    <Link
                      href="/role"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2.5 w-full px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-purple-600 transition-colors duration-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                      Admin Panel
                    </Link>
                  )}
                  {isOwner && (
                    <Link
                      href="/OwnerDashboard"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2.5 w-full px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#857749] transition-colors duration-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                      My Dashboard
                    </Link>
                  )}
                  <button
                    disabled={loggingOut}
                    className="flex items-center gap-2.5 w-full px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-red-500 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                    onClick={async () => {
                      setLoggingOut(true);
                      await handleLogout();
                      setLoggingOut(false);
                    }}
                  >
                    {loggingOut ? (
                      <>
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                        <span>Logging out...</span>
                      </>
                    ) : (
                      <>
                        <FiLogOut size={16} />
                        Log out
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <LoginButton isTransparent={isTransparent} />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
