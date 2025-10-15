import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './Konfigurasi.css';

function Konfigurasi() {
  const navigate = useNavigate();

  return (
    <div className="konfigurasi-container">
      <header className="konfigurasi-header">
        <button className="back-button" onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
          Kembali
        </button>
        <div className="header-content">
          <h1 className="konfigurasi-title">Konfigurasi</h1>
          <p className="konfigurasi-subtitle">Halaman dalam pengembangan</p>
        </div>
      </header>
    </div>
  );
}

export default Konfigurasi;
