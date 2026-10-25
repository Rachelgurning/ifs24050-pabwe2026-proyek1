import PropTypes from 'prop-types';
import { Component } from 'react';

/**
 * Menangkap kesalahan render pada pohon komponen di bawahnya sehingga
 * aplikasi menampilkan pesan yang dapat dipulihkan, bukan layar kosong.
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
    this.handleReload = this.handleReload.bind(this);
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    // Dicatat ke konsol agar dapat ditelusuri saat pengembangan.
    console.error('Kesalahan render tidak tertangani:', error);
  }

  handleReload() {
    this.setState({ hasError: false });
    globalThis.location.reload();
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main id="main-content" className="main">
        <div className="container stack">
          <h1>Terjadi kesalahan</h1>
          <p>Halaman tidak dapat ditampilkan. Muat ulang untuk mencoba lagi.</p>
          <div>
            <button type="button" className="btn btn--primary" onClick={this.handleReload}>
              Muat ulang halaman
            </button>
          </div>
        </div>
      </main>
    );
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
