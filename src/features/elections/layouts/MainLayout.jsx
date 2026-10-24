import { Suspense, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { LoadingState } from '../../../components/ui/LoadingState.jsx';
import { FooterComponent } from '../components/FooterComponent.jsx';
import { NavbarComponent } from '../components/NavbarComponent.jsx';

/** Shell layout utama: navigasi, area konten dinamis, dan footer. */
export function MainLayout() {
  const { pathname } = useLocation();
  const mainRef = useRef(null);
  const previousPath = useRef(pathname);

  // Pindah halaman pada SPA: fokus dikembalikan ke konten utama agar pembaca layar
  // dan pengguna keyboard mengetahui halaman telah berganti.
  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    mainRef.current?.focus();
    globalThis.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <a className="skip-link" href="#main-content">
        Lewati ke konten utama
      </a>
      <NavbarComponent />
      <main id="main-content" ref={mainRef} tabIndex={-1} className="main">
        <div className="container">
          <Suspense fallback={<LoadingState label="Memuat halaman…" />}>
            <Outlet />
          </Suspense>
        </div>
      </main>
      <FooterComponent />
    </>
  );
}

export default MainLayout;
