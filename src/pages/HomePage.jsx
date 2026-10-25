import { ButtonLink } from '../components/ui/ButtonLink.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { useDocumentMeta } from '../hooks/useDocumentMeta.js';
import { APP_NAME, ROUTES } from '../utils/constants.js';

const FEATURES = [
  {
    title: 'Satu mahasiswa, satu suara',
    text: 'Sistem menjamin setiap akun hanya dapat memberikan satu suara pada setiap pemilihan.',
  },
  {
    title: 'Kerahasiaan terjaga',
    text: 'Pilihan Anda tidak ditampilkan di riwayat dan hasil hanya dibuka setelah pemilihan ditutup.',
  },
  {
    title: 'Transparan dan mudah',
    text: 'Pelajari visi dan misi kandidat, lalu pantau hasil akhir dalam bentuk persentase yang jelas.',
  },
];

const STEPS = [
  'Daftar atau masuk menggunakan NIM Anda.',
  'Pilih pemilihan yang sedang berlangsung dan pelajari profil kandidat.',
  'Pilih satu kandidat, konfirmasi, lalu kirim suara Anda.',
];

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  useDocumentMeta(
    APP_NAME,
    'VoteDel adalah platform e-voting mahasiswa Institut Teknologi Del: lihat profil kandidat, berikan suara sekali, dan pantau hasil pemilihan secara transparan.',
  );

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <h1 id="hero-title" className="hero__title">
          Suaramu menentukan arah kampus
        </h1>
        <p className="hero__text">
          {APP_NAME} adalah platform pemilihan suara online untuk mahasiswa Institut Teknologi Del.
          Aman, transparan, dan dapat diakses dari mana saja.
        </p>
        <div className="button-row">
          <ButtonLink to={ROUTES.elections} variant="light">
            Lihat pemilihan
          </ButtonLink>
          {!isAuthenticated && (
            <ButtonLink to={ROUTES.register} variant="outline-light">
              Buat akun
            </ButtonLink>
          )}
        </div>
      </section>

      <section className="section" aria-labelledby="features-title">
        <h2 id="features-title" className="section__title">
          Mengapa memilih {APP_NAME}?
        </h2>
        <div className="grid grid--3">
          {FEATURES.map(({ title, text }) => (
            <article key={title} className="card">
              <h3 className="card__title">{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section" aria-labelledby="steps-title">
        <h2 id="steps-title" className="section__title">
          Cara memberikan suara
        </h2>
        <ol className="steps">
          {STEPS.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>
    </>
  );
}
