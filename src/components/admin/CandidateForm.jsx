import PropTypes from 'prop-types';
import { useForm } from '../../hooks/useForm.js';
import { validateCandidateForm } from '../../utils/validators.js';
import { candidateShape } from '../election/electionPropTypes.js';
import { Alert } from '../ui/Alert.jsx';
import { Button } from '../ui/Button.jsx';
import { FormField } from '../ui/FormField.jsx';

function toInitialValues(candidate, defaultNumber) {
  return {
    number: String(candidate?.number ?? defaultNumber ?? ''),
    name: candidate?.name ?? '',
    vision: candidate?.vision ?? '',
    mission: candidate?.mission ?? '',
  };
}

export function CandidateForm({ candidate, defaultNumber, onSubmit, onCancel }) {
  const { values, errors, submitError, submitting, handleChange, handleSubmit } = useForm({
    initialValues: toInitialValues(candidate, defaultNumber),
    validate: validateCandidateForm,
    onSubmit: (formValues) =>
      onSubmit({
        number: Number(formValues.number),
        name: formValues.name.trim(),
        vision: formValues.vision.trim(),
        mission: formValues.mission.trim(),
      }),
  });

  const heading = candidate ? 'Ubah kandidat' : 'Tambah kandidat';

  return (
    <form className="card form-card" onSubmit={handleSubmit} noValidate aria-label={heading}>
      <h3 className="card__title">{heading}</h3>
      {submitError && <Alert variant="error">{submitError}</Alert>}

      <FormField
        id="candidate-number"
        name="number"
        type="number"
        min="1"
        max="99"
        label="Nomor urut"
        value={values.number}
        onChange={handleChange}
        error={errors.number}
      />
      <FormField
        id="candidate-name"
        name="name"
        label="Nama kandidat"
        value={values.name}
        onChange={handleChange}
        error={errors.name}
      />
      <FormField
        id="candidate-vision"
        name="vision"
        as="textarea"
        rows={3}
        label="Visi"
        value={values.vision}
        onChange={handleChange}
        error={errors.vision}
      />
      <FormField
        id="candidate-mission"
        name="mission"
        as="textarea"
        rows={4}
        label="Misi"
        value={values.mission}
        onChange={handleChange}
        error={errors.mission}
      />

      <div className="button-row">
        <Button type="submit" loading={submitting} loadingText="Menyimpan…">
          Simpan kandidat
        </Button>
        <Button variant="secondary" onClick={onCancel} disabled={submitting}>
          Batal
        </Button>
      </div>
    </form>
  );
}

CandidateForm.propTypes = {
  candidate: candidateShape,
  defaultNumber: PropTypes.number,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
