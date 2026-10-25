import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { APP_NAME, ROUTES } from '../../utils/constants.js';
import { Button } from '../ui/Button.jsx';

const navLinkClass = ({ isActive }) => `nav__link${isActive ? ' nav__link--active' : ''}`;

export function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link to={ROUTES.home} className="brand">
          {APP_NAME}
        </Link>

        <nav aria-label="Navigasi utama" className="nav">
          <NavLink to={ROUTES.home} end className={navLinkClass}>
            Beranda
          </NavLink>
          <NavLink to={ROUTES.elections} className={navLinkClass}>
            Pemilihan
          </NavLink>
          {isAuthenticated && !isAdmin && (
            <NavLink to={ROUTES.history} className={navLinkClass}>
              Riwayat
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to={ROUTES.admin} className={navLinkClass}>
              Kelola
            </NavLink>
          )}
        </nav>

        <div className="site-header__account">
          {isAuthenticated ? (
            <>
              <span className="site-header__user">{user.name}</span>
              <Button variant="light" onClick={logout}>
                Keluar
              </Button>
            </>
          ) : (
            <>
              <Link to={ROUTES.login} className="nav__link">
                Masuk
              </Link>
              <Link to={ROUTES.register} className="btn btn--light">
                Daftar
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
