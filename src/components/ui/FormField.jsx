import PropTypes from 'prop-types';

/**
 * Field formulir yang aksesibel: label terhubung, pesan error dan petunjuk
 * dikaitkan lewat aria-describedby, serta aria-invalid saat ada error.
 */
export function FormField({ id, label, error, hint, as: Control = 'input', children, ...controlProps }) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      {hint && (
        <p className="field__hint" id={hintId}>
          {hint}
        </p>
      )}
      <Control
        id={id}
        className={`field__control${error ? ' field__control--invalid' : ''}`}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy}
        {...controlProps}
      >
        {children}
      </Control>
      {error && (
        <p className="field__error" id={errorId}>
          {error}
        </p>
      )}
    </div>
  );
}

FormField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  error: PropTypes.string,
  hint: PropTypes.string,
  as: PropTypes.oneOf(['input', 'textarea', 'select']),
  children: PropTypes.node,
};
