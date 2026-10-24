import { Suspense } from 'react';
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { LoadingState } from '../../../components/ui/LoadingState.jsx';
import { APP_NAME, ROUTES } from '../../../utils/constants.js';
import { selectIsAuthenticated } from '../states/authSlice.js';

/**
 * Shell layout halaman autentikasi: kontainer formulir terpusat dan
 * pengalihan otomatis bila pengguna sudah terautentikasi.
 */
export function AuthLayout() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();

  if (isAuthenticated) {
    return <Navigate to={location.state?.from ?? ROUTES.elections} replace />;
  }

  return (
    <main className="main" id="main-content">
      <div className="container narrow">
        <p>
          <Link to={ROUTES.home} className="brand">
            {APP_NAME}
          </Link>
        </p>
        <Suspense fallback={<LoadingState label="Memuat halaman…" />}>
          <Outlet />
        </Suspense>
      </div>
    </main>
  );
}

export default AuthLayout;
