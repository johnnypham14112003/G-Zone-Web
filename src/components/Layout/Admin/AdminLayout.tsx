import React from "react";
import { Outlet, Link, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import logo from "@/assets/logo/logo-gzone.png";

const NAVIGATION_ITEMS = [
  { name: "Dashboard", href: "/management", icon: "dashboard" },
  { name: "Accounts", href: "/management/accounts", icon: "manage_accounts" },
  { name: "Products", href: "/management/products", icon: "two_wheeler" },
  { name: "Categories", href: "/management/categories", icon: "category" },
  { name: "Orders", href: "/management/orders", icon: "local_mall" },
  { name: "Warranties", href: "/management/warranties", icon: "plumbing" },
];

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();

  // ==========================================
  // AUTH LOGIC (Kiểm tra quyền truy cập)
  // ==========================================
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user?.role?.toLowerCase();
  if (userRole !== "admin" && userRole !== "staff") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex h-screen bg-background-dark text-white font-display">
      {/* -------------------------------------
          SIDEBAR SECTION
      --------------------------------------*/}
      <aside className="w-64 bg-surface-dark border-r border-surface-border flex flex-col">
        {/* [A] Sidebar Header - Logo */}
        <div className="p-6 md:px-6 md:py-8 border-b border-surface-border">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="GZone" className="h-10" />
            <span className="text-lg font-bold tracking-tighter uppercase">
              GZone
            </span>
          </Link>
        </div>

        {/* [B] Navigation Menu - Danh sách chức năng */}
        <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
          {NAVIGATION_ITEMS.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${
                  isActive
                    ? "bg-primary/20 border-l-4 border-primary text-white"
                    : "text-text-muted hover:bg-[#2a1212] hover:text-white"
                }`}
              >
                <span
                  className={`material-symbols-outlined ${
                    isActive ? "text-primary" : "group-hover:text-primary"
                  }`}
                >
                  {item.icon}
                </span>
                <p className="text-sm font-bold uppercase tracking-wide">
                  {item.name}
                </p>
              </Link>
            );
          })}
        </nav>

        {/* [C] Sidebar Footer - Hành động phụ (Mode/Logout) */}
        <div className="p-4 border-t border-surface-border flex flex-col gap-2">
          <Link
            to="/"
            className="flex items-center w-full gap-3 px-4 py-3 rounded-lg text-text-muted hover:bg-primary/10 hover:text-white transition-all group"
          >
            <span className="material-symbols-outlined">visibility</span>
            <p className="text-sm font-bold uppercase tracking-wide">
              Client Mode
            </p>
          </Link>
          <button
            onClick={logout}
            className="flex items-center w-full gap-3 px-4 py-3 rounded-lg text-text-muted hover:bg-red-500/10 hover:text-red-500 transition-all group"
          >
            <span className="material-symbols-outlined">logout</span>
            <p className="text-sm font-bold uppercase tracking-wide">Logout</p>
          </button>
        </div>
      </aside>

      {/* -------------------------------------
          MAIN CONTENT SECTION
      --------------------------------------*/}
      <main className="flex-1 flex flex-col max-h-screen overflow-hidden">
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
