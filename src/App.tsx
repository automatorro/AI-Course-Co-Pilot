import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { I18nProvider } from './contexts/I18nContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import CourseWorkspacePage from './pages/CourseWorkspacePage';
import BillingPage from './pages/BillingPage';
import ProfilePage from './pages/ProfilePage';
import RlsTestPage from './pages/RlsTestPage';
import DemoPage from './pages/DemoPage';
import AutoExportPage from './pages/AutoExportPage';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const HomeRoute: React.FC = () => {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" /> : <HomePage />;
};

export const AppContent: React.FC = () => {
  const location = useLocation();
  const isWorkspaceRoute = location.pathname.startsWith('/course/');
  const isLandingRoute   = location.pathname === '/';
  const isDemoRoute      = location.pathname.startsWith('/demo');
  // Landing + demo carry their own nav/footer, so hide the shared shell.
  const hideShell = isWorkspaceRoute || isLandingRoute || isDemoRoute;
  return (
    <div className="min-h-screen flex flex-col bg-paper text-graphite transition-colors duration-200">
      {!hideShell && <Header />}
      <main className={hideShell ? 'flex-grow' : 'pt-16 flex-grow'}>
        <Routes>
          <Route path="/" element={<HomeRoute />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/demo/:sessionId" element={<DemoPage />} />
          <Route path="/auto-export" element={<AutoExportPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/course/:id" element={<PrivateRoute><CourseWorkspacePage /></PrivateRoute>} />
          <Route path="/billing" element={<PrivateRoute><BillingPage /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="/tests" element={<PrivateRoute><RlsTestPage /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      {!hideShell && <Footer />}
    </div>
  );
};

function App() {
  return (
    <I18nProvider>
      <ThemeProvider>
        <AuthProvider>
          <HelmetProvider>
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <AppContent />
            </BrowserRouter>
          </HelmetProvider>
        </AuthProvider>
      </ThemeProvider>
    </I18nProvider>
  );
}

export default App;
