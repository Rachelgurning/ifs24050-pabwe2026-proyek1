import PropTypes from 'prop-types';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { ButtonLink } from '../../../components/ui/ButtonLink.jsx';
import { ErrorState } from '../../../components/ui/ErrorState.jsx';
import { LoadingState } from '../../../components/ui/LoadingState.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { useDocumentMeta } from '../../../hooks/useDocumentMeta.js';
import { ROUTES, paths } from '../../../utils/constants.js';
import {
  asyncCreateElection,
  asyncFetchElection,
  asyncUpdateElection,
  selectElection,
  selectElectionError,
} from '../../elections/states/electionSlice.js';
import { CandidateManager } from '../components/CandidateManager.jsx';
import { ElectionForm } from '../components/ElectionForm.jsx';

function CreateElection() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useDocumentMeta('Buat Pemilihan', 'Buat pemilihan baru di VoteDel.');

  const handleCreate = async (payload) => {
    const result = await dispatch(asyncCreateElection(payload));

    if (asyncCreateElection.rejected.match(result)) {
      throw new Error(result.payload);
    }

    navigate(paths.adminEditElection(result.payload.id), { replace: true });
  };

  return (
    <div className="stack">
      <PageHeader
        title="Buat pemilihan"
        subtitle="Setelah disimpan, Anda dapat menambahkan kandidat."
      />
      <ElectionForm onSubmit={handleCreate} submitLabel="Simpan pemilihan" />
    </div>
  );
}

function EditElection({ id }) {
  const dispatch = useDispatch();
  const election = useSelector(selectElection);
  const error = useSelector(selectElectionError);

  const reload = useCallback(() => dispatch(asyncFetchElection(id)), [dispatch, id]);

  useEffect(() => {
    const request = reload();
    return () => request.abort();
  }, [reload]);

  useDocumentMeta('Ubah Pemilihan', 'Ubah data pemilihan dan kelola kandidat di VoteDel.');

  const handleUpdate = async (payload) => {
    const result = await dispatch(asyncUpdateElection({ id: election.id, payload }));

    if (asyncUpdateElection.rejected.match(result)) {
      throw new Error(result.payload);
    }

    reload();
  };

  // Hanya kegagalan pemuatan awal yang menggantikan halaman; kegagalan simpan
  // ditampilkan di dalam formulir agar konteks pengguna tidak hilang.
  if (error && !election) return <ErrorState error={{ message: error }} onRetry={reload} />;
  if (!election) return <LoadingState label="Memuat data pemilihan…" />;

  const locked = election.totalVotes > 0;

  return (
    <div className="stack stack--lg">
      <PageHeader
        title="Ubah pemilihan"
        subtitle={election.title}
        actions={
          <ButtonLink to={ROUTES.admin} variant="secondary">
            Kembali ke daftar
          </ButtonLink>
        }
      />
      <ElectionForm
        key={election.id}
        election={election}
        locked={locked}
        onSubmit={handleUpdate}
        submitLabel="Simpan perubahan"
      />
      <CandidateManager
        electionId={election.id}
        candidates={election.candidates}
        locked={locked}
        onChanged={reload}
      />
    </div>
  );
}

EditElection.propTypes = {
  id: PropTypes.string.isRequired,
};

export default function ElectionFormPage() {
  const { id } = useParams();
  return id ? <EditElection id={id} /> : <CreateElection />;
}
