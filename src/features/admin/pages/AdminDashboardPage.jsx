import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui/Button.jsx';
import { ButtonLink } from '../../../components/ui/ButtonLink.jsx';
import { EmptyState } from '../../../components/ui/EmptyState.jsx';
import { ErrorState } from '../../../components/ui/ErrorState.jsx';
import { LoadingState } from '../../../components/ui/LoadingState.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import {
  formatDate,
  showConfirmDialog,
  showErrorDialog,
  showSuccessDialog,
} from '../../../helpers/toolsHelper.js';
import { useDocumentMeta } from '../../../hooks/useDocumentMeta.js';
import { ROUTES, paths } from '../../../utils/constants.js';
import { ElectionStatusBadge } from '../../elections/components/ElectionStatusBadge.jsx';
import {
  asyncDeleteElection,
  asyncFetchElections,
  selectElectionError,
  selectElections,
} from '../../elections/states/electionSlice.js';

export default function AdminDashboardPage() {
  const dispatch = useDispatch();
  const elections = useSelector(selectElections);
  const error = useSelector(selectElectionError);
  const isLoading = useSelector((state) => state.elections.isElections);

  useDocumentMeta(
    'Kelola Pemilihan',
    'Halaman administrator untuk mengelola pemilihan dan kandidat VoteDel.',
  );

  useEffect(() => {
    dispatch(asyncFetchElections());
  }, [dispatch]);

  const handleDelete = async (election) => {
    const confirmed = await showConfirmDialog({
      title: 'Hapus pemilihan?',
      text: `Pemilihan "${election.title}" beserta kandidatnya akan dihapus permanen.`,
    });
    if (!confirmed) return;

    const result = await dispatch(asyncDeleteElection(election.id));

    if (asyncDeleteElection.rejected.match(result)) {
      await showErrorDialog({ title: 'Gagal menghapus pemilihan', text: result.payload });
      return;
    }

    await showSuccessDialog({ title: 'Pemilihan dihapus', text: election.title });
  };

  const renderContent = () => {
    if (isLoading && elections.length === 0) {
      return <LoadingState label="Memuat daftar pemilihan…" />;
    }
    if (error) {
      return (
        <ErrorState error={{ message: error }} onRetry={() => dispatch(asyncFetchElections())} />
      );
    }
    if (elections.length === 0) {
      return <EmptyState title="Belum ada pemilihan" description="Buat pemilihan pertama Anda." />;
    }

    return (
      <section className="table-scroll" aria-label="Tabel daftar pemilihan">
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
            {elections.map((election) => (
              <tr key={election.id}>
                <th scope="row">{election.title}</th>
                <td>
                  <ElectionStatusBadge status={election.status} />
                </td>
                <td>
                  {formatDate(election.startAt)}
                  <br />
                  s.d. {formatDate(election.endAt)}
                </td>
                <td>{election.candidateCount}</td>
                <td>{election.totalVotes}</td>
                <td>
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
                      <Button
                        variant="secondary"
                        onClick={() => {
                          handleDelete(election);
                        }}
                      >
                        Hapus<span className="visually-hidden"> {election.title}</span>
                      </Button>
                    )}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    );
  };

  return (
    <div className="stack">
      <PageHeader
        title="Kelola Pemilihan"
        subtitle="Buat pemilihan, atur kandidat, dan pantau perolehan suara."
        actions={<ButtonLink to={ROUTES.adminNewElection}>Buat pemilihan</ButtonLink>}
      />
      {renderContent()}
    </div>
  );
}
