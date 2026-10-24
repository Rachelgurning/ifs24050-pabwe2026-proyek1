import { lazy, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { LoadingState } from './components/ui/LoadingState.jsx';
import { getAccessToken, setUnauthorizedHandler } from './helpers/apiHelper.js';
import { ROUTES } from './utils/constants.js';
import { AuthLayout } from './features/auth/layouts/AuthLayout.jsx';
import { MainLayout } from './features/elections/layouts/MainLayout.jsx';
import { asyncAuthProfile, authLogout, selectIsPreload } from './features/auth/states/authSlice.js';

const LoginPage = lazy(() => import('./features/auth/pages/LoginPage.jsx'));
const RegisterPage = lazy(() => import('./features/auth/pages/RegisterPage.jsx'));
const HomePage = lazy(() => import('./features/elections/pages/HomePage.jsx'));
const ElectionsPage = lazy(() => import('./features/elections/pages/ElectionsPage.jsx'));
const DetailPage = lazy(() => import('./features/elections/pages/DetailPage.jsx'));
const ResultsPage = lazy(() => import('./features/elections/pages/ResultsPage.jsx'));
const HistoryPage = lazy(() => import('./features/votes/pages/HistoryPage.jsx'));
const AdminDashboardPage = lazy(() => import('./features/admin/pages/AdminDashboardPage.jsx'));
const ElectionFormPage = lazy(() => import('./features/admin/pages/ElectionFormPage.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));

const adminOnly = (page) => <ProtectedRoute requireAdmin>{page}</ProtectedRoute>;

/** Deklarasi rute aplikasi beserta route guarding dan pemulihan sesi pengguna. */
export default function App() {
  const dispatch = useDispatch();
  const isPreload = useSelector(selectIsPreload);

  // Token yang tersimpan diverifikasi ke server sebelum halaman dirender.
  useEffect(() => {
    if (getAccessToken()) dispatch(asyncAuthProfile());
  }, [dispatch]);

  // Token yang ditolak server (401) langsung mengakhiri sesi di sisi klien.
  useEffect(() => {
    setUnauthorizedHandler(() => dispatch(authLogout()));
    return () => setUnauthorizedHandler(null);
  }, [dispatch]);

  if (isPreload) return <LoadingState label="Memuat sesi…" />;

  return (
    <Routes>
      <Route path="/auth" element={<AuthLayout />}>
        <Route index element={<Navigate to={ROUTES.login} replace />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      {/* Alias rute lama berbahasa Indonesia. */}
      <Route path="/masuk" element={<Navigate to={ROUTES.login} replace />} />
      <Route path="/daftar" element={<Navigate to={ROUTES.register} replace />} />

      <Route element={<MainLayout />}>
        <Route path={ROUTES.home} element={<HomePage />} />
        <Route path={ROUTES.elections} element={<ElectionsPage />} />
        <Route path={ROUTES.electionDetail} element={<DetailPage />} />
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
