import PropTypes from 'prop-types';

export function EmptyState({ title, description, children }) {
  return (
    <div className="empty-state">
      <h2 className="empty-state__title">{title}</h2>
      {description && <p>{description}</p>}
      {children}
    </div>
  );
}

EmptyState.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  children: PropTypes.node,
};
