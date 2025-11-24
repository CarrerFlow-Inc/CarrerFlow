import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
const Login = lazy(() => import('./pages/login.jsx'));
const Signup = lazy(() => import('./pages/signup.jsx'));
const Dashboard = lazy(() => import('./pages/dashboard.jsx'));
const Candidaturas = lazy(() => import('./pages/candidaturas.jsx'));
const Analytics = lazy(() => import('./pages/analytics.jsx'));
const Profile = lazy(() => import('./pages/profile.jsx'));
const Settings = lazy(() => import('./pages/settings.jsx'));
const CandidaturaDetalhes = lazy(() => import('./pages/candidaturadetalhes.jsx'));
const Layout = lazy(() => import('./components/layout/layout.jsx'));

export default function App() {
  // Prefetch common next routes & heavy components when idle
  useEffect(() => {
    const prefetch = () => {
      import('./pages/candidaturas.jsx');
      import('./pages/analytics.jsx');
      import('./pages/profile.jsx');
      import('./pages/settings.jsx');
      import('./pages/candidaturadetalhes.jsx');
      // Prefetch heavy dashboard charts & auth slider chunks
      import('./components/dashboard/performancechart.jsx');
      import('./components/dashboard/conversionchart.jsx');
      import('./components/auth/authslider.jsx');
      import('./components/candidaturas/candidaturaform.jsx');
    };
    if (typeof window !== 'undefined') {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(prefetch);
      } else {
        setTimeout(prefetch, 2000);
      }
    }
  }, []);
  return (
    <Suspense fallback={<div className="p-6 text-gray-600">Carregando…</div>}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="candidaturas" element={<Candidaturas />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="candidaturas/:id" element={<CandidaturaDetalhes />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Suspense>
  );
}

