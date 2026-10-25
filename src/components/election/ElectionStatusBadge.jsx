import PropTypes from 'prop-types';
import { ELECTION_STATUS, STATUS_LABELS } from '../../utils/constants.js';

export function ElectionStatusBadge({ status }) {
  return <span className={`badge badge--${status}`}>{STATUS_LABELS[status] ?? status}</span>;
}

ElectionStatusBadge.propTypes = {
  status: PropTypes.oneOf(Object.values(ELECTION_STATUS)).isRequired,
};
