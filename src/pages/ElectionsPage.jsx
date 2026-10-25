import { useState } from 'react';
import { ElectionCard } from '../components/election/ElectionCard.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { ErrorState } from '../components/ui/ErrorState.jsx';
import { LoadingState } from '../components/ui/LoadingState.jsx';
import { PageHeader } from '../components/ui/PageHeader.jsx';
import { useAsyncData } from '../hooks/useAsyncData.js';
import { useAuth } from '../hooks/useAuth.js';
import { useDocumentMeta } from '../hooks/useDocumentMeta.js';
import { electionService } from '../services/electionService.js';
import { ELECTION_STATUS, STATUS_LABELS } from '../utils/constants.js';

const ALL_FILTER = 'all';
const FILTERS = [
  { value: ALL_FILTER, label: 'Semua' },
  ...Object.values(ELECTION_STATUS).map((status) => ({ value: status, label: STATUS_LABELS[status] })),
];

export default function ElectionsPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState(ALL_FILTER);
  const { data, error, loading, reload } = useAsyncData(
    (signal) => electionService.list(signal),
    user?.id ?? 'guest',
  );

  useDocumentMeta('Daftar Pemilihan', 'Daftar pemilihan mahasiswa yang sedang berlangsung, akan datang, dan telah selesai.');

  const elections = (data ?? []).filter((item) => filter === ALL_FILTER || item.status === filter);

  const renderContent = () => {
    if (loading) return <LoadingState label="Memuat daftar pemilihan…" />;
    if (error) return <ErrorState error={error} onRetry={reload} />;
    if (elections.length === 0) {
      return <EmptyState title="Belum ada pemilihan" description="Tidak ada pemilihan pada kategori ini." />;
    }
    return (
      <div className="grid grid--2">
        {elections.map((election) => (
          <ElectionCard key={election.id} election={election} />
        ))}
      </div>
    );
  };

  return (
    <>
      <PageHeader title="Daftar Pemilihan" subtitle="Pilih pemilihan untuk melihat kandidat dan memberikan suara." />

      <div className="filter-bar" role="group" aria-label="Filter status pemilihan">
        {FILTERS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            className={`chip${filter === value ? ' chip--active' : ''}`}
            aria-pressed={filter === value}
            onClick={() => setFilter(value)}
          >
            {label}
          </button>
        ))}
      </div>

      {renderContent()}
    </>
  );
}
