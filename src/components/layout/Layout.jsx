import { Suspense, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { LoadingState } from '../ui/LoadingState.jsx';
import { Footer } from './Footer.jsx';
import { Navbar } from './Navbar.jsx';

export function Layout() {
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
      <Navbar />
      <main id="main-content" ref={mainRef} tabIndex={-1} className="main">
        <div className="container">
          <Suspense fallback={<LoadingState label="Memuat halaman…" />}>
            <Outlet />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
