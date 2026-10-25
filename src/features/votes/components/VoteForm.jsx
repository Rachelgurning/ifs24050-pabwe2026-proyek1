import PropTypes from 'prop-types';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert } from '../../../components/ui/Alert.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { CandidateProfile } from '../../elections/components/CandidateProfile.jsx';
import { candidateShape } from '../../elections/components/electionPropTypes.js';
import { asyncCastVote, selectVoteError, voteStateReset } from '../states/voteSlice.js';

/** Formulir pemilihan kandidat dengan langkah konfirmasi sebelum suara dikirim. */
export function VoteForm({ electionId, candidates, onVoted }) {
  const dispatch = useDispatch();
  const error = useSelector(selectVoteError);
  const isVoteSubmitting = useSelector((state) => state.votes.isVoteSubmitting);

  const [selectedId, setSelectedId] = useState(null);
  const [confirming, setConfirming] = useState(false);

  const selected = candidates.find((candidate) => candidate.id === selectedId);

  const handleSelect = (candidateId) => {
    setSelectedId(candidateId);
    setConfirming(false);
    dispatch(voteStateReset());
  };

  const handleConfirm = async () => {
    const result = await dispatch(asyncCastVote({ electionId, candidateId: selectedId }));

    if (asyncCastVote.fulfilled.match(result)) {
      onVoted();
    } else {
      setConfirming(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (selected) setConfirming(true);
  };

  return (
    <form className="vote-form" onSubmit={handleSubmit}>
      <fieldset className="vote-form__fieldset" disabled={isVoteSubmitting}>
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
            Anda akan memilih{' '}
            <strong>
              nomor {selected.number} – {selected.name}
            </strong>
            . Suara yang sudah dikirim tidak dapat diubah.
          </p>
          <div className="button-row">
            <Button onClick={handleConfirm} loading={isVoteSubmitting} loadingText="Mengirim suara…">
              Ya, kirim suara
            </Button>
            <Button variant="secondary" onClick={() => setConfirming(false)} disabled={isVoteSubmitting}>
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
