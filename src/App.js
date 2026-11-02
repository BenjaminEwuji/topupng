import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./frontend/src/context/AuthContext";

// Auth pages
import LoginPage from "./frontend/src/pages/auth/LoginPage";
import SignUpPage from "./frontend/src/pages/auth/SignUpPage";
import ResetPasswordPage from "./frontend/src/pages/auth/ResetPasswordPage";

// App pages
import DashboardPage from "./frontend/src/pages/app/DashboardPage";
import BuyAirtimePage from "./frontend/src/pages/app/BuyAirtimePage";
import BuyDataPage from "./frontend/src/pages/app/BuyDataPage";
import HistoryPage from "./frontend/src/pages/app/HistoryPage";
import AccountPage from "./frontend/src/pages/app/AccountPage";
import NotFoundPage from "./frontend/src/pages/app/NotFoundPage";

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Default: redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* ── Auth routes ── */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* ── App routes ── */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/airtime"
            element={
              <ProtectedRoute>
                <BuyAirtimePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/data"
            element={
              <ProtectedRoute>
                <BuyDataPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <HistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <AccountPage />
              </ProtectedRoute>
            }
          />

          {/* ── 404 catch-all ── */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
