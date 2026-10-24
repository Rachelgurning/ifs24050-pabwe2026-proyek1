import { useCallback, useState } from 'react';
import { ApiError } from '../helpers/apiHelper.js';

function omitKey(source, key) {
  const { [key]: _removed, ...rest } = source;
  return rest;
}

function focusFirstInvalidField(form) {
  requestAnimationFrame(() => form?.querySelector('[aria-invalid="true"]')?.focus());
}

/**
 * Mengelola state formulir: nilai, validasi sisi klien, error dari server, dan status kirim.
 * @param {{initialValues: object, validate: (values: object) => object, onSubmit: (values: object) => Promise<*>}} options
 */
export function useForm({ initialValues, validate, onSubmit }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setValues((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => (previous[name] ? omitKey(previous, name) : previous));
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const validationErrors = validate(values);

      setSubmitError('');
      setErrors(validationErrors);

      if (Object.keys(validationErrors).length > 0) {
        focusFirstInvalidField(form);
        return;
      }

      setSubmitting(true);
      try {
        await onSubmit(values);
      } catch (error) {
        if (error instanceof ApiError && error.details) {
          setErrors(error.details);
          focusFirstInvalidField(form);
        }
        setSubmitError(error.message);
      } finally {
        setSubmitting(false);
      }
    },
    [onSubmit, validate, values],
  );

  return { values, errors, submitError, submitting, handleChange, handleSubmit };
}
