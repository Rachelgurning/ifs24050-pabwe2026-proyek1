import { useParams } from 'react-router-dom';
import { ResultsChart } from '../components/election/ResultsChart.jsx';
import { ButtonLink } from '../components/ui/ButtonLink.jsx';
import { ErrorState } from '../components/ui/ErrorState.jsx';
import { LoadingState } from '../components/ui/LoadingState.jsx';
import { PageHeader } from '../components/ui/PageHeader.jsx';
import { useAsyncData } from '../hooks/useAsyncData.js';
import { useAuth } from '../hooks/useAuth.js';
import { useDocumentMeta } from '../hooks/useDocumentMeta.js';
import { electionService } from '../services/electionService.js';
import { paths } from '../utils/constants.js';
import { formatDateTime } from '../utils/formatters.js';

export default function ResultsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { data, error, loading, reload } = useAsyncData(
    (signal) => electionService.getResults(id, signal),
    `${id}:${user?.id ?? 'guest'}`,
  );

  useDocumentMeta(
    data ? `Hasil ${data.election.title}` : 'Hasil Pemilihan',
    'Hasil perolehan suara pemilihan mahasiswa di VoteDel.',
  );

  if (loading) return <LoadingState label="Memuat hasil pemilihan…" />;
  if (error) {
    return (
      <div className="stack">
        <ErrorState error={error} onRetry={reload} />
        <div>
          <ButtonLink to={paths.electionDetail(id)} variant="secondary">
            Kembali ke detail pemilihan
          </ButtonLink>
        </div>
      </div>
    );
  }

  const { election, totalVotes, results } = data;

  return (
    <div className="stack stack--lg">
      <PageHeader
        title={`Hasil: ${election.title}`}
        subtitle={`Ditutup ${formatDateTime(election.endAt)} · Total ${totalVotes} suara`}
      />
      {totalVotes === 0 ? <p>Belum ada suara yang masuk.</p> : <ResultsChart results={results} />}
      <div>
        <ButtonLink to={paths.electionDetail(election.id)} variant="secondary">
          Kembali ke detail pemilihan
        </ButtonLink>
      </div>
    </div>
  );
}
