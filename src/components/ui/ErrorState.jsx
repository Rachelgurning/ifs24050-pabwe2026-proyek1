import PropTypes from 'prop-types';
import { Alert } from './Alert.jsx';
import { Button } from './Button.jsx';

export function ErrorState({ error, onRetry }) {
  return (
    <div className="stack">
      <Alert variant="error">{error?.message ?? 'Terjadi kesalahan tak terduga.'}</Alert>
      {onRetry && (
        <div>
          <Button variant="secondary" onClick={onRetry}>
            Coba lagi
          </Button>
        </div>
      )}
    </div>
  );
}

ErrorState.propTypes = {
  error: PropTypes.shape({ message: PropTypes.string }),
  onRetry: PropTypes.func,
};
