import React, { useState } from "react";
import { Link } from "react-router-dom";
import ModernForm from "../components/ModernForm";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/providers/ToastProvider";
import { registerApi } from "../api/auth-api";
import logo from "@/assets/logo/logo-gzone.png";

const AuthPage: React.FC = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleLogin = async (email, password) => {
    try {
      await login(email, password);
      showToast("Login successful", "success");
    } catch (err) {
      setSuccessMessage(null);
      showToast("Login failed. Invalid email or password.", "error");
      console.error("Login failed:", err);
    }
  };

  const handleRegister = async (name, email, password) => {
    try {
      await registerApi(name, email, password);
      setSuccessMessage("Registration successful! Please sign in to continue.");
      showToast("Registration successful! Please sign in.", "success");
    } catch (err) {
      setSuccessMessage(null);
      showToast("Registration failed. Please try again.", "error");
      console.error("Registration failed:", err);
    }
  };

  return (
    <div className="bg-background-dark min-h-screen flex flex-col relative overflow-hidden text-white">
      {/* Navbar Minimal */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-surface-border bg-[#240f0f]/90 backdrop-blur-md px-6 lg:px-10 py-3">
        <Link
          to="/"
          className="flex items-center gap-2 text-white group hover:text-primary transition-colors"
        >
          <img src={logo} alt="GZone" className="h-8" />
          <span className="text-lg font-bold tracking-tighter uppercase">
            GZone
          </span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="grow relative flex items-center justify-center min-h-screen pt-16 pb-12 px-4 sm:px-6">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-fixed"
          style={{
            backgroundImage:
              "linear-gradient(rgba(13, 13, 13, 0.85), rgba(35, 15, 15, 0.9)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuDvBe7ZQ9ncA54xZEhxV0eid4T5sekeirUQLrC29t6jpxGzzULIsK3NuZW2NWvNe92a-IwCDCblHxsPlTQmx-ikai-n-PVWAHj6TPOx7Yel046tZePyvvLMx1SsL-rYXmkKf_KlRpvPSR2VZPxh8w92tmClnKKVex39ta_Pw1qNCFfjpDLuogfarqpGXjdPsCB29skihV5J7oDQ8_vTIcc0iJF5gilt4uZ-tHeveJRfBB804CfToFsOGsXZLovX_V7QTy4GTK-ybz0a')",
          }}
        ></div>

        <div className="relative z-10">
          <ModernForm onLogin={handleLogin} onRegister={handleRegister} />
          {successMessage && (
            <p className="text-green-500 text-center mt-4">{successMessage}</p>
          )}
        </div>
      </main>

      <footer className="border-t border-surface-border bg-[#240f0f] py-6 text-center text-sm text-gray-500">
        <p>© 2026 GZone. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AuthPage;
