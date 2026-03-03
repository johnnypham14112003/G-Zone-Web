import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();
  const isCheckout = location.pathname === '/checkout';

  if (isCheckout) {
    return (
      <header className="flex items-center justify-between whitespace-nowrap border-b border-[#333] bg-[#0D0D0D]/95 backdrop-blur px-6 lg:px-40 py-4 sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-3 text-white">
          <div className="text-primary">
            <span className="material-symbols-outlined text-4xl">two_wheeler</span>
          </div>
          <h2 className="text-white text-xl font-bold leading-tight tracking-tighter uppercase">MotoGear</h2>
        </Link>
        <div className="flex items-center gap-3 bg-[#1A1A1A] px-4 py-2 rounded-full border border-[#333]">
          <span className="material-symbols-outlined text-[#6B6B6B] text-lg">lock</span>
          <span className="text-sm font-bold text-[#E0E0E0] uppercase tracking-wider">Secure Checkout</span>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-surface-border bg-[#120505]/95 backdrop-blur">
      <div className="flex h-16 items-center px-4 md:px-8 max-w-[1440px] mx-auto justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 text-white transition-opacity hover:opacity-80">
            <div className="size-6 text-primary">
              <span className="material-symbols-outlined text-3xl">sports_motorsports</span>
            </div>
            <span className="text-xl font-bold tracking-tighter uppercase italic">MotoGear</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/shop" className="text-sm font-medium text-white/70 hover:text-primary transition-colors uppercase tracking-wide">Shop</Link>
            <Link to="/garage" className="text-sm font-medium text-white/70 hover:text-primary transition-colors uppercase tracking-wide">Garage</Link>
            <Link to="/missions" className="text-sm font-medium text-white/70 hover:text-primary transition-colors uppercase tracking-wide">Missions</Link>
            <Link to="/support" className="text-sm font-medium text-white/70 hover:text-primary transition-colors uppercase tracking-wide">Support</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex relative group">
            <input className="bg-surface-dark border border-surface-border rounded-lg py-1.5 px-4 text-sm text-white focus:outline-none focus:border-primary w-64 transition-all" placeholder="Search parts..." type="text" />
            <span className="material-symbols-outlined absolute right-3 top-1.5 text-white/40 text-[20px]">search</span>
          </div>
          <Link to="/cart" className="text-white hover:text-primary transition-colors relative">
            <span className="material-symbols-outlined">shopping_cart</span>
            <span className="absolute -top-1 -right-1 size-2 bg-primary rounded-full animate-pulse"></span>
          </Link>
          <Link to="/dashboard" className="size-9 rounded-full bg-surface-dark border border-surface-border flex items-center justify-center text-white hover:border-primary transition-colors">
            <span className="material-symbols-outlined text-[20px]">person</span>
          </Link>
          <Link to="/login" className="md:hidden text-white">
             <span className="material-symbols-outlined">login</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;