import React from 'react';

const Accessories: React.FC = () => {
  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row gap-8">
      <aside className="w-full md:w-64 shrink-0 space-y-8 hidden md:block">
        <div className="border-b border-border-dark pb-6">
            <h3 className="text-white font-bold uppercase tracking-wide text-sm mb-4">Category</h3>
            <div className="space-y-2 text-sm text-gray-400">
                <label className="flex items-center gap-2"><input type="checkbox" className="rounded bg-background-dark border-gray-600 text-primary focus:ring-primary" /> Exhaust Systems</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked className="rounded bg-background-dark border-gray-600 text-primary focus:ring-primary" /> Helmets</label>
                <label className="flex items-center gap-2"><input type="checkbox" className="rounded bg-background-dark border-gray-600 text-primary focus:ring-primary" /> Tires</label>
            </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b border-border-dark pb-4">
            <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white uppercase italic tracking-tighter">Motorcycle Accessories</h1>
                <p className="text-gray-500 mt-2 text-sm md:text-base">Upgrade your ride with track-proven parts.</p>
            </div>
         </div>
         
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Product Card Example */}
            <div className="group relative bg-surface-dark rounded-md border border-border-dark overflow-hidden transition-all hover:border-primary/50">
                <div className="absolute top-3 right-3 z-10"><span className="bg-primary text-white text-[10px] font-bold px-2 py-1 uppercase rounded-sm">New Arrival</span></div>
                <div className="h-64 w-full bg-[#151515] relative p-6 flex items-center justify-center overflow-hidden">
                    <img className="h-full w-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrBLqbysqiS-7p-VeuNKa2KqYU0kcuC68GMqHvq6_SUdgCmMVDidBEifq8mlde9_6W4bFSC1_Mfwk6Y9cl2fa3PubpdaD_mxTTZxPcfc3SX1muJJy1C8M71dLpB3rqskvafzIr1Jl2Z2UWf4LpdDYVsloJjYYnpaC_6n-7pkeao0C-qKPLF18rMlkFXO6yXf3Ayw3ewsV3lXdFgv6CCSOLjIi5efmX9sn_-oxRUieEKv2jOUX4R6orIaDNerAXQKK6lF6GqpjRqA4L" alt="Exhaust" />
                </div>
                <div className="p-5">
                    <div className="text-xs text-gray-500 font-mono mb-1">EXHAUST SYSTEMS</div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors">Carbon Slip-On Exhaust</h3>
                    <div className="flex justify-between items-center"><span className="text-xl font-bold text-primary font-mono">$450.00</span></div>
                </div>
            </div>
            {/* More cards would map here */}
         </div>
      </div>
    </div>
  );
};

export default Accessories;