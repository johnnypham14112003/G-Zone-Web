import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";

const ProfileDropdown: React.FC = () => {
  const { user, logout, avatarUrl } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!user) return null;

  const menuItems = [
    {
      label: "Edit Profile",
      path: "/profile",
      icon: "person",
    },
    {
      label: "Shipping Addresses",
      path: "/profile/addresses",
      icon: "home_pin",
    },
    {
      label: "Order History",
      path: "/profile/orders",
      icon: "receipt_long",
    },
    {
      label: "Warranty Claims",
      path: "/profile/warranties",
      icon: "verified",
    },
    {
      label: "Vouchers",
      path: "/profile/vouchers",
      icon: "local_activity",
    },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="size-9 rounded-full bg-surface-dark border border-surface-border flex items-center justify-center text-white hover:border-primary transition-colors"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="User Avatar"
            className="size-full rounded-full object-cover"
          />
        ) : (
          <span className="material-symbols-outlined text-[20px]">person</span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-[#1A1A1A] border border-[#333] rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-[#333]">
            <p className="text-sm font-semibold text-white truncate">
              {user["user-name"]}
            </p>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
          </div>
          <div className="py-2">
            {(user.role?.toLowerCase() === "admin" ||
              user.role?.toLowerCase() === "staff") && (
              <Link
                to="/management"
                className="flex items-center gap-3 px-4 py-2 text-sm text-primary hover:bg-[#333] transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <span className="material-symbols-outlined text-base text-primary">
                  safety_divider
                </span>
                <span>Admin Panel</span>
              </Link>
            )}
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-[#333] transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <span className="material-symbols-outlined text-base text-gray-400">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
          <div className="border-t border-[#333] p-2">
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 text-left px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
            >
              <span className="material-symbols-outlined text-base">
                logout
              </span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;

