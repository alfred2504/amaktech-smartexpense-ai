import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import DashboardPage from "./pages/DashboardPage";
import TransactionsPage from "./pages/TransactionsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import BudgetsPage from "./pages/BudgetsPage";
import AIPage from "./pages/AIPage";
import ProfilePage from "./pages/ProfilePage";

import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Routes>

      {/* 🔥 PUBLIC ROUTES */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* 🔐 PROTECTED ROUTES */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <div className="flex flex-col h-screen">
              
              {/* 🔥 NAVBAR */}
              <Navbar />

              <div className="flex flex-1">
                <Sidebar />

                <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
                  <DashboardPage />
                </div>
              </div>

            </div>
          </ProtectedRoute>
        }
      />

      <Route
        path="/transactions"
        element={
          <ProtectedRoute>
            <div className="flex flex-col h-screen">
              <Navbar />

              <div className="flex flex-1">
                <Sidebar />
                <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
                  <TransactionsPage />
                </div>
              </div>
            </div>
          </ProtectedRoute>
        }
      />

      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <div className="flex flex-col h-screen">
              <Navbar />

              <div className="flex flex-1">
                <Sidebar />
                <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
                  <AnalyticsPage />
                </div>
              </div>
            </div>
          </ProtectedRoute>
        }
      />

      <Route
        path="/budgets"
        element={
          <ProtectedRoute>
            <div className="flex flex-col h-screen">
              <Navbar />

              <div className="flex flex-1">
                <Sidebar />
                <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
                  <BudgetsPage />
                </div>
              </div>
            </div>
          </ProtectedRoute>
        }
      />

      <Route
        path="/ai"
        element={
          <ProtectedRoute>
            <div className="flex flex-col h-screen">
              <Navbar />

              <div className="flex flex-1">
                <Sidebar />
                <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
                  <AIPage />
                </div>
              </div>
            </div>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <div className="flex flex-col h-screen">
              <Navbar />

              <div className="flex flex-1">
                <Sidebar />
                <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
                  <ProfilePage />
                </div>
              </div>
            </div>
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;