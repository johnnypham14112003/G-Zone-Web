import React from 'react';

const Checkout: React.FC = () => {
  return (
    <div className="px-4 lg:px-40 flex flex-1 justify-center py-8 lg:py-12">
      <div className="layout-content-container flex flex-col w-full flex-1 gap-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          {/* LEFT COLUMN: STEPS */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <div>
              <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] mb-6">Checkout</h1>
              <div className="flex flex-col gap-3">
                <div className="flex gap-6 justify-between items-end">
                  <p className="text-primary text-sm font-bold uppercase tracking-widest">Step 3 of 3: Payment Details</p>
                  <p className="text-[#6B6B6B] text-xs font-mono">100% SECURE</p>
                </div>
                <div className="rounded-full bg-[#1A1A1A] h-2 overflow-hidden">
                  <div className="h-full rounded-full bg-primary shadow-[0_0_15px_#e60000]" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>

            {/* Completed Steps */}
            <div className="flex flex-col rounded-lg border border-[#333] bg-surface-dark overflow-hidden group opacity-60">
              <div className="flex cursor-pointer items-center justify-between px-6 py-4 bg-[#151515]">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-primary">check_circle</span>
                  <p className="text-gray-300 text-base font-medium leading-normal">1. Shipping Address</p>
                </div>
                <button className="text-xs font-bold text-[#6B6B6B] hover:text-primary uppercase tracking-wider">Edit</button>
              </div>
              <div className="px-6 pb-4 pl-14">
                <p className="text-[#E0E0E0] text-sm leading-relaxed">
                  <span className="font-bold text-white">Alex Rider</span><br />
                  1240 Asphalt Blvd, Unit 4B<br />
                  Los Angeles, CA 90012, USA
                </p>
              </div>
            </div>

            <div className="flex flex-col rounded-lg border border-[#333] bg-surface-dark overflow-hidden group opacity-60">
              <div className="flex cursor-pointer items-center justify-between px-6 py-4 bg-[#151515]">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-primary">check_circle</span>
                  <p className="text-gray-300 text-base font-medium leading-normal">2. Shipping Method</p>
                </div>
                <button className="text-xs font-bold text-[#6B6B6B] hover:text-primary uppercase tracking-wider">Edit</button>
              </div>
              <div className="px-6 pb-4 pl-14 flex items-center gap-3">
                <span className="material-symbols-outlined text-[#E0E0E0]">rocket_launch</span>
                <p className="text-[#E0E0E0] text-sm"><span className="font-bold text-white">Express Moto</span> (2 Business Days) - <span className="text-primary">$15.00</span></p>
              </div>
            </div>

            {/* Step 3: Payment */}
            <div className="flex flex-col rounded-xl border border-primary bg-surface-dark relative overflow-hidden shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#333] bg-[#202020]">
                <div className="flex items-center gap-4">
                  <div className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">3</div>
                  <p className="text-white text-lg font-bold leading-normal">Payment Details</p>
                </div>
                <div className="flex gap-2 opacity-50">
                  <span className="material-symbols-outlined text-2xl">credit_card</span>
                  <span className="material-symbols-outlined text-2xl">account_balance</span>
                </div>
              </div>
              <div className="p-6 lg:p-8 flex flex-col gap-6">
                <div className="flex gap-4 mb-2">
                  <button className="flex-1 py-3 px-4 rounded-lg border-2 border-primary bg-[#2a0f0f] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_10px_rgba(230,0,0,0.1)]">
                    <span className="material-symbols-outlined">credit_card</span> Credit Card
                  </button>
                  <button className="flex-1 py-3 px-4 rounded-lg border border-[#333] bg-[#262626] text-[#888] font-medium text-sm flex items-center justify-center gap-2 hover:bg-[#333] hover:text-white transition-colors">
                    <span className="material-symbols-outlined">payments</span> PayPal
                  </button>
                </div>
                <div className="flex flex-col gap-4">
                  <label className="flex flex-col gap-2">
                    <p className="text-[#E0E0E0] text-xs font-bold uppercase tracking-wider">Card Number</p>
                    <div className="relative">
                      <input className="w-full bg-[#262626] border border-[#333] rounded-lg h-12 px-4 pl-12 text-white placeholder-[#666] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono" placeholder="0000 0000 0000 0000" type="text" />
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666]">
                        <span className="material-symbols-outlined">credit_card</span>
                      </div>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <span className="material-symbols-outlined text-green-500">lock</span>
                      </div>
                    </div>
                  </label>
                  <div className="flex gap-4">
                    <label className="flex flex-col gap-2 flex-1">
                      <p className="text-[#E0E0E0] text-xs font-bold uppercase tracking-wider">Expiry Date</p>
                      <input className="w-full bg-[#262626] border border-[#333] rounded-lg h-12 px-4 text-white placeholder-[#666] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono" placeholder="MM/YY" type="text" />
                    </label>
                    <label className="flex flex-col gap-2 flex-1">
                      <p className="text-[#E0E0E0] text-xs font-bold uppercase tracking-wider">CVC / CWW</p>
                      <div className="relative">
                        <input className="w-full bg-[#262626] border border-[#333] rounded-lg h-12 px-4 text-white placeholder-[#666] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono" placeholder="123" type="text" />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#666] cursor-help">
                          <span className="material-symbols-outlined text-sm">help</span>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: SUMMARY */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-28 space-y-6">
              <div className="bg-[#1A1A1A] border border-[#333] rounded-xl shadow-2xl overflow-hidden flex flex-col">
                <div className="bg-[#202020] px-6 py-4 border-b border-[#333] flex justify-between items-center">
                  <h3 className="text-lg font-bold text-white uppercase tracking-tight">Order Spec Sheet</h3>
                  <span className="text-xs font-mono text-[#666]">#MG-9928-X</span>
                </div>
                <div className="p-6 flex flex-col gap-6">
                  {/* Item 1 */}
                  <div className="flex gap-4 group">
                    <div className="size-20 rounded bg-[#0D0D0D] border border-[#333] flex items-center justify-center overflow-hidden shrink-0">
                      <img className="w-full h-full object-cover opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYdwQ2PBu6pq-1D9VoGzZHvu8hg6W0CL6TwL2ClXtWBdKWsp9PY4xQP-CAH6BERBZnAIzddybD_qoay7yT0NFc8rm-uJTKrjdgbOCXc-rgjVRjQTg-QBjwlD7v4Hin8SD6zuG6eIfZCvS24pQzNb3Fx8m1kv30y9cFaTmojl06tJqrVijgNDGY5X4IUIukiEKkRbHPSFq_8ym02VNMRXdhmYSWqQZwYCBXa8oNFH7P0EvkG5HoBWR446E9Js_howZFBlO0XddednVP" alt="Helmet" />
                    </div>
                    <div className="flex flex-col justify-center flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="text-white font-bold text-sm leading-tight">Carbon X1 Helmet</h4>
                        <p className="text-white font-mono text-sm">$450.00</p>
                      </div>
                      <p className="text-[#888] text-xs mt-1">Matte Black / Large</p>
                      <p className="text-[#888] text-xs mt-0.5">Qty: 1</p>
                    </div>
                  </div>
                  {/* Totals */}
                  <div className="space-y-3 border-t border-[#333] pt-6">
                    <div className="flex items-center justify-between text-sm text-[#888]">
                      <p>Subtotal</p>
                      <p className="font-mono">$535.00</p>
                    </div>
                    <div className="flex items-center justify-between text-sm text-[#888]">
                      <p>Shipping <span className="text-primary text-xs ml-1">(Express)</span></p>
                      <p class="font-mono text-white">$15.00</p>
                    </div>
                    <div className="flex items-center justify-between border-t border-[#333] pt-4 mt-2">
                      <p className="text-base font-bold text-white uppercase">Total Due</p>
                      <p className="text-3xl font-black text-primary tracking-tight font-display">$592.80</p>
                    </div>
                  </div>
                  <button className="w-full group relative overflow-hidden rounded-lg bg-primary px-4 py-4 text-white shadow-[0_0_20px_rgba(230,0,0,0.3)] transition-all hover:bg-[#cc0000] hover:shadow-[0_0_30px_rgba(230,0,0,0.5)] active:scale-[0.98]">
                    <span className="relative z-10 flex items-center justify-center gap-2 text-lg font-black uppercase tracking-widest">
                      Pay Now <span className="material-symbols-outlined font-black">arrow_forward</span>
                    </span>
                  </button>
                  <div className="flex items-center justify-center gap-2 text-[#666]">
                    <span className="material-symbols-outlined text-sm">lock</span>
                    <p className="text-xs font-medium">Payments are SSL encrypted & secured</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;