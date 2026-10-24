import { APP_NAME } from '../../../utils/constants.js';

export function FooterComponent() {
  return (
    <footer className="site-footer">
      <div className="container">
        <p>
          © {new Date().getFullYear()} {APP_NAME} · Proyek 1 Pengembangan Aplikasi Berbasis Web ·
          Institut Teknologi Del
        </p>
      </div>
    </footer>
  );
}
