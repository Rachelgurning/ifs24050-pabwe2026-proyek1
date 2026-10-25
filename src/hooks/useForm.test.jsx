import { describe, expect, it, vi } from 'vitest';
import PropTypes from 'prop-types';
import userEvent from '@testing-library/user-event';
import { ApiError } from '../helpers/apiHelper.js';
import { renderWithProviders, screen, waitFor } from '../test-utils.jsx';
import { useForm } from './useForm.js';

const validate = (values) => (values.nama ? {} : { nama: 'Nama wajib diisi.' });

function DemoForm({ onSubmit }) {
  const { values, errors, submitError, submitting, handleChange, handleSubmit } = useForm({
    initialValues: { nama: '' },
    validate,
    onSubmit,
  });

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label htmlFor="nama">Nama</label>
      <input
        id="nama"
        name="nama"
        value={values.nama}
        onChange={handleChange}
        aria-invalid={errors.nama ? 'true' : undefined}
      />
      {errors.nama && <p>{errors.nama}</p>}
      {submitError && <p role="alert">{submitError}</p>}
      <button type="submit" disabled={submitting}>
        Kirim
      </button>
    </form>
  );
}

DemoForm.propTypes = { onSubmit: PropTypes.func.isRequired };

describe('useForm', () => {
  it('menampilkan error validasi lalu menghapusnya saat field diubah', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    renderWithProviders(<DemoForm onSubmit={onSubmit} />);

    await user.click(screen.getByRole('button', { name: 'Kirim' }));

    expect(screen.getByText('Nama wajib diisi.')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByLabelText('Nama')).toHaveFocus());
    expect(onSubmit).not.toHaveBeenCalled();

    await user.type(screen.getByLabelText('Nama'), 'Budi');
    expect(screen.queryByText('Nama wajib diisi.')).not.toBeInTheDocument();
  });

  it('mengirim nilai formulir ketika valid', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    renderWithProviders(<DemoForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText('Nama'), 'Budi');
    await user.click(screen.getByRole('button', { name: 'Kirim' }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ nama: 'Budi' }));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('memetakan detail ApiError ke error per field', async () => {
    const user = userEvent.setup();
    const onSubmit = vi
      .fn()
      .mockRejectedValue(new ApiError('Validasi gagal', { details: { nama: 'Nama sudah dipakai.' } }));
    renderWithProviders(<DemoForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText('Nama'), 'Budi');
    await user.click(screen.getByRole('button', { name: 'Kirim' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Validasi gagal');
    expect(screen.getByText('Nama sudah dipakai.')).toBeInTheDocument();
  });

  it('menampilkan pesan error umum dari onSubmit', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockRejectedValue(new Error('Server sibuk'));
    renderWithProviders(<DemoForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText('Nama'), 'Budi');
    await user.click(screen.getByRole('button', { name: 'Kirim' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Server sibuk');
  });
});
