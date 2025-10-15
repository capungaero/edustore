import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './Keuangan.css';

function Keuangan() {
  const navigate = useNavigate();

  return (
    <div className="keuangan-container">
      <header className="keuangan-header">
        <button className="back-button" onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
          Kembali
        </button>
        <div className="header-content">
          <h1 className="keuangan-title">Keuangan</h1>
          <p className="keuangan-subtitle">Halaman dalam pengembangan</p>
        </div>
      </header>
    </div>
  );
}

export default Keuangan;
