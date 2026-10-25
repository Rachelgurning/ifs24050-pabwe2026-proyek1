import PropTypes from 'prop-types';
import { useState } from 'react';
import { electionService } from '../../services/electionService.js';
import { candidateShape } from '../election/electionPropTypes.js';
import { Alert } from '../ui/Alert.jsx';
import { Button } from '../ui/Button.jsx';
import { CandidateForm } from './CandidateForm.jsx';

const NEW_CANDIDATE = 'new';

export function CandidateManager({ electionId, candidates, locked, onChanged }) {
  const [editing, setEditing] = useState(null);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [error, setError] = useState('');

  const closeForm = () => setEditing(null);

  const handleSave = async (payload) => {
    if (editing === NEW_CANDIDATE) {
      await electionService.addCandidate(electionId, payload);
    } else {
      await electionService.updateCandidate(editing.id, payload);
    }
    closeForm();
    onChanged();
  };

  const handleDelete = async (candidateId) => {
    setError('');
    try {
      await electionService.removeCandidate(candidateId);
      setPendingDeleteId(null);
      onChanged();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const nextNumber = candidates.length === 0 ? 1 : Math.max(...candidates.map((item) => item.number)) + 1;

  return (
    <section className="stack" aria-labelledby="candidate-manager-title">
      <h2 id="candidate-manager-title">Kandidat</h2>
      {error && <Alert variant="error">{error}</Alert>}
      {locked && <Alert>Kandidat dikunci karena pemilihan sudah memiliki suara.</Alert>}

      {candidates.length === 0 ? (
        <p>Belum ada kandidat. Tambahkan minimal dua kandidat sebelum pemilihan dimulai.</p>
      ) : (
        <ul className="list">
          {candidates.map((candidate) => (
            <li key={candidate.id} className="card list__item list__item--row">
              <span>
                <strong>{candidate.number}.</strong> {candidate.name}
              </span>
              {!locked && (
                <span className="button-row">
                  {pendingDeleteId === candidate.id ? (
                    <>
                      <Button variant="danger" onClick={() => handleDelete(candidate.id)}>
                        Ya, hapus<span className="visually-hidden"> {candidate.name}</span>
                      </Button>
                      <Button variant="secondary" onClick={() => setPendingDeleteId(null)}>
                        Batal
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="secondary" onClick={() => setEditing(candidate)}>
                        Ubah<span className="visually-hidden"> {candidate.name}</span>
                      </Button>
                      <Button variant="secondary" onClick={() => setPendingDeleteId(candidate.id)}>
                        Hapus<span className="visually-hidden"> {candidate.name}</span>
                      </Button>
                    </>
                  )}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      {editing ? (
        <CandidateForm
          key={editing === NEW_CANDIDATE ? NEW_CANDIDATE : editing.id}
          candidate={editing === NEW_CANDIDATE ? undefined : editing}
          defaultNumber={nextNumber}
          onSubmit={handleSave}
          onCancel={closeForm}
        />
      ) : (
        !locked && (
          <div>
            <Button onClick={() => setEditing(NEW_CANDIDATE)}>Tambah kandidat</Button>
          </div>
        )
      )}
    </section>
  );
}

CandidateManager.propTypes = {
  electionId: PropTypes.number.isRequired,
  candidates: PropTypes.arrayOf(candidateShape).isRequired,
  locked: PropTypes.bool.isRequired,
  onChanged: PropTypes.func.isRequired,
};
