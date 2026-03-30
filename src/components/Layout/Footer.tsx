import React from "react";
import logo from "@/assets/logo/logo-gzone.png";

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-surface-border bg-[#0a0a0a] pt-12 pb-8 mt-auto">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src={logo} alt="GZone" className="h-10" />
              <span className="text-lg font-bold tracking-tighter uppercase">
                GZone
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Engineered for speed, built for the road. The ultimate destination
              for premium motorcycle accessories and gear.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-4 text-sm">
              Shop
            </h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  New Arrivals
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Best Sellers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Performance Parts
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Riding Gear
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-4 text-sm">
              Support
            </h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Returns Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Track Order
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-4 text-sm">
              Stay Connected
            </h4>
            <div className="flex gap-4 mb-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined">thumb_up</span>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined">photo_camera</span>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined">smart_display</span>
              </a>
            </div>
            <div className="text-xs text-gray-500">
              <p>Service Hours:</p>
              <p className="text-white font-bold">Mon-Fri: 09:00 - 18:00 EST</p>
            </div>
          </div>
        </div>
        <div className="border-t border-[#222] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            © 2024 GZone Inc. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-gray-500">
            <a href="#" className="hover:text-white">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
