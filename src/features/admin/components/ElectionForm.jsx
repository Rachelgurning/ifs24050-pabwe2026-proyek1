import PropTypes from 'prop-types';
import { useState } from 'react';
import { Alert } from '../../../components/ui/Alert.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { FormField } from '../../../components/ui/FormField.jsx';
import { fromDateTimeLocalValue, toDateTimeLocalValue } from '../../../helpers/toolsHelper.js';
import { useForm } from '../../../hooks/useForm.js';
import { validateElectionForm } from '../../../utils/validators.js';

function toInitialValues(election) {
  return {
    title: election?.title ?? '',
    description: election?.description ?? '',
    startAt: election ? toDateTimeLocalValue(election.startAt) : '',
    endAt: election ? toDateTimeLocalValue(election.endAt) : '',
  };
}

export function ElectionForm({ election, onSubmit, submitLabel, locked = false }) {
  const [saved, setSaved] = useState(false);

  const handleSave = async (values) => {
    setSaved(false);
    await onSubmit({
      title: values.title.trim(),
      description: values.description.trim(),
      startAt: fromDateTimeLocalValue(values.startAt),
      endAt: fromDateTimeLocalValue(values.endAt),
    });
    setSaved(true);
  };

  const { values, errors, submitError, submitting, handleChange, handleSubmit } = useForm({
    initialValues: toInitialValues(election),
    validate: validateElectionForm,
    onSubmit: handleSave,
  });

  return (
    <form className="card form-card" onSubmit={handleSubmit} noValidate>
      {locked && <Alert>Pemilihan ini sudah memiliki suara sehingga datanya tidak dapat diubah.</Alert>}
      {submitError && <Alert variant="error">{submitError}</Alert>}
      {saved && <Alert variant="success">Perubahan berhasil disimpan.</Alert>}

      <fieldset className="plain-fieldset" disabled={locked}>
        <legend className="visually-hidden">Data pemilihan</legend>
        <FormField
          id="title"
          name="title"
          label="Judul pemilihan"
          value={values.title}
          onChange={handleChange}
          error={errors.title}
        />
        <FormField
          id="description"
          name="description"
          as="textarea"
          rows={4}
          label="Deskripsi"
          value={values.description}
          onChange={handleChange}
          error={errors.description}
        />
        <div className="grid grid--2">
          <FormField
            id="startAt"
            name="startAt"
            type="datetime-local"
            label="Waktu mulai"
            value={values.startAt}
            onChange={handleChange}
            error={errors.startAt}
          />
          <FormField
            id="endAt"
            name="endAt"
            type="datetime-local"
            label="Waktu selesai"
            value={values.endAt}
            onChange={handleChange}
            error={errors.endAt}
          />
        </div>
      </fieldset>

      <div>
        <Button type="submit" loading={submitting} loadingText="Menyimpan…" disabled={locked}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

ElectionForm.propTypes = {
  election: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    startAt: PropTypes.string,
    endAt: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
  submitLabel: PropTypes.string.isRequired,
  locked: PropTypes.bool,
};
