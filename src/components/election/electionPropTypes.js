import PropTypes from 'prop-types';
import { ELECTION_STATUS } from '../../utils/constants.js';

export const electionShape = PropTypes.shape({
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  startAt: PropTypes.string.isRequired,
  endAt: PropTypes.string.isRequired,
  status: PropTypes.oneOf(Object.values(ELECTION_STATUS)).isRequired,
  candidateCount: PropTypes.number,
  totalVotes: PropTypes.number,
  hasVoted: PropTypes.bool,
});

export const candidateShape = PropTypes.shape({
  id: PropTypes.number.isRequired,
  number: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  vision: PropTypes.string,
  mission: PropTypes.string,
});
