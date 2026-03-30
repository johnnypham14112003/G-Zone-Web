import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import ProfileDropdown from '../UI/ProfileDropdown';
import NotificationBell from './NotificationBell';
import { getCart, getCartCount } from '@/lib/cart';
import logo from "@/assets/logo/logo-gzone.png";

const primaryLinks = [
  { to: "/shop", label: "Shop All" },
  { to: "/garage", label: "Garage" },
  { to: "/missions", label: "Missions" },
  { to: "/support", label: "Support" },
];

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const isCheckout = location.pathname === "/checkout";
  const [cartCount, setCartCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const syncCartCount = () => {
      setCartCount(getCartCount(getCart()));
    };

    syncCartCount();
    window.addEventListener("cart:updated", syncCartCount);
    return () => window.removeEventListener("cart:updated", syncCartCount);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchTerm(params.get("search") || "");
  }, [location.search]);

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchTerm.trim();
    navigate(query ? `/shop?search=${encodeURIComponent(query)}` : "/shop");
  };

  if (isCheckout) {
    return (
      <header className="flex items-center justify-between whitespace-nowrap border-b border-[#333] bg-[#0D0D0D]/95 backdrop-blur px-6 lg:px-40 py-4 sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-3 text-white">
          <img src={logo} alt="GZone" className="h-10" />
          <span className="text-lg font-bold tracking-tighter uppercase">
            GZone
          </span>
        </Link>
        <div className="flex items-center gap-3 bg-[#1A1A1A] px-4 py-2 rounded-full border border-[#333]">
          <span className="material-symbols-outlined text-[#6B6B6B] text-lg">
            lock
          </span>
          <span className="text-sm font-bold text-[#E0E0E0] uppercase tracking-wider">
            Secure Checkout
          </span>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-surface-border bg-[#120505]/95 backdrop-blur supports-[backdrop-filter]:bg-[#120505]/80">
      <div className="hidden border-b border-white/5 bg-black/30 md:block">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-white/55 md:px-8">
          <div className="flex items-center gap-5">
            <span>COD available</span>
            <span>Verified riding gear</span>
            <span>Support 7 days</span>
          </div>
          <div className="flex items-center gap-5">
            <Link to="/support" className="transition-colors hover:text-white">
              Help Center
            </Link>
            <Link
              to={isAuthenticated ? "/profile" : "/login"}
              className="transition-colors hover:text-white"
            >
              {isAuthenticated ? "My Account" : "Sign In"}
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 md:px-8">
        <div className="flex min-h-16 items-center gap-4 py-3">
          <div className="flex min-w-0 items-center gap-6">
            <Link
              to="/"
              className="flex items-center gap-3 text-white transition-opacity hover:opacity-85"
            >
              <img src={logo} alt="GZone" className="h-12" />
              <span className="text-lg font-bold tracking-tighter uppercase">
                GZone
              </span>
            </Link>
          </div>

          <form onSubmit={handleSearchSubmit} className="hidden flex-1 lg:flex">
            <div className="relative w-full max-w-2xl">
              <span className="material-symbols-outlined pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/35">
                search
              </span>
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="h-12 w-full rounded-full border border-white/10 bg-[#1a1111] pl-12 pr-36 text-sm text-white placeholder:text-white/30 focus:border-primary focus:outline-none"
                placeholder="Search helmets, jackets, gloves..."
                type="text"
              />
              <button className="absolute right-1.5 top-1.5 rounded-full bg-primary px-5 py-3 text-xs font-black uppercase tracking-[0.2em] text-white transition-colors hover:bg-red-600">
                Search
              </button>
            </div>
          </form>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <Link
              to="/shop"
              className="hidden rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white/70 transition-colors hover:border-primary/30 hover:text-white md:inline-flex"
            >
              Shop Now
            </Link>
            <Link
              to="/cart"
              className="relative flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white transition-colors hover:border-primary/40 hover:text-primary"
            >
              <span className="material-symbols-outlined">shopping_cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
            <NotificationBell />
            {isAuthenticated ? (
              <ProfileDropdown />
            ) : (
              <Link to="/login" className="flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white transition-colors hover:border-primary/40 hover:text-primary">
                <span className="material-symbols-outlined text-[20px]">person</span>
              </Link>
            )}
            {!isAuthenticated && (
              <Link
                to="/login"
                className="hidden rounded-full bg-primary px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white transition-colors hover:bg-red-600 sm:inline-flex"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>

        <div className="pb-3 lg:hidden">
          <form onSubmit={handleSearchSubmit} className="relative">
            <span className="material-symbols-outlined pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/35">
              search
            </span>
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="h-11 w-full rounded-full border border-white/10 bg-[#1a1111] pl-12 pr-4 text-sm text-white placeholder:text-white/30 focus:border-primary focus:outline-none"
              placeholder="Search riding gear"
              type="text"
            />
          </form>
        </div>

        <nav className="flex gap-2 overflow-x-auto border-t border-white/5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white/60 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {primaryLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-full px-4 py-2 transition-colors ${
                  isActive
                    ? "bg-primary text-white"
                    : "bg-white/[0.03] hover:bg-white/[0.08] hover:text-white"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <Link
            to="/profile"
            className="whitespace-nowrap rounded-full bg-white/[0.03] px-4 py-2 transition-colors hover:bg-white/[0.08] hover:text-white"
          >
            Account
          </Link>
          <Link
            to="/profile/orders"
            className="whitespace-nowrap rounded-full bg-white/[0.03] px-4 py-2 transition-colors hover:bg-white/[0.08] hover:text-white"
          >
            Orders
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
