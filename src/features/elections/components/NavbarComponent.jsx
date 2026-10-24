import { Link, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../../../components/ui/Button.jsx';
import { APP_NAME, ROUTES } from '../../../utils/constants.js';
import {
  authLogout,
  selectAuthUser,
  selectIsAdmin,
  selectIsAuthenticated,
} from '../../auth/states/authSlice.js';

const navLinkClass = ({ isActive }) => `nav__link${isActive ? ' nav__link--active' : ''}`;

/** Bilah navigasi utama: menu aplikasi, identitas sesi, dan tombol keluar. */
export function NavbarComponent() {
  const dispatch = useDispatch();
  const user = useSelector(selectAuthUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdmin = useSelector(selectIsAdmin);

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
              <Button variant="light" onClick={() => dispatch(authLogout())}>
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
