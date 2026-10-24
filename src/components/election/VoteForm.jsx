import PropTypes from 'prop-types';
import { useState } from 'react';
import { voteService } from '../../services/voteService.js';
import { Alert } from '../ui/Alert.jsx';
import { Button } from '../ui/Button.jsx';
import { CandidateProfile } from './CandidateProfile.jsx';
import { candidateShape } from './electionPropTypes.js';

export function VoteForm({ electionId, candidates, onVoted }) {
  const [selectedId, setSelectedId] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const selected = candidates.find((candidate) => candidate.id === selectedId);

  const handleSelect = (candidateId) => {
    setSelectedId(candidateId);
    setConfirming(false);
    setError('');
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    setError('');
    try {
      await voteService.cast(electionId, selectedId);
      onVoted();
    } catch (requestError) {
      setError(requestError.message);
      setConfirming(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (selected) setConfirming(true);
  };

  return (
    <form className="vote-form" onSubmit={handleSubmit}>
      <fieldset className="vote-form__fieldset" disabled={submitting}>
        <legend className="vote-form__legend">Pilih satu kandidat</legend>
        <div className="vote-form__options">
          {candidates.map((candidate) => (
            <label
              key={candidate.id}
              className={`card vote-option${candidate.id === selectedId ? ' vote-option--selected' : ''}`}
            >
              <input
                type="radio"
                name="candidate"
                value={candidate.id}
                checked={candidate.id === selectedId}
                onChange={() => handleSelect(candidate.id)}
                aria-labelledby={`candidate-${candidate.id}-name`}
                aria-describedby={candidate.vision ? `candidate-${candidate.id}-vision` : undefined}
              />
              <CandidateProfile candidate={candidate} />
            </label>
          ))}
        </div>
      </fieldset>

      {error && <Alert variant="error">{error}</Alert>}

      {confirming && selected ? (
        <div className="confirm-box" role="group" aria-labelledby="confirm-title">
          <h3 id="confirm-title" className="confirm-box__title">
            Konfirmasi pilihan Anda
          </h3>
          <p>
            Anda akan memilih <strong>nomor {selected.number} – {selected.name}</strong>. Suara
            yang sudah dikirim tidak dapat diubah.
          </p>
          <div className="button-row">
            <Button onClick={handleConfirm} loading={submitting} loadingText="Mengirim suara…">
              Ya, kirim suara
            </Button>
            <Button variant="secondary" onClick={() => setConfirming(false)} disabled={submitting}>
              Ubah pilihan
            </Button>
          </div>
        </div>
      ) : (
        <Button type="submit" disabled={!selected}>
          Lanjutkan
        </Button>
      )}
    </form>
  );
}

VoteForm.propTypes = {
  electionId: PropTypes.number.isRequired,
  candidates: PropTypes.arrayOf(candidateShape).isRequired,
  onVoted: PropTypes.func.isRequired,
};
