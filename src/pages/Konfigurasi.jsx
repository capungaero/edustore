import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Save, Edit2, X, Upload, Image } from 'lucide-react';
import initSqlJs from 'sql.js';
import './Konfigurasi.css';

function Konfigurasi() {
  const navigate = useNavigate();
  
  // State untuk jenis pekerjaan dan harga
  const [jenisLista, setJenisLista] = useState([]);
  const [satuanList, setSatuanList] = useState([]);
  const [instansiList, setInstansiList] = useState([]);
  const [priceConfig, setPriceConfig] = useState({});
  const [logo, setLogo] = useState('');
  const [logoPreview, setLogoPreview] = useState('');
  
  // State untuk form
  const [showJenisForm, setShowJenisForm] = useState(false);
  const [showSatuanForm, setShowSatuanForm] = useState(false);
  const [showInstansiForm, setShowInstansiForm] = useState(false);
  
  const [newJenis, setNewJenis] = useState({ nama: '', harga: 0 });
  const [newSatuan, setNewSatuan] = useState('');
  const [newInstansi, setNewInstansi] = useState('');
  
  const [editingJenis, setEditingJenis] = useState(null);

  // Database state
  const [db, setDb] = useState(null);
  const [dbMode, setDbMode] = useState('localStorage'); // 'sqlite' or 'localStorage'
  const [dbFileName, setDbFileName] = useState('');
  const [sqlJsLoaded, setSqlJsLoaded] = useState(false);
  const [SQLFactory, setSQLFactory] = useState(null);

  // Path WASM harus mengikuti base path Vite (agar support subfolder GitHub Pages)
  const SQL_WASM_PATH = import.meta.env.BASE_URL + 'sql-wasm.wasm';

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

    // Load logo
    const savedLogo = localStorage.getItem('appLogo');
    if (savedLogo) {
      setLogo(savedLogo);
      setLogoPreview(savedLogo);
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

  // Load sql.js by fetching the wasm binary first and initialize with wasmBinary
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const wasmUrl = SQL_WASM_PATH;
        const res = await fetch(wasmUrl);
        if (!res.ok) throw new Error('WASM fetch failed: ' + res.status);
        const buffer = await res.arrayBuffer();
        const SQL = await initSqlJs({ wasmBinary: new Uint8Array(buffer) });
        if (!mounted) return;
        setSQLFactory(SQL);
        setSqlJsLoaded(true);

        // Try to load DB from localStorage (if any)
        const dbData = localStorage.getItem('sqliteDb');
        if (dbData) {
          const uInt8Array = new Uint8Array(JSON.parse(dbData));
          setDb(new SQL.Database(uInt8Array));
          setDbMode('sqlite');
        }
      } catch (err) {
        console.error('Failed to initialize sql.js or fetch wasm:', err);
        setSqlJsLoaded(false);
        setSQLFactory(null);
        // keep fallback to localStorage
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Update database to localStorage
  useEffect(() => {
    if (db) {
      const data = db.export();
      localStorage.setItem('sqliteDb', JSON.stringify(Array.from(new Uint8Array(data))));
    }
  }, [db]);

  // Handle upload SQLite file
  const handleDbUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const arrayBuffer = await file.arrayBuffer();
    if (!SQLFactory) {
      alert('sql.js belum siap. Menggunakan localStorage sebagai fallback.');
      // still persist the raw bytes to localStorage for later import
      localStorage.setItem('sqliteDb', JSON.stringify(Array.from(new Uint8Array(arrayBuffer))));
      setDbMode('localStorage');
      return;
    }
    const loadedDb = new SQLFactory.Database(new Uint8Array(arrayBuffer));
    setDb(loadedDb);
    setDbMode('sqlite');
    setDbFileName(file.name);
    // Simpan ke localStorage agar persist
    localStorage.setItem('sqliteDb', JSON.stringify(Array.from(new Uint8Array(arrayBuffer))));
  };

  // Handle export SQLite file
  const handleDbExport = () => {
    if (!db) return;
    const data = db.export();
    const blob = new Blob([data], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = dbFileName || 'palugada-db.sqlite';
    a.click();
    URL.revokeObjectURL(url);
  };

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

  // Handler untuk Logo
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Hanya file gambar yang diperbolehkan!');
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran file maksimal 2MB!');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveLogo = () => {
    if (logoPreview) {
      setLogo(logoPreview);
      localStorage.setItem('appLogo', logoPreview);
      alert('Logo berhasil disimpan!');
    }
  };

  const handleDeleteLogo = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus logo?')) {
      setLogo('');
      setLogoPreview('');
      localStorage.removeItem('appLogo');
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
          <p className="konfigurasi-subtitle">Pengaturan Logo, Jenis Pekerjaan, Satuan, dan Instansi</p>
        </div>
      </header>

      <div className="konfigurasi-content">
        {/* Database SQLite Section */}
        <section className="db-section">
          <h2>Database (SQLite)</h2>
          <div className="db-status-row">
            <span>Status: <b>{dbMode === 'sqlite' ? 'Menggunakan file database SQLite' : 'Menggunakan localStorage browser'}</b></span>
          </div>
          <div className="db-actions-row">
            <label className="db-upload-label">
              <Upload size={18} style={{marginRight: 6}} />
              <span>Load/Import file SQLite</span>
              <input type="file" accept=".sqlite,.db,.sqlite3,application/octet-stream" style={{display:'none'}} onChange={handleDbUpload} />
            </label>
            <button className="db-export-btn" onClick={handleDbExport} disabled={!db} style={{marginLeft: 12}}>
              <Save size={16} style={{marginRight: 4}} /> Export/Download DB
            </button>
          </div>
          <div className="db-filename-row">
            {dbFileName && <span>File aktif: <b>{dbFileName}</b></span>}
          </div>
        </section>

        {/* Logo Aplikasi */}
        <div className="config-section">
          <div className="section-header">
            <h2>Logo Aplikasi</h2>
          </div>

          <div className="logo-config">
            <div className="logo-preview-container">
              {logoPreview ? (
                <div className="logo-preview">
                  <img src={logoPreview} alt="Logo Preview" />
                  <button className="delete-logo-btn" onClick={handleDeleteLogo}>
                    <Trash2 size={16} />
                    Hapus Logo
                  </button>
                </div>
              ) : (
                <div className="logo-placeholder">
                  <Image size={48} color="#9ca3af" />
                  <p>Belum ada logo</p>
                </div>
              )}
            </div>

            <div className="logo-upload-section">
              <label htmlFor="logo-upload" className="upload-label">
                <Upload size={20} />
                Pilih Logo
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  style={{ display: 'none' }}
                />
              </label>
              
              {logoPreview !== logo && logoPreview && (
                <button className="save-logo-btn" onClick={handleSaveLogo}>
                  <Save size={20} />
                  Simpan Logo
                </button>
              )}
              
              <div className="logo-info">
                <p>Format: JPG, PNG, GIF</p>
                <p>Ukuran maksimal: 2MB</p>
                <p>Rekomendasi: 300x300px</p>
              </div>
            </div>
          </div>
        </div>

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
