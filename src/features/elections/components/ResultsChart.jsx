import PropTypes from 'prop-types';
import { formatPercentage, formatVoteCount } from '../../../helpers/toolsHelper.js';

export function ResultsChart({ results }) {
  return (
    <ol className="results">
      {results.map(({ candidateId, number, name, votes, percentage, isLeading }) => (
        <li key={candidateId} className="results__item">
          <div className="results__header">
            <span className="results__name">
              {number}. {name}
              {isLeading && <span className="badge badge--active">Unggul</span>}
            </span>
            <span className="results__value">
              {formatVoteCount(votes)} · {formatPercentage(percentage)}
            </span>
          </div>
          <progress
            className="results__bar"
            max="100"
            value={percentage}
            aria-label={`Perolehan suara ${name}`}
          />
        </li>
      ))}
    </ol>
  );
}

ResultsChart.propTypes = {
  results: PropTypes.arrayOf(
    PropTypes.shape({
      candidateId: PropTypes.number.isRequired,
      number: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      votes: PropTypes.number.isRequired,
      percentage: PropTypes.number.isRequired,
      isLeading: PropTypes.bool.isRequired,
    }),
  ).isRequired,
};
