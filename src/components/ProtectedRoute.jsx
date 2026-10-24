import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAdmin, selectIsAuthenticated } from '../features/auth/states/authSlice.js';
import { ROUTES } from '../utils/constants.js';

/** Route guarding: membatasi halaman untuk pengguna yang sudah masuk (opsional khusus admin). */
export function ProtectedRoute({ children, requireAdmin = false }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdmin = useSelector(selectIsAdmin);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} replace state={{ from: location.pathname }} />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to={ROUTES.home} replace />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requireAdmin: PropTypes.bool,
};
