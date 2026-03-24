"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ShoppingCart, User, LogOut, Package, LogIn, LayoutDashboard } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { toggleCart, totalItems } = useCart();
  const { user, role, loading, signOut } = useAuth();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const solid = scrolled || !isHome;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initial = user?.user_metadata?.full_name?.charAt(0)?.toUpperCase()
    || user?.email?.charAt(0)?.toUpperCase()
    || "U";

  const handleSignOut = async () => {
    setDropdownOpen(false);
    await signOut();
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <header className={`fixed w-full top-0 z-50 transition-all duration-500 ${solid ? "navbar-scrolled" : ""}`} id="navbar">
        <div className={`bg-gold text-brand-dark flex items-center justify-center px-4 text-sm font-medium transition-all duration-500 h-10 border-b border-brand/10 ${solid ? "-mt-10 opacity-0" : ""}`}>
          <span className="material-symbols-outlined text-[18px] mr-2">workspace_premium</span>
          <span><strong className="font-black tracking-wide">15% OFF</strong> until Dec 31 2026 on Bulk orders</span>
        </div>
        <div className={`transition-all duration-500 ${solid ? "py-1" : "py-2 sm:py-4"}`}>
          <div className="max-w-[1370px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`flex items-center justify-between transition-all duration-500 ${solid ? "h-16" : "h-14 sm:h-24"}`}>
              <Link href="/" className="flex items-center gap-2 sm:gap-4 group min-w-0">
                <div className={`rounded-full overflow-hidden border-2 group-hover:border-gold transition-all duration-500 bg-white flex items-center justify-center shrink-0 ${solid ? "w-9 h-9 sm:w-10 sm:h-10 border-brand" : "w-9 h-9 sm:w-16 sm:h-16 border-white/20"}`}>
                  <Image src="/assets/BKH.png" alt="Bandaru Agrotech Logo" width={64} height={64} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <h1 className={`font-heading font-semibold leading-tight transition-all duration-500 truncate ${solid ? "text-base sm:text-xl text-brand" : "text-base sm:text-2xl text-white"}`}>
                    Bandaru Agrotech
                  </h1>
                  <p className={`text-[0.5rem] sm:text-[0.7rem] font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase transition-colors duration-500 ${solid ? "text-brand/50" : "text-white/80"}`}>
                    Private Limited
                  </p>
                </div>
              </Link>

              <nav className="hidden md:flex items-center gap-8">
                <Link href="/#process" className={`text-sm font-medium transition-colors duration-300 font-heading ${solid ? "text-gray-700 hover:text-gold" : "text-white hover:text-gold"}`}>Our Process</Link>
                <Link href="/products" className={`text-sm font-medium transition-colors duration-300 font-heading ${solid ? "text-gray-700 hover:text-gold" : "text-white hover:text-gold"}`}>Products</Link>
                <Link href="/#faq" className={`text-sm font-medium transition-colors duration-300 font-heading ${solid ? "text-gray-700 hover:text-gold" : "text-white hover:text-gold"}`}>FAQ</Link>

                <button
                  onClick={toggleCart}
                  className={`relative p-2 rounded-full transition-colors ${solid ? "hover:bg-brand/5 text-brand" : "hover:bg-white/10 text-white"}`}
                >
                  <ShoppingCart size={22} />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gold text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                      {totalItems}
                    </span>
                  )}
                </button>

                {!loading && (
                  user ? (
                    <div className="relative" ref={dropdownRef}>
                      <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${solid ? "bg-brand text-white hover:bg-brand-light" : "bg-white/20 text-white hover:bg-white/30"}`}
                      >
                        {initial}
                      </button>
                      {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border py-2 z-50">
                          <Link href="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-soft transition-colors">
                            <User size={16} /> Profile
                          </Link>
                          <Link href="/orders" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-soft transition-colors">
                            <Package size={16} /> My Orders
                          </Link>
                          {role === "admin" && (
                            <Link href="/admin" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-soft transition-colors">
                              <LayoutDashboard size={16} /> Admin Dashboard
                            </Link>
                          )}
                          <hr className="my-1" />
                          <button onClick={handleSignOut} className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full">
                            <LogOut size={16} /> Sign Out
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link href="/auth/login" className={`flex items-center gap-2 text-sm font-medium transition-colors ${solid ? "text-brand hover:text-gold" : "text-white/90 hover:text-gold"}`}>
                      <LogIn size={18} /> Login
                    </Link>
                  )
                )}

                <a href="#contact" className="bg-gold text-brand px-6 py-2.5 rounded-full text-sm font-bold hover:bg-gold-light transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-heading">
                  Contact Us
                </a>
              </nav>

              <div className="flex md:hidden items-center gap-2">
                <button
                  onClick={toggleCart}
                  className={`relative p-2 rounded-full ${solid ? "text-brand" : "text-white"}`}
                >
                  <ShoppingCart size={22} />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gold text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                      {totalItems}
                    </span>
                  )}
                </button>
                <button
                  className={`p-2 transition-colors duration-300 ${solid ? "text-brand" : "text-white"}`}
                  onClick={() => setMobileOpen(true)}
                >
                  <span className="material-symbols-outlined text-2xl">menu</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className={`fixed inset-0 bg-white z-[60] transform transition-transform duration-300 md:hidden flex flex-col ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between h-20 px-6 border-b border-brand/10">
          <h1 className="font-heading text-xl font-semibold text-brand">Bandaru Agrotech</h1>
          <button onClick={closeMobile} className="p-2 text-brand">
            <span className="material-symbols-outlined text-3xl">close</span>
          </button>
        </div>
        <nav className="flex flex-col p-8 gap-8 mt-4">
          <Link href="/#process" onClick={closeMobile} className="text-3xl font-heading font-semibold text-brand hover:text-gold transition-colors">Our Process</Link>
          <Link href="/products" onClick={closeMobile} className="text-3xl font-heading font-semibold text-brand hover:text-gold transition-colors">Products</Link>
          <Link href="/#faq" onClick={closeMobile} className="text-3xl font-heading font-semibold text-brand hover:text-gold transition-colors">FAQ</Link>
          <a href="#contact" onClick={closeMobile} className="text-3xl font-heading font-semibold text-brand hover:text-gold transition-colors">Contact Us</a>

          <hr className="border-brand/10" />

          {!loading && (
            user ? (
              <>
                <Link href="/profile" onClick={closeMobile} className="text-xl font-heading font-semibold text-brand hover:text-gold transition-colors">Profile</Link>
                <Link href="/orders" onClick={closeMobile} className="text-xl font-heading font-semibold text-brand hover:text-gold transition-colors">My Orders</Link>
                {role === "admin" && (
                  <Link href="/admin" onClick={closeMobile} className="text-xl font-heading font-semibold text-gold hover:text-gold-light transition-colors">Admin Dashboard</Link>
                )}
                <button onClick={() => { closeMobile(); handleSignOut(); }} className="text-xl font-heading font-semibold text-red-600 hover:text-red-700 transition-colors text-left">
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/auth/login" onClick={closeMobile} className="text-xl font-heading font-semibold text-brand hover:text-gold transition-colors">
                Login / Sign Up
              </Link>
            )
          )}
        </nav>
      </div>
    </>
  );
}
