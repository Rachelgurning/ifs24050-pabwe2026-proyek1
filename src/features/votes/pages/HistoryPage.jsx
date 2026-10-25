import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { EmptyState } from '../../../components/ui/EmptyState.jsx';
import { ErrorState } from '../../../components/ui/ErrorState.jsx';
import { LoadingState } from '../../../components/ui/LoadingState.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { formatDate } from '../../../helpers/toolsHelper.js';
import { useDocumentMeta } from '../../../hooks/useDocumentMeta.js';
import { paths } from '../../../utils/constants.js';
import { asyncFetchVoteHistory, selectVoteError, selectVoteHistory } from '../states/voteSlice.js';

export default function HistoryPage() {
  const dispatch = useDispatch();
  const history = useSelector(selectVoteHistory);
  const error = useSelector(selectVoteError);
  const isLoading = useSelector((state) => state.votes.isHistory);

  useDocumentMeta('Riwayat Partisipasi', 'Daftar pemilihan yang telah Anda ikuti di VoteDel.');

  useEffect(() => {
    dispatch(asyncFetchVoteHistory());
  }, [dispatch]);

  const renderContent = () => {
    if (isLoading && history.length === 0) return <LoadingState label="Memuat riwayat…" />;
    if (error) {
      return (
        <ErrorState
          error={{ message: error }}
          onRetry={() => dispatch(asyncFetchVoteHistory())}
        />
      );
    }
    if (history.length === 0) {
      return (
        <EmptyState title="Belum ada riwayat" description="Anda belum mengikuti pemilihan apa pun." />
      );
    }
    return (
      <ul className="list">
        {history.map(({ electionId, title, votedAt }) => (
          <li key={electionId} className="card list__item">
            <Link to={paths.electionDetail(electionId)}>{title}</Link>
            <span className="muted">Suara tercatat pada {formatDate(votedAt)}</span>
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
