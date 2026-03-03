import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="flex flex-1 relative">
      {/* Side Navigation */}
      <aside className="hidden md:flex w-72 flex-col border-r border-surface-border bg-surface-dark p-6 sticky top-[65px] h-[calc(100vh-65px)] overflow-y-auto">
        <div className="flex flex-col gap-4 mb-8 pb-8 border-b border-surface-border">
          <div className="flex gap-4 items-center">
            <div className="bg-center bg-no-repeat bg-cover rounded-full size-16 ring-2 ring-primary ring-offset-2 ring-offset-[#1E0A0A]" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD4xjA1xDmBybJ-zy4g8gH5Y-1DKlrvzYpSZ_cIh6yV4C88TyAZOwO3S2vCUtDfiTbomUBl2vygay32TtWV64TCMy-Kv_rJtkJ3Sk3a5NfCVmeJpPjzy_Z_1Su4LUyKP8wUmj0Mb4dsoLCgAVXG-LryCFzQ1WIrGVKIx4IfJv_GoGvJhYkff_iaY0CS6MwbufiZ2kJT8_eKQC74D6OlAwmfiF97-BoUvtKnnkQJ3mQQ35cJVvhRGUiXlJiLgAdq7dq4GbBf-nPNllwz')" }}></div>
            <div className="flex flex-col">
              <h1 className="text-white text-lg font-bold leading-tight uppercase tracking-wide">Alex 'Apex' Rider</h1>
              <p className="text-primary text-xs font-bold uppercase tracking-widest mt-1">Gold Tier Racer</p>
            </div>
          </div>
          <div className="flex justify-between items-center text-xs text-text-muted bg-[#2a1212] p-2 rounded">
            <span>Member Since</span>
            <span className="text-white font-mono">NOV 2021</span>
          </div>
        </div>
        <nav className="flex flex-col gap-2 flex-1">
          <a className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/20 border-l-4 border-primary text-white group transition-all" href="#"><span className="material-symbols-outlined icon-filled text-primary">dashboard</span><p className="text-sm font-bold uppercase tracking-wide">Overview</p></a>
          <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-muted hover:bg-[#2a1212] hover:text-white transition-all group" href="#"><span className="material-symbols-outlined group-hover:text-primary transition-colors">two_wheeler</span><p className="text-sm font-medium">My Garage</p></a>
          <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-muted hover:bg-[#2a1212] hover:text-white transition-all group" href="#"><span className="material-symbols-outlined group-hover:text-primary transition-colors">package_2</span><p className="text-sm font-medium">Orders</p></a>
          <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-muted hover:bg-[#2a1212] hover:text-white transition-all group" href="#"><span className="material-symbols-outlined group-hover:text-primary transition-colors">favorite</span><p className="text-sm font-medium">Wishlist</p></a>
          <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-muted hover:bg-[#2a1212] hover:text-white transition-all group" href="#"><span className="material-symbols-outlined group-hover:text-primary transition-colors">settings</span><p className="text-sm font-medium">Settings</p></a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-text-muted text-sm font-mono mb-1 uppercase tracking-widest">Dashboard // Home</p>
            <h2 className="text-white text-4xl md:text-5xl font-black italic uppercase tracking-tighter">Ready to Ride, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-red-400">Alex?</span></h2>
          </div>
          <button className="flex items-center gap-2 px-6 h-10 bg-[#2a1212] hover:bg-[#3d1a1a] border border-surface-border rounded text-white text-sm font-bold uppercase tracking-wider transition-all"><span className="material-symbols-outlined text-lg">edit</span> Edit Profile</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 relative overflow-hidden rounded-xl bg-surface-dark border border-surface-border group">
            <div className="relative z-10 p-6 flex flex-col sm:flex-row h-full">
              <div className="flex-1 flex flex-col justify-between order-2 sm:order-1 mt-4 sm:mt-0">
                <div>
                  <div className="flex items-center gap-2 mb-2"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary text-white uppercase">Primary Ride</span></div>
                  <h3 className="text-2xl font-bold text-white mb-1">Ducati Panigale V4</h3>
                  <p className="text-text-muted text-sm mb-4">2023 Model • Matte Black Finish</p>
                </div>
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-primary hover:bg-red-700 text-white text-sm font-bold rounded flex items-center gap-2 transition-colors"><span className="material-symbols-outlined text-lg">build</span> Shop Parts</button>
                  <button className="px-4 py-2 bg-[#2a1212] hover:bg-[#3a1818] text-white text-sm font-bold rounded transition-colors">View Specs</button>
                </div>
              </div>
              <div className="w-full sm:w-1/2 order-1 sm:order-2">
                <div className="w-full h-48 sm:h-full bg-center bg-contain bg-no-repeat transform group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDjuJ2Jj-soVXxQM1zQai5LYxaqR3cUpxpGnepyWyuMFTtMXgNvGzOWHmAVpXaYiLu03peY97w7fHHcUiFvGECdHX-EoSMie2mnVt8EBw7EMuZQVhqXd04VcCovTufrsaxqjx6FrDfNx_eKRQ-JGrzoND-g4viGRIx0uAtBZbHOF5gxyIgTEVG0eL2CAe9a52hkg27I-dINSzravH-dxbH55e3OoxqVWnxQ_EFqVgknoFegQaNnSxss_YH4ly5GHzwv63oBtQskWQxJ')" }}></div>
              </div>
            </div>
          </div>

          <div className="bg-surface-dark rounded-xl border border-surface-border p-6 flex flex-col items-center justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4"><span className="material-symbols-outlined text-[#361717] text-8xl opacity-50 rotate-12">loyalty</span></div>
            <div className="w-full flex justify-between items-start z-10 mb-4">
              <h3 className="text-white font-bold uppercase tracking-wide">RPM Rewards</h3>
              <span className="text-text-muted text-xs font-mono">Tier: GOLD</span>
            </div>
            <div className="relative w-48 h-24 overflow-hidden mt-4">
                <div className="absolute w-48 h-48 rounded-full border-[12px] border-[#2a1212] border-b-0 border-l-0 border-r-0" style={{ transform: 'rotate(-90deg)' }}></div>
                <div className="absolute w-48 h-48 rounded-full border-[12px] border-primary border-b-transparent border-l-transparent border-r-transparent" style={{ transform: 'rotate(45deg)' }}></div>
            </div>
            <div className="text-center mt-2 z-10">
              <p className="text-4xl font-mono font-bold text-white">8,450</p>
              <p className="text-primary text-xs font-bold uppercase tracking-widest">Points Balance</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[{icon: 'shopping_bag', val: '12', label: 'Total Orders'}, {icon: 'rate_review', val: '05', label: 'Reviews'}, {icon: 'confirmation_number', val: '01', label: 'Active Ticket'}, {icon: 'garage', val: '02', label: 'Bikes Saved'}].map((s,i) => (
                <div key={i} className="bg-surface-dark p-4 rounded-lg border border-surface-border flex items-center gap-4 hover:border-primary/50 transition-colors">
                    <div className="size-10 rounded-full bg-[#2a1212] flex items-center justify-center text-primary"><span className="material-symbols-outlined">{s.icon}</span></div>
                    <div><p className="text-2xl font-bold text-white font-mono">{s.val}</p><p className="text-text-muted text-xs uppercase font-bold">{s.label}</p></div>
                </div>
            ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;