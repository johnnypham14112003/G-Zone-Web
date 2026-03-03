import React from "react";
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import Home from "@/features/home/routes/Home";
import MissionLog from "@/features/missions/routes/MissionLog";
import Support from "@/features/support/routes/Support";
import Checkout from "@/features/checkout/routes/Checkout";
import Garage from "@/features/workshop/routes/Garage";
import Dashboard from "@/features/dashboard/routes/Dashboard";
import Login from "@/features/auth/routes/Login";
import ProductDetail from "@/features/products/routes/ProductDetail";
import Cart from "@/features/cart/routes/Cart";
import Accessories from "@/features/products/routes/Accessories";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const hideHeaderRoutes = ["/login"];
  const isHeaderHidden = hideHeaderRoutes.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen font-display text-white bg-background-dark selection:bg-primary selection:text-white">
      {!isHeaderHidden && <Header />}
      <main className="flex-grow flex flex-col">{children}</main>
      {!isHeaderHidden && <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/missions" element={<MissionLog />} />
          <Route path="/support" element={<Support />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/garage" element={<Garage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/product" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/shop" element={<Accessories />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
