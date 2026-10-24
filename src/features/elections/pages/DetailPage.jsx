import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ErrorState } from '../../../components/ui/ErrorState.jsx';
import { LoadingState } from '../../../components/ui/LoadingState.jsx';
import { formatDate } from '../../../helpers/toolsHelper.js';
import { useDocumentMeta } from '../../../hooks/useDocumentMeta.js';
import { ELECTION_STATUS } from '../../../utils/constants.js';
import { selectAuthUser } from '../../auth/states/authSlice.js';
import { VotingSection } from '../../votes/components/VotingSection.jsx';
import { CandidateProfile } from '../components/CandidateProfile.jsx';
import { ElectionStatusBadge } from '../components/ElectionStatusBadge.jsx';
import {
  asyncFetchElection,
  electionCleared,
  selectElection,
  selectElectionError,
} from '../states/electionSlice.js';

export default function DetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const user = useSelector(selectAuthUser);
  const election = useSelector(selectElection);
  const error = useSelector(selectElectionError);
  const isLoading = useSelector((state) => state.elections.isElection);

  const reload = useCallback(() => dispatch(asyncFetchElection(id)), [dispatch, id]);

  useEffect(() => {
    reload();
    return () => {
      dispatch(electionCleared());
    };
  }, [reload, dispatch, user?.id]);

  useDocumentMeta(
    election?.title ?? 'Detail Pemilihan',
    election?.description || 'Detail pemilihan mahasiswa di VoteDel.',
  );

  if (error) return <ErrorState error={{ message: error }} onRetry={reload} />;
  if (!election || isLoading) return <LoadingState label="Memuat detail pemilihan…" />;

  const showCandidateList = election.status !== ELECTION_STATUS.ACTIVE || !user || election.hasVoted;

  return (
    <article className="stack stack--lg">
      <header>
        <ElectionStatusBadge status={election.status} />
        <h1 className="page-header__title">{election.title}</h1>
        <p>{election.description}</p>
        <p className="muted">
          {formatDate(election.startAt)} – {formatDate(election.endAt)} · {election.totalVotes} suara
          masuk
        </p>
      </header>

      <section aria-labelledby="voting-title" className="stack">
        <h2 id="voting-title">
          {election.status === ELECTION_STATUS.ACTIVE ? 'Berikan suara' : 'Status pemilihan'}
        </h2>
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
