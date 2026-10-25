import { Link } from 'react-router-dom';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { ErrorState } from '../components/ui/ErrorState.jsx';
import { LoadingState } from '../components/ui/LoadingState.jsx';
import { PageHeader } from '../components/ui/PageHeader.jsx';
import { useAsyncData } from '../hooks/useAsyncData.js';
import { useDocumentMeta } from '../hooks/useDocumentMeta.js';
import { voteService } from '../services/voteService.js';
import { paths } from '../utils/constants.js';
import { formatDateTime } from '../utils/formatters.js';

export default function HistoryPage() {
  const { data, error, loading, reload } = useAsyncData((signal) => voteService.history(signal), 'history');

  useDocumentMeta('Riwayat Partisipasi', 'Daftar pemilihan yang telah Anda ikuti di VoteDel.');

  const renderContent = () => {
    if (loading) return <LoadingState label="Memuat riwayat…" />;
    if (error) return <ErrorState error={error} onRetry={reload} />;
    if (data.length === 0) {
      return (
        <EmptyState
          title="Belum ada riwayat"
          description="Anda belum mengikuti pemilihan apa pun."
        />
      );
    }
    return (
      <ul className="list">
        {data.map(({ electionId, title, votedAt }) => (
          <li key={electionId} className="card list__item">
            <Link to={paths.electionDetail(electionId)}>{title}</Link>
            <span className="muted">Suara tercatat pada {formatDateTime(votedAt)}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <>
      <PageHeader
        title="Riwayat Partisipasi"
        subtitle="Demi kerahasiaan, pilihan kandidat Anda tidak ditampilkan."
      />
      {renderContent()}
    </>
  );
}
