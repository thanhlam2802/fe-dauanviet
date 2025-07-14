import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TransitionProvider } from "./context/TransitionContext";

import Dashboard from "./components/Dashboard";
import HomePage from "./views/HomePage";
import LoginPage from "./views/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFoundPage from "./views/NotFoundPage";
import MainLayout from "./views/MainLayout";
import CongTrinhDetail from "./components/CongTrinhDetail";

// 1. Import các component mới
import Phivatthe from "./components/Phivatthe";
import PhivattheDetail from "./components/PhivattheDetail";

function App() {
  return (
    <TransitionProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/heritage/:id" element={<CongTrinhDetail />} />

            {/* 2. Thêm các route mới vào trong MainLayout */}
            <Route path="/phivatthe" element={<Phivatthe />} />
            <Route path="/detail/:id" element={<PhivattheDetail />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </TransitionProvider>
  );
}

export default App;
