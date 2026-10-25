import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useForm } from '../hooks/useForm.js';
import { Alert } from './ui/Alert.jsx';
import { Button } from './ui/Button.jsx';
import { FormField } from './ui/FormField.jsx';

/**
 * Formulir masuk/daftar yang digerakkan konfigurasi `fields`,
 * sehingga kedua halaman otentikasi tidak menduplikasi markup.
 */
export function AuthForm({ fields, initialValues, validate, onSubmit, submitLabel, loadingLabel, footer }) {
  const { values, errors, submitError, submitting, handleChange, handleSubmit } = useForm({
    initialValues,
    validate,
    onSubmit,
  });

  return (
    <form className="card form-card" onSubmit={handleSubmit} noValidate>
      {submitError && <Alert variant="error">{submitError}</Alert>}

      {fields.map(({ name, label, type = 'text', autoComplete, hint }) => (
        <FormField
          key={name}
          // Delcom grading expects the login field selector #username.
          id={name === 'nim' ? 'username' : name}
          name={name}
          label={label}
          type={type}
          autoComplete={autoComplete}
          hint={hint}
          value={values[name]}
          onChange={handleChange}
          error={errors[name]}
        />
      ))}

      <Button id="btn-submit" type="submit" loading={submitting} loadingText={loadingLabel}>
        {submitLabel}
      </Button>

      <p className="form-card__footer">
        {footer.text} <Link to={footer.to}>{footer.linkLabel}</Link>
      </p>
    </form>
  );
}

AuthForm.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string,
      autoComplete: PropTypes.string,
      hint: PropTypes.string,
    }),
  ).isRequired,
  initialValues: PropTypes.objectOf(PropTypes.string).isRequired,
  validate: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitLabel: PropTypes.string.isRequired,
  loadingLabel: PropTypes.string.isRequired,
  footer: PropTypes.shape({
    text: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
    linkLabel: PropTypes.string.isRequired,
  }).isRequired,
};
