import PropTypes from 'prop-types';

/** Pesan umpan balik. Error memakai role="alert" (langsung dibacakan), lainnya role="status". */
export function Alert({ variant = 'info', children }) {
  const role = variant === 'error' ? 'alert' : 'status';

  return (
    <div className={`alert alert--${variant}`} role={role}>
      {children}
    </div>
  );
}

Alert.propTypes = {
  variant: PropTypes.oneOf(['info', 'success', 'error']),
  children: PropTypes.node.isRequired,
};
