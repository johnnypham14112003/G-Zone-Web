import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="relative w-full bg-background-dark">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl bg-black h-[500px] md:h-[600px]">
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent z-10"></div>
              <img 
                alt="High performance red sport motorcycle" 
                className="h-full w-full object-cover object-center opacity-80" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBXM8FgHeDxC2B4EbKwuouG-h4ID74jPnLsP7Uz66vSRnFgviTeqVPlOx8GLd45XGudGuUAzmrTlp2MEjLz8tbTV2V3-Hjx39da42KaPdq67G83Zv-4KTQFO50kuz_azQWLQI8e8zzo0fb3wRVslnSEM4CyRpqQPbGh0MSGMILSRJaYABqu03_6LV8Z9xZOcVIEoQfRDqOqDTkn3_qUNdigjFlag_xQlMpbq3M17c1uBYnq8DJKQJnC_JLoXmQRA5jsbjnWHFeV4i7" 
              />
            </div>
            <div className="relative z-20 flex h-full flex-col justify-end px-6 py-12 md:w-2/3 lg:w-1/2 lg:px-12">
              <div className="mb-6 flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-primary"></span>
                <span className="text-xs font-bold uppercase tracking-widest text-primary">New Arrival</span>
              </div>
              <h1 className="mb-4 text-5xl font-black uppercase leading-none tracking-tighter text-white sm:text-6xl lg:text-7xl">
                Dominate<br/>The Tarmac
              </h1>
              <p className="mb-8 max-w-md text-lg text-gray-300">
                Precision-engineered protective gear designed for the modern rider. Experience speed without compromise.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/shop" className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-base font-bold tracking-wide text-white transition-all hover:bg-primary-hover hover:shadow-[0_0_20px_rgba(230,0,0,0.4)]">
                  SHOP COLLECTION
                </Link>
                <button className="inline-flex h-12 items-center justify-center rounded-lg border border-white/20 bg-white/5 px-8 text-base font-bold tracking-wide text-white backdrop-blur-sm transition-all hover:bg-white/10">
                  VIEW LOOKBOOK
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <h2 class="text-3xl font-bold uppercase tracking-tight text-white">Featured Categories</h2>
          <Link to="/shop" className="hidden text-sm font-bold text-primary hover:text-white sm:block">VIEW ALL CATEGORIES -&gt;</Link>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-2 h-auto md:h-[600px]">
          {/* Primary Feature: Helmets */}
          <Link to="/shop" className="group relative col-span-1 md:col-span-2 md:row-span-2 overflow-hidden rounded-xl bg-surface-dark border border-surface-border">
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent z-10"></div>
            <img alt="Helmet" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBG0IulpjlZsveY4OYhpoEel3_AbCtANwD9DWL2sN0CR9DLDc7eEgKfEzLictrUC2zc6HdghF1EDDH46PrjQoqvzi1A9Au5fAkrsIw0ve3DF8Ak1Cc6nb5MEfuvWUE3321rb2IAAjZ4CgicRCT5OJT4UeqzB6O2lk_SfFSTXYwVE2BpljvyB5I6WCIQ-9h4pby1UcPKwAoSTvD2dpelxQleYvG3PLPnWJgfZptmzHNkBseQVXunO0zjQ6kYGDbDfn637X0UBj1nJ8ML" />
            <div className="absolute bottom-0 left-0 z-20 p-8">
              <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-primary">Protection</span>
              <h3 className="text-4xl font-black uppercase text-white group-hover:text-primary transition-colors">Helmets</h3>
              <p className="mt-2 text-gray-400">DOT & SNELL certified for maximum safety.</p>
            </div>
          </Link>
          {/* Secondary Feature: Jackets */}
          <Link to="/shop" className="group relative col-span-1 overflow-hidden rounded-xl bg-surface-dark border border-surface-border">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
            <img alt="Jacket" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAggzzY96P4wMJuMDJBfC8SZw-v6JlaRLWYVsWjuOZUqQwsZbpzuyyjr-GPoocBjwAJ1LhN5sov47loNAr-_rMkgIjbJBzYoBZm6BMQtsor6Ez8fuM664ySG5RJEW0ZEdCPXex4w0Bh30hONycfNGuRHXh0PIRvI4Pamq3m4vEMtjRHqjKA5iUJkV8-cATCcibR_7-Ty3WfUhMGmz1RwFNyxpUEWx_6AITYUbwHPhAD7xC55yoISqhAkRkk60ogt7-AJP-DPyYOYP6R" />
            <div className="absolute bottom-0 left-0 z-20 p-6">
              <h3 className="text-2xl font-black uppercase text-white group-hover:text-primary transition-colors">Jackets</h3>
            </div>
          </Link>
          {/* Tertiary Feature: Gloves */}
          <Link to="/shop" className="group relative col-span-1 overflow-hidden rounded-xl bg-surface-dark border border-surface-border">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
            <img alt="Gloves" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3TMsYac3ypiL-N00BaogEoyeRoJWERtBe-FOUKwU5IcKxKd2o9uPhoKNsYEOpHImlZsTt2F-qIj8wIxsb_k9XA9F1mKih-9behOnlcPoiXlldFtW1sgwi03IcbDHQ3r6nC8pv_MvzJnz2iyw7VO0vd3a0oQeWhH5nvr2f_SSAwTDqfWCxt0TMtymU_sBsvOn51VzLsy0CCpi63uHrMO7D8A-C6F4bnE9UztnZQLOOxte6Lw3izrk_ruyNEiKjeEbkm0ehuJFKQhn2" />
            <div className="absolute bottom-0 left-0 z-20 p-6">
              <h3 className="text-2xl font-black uppercase text-white group-hover:text-primary transition-colors">Gloves</h3>
            </div>
          </Link>
        </div>
      </div>

      {/* Promo Banner */}
      <div className="w-full border-y border-surface-border bg-[#1a0a0a] bg-[radial-gradient(#2e1a1a_15%,transparent_16%),radial-gradient(#2e1a1a_15%,transparent_16%)] bg-[length:10px_10px] py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-4 text-center sm:px-6 md:flex-row md:text-left lg:px-8">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tight text-white md:text-4xl">
              Ready for the <span className="text-primary">Track?</span>
            </h2>
            <p className="mt-2 max-w-xl text-gray-400">Join the Redline Club and get exclusive access to limited edition drops and track day discounts.</p>
          </div>
          <div className="flex w-full max-w-sm flex-col gap-3 sm:flex-row">
            <input className="flex-1 rounded-lg border-none bg-black/50 px-4 py-3 text-white ring-1 ring-white/10 focus:ring-primary" placeholder="Enter your email" type="email" />
            <button className="rounded-lg bg-white px-6 py-3 font-bold text-black hover:bg-gray-200">JOIN</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;