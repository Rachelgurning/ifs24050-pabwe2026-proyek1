import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute.jsx';
import { Layout } from '../components/layout/Layout.jsx';
import { ROUTES } from '../utils/constants.js';

const HomePage = lazy(() => import('../pages/HomePage.jsx'));
const LoginPage = lazy(() => import('../pages/LoginPage.jsx'));
const RegisterPage = lazy(() => import('../pages/RegisterPage.jsx'));
const ElectionsPage = lazy(() => import('../pages/ElectionsPage.jsx'));
const ElectionDetailPage = lazy(() => import('../pages/ElectionDetailPage.jsx'));
const ResultsPage = lazy(() => import('../pages/ResultsPage.jsx'));
const HistoryPage = lazy(() => import('../pages/HistoryPage.jsx'));
const AdminDashboardPage = lazy(() => import('../pages/admin/AdminDashboardPage.jsx'));
const ElectionFormPage = lazy(() => import('../pages/admin/ElectionFormPage.jsx'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage.jsx'));

const adminOnly = (page) => <ProtectedRoute requireAdmin>{page}</ProtectedRoute>;

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path={ROUTES.home} element={<HomePage />} />
        <Route path={ROUTES.login} element={<LoginPage />} />
        {/* Alias required by the Delcom grading login automation. */}
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path={ROUTES.register} element={<RegisterPage />} />
        <Route path={ROUTES.elections} element={<ElectionsPage />} />
        <Route path={ROUTES.electionDetail} element={<ElectionDetailPage />} />
        <Route path={ROUTES.electionResults} element={<ResultsPage />} />
        <Route
          path={ROUTES.history}
          element={
            <ProtectedRoute>
              <HistoryPage />
            </ProtectedRoute>
          }
        />
        <Route path={ROUTES.admin} element={adminOnly(<AdminDashboardPage />)} />
        <Route path={ROUTES.adminNewElection} element={adminOnly(<ElectionFormPage />)} />
        <Route path={ROUTES.adminEditElection} element={adminOnly(<ElectionFormPage />)} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
