import { NotificationProvider } from './components/notification-system';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PreferenceProvider } from './context/PreferenceContext';
import App from './App';
import Connexion from './pages/Connexion';
import './index.css';

function RequireAuth({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <NotificationProvider>
    <AuthProvider>
      <PreferenceProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Connexion />} />
            <Route
              path="/*"
              element={
                <RequireAuth>
                  <App />
                </RequireAuth>
              }
            />
          </Routes>
        </BrowserRouter>
      </PreferenceProvider>
    </AuthProvider>
      </NotificationProvider>
  </ThemeProvider>
);
