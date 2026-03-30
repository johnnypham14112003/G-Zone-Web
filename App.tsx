import React from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import Home from "@/features/home/routes/Home";
import MissionLog from "@/features/missions/routes/MissionLog";
import Support from "@/features/support/routes/Support";
import Checkout from "./src/features/checkout/routes/Checkout";
import Garage from "@/features/workshop/routes/Garage";
import Login from "@/features/auth/routes/AuthPage";
import ProductDetail from "./src/features/products/routes/ProductDetail";
import Cart from "./src/features/cart/routes/Cart";
import Accessories from "@/features/products/routes/Accessories";
import { AuthProvider } from "@/providers/AuthProvider";
import BadRequest from "@/components/pages/BadRequest";

const MainLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen font-display text-white bg-background-dark selection:bg-primary selection:text-white">
      <Header />
      <main className="grow flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

import ProfilePage from "@/features/accounts/routes/ProfilePage";
import AddressPage from "@/features/accounts/routes/AddressPage";
import MyVouchers from "@/features/accounts/routes/MyVouchers";
import MyOrders from "./src/features/orders/routes/MyOrders";

import AdminLayout from "@/components/Layout/Admin/AdminLayout";
import AdminDashboard from "@/features/admin/routes/AdminDashboard";
import AdminCategories from "@/features/admin/routes/AdminCategories";
import AdminProducts from "@/features/admin/routes/AdminProducts";
import AdminAccounts from "@/features/admin/routes/AdminAccounts";
import AdminOrders from "./src/features/admin/routes/AdminOrders";
import AdminVouchers from "@/features/admin/routes/AdminVouchers";
import AdminUserVouchers from "@/features/admin/routes/AdminUserVouchers";
import AdminOrderVouchers from "@/features/admin/routes/AdminOrderVouchers";
import { ToastProvider } from "@/providers/ToastProvider";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Client Routes */}
            <Route element={<MainLayout />}>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Accessories />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/profile/addresses" element={<AddressPage />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/support" element={<Support />} />

              {/* Protected Routes (Logged in users only) */}
              <Route path="/missions" element={<MissionLog />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/garage" element={<Garage />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/profile/orders" element={<MyOrders />} />
              <Route path="/profile/vouchers" element={<MyVouchers />} />
            </Route>

            {/* Management Routes */}
            <Route path="/management" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="accounts" element={<AdminAccounts />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="vouchers" element={<AdminVouchers />} />
              <Route path="user-vouchers" element={<AdminUserVouchers />} />
              <Route path="order-vouchers" element={<AdminOrderVouchers />} />
            </Route>

            {/* Auth Route */}
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={<BadRequest />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
