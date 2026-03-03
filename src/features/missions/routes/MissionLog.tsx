import React from 'react';
import { Link } from 'react-router-dom';

const MissionLog: React.FC = () => {
  return (
    <div className="flex-1 w-full max-w-[1440px] mx-auto p-4 md:p-8 flex flex-col lg:flex-row gap-8">
      {/* Left Column: Order History */}
      <main className="flex-1 flex flex-col gap-8 min-w-0">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-surface-border pb-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-white mb-2">Mission Log</h1>
            <p className="text-text-muted font-body">Track your gear acquisitions and past operations.</p>
          </div>
          <div className="flex items-center gap-2 bg-surface-dark p-1 rounded-lg border border-surface-border">
            <button className="px-4 py-1.5 rounded bg-primary text-white text-sm font-bold uppercase tracking-wide shadow-[0_0_10px_rgba(230,0,0,0.4)]">All</button>
            <button className="px-4 py-1.5 rounded text-white/60 hover:text-white hover:bg-white/5 text-sm font-medium uppercase tracking-wide transition-all">Active</button>
            <button className="px-4 py-1.5 rounded text-white/60 hover:text-white hover:bg-white/5 text-sm font-medium uppercase tracking-wide transition-all">Completed</button>
            <button className="px-4 py-1.5 rounded text-white/60 hover:text-white hover:bg-white/5 text-sm font-medium uppercase tracking-wide transition-all">Returns</button>
          </div>
        </div>

        {/* Active Order */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-transparent opacity-20 blur rounded-xl group-hover:opacity-40 transition duration-500"></div>
          <div className="relative bg-surface-dark border border-surface-border rounded-xl overflow-hidden flex flex-col md:flex-row">
            <div className="md:w-1/3 min-h-[200px] relative bg-neutral-900 border-r border-surface-border">
              <div className="absolute inset-0 opacity-40 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA5TekR3psS_I2quoBhy3rABIdRG5m1k6yyvAVGmH80O2oui0OSyG-jfo2EJRMCa1ncTHMK_x5cwOGCJodaF0aFef2Fbv7xRCqlps4pt5xK8od5xJEIS1ktnDcGsdjw8g6bRcM8AEK42YsU50ISXcMG9zhK39jeHN0lIm3YB-3EGlE0rpSJjaa6dcZVDmq8KV_QdflZwXsBRmvBQSrOp9vU4O3w6EGslIY365Y2eywil6OnIi8TA_hAnd736uUBR7DAsZk_XQ52tk8p')" }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 z-10">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-primary/20 border border-primary/40 text-primary text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                  <span className="size-1.5 rounded-full bg-primary animate-ping"></span>
                  In Transit
                </span>
              </div>
            </div>
            <div className="flex-1 p-6 flex flex-col justify-between gap-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-xs font-mono text-text-muted mb-1">ORDER #29384-MX • OCT 24, 2023</div>
                  <h3 className="text-xl font-bold text-white mb-2">Akrapovič Slip-On Line (Titanium)</h3>
                  <p className="text-sm text-text-muted font-body">Also includes: Chain Lube, Oil Filter</p>
                </div>
                <div className="text-right hidden sm:block">
                  <div className="text-2xl font-bold text-white">$849.00</div>
                  <div className="text-xs text-text-muted">3 Items</div>
                </div>
              </div>
              <div className="w-full">
                <div className="flex justify-between text-xs text-white/50 mb-2 uppercase tracking-wider font-bold">
                  <span className="text-white">Ordered</span>
                  <span className="text-white">Shipped</span>
                  <span className="text-primary animate-pulse">Out for Delivery</span>
                  <span>Delivered</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-3/4 shadow-[0_0_10px_rgba(230,0,0,0.6)] relative">
                    <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-r from-transparent to-white/40"></div>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-2">
                <button className="flex-1 bg-primary hover:bg-primary-hover text-white font-bold py-2.5 px-4 rounded-lg uppercase tracking-wide text-sm flex items-center justify-center gap-2 transition-all shadow-[0_4px_14px_rgba(230,0,0,0.3)]">
                  <span className="material-symbols-outlined text-[18px]">location_on</span>
                  Track Mission
                </button>
                <button className="px-4 py-2.5 rounded-lg border border-white/10 hover:bg-white/5 text-white text-sm font-medium uppercase tracking-wide transition-colors">
                  Details
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Past Orders */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold uppercase text-white/40 tracking-widest pl-1 mt-4">Past Missions</h3>
          
          <div className="group bg-surface-dark hover:bg-[#261010] border border-surface-border border-l-4 border-l-green-500 rounded-r-lg p-4 flex flex-col md:flex-row items-center gap-6 transition-all duration-300">
            <div className="size-16 md:size-20 shrink-0 bg-white/5 rounded-lg flex items-center justify-center border border-white/10 overflow-hidden relative">
              <div className="absolute inset-0 bg-cover bg-center opacity-80" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCrViA0dNfYEcms8r3naQ_BASy22QtxpXxxPBZR41DiFqf0w07fpJ8AtbSjm7uFu28x16LR1fZMUSGZdJUL3Ns_l4MtIDTHV1uIXpYnplS6d449IiVkl7Rvcasjt_cm2i3iGK-jswZxGP2MRnxA0ccFyyrTN5CeH-8hW4-HpmUD8JeZne0HuewN5eYEJ-uhKuvqNEuKCe2j8cPC1ZIT2ULV9J-wotAgwqnDQl_kuWTrRqunpn_jrm0mvChSaBXDWvWhAsmjytz8NZBE')" }}></div>
            </div>
            <div className="flex-1 w-full text-center md:text-left">
              <div className="flex flex-col md:flex-row justify-between items-baseline mb-1">
                <h4 className="text-lg font-bold text-white group-hover:text-primary transition-colors">Alpinestars GP Plus R v3 Jacket</h4>
                <span className="text-green-500 text-xs font-bold uppercase tracking-wider border border-green-500/20 bg-green-500/10 px-2 py-0.5 rounded flex items-center gap-1 mx-auto md:mx-0">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span> Delivered
                </span>
              </div>
              <div className="flex flex-col md:flex-row gap-4 text-sm text-text-muted font-body">
                <span>Order #88392-US</span>
                <span className="hidden md:inline text-white/20">•</span>
                <span>Sep 12, 2023</span>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button className="flex-1 md:flex-none py-2 px-4 rounded border border-white/10 hover:border-white/30 text-white text-sm font-medium transition-colors">Invoice</button>
              <button className="flex-1 md:flex-none py-2 px-4 rounded bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors flex items-center justify-center gap-1">
                <span className="material-symbols-outlined text-[16px]">refresh</span> Buy Again
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Sidebar */}
      <aside className="w-full lg:w-80 xl:w-96 shrink-0 flex flex-col gap-6">
        <div className="bg-surface-dark border border-surface-border rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <span className="material-symbols-outlined text-[120px] text-white rotate-[-15deg]">motorcycle</span>
          </div>
          <h3 className="text-sm font-bold uppercase text-text-muted tracking-widest mb-4">My Garage</h3>
          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="size-14 rounded-full bg-gradient-to-br from-primary to-black p-[2px]">
              <div className="size-full rounded-full bg-surface-dark flex items-center justify-center overflow-hidden">
                <div className="size-full bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDZrY20dkluhAupqHK6TlOgyQA7e0zur5x_FMUM6P-0ufIBB1T6zZfxwfSdPSfhmZF4Zn_5geKqf8nr1c2uxP0HVSJgkB0QPFlVbt0ZCjNQumN6hML3j3kRwBA3SJ42w_55u-UKw_OilIYwi1s5-pUu8w7cGAxYk2l_mAE_WKzKTUq-Hd056fRapQSya94xENBAxS7WWQJfCRZnKr1bCj5YoOMjYXcgG8Db1VxHd13m5uS1NSCSbn5rSs_99abmZCEX5YouFtJ4H_UR')" }}></div>
              </div>
            </div>
            <div>
              <div className="text-xl font-bold text-white">Alex Rider</div>
              <div className="text-sm text-primary font-medium">2023 Yamaha R1M</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-black/30 rounded-lg p-3 border border-white/5">
              <div className="text-xs text-text-muted uppercase mb-1">Total Spend</div>
              <div className="text-lg font-mono font-bold text-white">$3,420</div>
            </div>
            <div className="bg-black/30 rounded-lg p-3 border border-white/5">
              <div className="text-xs text-text-muted uppercase mb-1">Missions</div>
              <div className="text-lg font-mono font-bold text-white">12</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-b from-surface-dark to-black border border-surface-border rounded-xl p-6 text-center">
            <div className="size-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10 text-white">
                <span className="material-symbols-outlined">headset_mic</span>
            </div>
            <h4 className="text-white font-bold text-lg mb-1">Need Backup?</h4>
            <p className="text-text-muted text-sm mb-4">Our mechanics are standing by to help with your order.</p>
            <Link to="/support" className="w-full block py-2.5 rounded border border-white/20 hover:bg-white/5 text-white text-sm font-medium transition-colors">
                Contact Support
            </Link>
        </div>
      </aside>
    </div>
  );
};

export default MissionLog;