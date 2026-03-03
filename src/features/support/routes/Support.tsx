import React from 'react';

const Support: React.FC = () => {
  return (
    <div className="relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-carbon opacity-30 pointer-events-none z-0"></div>
      <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-[#111] to-transparent pointer-events-none z-0"></div>

      <section className="relative z-10 pt-16 pb-12 md:pt-24 md:pb-16 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-[#333] pb-8">
          <div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-4">
              Pit Crew <span className="text-primary">Support</span>
            </h1>
            <p className="text-text-dim text-lg md:text-xl max-w-2xl font-light">
              Technical questions or order issues? Get back on the road fast.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-surface-dark border border-[#333] px-4 py-2 rounded-full">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm font-medium text-gray-300 uppercase tracking-wide">Systems Online</span>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto w-full pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          <div className="lg:col-span-5 flex flex-col gap-10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Contact Options */}
                {[
                  { icon: 'phone_in_talk', label: 'Call Us', value: '1-800-MOTO' },
                  { icon: 'mail', label: 'Email', value: 'support@' },
                  { icon: 'chat', label: 'Chat', value: 'Live Now' },
                ].map((item, i) => (
                  <a key={i} href="#" className="group flex flex-col items-center justify-center p-4 rounded-lg bg-surface-dark border border-surface-border hover:border-primary/50 transition-all hover:bg-[#222]">
                    <span className="material-symbols-outlined text-primary mb-2 text-3xl group-hover:scale-110 transition-transform">{item.icon}</span>
                    <span className="text-xs text-text-dim uppercase tracking-widest">{item.label}</span>
                    <span className="text-sm font-bold text-white mt-1">{item.value}</span>
                  </a>
                ))}
            </div>

            <div>
              <h2 className="text-2xl font-bold uppercase mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-primary block rounded-sm"></span>
                Common Issues
              </h2>
              <div className="flex flex-col gap-4">
                <details className="group bg-surface-dark rounded-lg border border-surface-border open:border-l-4 open:border-l-primary transition-all duration-300">
                  <summary className="flex cursor-pointer items-center justify-between p-5 list-none">
                    <span className="font-bold text-gray-200 group-hover:text-white uppercase tracking-tight">How do I track my exhaust system?</span>
                    <span className="material-symbols-outlined transition-transform duration-300 group-open:rotate-180 text-primary">expand_more</span>
                  </summary>
                  <div className="px-5 pb-5 text-text-dim border-t border-[#333] pt-4 mt-1 text-sm leading-relaxed">
                    <p>You can track your order status in real-time via the 'My Garage' dashboard.</p>
                  </div>
                </details>
                <details className="group bg-surface-dark rounded-lg border border-surface-border open:border-l-4 open:border-l-primary transition-all duration-300">
                  <summary className="flex cursor-pointer items-center justify-between p-5 list-none">
                    <span className="font-bold text-gray-200 group-hover:text-white uppercase tracking-tight">Will this part fit my 2022 model?</span>
                    <span className="material-symbols-outlined transition-transform duration-300 group-open:rotate-180 text-primary">expand_more</span>
                  </summary>
                  <div className="px-5 pb-5 text-text-dim border-t border-[#333] pt-4 mt-1 text-sm leading-relaxed">
                    <p>Our "My Garage" filter tool guarantees fitment.</p>
                  </div>
                </details>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="relative bg-surface-dark rounded-xl border border-surface-border p-8 md:p-10 shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none"></div>
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold uppercase">Open a Ticket</h2>
                        <span className="text-xs font-mono text-primary bg-primary/10 border border-primary/20 px-2 py-1 rounded">ID: #REQ-NEW</span>
                    </div>
                    <form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="group">
                                <label className="block text-xs uppercase tracking-wider text-text-dim mb-2 font-bold group-focus-within:text-white transition-colors">Rider Name</label>
                                <input className="w-full bg-background-dark border border-surface-border text-white rounded-md px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="Alex Doe" type="text" />
                            </div>
                            <div className="group">
                                <label className="block text-xs uppercase tracking-wider text-text-dim mb-2 font-bold group-focus-within:text-white transition-colors">Email Address</label>
                                <input className="w-full bg-background-dark border border-surface-border text-white rounded-md px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="alex@example.com" type="email" />
                            </div>
                        </div>
                        <div className="group">
                            <label className="block text-xs uppercase tracking-wider text-text-dim mb-2 font-bold group-focus-within:text-white transition-colors">Detailed Description</label>
                            <textarea className="w-full bg-background-dark border border-surface-border text-white rounded-md px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none" rows={5} placeholder="Describe the issue..."></textarea>
                        </div>
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-2">
                             <label className="cursor-pointer flex items-center gap-2 text-sm text-text-dim hover:text-white transition-colors group">
                                <span className="material-symbols-outlined group-hover:text-primary transition-colors">attach_file</span>
                                <span className="border-b border-transparent group-hover:border-white transition-all">Attach Photos/Video</span>
                                <input type="file" className="hidden" />
                            </label>
                            <button type="button" className="w-full md:w-auto min-w-[200px] flex items-center justify-center gap-3 bg-primary hover:bg-red-700 text-white font-bold py-4 px-8 rounded-md uppercase tracking-widest transition-all shadow-lg shadow-red-900/20 group">
                                <span>Send Message</span>
                                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">send</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Support;