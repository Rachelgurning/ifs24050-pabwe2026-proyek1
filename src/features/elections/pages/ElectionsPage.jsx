import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EmptyState } from '../../../components/ui/EmptyState.jsx';
import { ErrorState } from '../../../components/ui/ErrorState.jsx';
import { LoadingState } from '../../../components/ui/LoadingState.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { useDocumentMeta } from '../../../hooks/useDocumentMeta.js';
import { ELECTION_STATUS, STATUS_LABELS } from '../../../utils/constants.js';
import { selectAuthUser } from '../../auth/states/authSlice.js';
import { ElectionCard } from '../components/ElectionCard.jsx';
import {
  asyncFetchElections,
  selectElectionError,
  selectElections,
} from '../states/electionSlice.js';

const ALL_FILTER = 'all';
const FILTERS = [
  { value: ALL_FILTER, label: 'Semua' },
  ...Object.values(ELECTION_STATUS).map((status) => ({
    value: status,
    label: STATUS_LABELS[status],
  })),
];

export default function ElectionsPage() {
  const dispatch = useDispatch();
  const user = useSelector(selectAuthUser);
  const elections = useSelector(selectElections);
  const error = useSelector(selectElectionError);
  const isLoading = useSelector((state) => state.elections.isElectionsLoading);
  const [filter, setFilter] = useState(ALL_FILTER);

  useDocumentMeta(
    'Daftar Pemilihan',
    'Daftar pemilihan mahasiswa yang sedang berlangsung, akan datang, dan telah selesai.',
  );

  // Daftar dimuat ulang saat sesi berubah agar penanda "sudah memilih" selalu akurat.
  useEffect(() => {
    const request = dispatch(asyncFetchElections());
    return () => request.abort();
  }, [dispatch, user?.id]);

  const visibleElections = elections.filter(
    (item) => filter === ALL_FILTER || item.status === filter,
  );

  const renderContent = () => {
    if (isLoading && elections.length === 0) {
      return <LoadingState label="Memuat daftar pemilihan…" />;
    }
    if (error && elections.length === 0) {
      return <ErrorState error={{ message: error }} onRetry={() => dispatch(asyncFetchElections())} />;
    }
    if (visibleElections.length === 0) {
      return (
        <EmptyState
          title="Belum ada pemilihan"
          description="Tidak ada pemilihan pada kategori ini."
        />
      );
    }
    return (
      <div className="grid grid--2">
        {visibleElections.map((election) => (
          <ElectionCard key={election.id} election={election} />
        ))}
      </div>
    );
  };

  return (
    <>
      <PageHeader
        title="Daftar Pemilihan"
        subtitle="Pilih pemilihan untuk melihat kandidat dan memberikan suara."
      />

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
