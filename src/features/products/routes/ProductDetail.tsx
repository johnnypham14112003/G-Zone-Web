import React from 'react';
import { Link } from 'react-router-dom';

const ProductDetail: React.FC = () => {
  return (
    <div className="layout-container flex h-full grow flex-col max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 py-6 w-full">
      <nav className="flex flex-wrap gap-2 py-4 mb-4 text-sm font-medium">
        <Link to="/" className="text-text-muted hover:text-white transition-colors">Home</Link>
        <span className="text-text-muted">/</span>
        <Link to="/shop" className="text-text-muted hover:text-white transition-colors">Helmets</Link>
        <span className="text-text-muted">/</span>
        <span className="text-white">Racing</span>
        <span className="text-text-muted">/</span>
        <span className="text-primary">Apex Predator R1</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-surface-dark border border-[#3a1a1a] group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#2e1414] to-background-dark opacity-50 pointer-events-none"></div>
            <div className="w-full h-full bg-center bg-contain bg-no-repeat relative z-10 transition-transform duration-500 ease-out group-hover:scale-105" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuATuC_dLKQk8cojVKEm3Xf6e84MHK_AKB0T-avIAFJCANAhorSAzimYlAYX0XAXPdexk46VCxvJHYvDj4q6qKnyi7speAKw1z7LiZxAIsQMu0CdJKnLUbZ-fXdKLusfTqlKZfw5qw_Brqu8XnuPFn7Z94qQg2d9WGtGlWTq0fkYCvxgSXHnkbdBlhwHR4qZJNw7rMLSJclkFlWtZPRkwYr9t72iRrOfM2btltD9llj9yYKJJIwXZR2rmIbDA4dfIgiaJV-4wvV2YXAe')" }}></div>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 text-white text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-primary hover:border-primary transition-colors">
              <span className="material-symbols-outlined text-sm">360</span> View 360°
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
             {['https://lh3.googleusercontent.com/aida-public/AB6AXuDo6TDvL7PSP_xoVIgqYy45WwwNl2sc1j8weHOJMoDWw1NrEUkw2r66MTD1ZDDXC6Oh-Lv81pSE19DvjBaF678AiU7X1JBgSbbOuDErqQhvpq1MSp7YQP8Ff5rmM_JwcVI4yXp52Z-ehTgQkkfP83uT6No5H7D5ec3vdrfHkskl_y9MDDdWwXh6i6aexhSx3YDbwc5gAB-zzjc62vQYnTMbuTbA8PnjuQQUlEpAwM2qkS-V8g_OEn24EcexhYBXQCRwsw83s83w6w4k', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPbEvf-F748bvpsMBMmgKvYAtfXxqbMkBwkniTAiS9fvRtzwjcoi3IN8GQVqKV38wtdxLK3iwL1hfcIJEhVKV3-6e-ROkBLiYSAETZXNHXlmUsI0FjCT4pSfTQB-HHJ7d_B5dmvYiRno2BQwiE2O-uETT2E9vnkWD-nGnOFC2NclWlllADUGv9fFn1L4bVdUPmF6gCixiwyzQHGQmJHLcEdPazP2nRjznPVNXEMxhnJDZqoGEZBEtIJRD2wYRHPDb3mUczmCm-_Kl0', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkxpFK2TTTW2f8RmW8DK80iZ7O5Iap5ZsNEKZGh-Xc3-f8OpbyNW7dlE5fOnvWAx6jfg4VzZcP67YB3By4vmOY2m_4hmKRpN7gsmBUU-Z5-OYXGSqUrMaDXpBjSd0pAQSU3gtaGzZYlaEBVERFRG7knRg8vm0RCdJH03vpP18COmi7xOR1pXGtVN5TdBY22V5Wk2areQlInfQJg87CEEXXau9FT7gPUSTN2lY3WLMqBJfufkquBPyuAksh9lhmppvLd2hm4QRaFpwb', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOEMmaNBu7gJT9VBARaBrrzBYJ0q9r47gv2Zf5uPoKOKhlViDt8SYY-SHUoLxFjpObAjJeLAYPDvUFTaHGxotOFoDuq0Bc1wN_MSiXbWBvtl6X7fq71LGZC-XSyj5TropDhWLU7LGSbSbjP3QWqu7uB-caycMdiRou3KQFn7a4HSDCaNTKeDgm4KHtHjIRaFMvmuk0nODT9yyZrwrQnIvqWuf9RxBzhBuYd8AiwGqzLTsaMdR2LrgNQR51J_pAXFp8Wc1aRHXtUvTP'].map((url, i) => (
                <button key={i} className={`aspect-square rounded-lg border-2 ${i === 0 ? 'border-primary' : 'border-[#3a1a1a] hover:border-white/50'} bg-surface-dark overflow-hidden relative transition-colors`}>
                  <div className="w-full h-full bg-center bg-cover" style={{ backgroundImage: `url('${url}')` }}></div>
                </button>
             ))}
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="sticky top-24 flex flex-col gap-6 bg-surface-dark p-6 md:p-8 rounded-xl border border-[#3a1a1a] shadow-2xl shadow-black/50">
            <div className="border-b border-[#3a1a1a] pb-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-text-muted text-sm font-bold uppercase tracking-widest">Apex Moto Racing Series</h3>
                <div className="flex items-center gap-1 bg-[#2e1414] px-2 py-1 rounded">
                    <span className="material-symbols-outlined text-primary text-sm fill-current">star</span>
                    <span className="text-white text-xs font-bold">4.9</span>
                    <span className="text-text-muted text-xs">(128)</span>
                </div>
              </div>
              <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight mb-4">Apex Predator R1 Carbon</h1>
              <p className="text-[#a0a0a0] text-sm leading-relaxed mb-4 font-body">Engineered for the track. The R1 Carbon features active aerodynamics, a 6K carbon fiber shell, and a multi-density EPS liner.</p>
              <div className="flex items-baseline gap-3">
                <span className="text-primary text-3xl font-bold">$699.00</span>
                <span className="text-[#6b6b6b] line-through text-lg font-body">$849.00</span>
                <span className="text-[#4caf50] text-xs font-bold bg-[#1b3320] px-2 py-1 rounded ml-auto">In Stock</span>
              </div>
            </div>

            <div className="flex flex-col gap-6">
                <div>
                    <span className="block text-white text-sm font-bold mb-3 uppercase tracking-wide">Select Colorway</span>
                    <div className="flex gap-4">
                        <button className="size-10 rounded-full bg-[#111] border-2 border-primary ring-2 ring-primary/30"></button>
                        <button className="size-10 rounded-full bg-[#e60000] border-2 border-transparent hover:border-primary transition-all"></button>
                        <button className="size-10 rounded-full bg-[#f0f0f0] border-2 border-transparent hover:border-primary transition-all"></button>
                    </div>
                </div>
                <div>
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-white text-sm font-bold uppercase tracking-wide">Select Size</span>
                        <button className="text-text-muted text-xs underline hover:text-white transition-colors">Size Guide</button>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                        {['S', 'M', 'L', 'XL'].map((size, i) => (
                             <button key={i} className={`h-10 rounded-md border text-sm font-bold transition-all ${size === 'M' ? 'border-primary bg-primary/10 text-primary' : 'border-[#3a1a1a] bg-[#240f0f] text-white hover:border-primary'}`}>{size}</button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex gap-3 pt-2">
                <button className="flex-1 h-14 bg-primary hover:bg-[#c20000] active:scale-[0.98] text-white rounded-md font-bold text-lg uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                    <span>Add to Cart</span>
                    <span className="material-symbols-outlined">shopping_bag</span>
                </button>
            </div>
            
             <div className="border-t border-[#3a1a1a] mt-2">
                <details className="group py-4 border-b border-[#3a1a1a] cursor-pointer" open>
                    <summary className="flex justify-between items-center font-bold text-white list-none">
                        <span className="uppercase text-sm tracking-wide">Technical Specs</span>
                        <span className="material-symbols-outlined transition-transform group-open:rotate-180 text-text-muted">expand_more</span>
                    </summary>
                    <div className="text-[#a0a0a0] text-sm mt-3 space-y-2 font-body">
                         <div className="flex justify-between"><span>Shell Material</span><span className="text-white font-medium">6K Carbon Fiber</span></div>
                         <div className="flex justify-between"><span>Weight</span><span className="text-white font-medium">1250g +/- 50g</span></div>
                         <div className="flex justify-between"><span>Certification</span><span className="text-white font-medium">DOT & ECE 22.06</span></div>
                    </div>
                </details>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;