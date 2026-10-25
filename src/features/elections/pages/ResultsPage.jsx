import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ButtonLink } from '../../../components/ui/ButtonLink.jsx';
import { ErrorState } from '../../../components/ui/ErrorState.jsx';
import { LoadingState } from '../../../components/ui/LoadingState.jsx';
import { formatDate } from '../../../helpers/toolsHelper.js';
import { useDocumentMeta } from '../../../hooks/useDocumentMeta.js';
import { paths } from '../../../utils/constants.js';
import { selectAuthUser } from '../../auth/states/authSlice.js';
import { ResultsChart } from '../components/ResultsChart.jsx';
import {
  asyncFetchResults,
  selectElectionError,
  selectElectionResults,
} from '../states/electionSlice.js';

export default function ResultsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const user = useSelector(selectAuthUser);
  const data = useSelector(selectElectionResults);
  const error = useSelector(selectElectionError);

  const reload = useCallback(() => dispatch(asyncFetchResults(id)), [dispatch, id]);

  useEffect(() => {
    const request = reload();
    return () => request.abort();
  }, [reload, user?.id]);

  useDocumentMeta(
    data ? `Hasil ${data.election.title}` : 'Hasil Pemilihan',
    'Hasil perolehan suara pemilihan mahasiswa di VoteDel.',
  );

  if (error && !data) {
    return (
      <div className="stack">
        <ErrorState error={{ message: error }} onRetry={reload} />
        <div>
          <ButtonLink to={paths.electionDetail(id)} variant="secondary">
            Kembali ke detail pemilihan
          </ButtonLink>
        </div>
      </div>
    );
  }

  if (!data) return <LoadingState label="Memuat hasil pemilihan…" />;

  const { election, totalVotes, results } = data;

  return (
    <div className="stack stack--lg">
      <h1 className="page-header__title">Hasil: {election.title}</h1>
      <p className="muted">
        Ditutup {formatDate(election.endAt)} · Total {totalVotes} suara
      </p>
      {totalVotes === 0 ? <p>Belum ada suara yang masuk.</p> : <ResultsChart results={results} />}
      <div>
        <ButtonLink to={paths.electionDetail(election.id)} variant="secondary">
          Kembali ke detail pemilihan
        </ButtonLink>
      </div>
    </div>
  );
}
