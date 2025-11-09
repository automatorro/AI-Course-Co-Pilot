import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
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

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <I18nProvider>
      <ThemeProvider>
        <AuthProvider>
          <HashRouter>
            <div className="min-h-screen flex flex-col premium-texture bg-ink-50 dark:bg-ink-900 text-ink-900 dark:text-ink-100 transition-colors duration-300">
              <Header />
              <main className="pt-20 flex-grow">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<AuthPage />} />
                  <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
                  <Route path="/course/:id" element={<PrivateRoute><CourseWorkspacePage /></PrivateRoute>} />
                  <Route path="/billing" element={<PrivateRoute><BillingPage /></PrivateRoute>} />
                  <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </HashRouter>
        </AuthProvider>
      </ThemeProvider>
    </I18nProvider>
  );
}

export default App;