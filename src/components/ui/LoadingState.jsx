import PropTypes from 'prop-types';

export function LoadingState({ label = 'Memuat data…' }) {
  return (
    <output className="loading">
      <span className="spinner" aria-hidden="true" />
      <span>{label}</span>
    </output>
  );
}

LoadingState.propTypes = {
  label: PropTypes.string,
};
