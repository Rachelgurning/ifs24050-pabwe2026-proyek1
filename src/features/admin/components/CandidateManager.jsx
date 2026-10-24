import PropTypes from 'prop-types';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Alert } from '../../../components/ui/Alert.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { showConfirmDialog, showErrorDialog } from '../../../helpers/toolsHelper.js';
import { candidateShape } from '../../elections/components/electionPropTypes.js';
import { asyncDeleteCandidate, asyncSaveCandidate } from '../../elections/states/electionSlice.js';
import { CandidateForm } from './CandidateForm.jsx';

const NEW_CANDIDATE = 'new';

/** Pengelolaan kandidat milik satu pemilihan (tambah, ubah, hapus). */
export function CandidateManager({ electionId, candidates, locked, onChanged }) {
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(null);

  const closeForm = () => setEditing(null);

  const handleSave = async (payload) => {
    const result = await dispatch(
      asyncSaveCandidate({
        electionId,
        candidateId: editing === NEW_CANDIDATE ? null : editing.id,
        payload,
      }),
    );

    if (asyncSaveCandidate.rejected.match(result)) {
      throw new Error(result.payload);
    }

    closeForm();
    onChanged();
  };

  const handleDelete = async (candidate) => {
    const confirmed = await showConfirmDialog({
      title: 'Hapus kandidat?',
      text: `Kandidat ${candidate.name} akan dihapus dari pemilihan ini.`,
    });
    if (!confirmed) return;

    const result = await dispatch(asyncDeleteCandidate(candidate.id));

    if (asyncDeleteCandidate.rejected.match(result)) {
      await showErrorDialog({ title: 'Gagal menghapus kandidat', text: result.payload });
      return;
    }

    onChanged();
  };

  const nextNumber =
    candidates.length === 0 ? 1 : Math.max(...candidates.map((item) => item.number)) + 1;

  return (
    <section className="stack" aria-labelledby="candidate-manager-title">
      <h2 id="candidate-manager-title">Kandidat</h2>
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
                  <Button variant="secondary" onClick={() => setEditing(candidate)}>
                    Ubah<span className="visually-hidden"> {candidate.name}</span>
                  </Button>
                  <Button variant="secondary" onClick={() => handleDelete(candidate)}>
                    Hapus<span className="visually-hidden"> {candidate.name}</span>
                  </Button>
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
