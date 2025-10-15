import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Save, Edit2, X } from 'lucide-react';
import './Konfigurasi.css';

function Konfigurasi() {
  const navigate = useNavigate();
  
  // State untuk jenis pekerjaan dan harga
  const [jenisLista, setJenisLista] = useState([]);
  const [satuanList, setSatuanList] = useState([]);
  const [instansiList, setInstansiList] = useState([]);
  const [priceConfig, setPriceConfig] = useState({});
  
  // State untuk form
  const [showJenisForm, setShowJenisForm] = useState(false);
  const [showSatuanForm, setShowSatuanForm] = useState(false);
  const [showInstansiForm, setShowInstansiForm] = useState(false);
  
  const [newJenis, setNewJenis] = useState({ nama: '', harga: 0 });
  const [newSatuan, setNewSatuan] = useState('');
  const [newInstansi, setNewInstansi] = useState('');
  
  const [editingJenis, setEditingJenis] = useState(null);

  // Load data dari localStorage
  useEffect(() => {
    // Load jenis pekerjaan
    const savedJenis = localStorage.getItem('jenisLista');
    if (savedJenis) {
      setJenisLista(JSON.parse(savedJenis));
    } else {
      const defaultJenis = [
        { id: 1, nama: 'fotocopy', harga: 500 },
        { id: 2, nama: 'cetak', harga: 1000 },
        { id: 3, nama: 'print', harga: 1500 },
        { id: 4, nama: 'jilid', harga: 5000 }
      ];
      setJenisLista(defaultJenis);
      localStorage.setItem('jenisLista', JSON.stringify(defaultJenis));
    }

    // Load satuan
    const savedSatuan = localStorage.getItem('satuanList');
    if (savedSatuan) {
      setSatuanList(JSON.parse(savedSatuan));
    } else {
      const defaultSatuan = ['pcs', 'lembar', 'lembar bolak balik', 'unit'];
      setSatuanList(defaultSatuan);
      localStorage.setItem('satuanList', JSON.stringify(defaultSatuan));
    }

    // Load instansi
    const savedInstansi = localStorage.getItem('instansiList');
    if (savedInstansi) {
      setInstansiList(JSON.parse(savedInstansi));
    } else {
      const defaultInstansi = ['TK', 'SD', 'SMP', 'SMA'];
      setInstansiList(defaultInstansi);
      localStorage.setItem('instansiList', JSON.stringify(defaultInstansi));
    }

    // Load price config
    const savedPrice = localStorage.getItem('priceConfig');
    if (savedPrice) {
      setPriceConfig(JSON.parse(savedPrice));
    }
  }, []);

  // Update price config saat jenis berubah
  useEffect(() => {
    const newPriceConfig = {};
    jenisLista.forEach(jenis => {
      newPriceConfig[jenis.nama] = jenis.harga;
    });
    setPriceConfig(newPriceConfig);
    localStorage.setItem('priceConfig', JSON.stringify(newPriceConfig));
  }, [jenisLista]);

  // Handlers untuk Jenis Pekerjaan
  const handleAddJenis = () => {
    if (newJenis.nama && newJenis.harga > 0) {
      const jenis = {
        id: Date.now(),
        nama: newJenis.nama.toLowerCase(),
        harga: parseInt(newJenis.harga)
      };
      const updated = [...jenisLista, jenis];
      setJenisLista(updated);
      localStorage.setItem('jenisLista', JSON.stringify(updated));
      setNewJenis({ nama: '', harga: 0 });
      setShowJenisForm(false);
    }
  };

  const handleEditJenis = (jenis) => {
    setEditingJenis(jenis);
    setNewJenis({ nama: jenis.nama, harga: jenis.harga });
    setShowJenisForm(true);
  };

  const handleUpdateJenis = () => {
    if (editingJenis && newJenis.nama && newJenis.harga > 0) {
      const updated = jenisLista.map(j => 
        j.id === editingJenis.id 
          ? { ...j, nama: newJenis.nama.toLowerCase(), harga: parseInt(newJenis.harga) }
          : j
      );
      setJenisLista(updated);
      localStorage.setItem('jenisLista', JSON.stringify(updated));
      setNewJenis({ nama: '', harga: 0 });
      setEditingJenis(null);
      setShowJenisForm(false);
    }
  };

  const handleDeleteJenis = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus jenis pekerjaan ini?')) {
      const updated = jenisLista.filter(j => j.id !== id);
      setJenisLista(updated);
      localStorage.setItem('jenisLista', JSON.stringify(updated));
    }
  };

  // Handlers untuk Satuan
  const handleAddSatuan = () => {
    if (newSatuan.trim()) {
      const updated = [...satuanList, newSatuan.trim()];
      setSatuanList(updated);
      localStorage.setItem('satuanList', JSON.stringify(updated));
      setNewSatuan('');
      setShowSatuanForm(false);
    }
  };

  const handleDeleteSatuan = (index) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus satuan ini?')) {
      const updated = satuanList.filter((_, i) => i !== index);
      setSatuanList(updated);
      localStorage.setItem('satuanList', JSON.stringify(updated));
    }
  };

  // Handlers untuk Instansi
  const handleAddInstansi = () => {
    if (newInstansi.trim()) {
      const updated = [...instansiList, newInstansi.trim()];
      setInstansiList(updated);
      localStorage.setItem('instansiList', JSON.stringify(updated));
      setNewInstansi('');
      setShowInstansiForm(false);
    }
  };

  const handleDeleteInstansi = (index) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus instansi ini?')) {
      const updated = instansiList.filter((_, i) => i !== index);
      setInstansiList(updated);
      localStorage.setItem('instansiList', JSON.stringify(updated));
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="konfigurasi-container">
      <header className="konfigurasi-header">
        <button className="back-button" onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
          Kembali
        </button>
        <div className="header-content">
          <h1 className="konfigurasi-title">Konfigurasi</h1>
          <p className="konfigurasi-subtitle">Pengaturan Jenis Pekerjaan, Satuan, dan Instansi</p>
        </div>
      </header>

      <div className="konfigurasi-content">
        {/* Jenis Pekerjaan & Harga */}
        <div className="config-section">
          <div className="section-header">
            <h2>Jenis Pekerjaan & Harga</h2>
            <button className="add-button" onClick={() => { setShowJenisForm(true); setEditingJenis(null); setNewJenis({ nama: '', harga: 0 }); }}>
              <Plus size={20} />
              Tambah Jenis
            </button>
          </div>

          {showJenisForm && (
            <div className="inline-form">
              <input
                type="text"
                placeholder="Nama Pekerjaan"
                value={newJenis.nama}
                onChange={(e) => setNewJenis({ ...newJenis, nama: e.target.value })}
              />
              <input
                type="number"
                placeholder="Harga"
                value={newJenis.harga}
                onChange={(e) => setNewJenis({ ...newJenis, harga: e.target.value })}
              />
              <button className="save-btn" onClick={editingJenis ? handleUpdateJenis : handleAddJenis}>
                <Save size={18} />
                {editingJenis ? 'Update' : 'Simpan'}
              </button>
              <button className="cancel-btn" onClick={() => { setShowJenisForm(false); setEditingJenis(null); setNewJenis({ nama: '', harga: 0 }); }}>
                <X size={18} />
              </button>
            </div>
          )}

          <div className="items-grid">
            {jenisLista.map((jenis) => (
              <div key={jenis.id} className="item-card">
                <div className="item-info">
                  <h3>{jenis.nama.charAt(0).toUpperCase() + jenis.nama.slice(1)}</h3>
                  <p className="price">{formatCurrency(jenis.harga)}</p>
                </div>
                <div className="item-actions">
                  <button className="edit-btn" onClick={() => handleEditJenis(jenis)}>
                    <Edit2 size={16} />
                  </button>
                  <button className="delete-btn" onClick={() => handleDeleteJenis(jenis.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Satuan */}
        <div className="config-section">
          <div className="section-header">
            <h2>Satuan</h2>
            <button className="add-button" onClick={() => setShowSatuanForm(true)}>
              <Plus size={20} />
              Tambah Satuan
            </button>
          </div>

          {showSatuanForm && (
            <div className="inline-form">
              <input
                type="text"
                placeholder="Nama Satuan"
                value={newSatuan}
                onChange={(e) => setNewSatuan(e.target.value)}
              />
              <button className="save-btn" onClick={handleAddSatuan}>
                <Save size={18} />
                Simpan
              </button>
              <button className="cancel-btn" onClick={() => { setShowSatuanForm(false); setNewSatuan(''); }}>
                <X size={18} />
              </button>
            </div>
          )}

          <div className="items-list">
            {satuanList.map((satuan, index) => (
              <div key={index} className="list-item">
                <span>{satuan}</span>
                <button className="delete-btn-small" onClick={() => handleDeleteSatuan(index)}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Instansi */}
        <div className="config-section">
          <div className="section-header">
            <h2>Instansi</h2>
            <button className="add-button" onClick={() => setShowInstansiForm(true)}>
              <Plus size={20} />
              Tambah Instansi
            </button>
          </div>

          {showInstansiForm && (
            <div className="inline-form">
              <input
                type="text"
                placeholder="Nama Instansi"
                value={newInstansi}
                onChange={(e) => setNewInstansi(e.target.value)}
              />
              <button className="save-btn" onClick={handleAddInstansi}>
                <Save size={18} />
                Simpan
              </button>
              <button className="cancel-btn" onClick={() => { setShowInstansiForm(false); setNewInstansi(''); }}>
                <X size={18} />
              </button>
            </div>
          )}

          <div className="items-list">
            {instansiList.map((instansi, index) => (
              <div key={index} className="list-item">
                <span>{instansi}</span>
                <button className="delete-btn-small" onClick={() => handleDeleteInstansi(index)}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Konfigurasi;
