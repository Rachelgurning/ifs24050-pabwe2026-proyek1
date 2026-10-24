import { ButtonLink } from '../components/ui/ButtonLink.jsx';
import { PageHeader } from '../components/ui/PageHeader.jsx';
import { useDocumentMeta } from '../hooks/useDocumentMeta.js';
import { ROUTES } from '../utils/constants.js';

export default function NotFoundPage() {
  useDocumentMeta('Halaman Tidak Ditemukan', 'Halaman yang Anda cari tidak ditemukan di VoteDel.');

  return (
    <div className="stack">
      <PageHeader title="Halaman tidak ditemukan" subtitle="Alamat yang Anda tuju tidak tersedia." />
      <div>
        <ButtonLink to={ROUTES.home}>Kembali ke beranda</ButtonLink>
      </div>
    </div>
  );
}
