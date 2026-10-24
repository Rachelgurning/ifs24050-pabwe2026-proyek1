import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export function ButtonLink({ to, children, variant = 'primary', className = '', ...rest }) {
  const classes = ['btn', `btn--${variant}`, className].filter(Boolean).join(' ');

  return (
    <Link to={to} className={classes} {...rest}>
      {children}
    </Link>
  );
}

ButtonLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'light', 'outline-light']),
  className: PropTypes.string,
};
