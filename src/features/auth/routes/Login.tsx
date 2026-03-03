import React from 'react';
import { Link } from 'react-router-dom';

const Login: React.FC = () => {
  return (
    <div className="bg-background-dark min-h-screen flex flex-col relative overflow-hidden text-white">
      {/* Navbar Minimal */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-[#4b2020] bg-[#240f0f]/90 backdrop-blur-md px-6 lg:px-10 py-3">
        <Link to="/" className="flex items-center gap-2 text-white group hover:text-primary transition-colors">
            <div className="size-6 text-primary group-hover:rotate-180 transition-transform duration-500">
                <span className="material-symbols-outlined !text-[24px]">sports_motorsports</span>
            </div>
            <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em] uppercase">MotoGear</h2>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-grow relative flex items-center justify-center min-h-screen pt-16 pb-12 px-4 sm:px-6">
        <div className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-fixed" style={{ backgroundImage: "linear-gradient(rgba(13, 13, 13, 0.85), rgba(35, 15, 15, 0.9)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuDvBe7ZQ9ncA54xZEhxV0eid4T5sekeirUQLrC29t6jpxGzzULIsK3NuZW2NWvNe92a-IwCDCblHxsPlTQmx-ikai-n-PVWAHj6TPOx7Yel046tZePyvvLMx1SsL-rYXmkKf_KlRpvPSR2VZPxh8w92tmClnKKVex39ta_Pw1qNCFfjpDLuogfarqpGXjdPsCB29skihV5J7oDQ8_vTIcc0iJF5gilt4uZ-tHeveJRfBB804CfToFsOGsXZLovX_V7QTy4GTK-ybz0a')" }}></div>
        
        <div className="relative z-10 w-full max-w-[480px]">
          <div className="bg-[#1a1a1a]/95 backdrop-blur-xl border border-[#4b2020] shadow-2xl rounded-xl overflow-hidden">
            <div className="flex border-b border-[#333]">
              <button className="flex-1 py-5 text-center relative group">
                <span className="text-white font-bold tracking-wider text-sm uppercase">Login</span>
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary"></div>
              </button>
              <button className="flex-1 py-5 text-center relative group hover:bg-white/5 transition-colors">
                <span className="text-text-muted font-medium tracking-wider text-sm uppercase group-hover:text-white transition-colors">Sign Up</span>
              </button>
            </div>
            <div className="p-8 sm:p-10 flex flex-col gap-6">
              <div className="text-center mb-2">
                <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">RIDER ACCESS</h1>
                <p className="text-text-muted text-sm">Enter your credentials to hit the road.</p>
              </div>
              <form className="flex flex-col gap-5">
                <div className="space-y-2 group">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider group-focus-within:text-primary transition-colors" htmlFor="email">Email Address</label>
                  <div className="relative">
                     <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 material-symbols-outlined text-[20px]">mail</span>
                    <input className="block w-full rounded-lg border border-[#333] bg-[#0d0d0d] pl-10 pr-3 py-3 text-white placeholder-gray-600 focus:border-primary focus:ring-1 focus:ring-primary focus:bg-[#151515] transition-all sm:text-sm" id="email" placeholder="rider@example.com" type="email" />
                  </div>
                </div>
                <div className="space-y-2 group">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider group-focus-within:text-primary transition-colors" htmlFor="password">Password</label>
                    <a className="text-xs text-text-muted hover:text-white transition-colors" href="#">Forgot?</a>
                  </div>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 material-symbols-outlined text-[20px]">lock</span>
                    <input className="block w-full rounded-lg border border-[#333] bg-[#0d0d0d] pl-10 pr-10 py-3 text-white placeholder-gray-600 focus:border-primary focus:ring-1 focus:ring-primary focus:bg-[#151515] transition-all sm:text-sm" id="password" placeholder="••••••••" type="password" />
                  </div>
                </div>
                <Link to="/dashboard" className="mt-4 w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold py-3.5 px-4 rounded-lg uppercase tracking-widest shadow-[0_0_15px_rgba(230,0,0,0.3)] transition-all">
                  <span>Ignition</span> <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </Link>
              </form>
              <div className="relative flex py-2 items-center"><div className="flex-grow border-t border-[#333]"></div><span className="flex-shrink-0 mx-4 text-gray-600 text-xs uppercase font-medium">Or continue with</span><div className="flex-grow border-t border-[#333]"></div></div>
              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 bg-[#2a2a2a] hover:bg-[#333] border border-[#333] text-white py-2.5 px-4 rounded-lg transition-all text-sm font-medium">Google</button>
                <button className="flex items-center justify-center gap-2 bg-[#2a2a2a] hover:bg-[#333] border border-[#333] text-white py-2.5 px-4 rounded-lg transition-all text-sm font-medium">Apple</button>
              </div>
            </div>
            <div className="flex h-1.5 w-full bg-[#0d0d0d]">
                <div className="w-[30%] bg-green-500 animate-pulse"></div><div className="w-[10%] bg-[#0d0d0d]"></div><div className="w-[40%] bg-primary"></div><div className="w-[5%] bg-[#0d0d0d]"></div><div className="w-[15%] bg-yellow-500"></div>
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t border-[#4b2020] bg-[#240f0f] py-6 text-center text-sm text-gray-500">
        <p>© 2024 MotoGear. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Login;