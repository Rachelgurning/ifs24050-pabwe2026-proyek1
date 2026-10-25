import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ElectionStatusBadge } from '../../components/election/ElectionStatusBadge.jsx';
import { Alert } from '../../components/ui/Alert.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { ButtonLink } from '../../components/ui/ButtonLink.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { ErrorState } from '../../components/ui/ErrorState.jsx';
import { LoadingState } from '../../components/ui/LoadingState.jsx';
import { PageHeader } from '../../components/ui/PageHeader.jsx';
import { useAsyncData } from '../../hooks/useAsyncData.js';
import { useDocumentMeta } from '../../hooks/useDocumentMeta.js';
import { electionService } from '../../services/electionService.js';
import { ROUTES, paths } from '../../utils/constants.js';
import { formatDateTime } from '../../utils/formatters.js';

function ElectionActions({ election, pendingDeleteId, onAskDelete, onCancelDelete, onConfirmDelete }) {
  if (pendingDeleteId === election.id) {
    return (
      <span className="button-row">
        <Button variant="danger" onClick={() => onConfirmDelete(election.id)}>
          Ya, hapus<span className="visually-hidden"> {election.title}</span>
        </Button>
        <Button variant="secondary" onClick={onCancelDelete}>
          Batal
        </Button>
      </span>
    );
  }

  return (
    <span className="button-row">
      <Link className="btn btn--secondary" to={paths.adminEditElection(election.id)}>
        Ubah<span className="visually-hidden"> {election.title}</span>
      </Link>
      <Link className="btn btn--secondary" to={paths.electionResults(election.id)}>
        Hasil<span className="visually-hidden"> {election.title}</span>
      </Link>
      {election.totalVotes > 0 ? (
        <span className="muted">Terkunci</span>
      ) : (
        <Button variant="secondary" onClick={() => onAskDelete(election.id)}>
          Hapus<span className="visually-hidden"> {election.title}</span>
        </Button>
      )}
    </span>
  );
}

ElectionActions.propTypes = {
  election: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    totalVotes: PropTypes.number.isRequired,
  }).isRequired,
  pendingDeleteId: PropTypes.number,
  onAskDelete: PropTypes.func.isRequired,
  onCancelDelete: PropTypes.func.isRequired,
  onConfirmDelete: PropTypes.func.isRequired,
};

export default function AdminDashboardPage() {
  const { data, error, loading, reload } = useAsyncData((signal) => electionService.list(signal), 'admin');
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [actionError, setActionError] = useState('');

  useDocumentMeta('Kelola Pemilihan', 'Halaman administrator untuk mengelola pemilihan dan kandidat VoteDel.');

  const handleDelete = async (id) => {
    setActionError('');
    try {
      await electionService.remove(id);
      setPendingDeleteId(null);
      reload();
    } catch (requestError) {
      setActionError(requestError.message);
    }
  };

  const renderContent = () => {
    if (loading && !data) return <LoadingState label="Memuat daftar pemilihan…" />;
    if (error) return <ErrorState error={error} onRetry={reload} />;
    if (data.length === 0) {
      return <EmptyState title="Belum ada pemilihan" description="Buat pemilihan pertama Anda." />;
    }

    return (
      <div className="table-scroll" tabIndex={0} role="region" aria-label="Tabel daftar pemilihan">
        <table className="table">
          <caption className="visually-hidden">Daftar pemilihan beserta jadwal dan aksi</caption>
          <thead>
            <tr>
              <th scope="col">Judul</th>
              <th scope="col">Status</th>
              <th scope="col">Jadwal</th>
              <th scope="col">Kandidat</th>
              <th scope="col">Suara</th>
              <th scope="col">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((election) => (
              <tr key={election.id}>
                <th scope="row">{election.title}</th>
                <td>
                  <ElectionStatusBadge status={election.status} />
                </td>
                <td>
                  {formatDateTime(election.startAt)}
                  <br />
                  s.d. {formatDateTime(election.endAt)}
                </td>
                <td>{election.candidateCount}</td>
                <td>{election.totalVotes}</td>
                <td>
                  <ElectionActions
                    election={election}
                    pendingDeleteId={pendingDeleteId}
                    onAskDelete={setPendingDeleteId}
                    onCancelDelete={() => setPendingDeleteId(null)}
                    onConfirmDelete={handleDelete}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="stack">
      <PageHeader
        title="Kelola Pemilihan"
        subtitle="Buat pemilihan, atur kandidat, dan pantau perolehan suara."
        actions={<ButtonLink to={ROUTES.adminNewElection}>Buat pemilihan</ButtonLink>}
      />
      {actionError && <Alert variant="error">{actionError}</Alert>}
      {renderContent()}
    </div>
  );
}
