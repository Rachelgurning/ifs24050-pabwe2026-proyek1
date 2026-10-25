import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';
import { CandidateManager } from '../../components/admin/CandidateManager.jsx';
import { ElectionForm } from '../../components/admin/ElectionForm.jsx';
import { ButtonLink } from '../../components/ui/ButtonLink.jsx';
import { ErrorState } from '../../components/ui/ErrorState.jsx';
import { LoadingState } from '../../components/ui/LoadingState.jsx';
import { PageHeader } from '../../components/ui/PageHeader.jsx';
import { useAsyncData } from '../../hooks/useAsyncData.js';
import { useDocumentMeta } from '../../hooks/useDocumentMeta.js';
import { electionService } from '../../services/electionService.js';
import { ROUTES, paths } from '../../utils/constants.js';

function CreateElection() {
  const navigate = useNavigate();

  useDocumentMeta('Buat Pemilihan', 'Buat pemilihan baru di VoteDel.');

  const handleCreate = async (payload) => {
    const created = await electionService.create(payload);
    navigate(paths.adminEditElection(created.id), { replace: true });
  };

  return (
    <div className="stack">
      <PageHeader title="Buat pemilihan" subtitle="Setelah disimpan, Anda dapat menambahkan kandidat." />
      <ElectionForm onSubmit={handleCreate} submitLabel="Simpan pemilihan" />
    </div>
  );
}

function EditElection({ id }) {
  const { data: election, error, loading, reload } = useAsyncData(
    (signal) => electionService.getById(id, signal),
    id,
  );

  useDocumentMeta('Ubah Pemilihan', 'Ubah data pemilihan dan kelola kandidat di VoteDel.');

  if (loading && !election) return <LoadingState label="Memuat data pemilihan…" />;
  if (error) return <ErrorState error={error} onRetry={reload} />;

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
        onSubmit={async (payload) => {
          await electionService.update(election.id, payload);
          reload();
        }}
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
