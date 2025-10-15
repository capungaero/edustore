import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, TrendingUp, TrendingDown, DollarSign, Search, Save, X, Trash2 } from 'lucide-react';
import './Keuangan.css';

function Keuangan() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('semua');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  
  const [formData, setFormData] = useState({
    type: 'masuk',
    kategori: '',
    deskripsi: '',
    jumlah: 0,
    tanggal: '',
    keterangan: ''
  });

  useEffect(() => {
    // Load transactions from localStorage
    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) {
      const transData = JSON.parse(savedTransactions);
      setTransactions(transData);
      setFilteredTransactions(transData);
    }
  }, []);

  useEffect(() => {
    let result = [...transactions];

    // Search filter
    if (searchTerm) {
      result = result.filter(trans => 
        trans.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trans.kategori?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trans.deskripsi?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (filterType !== 'semua') {
      result = result.filter(trans => trans.type === filterType);
    }

    // Date range filter
    if (dateFrom) {
      result = result.filter(trans => new Date(trans.tanggal) >= new Date(dateFrom));
    }
    if (dateTo) {
      result = result.filter(trans => new Date(trans.tanggal) <= new Date(dateTo));
    }

    setFilteredTransactions(result);
  }, [searchTerm, filterType, dateFrom, dateTo, transactions]);

  const generateTransactionId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `TRX-${timestamp}-${random}`;
  };

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newTransaction = {
      id: generateTransactionId(),
      ...formData,
      jumlah: parseFloat(formData.jumlah),
      createdAt: new Date().toISOString()
    };

    const updatedTransactions = [...transactions, newTransaction];
    setTransactions(updatedTransactions);
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));

    // Reset form
    setFormData({
      type: 'masuk',
      kategori: '',
      deskripsi: '',
      jumlah: 0,
      tanggal: '',
      keterangan: ''
    });
    setShowForm(false);
  };

  const handleDelete = (transId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
      const updatedTransactions = transactions.filter(trans => trans.id !== transId);
      setTransactions(updatedTransactions);
      localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
    }
  };

  const getTotalMasuk = () => {
    return filteredTransactions
      .filter(trans => trans.type === 'masuk')
      .reduce((sum, trans) => sum + trans.jumlah, 0);
  };

  const getTotalKeluar = () => {
    return filteredTransactions
      .filter(trans => trans.type === 'keluar')
      .reduce((sum, trans) => sum + trans.jumlah, 0);
  };

  const getSaldo = () => {
    return getTotalMasuk() - getTotalKeluar();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterType('semua');
    setDateFrom('');
    setDateTo('');
  };

  return (
    <div className="keuangan-container">
      <header className="keuangan-header">
        <button className="back-button" onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
          Kembali
        </button>
        <div className="header-content">
          <h1 className="keuangan-title">Manajemen Keuangan</h1>
          <p className="keuangan-subtitle">Kelola transaksi dan rekapitulasi keuangan</p>
        </div>
        <button className="add-transaction-button" onClick={() => setShowForm(true)}>
          <Plus size={20} />
          Tambah Transaksi
        </button>
      </header>

      {/* Modal Form */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Tambah Transaksi Baru</h2>
              <button className="close-button" onClick={() => setShowForm(false)}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="transaction-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="type">Jenis Transaksi</label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="masuk">Transaksi Masuk</option>
                    <option value="keluar">Transaksi Keluar</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="kategori">Kategori</label>
                  <input
                    type="text"
                    id="kategori"
                    name="kategori"
                    value={formData.kategori}
                    onChange={handleInputChange}
                    placeholder="Misal: Penjualan, Gaji, Operasional..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="deskripsi">Deskripsi</label>
                  <input
                    type="text"
                    id="deskripsi"
                    name="deskripsi"
                    value={formData.deskripsi}
                    onChange={handleInputChange}
                    placeholder="Deskripsi transaksi..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="jumlah">Jumlah (Rp)</label>
                  <input
                    type="number"
                    id="jumlah"
                    name="jumlah"
                    value={formData.jumlah}
                    onChange={handleInputChange}
                    min="0"
                    step="1000"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="tanggal">Tanggal</label>
                  <input
                    type="date"
                    id="tanggal"
                    name="tanggal"
                    value={formData.tanggal}
                    onChange={handleInputChange}
                    max={getCurrentDate()}
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="keterangan">Keterangan</label>
                  <textarea
                    id="keterangan"
                    name="keterangan"
                    value={formData.keterangan}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Keterangan tambahan (opsional)..."
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={() => setShowForm(false)}>
                  Batal
                </button>
                <button type="submit" className="submit-button">
                  <Save size={20} />
                  Simpan Transaksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rekapitulasi Cards */}
      <div className="rekap-grid">
        <div className="rekap-card masuk">
          <div className="rekap-icon">
            <TrendingUp size={32} />
          </div>
          <div className="rekap-content">
            <p className="rekap-label">Total Masuk</p>
            <p className="rekap-value">{formatCurrency(getTotalMasuk())}</p>
          </div>
        </div>

        <div className="rekap-card keluar">
          <div className="rekap-icon">
            <TrendingDown size={32} />
          </div>
          <div className="rekap-content">
            <p className="rekap-label">Total Keluar</p>
            <p className="rekap-value">{formatCurrency(getTotalKeluar())}</p>
          </div>
        </div>

        <div className="rekap-card saldo">
          <div className="rekap-icon">
            <DollarSign size={32} />
          </div>
          <div className="rekap-content">
            <p className="rekap-label">Saldo</p>
            <p className="rekap-value">{formatCurrency(getSaldo())}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Cari berdasarkan ID, kategori, atau deskripsi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters-row">
          <div className="filter-group">
            <label>Jenis Transaksi</label>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="semua">Semua Transaksi</option>
              <option value="masuk">Transaksi Masuk</option>
              <option value="keluar">Transaksi Keluar</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Dari Tanggal</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Sampai Tanggal</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>

          <button className="reset-button" onClick={resetFilters}>
            Reset Filter
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="transactions-content">
        {filteredTransactions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💰</div>
            <h3>Belum Ada Transaksi</h3>
            <p>Klik tombol "Tambah Transaksi" untuk mencatat transaksi baru</p>
          </div>
        ) : (
          <div className="transactions-table-wrapper">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>ID Transaksi</th>
                  <th>Tanggal</th>
                  <th>Jenis</th>
                  <th>Kategori</th>
                  <th>Deskripsi</th>
                  <th>Jumlah</th>
                  <th>Keterangan</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((trans) => (
                  <tr key={trans.id}>
                    <td className="trans-id">{trans.id}</td>
                    <td>{formatDate(trans.tanggal)}</td>
                    <td>
                      <span className={`type-badge type-${trans.type}`}>
                        {trans.type === 'masuk' ? (
                          <><TrendingUp size={16} /> Masuk</>
                        ) : (
                          <><TrendingDown size={16} /> Keluar</>
                        )}
                      </span>
                    </td>
                    <td className="kategori">{trans.kategori}</td>
                    <td>{trans.deskripsi}</td>
                    <td className={`amount ${trans.type === 'masuk' ? 'masuk' : 'keluar'}`}>
                      {trans.type === 'masuk' ? '+' : '-'} {formatCurrency(trans.jumlah)}
                    </td>
                    <td className="keterangan">{trans.keterangan || '-'}</td>
                    <td>
                      <button
                        className="delete-button"
                        onClick={() => handleDelete(trans.id)}
                        title="Hapus"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Keuangan;
