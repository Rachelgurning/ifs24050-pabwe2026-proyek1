import PropTypes from 'prop-types';

export function LoadingState({ label = 'Memuat data…' }) {
  return (
    <div className="loading" role="status">
      <span className="spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

LoadingState.propTypes = {
  label: PropTypes.string,
};
