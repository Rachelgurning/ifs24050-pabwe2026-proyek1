import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Alert } from '../../../components/ui/Alert.jsx';
import { ButtonLink } from '../../../components/ui/ButtonLink.jsx';
import { ELECTION_STATUS, ROUTES, USER_ROLES, paths } from '../../../utils/constants.js';
import { candidateShape } from '../../elections/components/electionPropTypes.js';
import { VoteForm } from './VoteForm.jsx';

/** Menentukan isi bagian pemungutan suara berdasarkan status pemilihan dan peran pengguna. */
export function VotingSection({ election, user, onVoted }) {
  if (election.status === ELECTION_STATUS.UPCOMING) {
    return <Alert>Pemilihan belum dibuka. Pelajari profil kandidat sambil menunggu.</Alert>;
  }

  if (election.status === ELECTION_STATUS.CLOSED) {
    return (
      <div className="stack">
        <Alert>Pemilihan telah selesai.</Alert>
        <div>
          <ButtonLink to={paths.electionResults(election.id)}>Lihat hasil pemilihan</ButtonLink>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Alert>
        Anda harus masuk untuk memberikan suara. <Link to={ROUTES.login}>Masuk ke akun</Link>
      </Alert>
    );
  }

  if (user.role !== USER_ROLES.STUDENT) {
    return <Alert>Akun administrator tidak dapat memberikan suara.</Alert>;
  }

  if (election.hasVoted) {
    return <Alert variant="success">Terima kasih, suara Anda sudah tercatat.</Alert>;
  }

  return <VoteForm electionId={election.id} candidates={election.candidates} onVoted={onVoted} />;
}

VotingSection.propTypes = {
  election: PropTypes.shape({
    id: PropTypes.number.isRequired,
    status: PropTypes.oneOf(Object.values(ELECTION_STATUS)).isRequired,
    hasVoted: PropTypes.bool,
    candidates: PropTypes.arrayOf(candidateShape),
  }).isRequired,
  user: PropTypes.shape({ role: PropTypes.string.isRequired }),
  onVoted: PropTypes.func.isRequired,
};
