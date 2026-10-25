import { useParams } from 'react-router-dom';
import { CandidateProfile } from '../components/election/CandidateProfile.jsx';
import { ElectionStatusBadge } from '../components/election/ElectionStatusBadge.jsx';
import { VotingSection } from '../components/election/VotingSection.jsx';
import { ErrorState } from '../components/ui/ErrorState.jsx';
import { LoadingState } from '../components/ui/LoadingState.jsx';
import { useAsyncData } from '../hooks/useAsyncData.js';
import { useAuth } from '../hooks/useAuth.js';
import { useDocumentMeta } from '../hooks/useDocumentMeta.js';
import { electionService } from '../services/electionService.js';
import { ELECTION_STATUS } from '../utils/constants.js';
import { formatDateTime } from '../utils/formatters.js';

export default function ElectionDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { data: election, error, loading, reload } = useAsyncData(
    (signal) => electionService.getById(id, signal),
    `${id}:${user?.id ?? 'guest'}`,
  );

  useDocumentMeta(
    election?.title ?? 'Detail Pemilihan',
    election?.description || 'Detail pemilihan mahasiswa di VoteDel.',
  );

  if (loading && !election) return <LoadingState label="Memuat detail pemilihan…" />;
  if (error) return <ErrorState error={error} onRetry={reload} />;

  const showCandidateList = election.status !== ELECTION_STATUS.ACTIVE || !user || election.hasVoted;

  return (
    <article className="stack stack--lg">
      <header>
        <ElectionStatusBadge status={election.status} />
        <h1 className="page-header__title">{election.title}</h1>
        <p>{election.description}</p>
        <p className="muted">
          {formatDateTime(election.startAt)} – {formatDateTime(election.endAt)} · {election.totalVotes} suara masuk
        </p>
      </header>

      <section aria-labelledby="voting-title" className="stack">
        <h2 id="voting-title">{election.status === ELECTION_STATUS.ACTIVE ? 'Berikan suara' : 'Status pemilihan'}</h2>
        <VotingSection election={election} user={user} onVoted={reload} />
      </section>

      {showCandidateList && (
        <section aria-labelledby="candidates-title" className="stack">
          <h2 id="candidates-title">Kandidat</h2>
          <div className="grid grid--2">
            {election.candidates.map((candidate) => (
              <div key={candidate.id} className="card">
                <CandidateProfile candidate={candidate} />
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
