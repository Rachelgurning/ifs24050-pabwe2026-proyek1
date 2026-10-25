import { useNavigate } from 'react-router-dom';
import { AuthForm } from '../components/AuthForm.jsx';
import { PageHeader } from '../components/ui/PageHeader.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { useDocumentMeta } from '../hooks/useDocumentMeta.js';
import { ROUTES } from '../utils/constants.js';
import { validateRegisterForm } from '../utils/validators.js';

const FIELDS = [
  { name: 'nim', label: 'NIM', autoComplete: 'username', hint: '5-15 karakter, huruf atau angka.' },
  { name: 'name', label: 'Nama lengkap', autoComplete: 'name' },
  {
    name: 'password',
    label: 'Kata sandi',
    type: 'password',
    autoComplete: 'new-password',
    hint: 'Minimal 8 karakter, mengandung huruf dan angka.',
  },
  {
    name: 'confirmPassword',
    label: 'Konfirmasi kata sandi',
    type: 'password',
    autoComplete: 'new-password',
  },
];
const INITIAL_VALUES = { nim: '', name: '', password: '', confirmPassword: '' };

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  useDocumentMeta('Daftar', 'Buat akun VoteDel dengan NIM Anda untuk mengikuti pemilihan mahasiswa.');

  const handleSubmit = async ({ nim, name, password }) => {
    await register({ nim, name, password });
    navigate(ROUTES.elections, { replace: true });
  };

  return (
    <div className="narrow">
      <PageHeader title="Daftar akun" subtitle="Buat akun mahasiswa untuk mengikuti pemilihan." />
      <AuthForm
        fields={FIELDS}
        initialValues={INITIAL_VALUES}
        validate={validateRegisterForm}
        onSubmit={handleSubmit}
        submitLabel="Daftar"
        loadingLabel="Mendaftarkan…"
        footer={{ text: 'Sudah punya akun?', to: ROUTES.login, linkLabel: 'Masuk' }}
      />
    </div>
  );
}
