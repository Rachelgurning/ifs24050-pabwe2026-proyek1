import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { useDocumentMeta } from '../../../hooks/useDocumentMeta.js';
import { ROUTES } from '../../../utils/constants.js';
import { validateLoginForm } from '../../../utils/validators.js';
import { AuthForm } from '../components/AuthForm.jsx';
import { asyncAuthLogin } from '../states/authSlice.js';

const FIELDS = [
  { name: 'nim', label: 'NIM', autoComplete: 'username' },
  { name: 'password', label: 'Kata sandi', type: 'password', autoComplete: 'current-password' },
];
const INITIAL_VALUES = { nim: '', password: '' };

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useDocumentMeta('Masuk', 'Masuk ke VoteDel menggunakan NIM dan kata sandi untuk memberikan suara.');

  const handleSubmit = async (values) => {
    const result = await dispatch(asyncAuthLogin(values));

    if (asyncAuthLogin.rejected.match(result)) {
      throw new Error(result.payload);
    }

    navigate(location.state?.from ?? ROUTES.elections, { replace: true });
  };

  return (
    <>
      <PageHeader title="Masuk" subtitle="Gunakan NIM dan kata sandi akun VoteDel Anda." />
      <AuthForm
        fields={FIELDS}
        initialValues={INITIAL_VALUES}
        validate={validateLoginForm}
        onSubmit={handleSubmit}
        submitLabel="Masuk"
        loadingLabel="Memproses…"
        footer={{ text: 'Belum punya akun?', to: ROUTES.register, linkLabel: 'Daftar sekarang' }}
      />
    </>
  );
}
