import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './Laporan.css';

function Laporan() {
  const navigate = useNavigate();

  return (
    <div className="laporan-container">
      <header className="laporan-header">
        <button className="back-button" onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
          Kembali
        </button>
        <div className="header-content">
          <h1 className="laporan-title">Laporan</h1>
          <p className="laporan-subtitle">Halaman dalam pengembangan</p>
        </div>
      </header>
    </div>
  );
}

export default Laporan;
