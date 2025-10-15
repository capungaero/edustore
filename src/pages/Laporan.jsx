import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, FileText, Calendar, TrendingUp, Download } from 'lucide-react';
import './Laporan.css';

function Laporan() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterInstansi, setFilterInstansi] = useState('semua');
  const [filterPekerjaan, setFilterPekerjaan] = useState('semua');
  const [filterStatus, setFilterStatus] = useState('semua');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [instansiList, setInstansiList] = useState([]);
  const [jenisLista, setJenisLista] = useState([]);

  useEffect(() => {
    // Load orders
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      const ordersData = JSON.parse(savedOrders);
      setOrders(ordersData);
      setFilteredOrders(ordersData);
    }

    // Load instansi list
    const savedInstansi = localStorage.getItem('instansiList');
    if (savedInstansi) {
      setInstansiList(JSON.parse(savedInstansi));
    }

    // Load jenis pekerjaan
    const savedJenis = localStorage.getItem('jenisLista');
    if (savedJenis) {
      setJenisLista(JSON.parse(savedJenis));
    }
  }, []);

  useEffect(() => {
    let result = [...orders];

    // Search filter
    if (searchTerm) {
      result = result.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.namaPemesan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.instansi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.pekerjaan?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Instansi filter
    if (filterInstansi !== 'semua') {
      result = result.filter(order => order.instansi === filterInstansi);
    }

    // Pekerjaan filter
    if (filterPekerjaan !== 'semua') {
      result = result.filter(order => order.pekerjaan === filterPekerjaan);
    }

    // Status filter
    if (filterStatus !== 'semua') {
      result = result.filter(order => order.status === filterStatus);
    }

    // Date range filter
    if (dateFrom) {
      result = result.filter(order => new Date(order.tglMasuk) >= new Date(dateFrom));
    }
    if (dateTo) {
      result = result.filter(order => new Date(order.tglMasuk) <= new Date(dateTo));
    }

    setFilteredOrders(result);
  }, [searchTerm, filterInstansi, filterPekerjaan, filterStatus, dateFrom, dateTo, orders]);

  const getTotalRevenue = () => {
    return filteredOrders.reduce((sum, order) => sum + (order.total || 0), 0);
  };

  const getTotalOrders = () => {
    return filteredOrders.length;
  };

  const getAverageOrderValue = () => {
    const total = getTotalRevenue();
    const count = getTotalOrders();
    return count > 0 ? total / count : 0;
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

  const handleExport = () => {
    const csvContent = [
      ['ID Pesanan', 'Nama Pemesan', 'Instansi', 'Pekerjaan', 'Tgl Masuk', 'Deadline', 'Satuan', 'Jumlah', 'Harga', 'Total', 'Status', 'Keterangan'],
      ...filteredOrders.map(order => [
        order.id,
        order.namaPemesan || '-',
        order.instansi || '-',
        order.pekerjaan,
        order.tglMasuk,
        order.deadline,
        order.satuan,
        order.jumlah,
        order.harga,
        order.total,
        order.status,
        order.keterangan || '-'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `laporan-order-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterInstansi('semua');
    setFilterPekerjaan('semua');
    setFilterStatus('semua');
    setDateFrom('');
    setDateTo('');
  };

  return (
    <div className="laporan-container">
      <header className="laporan-header">
        <button className="back-button" onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
          Kembali
        </button>
        <div className="header-content">
          <h1 className="laporan-title">Laporan Order</h1>
          <p className="laporan-subtitle">Analisis dan laporan data pesanan</p>
        </div>
        <button className="export-button" onClick={handleExport}>
          <Download size={20} />
          Export CSV
        </button>
      </header>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#dbeafe' }}>
            <FileText size={24} color="#1e40af" />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Order</p>
            <p className="stat-value">{getTotalOrders()}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#dcfce7' }}>
            <TrendingUp size={24} color="#15803d" />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Pendapatan</p>
            <p className="stat-value">{formatCurrency(getTotalRevenue())}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef3c7' }}>
            <Calendar size={24} color="#92400e" />
          </div>
          <div className="stat-content">
            <p className="stat-label">Rata-rata/Order</p>
            <p className="stat-value">{formatCurrency(getAverageOrderValue())}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Cari berdasarkan ID, nama pemesan, instansi, atau pekerjaan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters-row">
          <div className="filter-group">
            <label>Instansi</label>
            <select value={filterInstansi} onChange={(e) => setFilterInstansi(e.target.value)}>
              <option value="semua">Semua Instansi</option>
              {instansiList.map((instansi, index) => (
                <option key={index} value={instansi}>{instansi}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Pekerjaan</label>
            <select value={filterPekerjaan} onChange={(e) => setFilterPekerjaan(e.target.value)}>
              <option value="semua">Semua Pekerjaan</option>
              {jenisLista.map((jenis) => (
                <option key={jenis.id} value={jenis.nama}>{jenis.nama.charAt(0).toUpperCase() + jenis.nama.slice(1)}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Status</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="semua">Semua Status</option>
              <option value="pending">Pending</option>
              <option value="proses">Proses</option>
              <option value="selesai">Selesai</option>
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

      {/* Orders Table */}
      <div className="laporan-content">
        {filteredOrders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <h3>Tidak Ada Data</h3>
            <p>Tidak ada order yang sesuai dengan filter yang dipilih</p>
          </div>
        ) : (
          <div className="orders-table-wrapper">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>ID Pesanan</th>
                  <th>Nama Pemesan</th>
                  <th>Instansi</th>
                  <th>Pekerjaan</th>
                  <th>Tgl Masuk</th>
                  <th>Deadline</th>
                  <th>Satuan</th>
                  <th>Jumlah</th>
                  <th>Harga</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="order-id">{order.id}</td>
                    <td className="nama-pemesan">{order.namaPemesan || '-'}</td>
                    <td><span className="instansi-badge">{order.instansi || '-'}</span></td>
                    <td>
                      <span className={`badge badge-${order.pekerjaan}`}>
                        {order.pekerjaan.charAt(0).toUpperCase() + order.pekerjaan.slice(1)}
                      </span>
                    </td>
                    <td>{formatDate(order.tglMasuk)}</td>
                    <td>{formatDate(order.deadline)}</td>
                    <td>{order.satuan}</td>
                    <td className="text-center">{order.jumlah}</td>
                    <td>{formatCurrency(order.harga)}</td>
                    <td className="total-amount">{formatCurrency(order.total)}</td>
                    <td>
                      <span className={`status-badge status-${order.status}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
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

export default Laporan;
