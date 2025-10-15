import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Save, X } from 'lucide-react';
import './Order.css';

function Order() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [priceConfig, setPriceConfig] = useState({});
  const [formData, setFormData] = useState({
    pekerjaan: 'fotocopy',
    deadline: '',
    satuan: 'lembar',
    jumlah: 1,
    harga: 0,
    keterangan: ''
  });

  // Load price config from localStorage
  useEffect(() => {
    const savedConfig = localStorage.getItem('priceConfig');
    if (savedConfig) {
      setPriceConfig(JSON.parse(savedConfig));
    } else {
      // Default prices
      const defaultPrices = {
        fotocopy: 500,
        cetak: 1000,
        print: 1500,
        jilid: 5000
      };
      setPriceConfig(defaultPrices);
      localStorage.setItem('priceConfig', JSON.stringify(defaultPrices));
    }

    // Load orders from localStorage
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  // Update harga when pekerjaan changes
  useEffect(() => {
    if (priceConfig[formData.pekerjaan]) {
      setFormData(prev => ({
        ...prev,
        harga: priceConfig[formData.pekerjaan]
      }));
    }
  }, [formData.pekerjaan, priceConfig]);

  const generateOrderId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `ORD-${timestamp}-${random}`;
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

  const calculateTotal = () => {
    return formData.harga * formData.jumlah;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newOrder = {
      id: generateOrderId(),
      ...formData,
      tglMasuk: getCurrentDate(),
      total: calculateTotal(),
      status: 'pending'
    };

    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));

    // Reset form
    setFormData({
      pekerjaan: 'fotocopy',
      deadline: '',
      satuan: 'lembar',
      jumlah: 1,
      harga: priceConfig['fotocopy'] || 0,
      keterangan: ''
    });
    setShowForm(false);
  };

  const handleDelete = (orderId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pesanan ini?')) {
      const updatedOrders = orders.filter(order => order.id !== orderId);
      setOrders(updatedOrders);
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
    }
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

  return (
    <div className="order-container">
      <header className="order-header">
        <button className="back-button" onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
          Kembali
        </button>
        <div className="header-content">
          <h1 className="order-title">Manajemen Order</h1>
          <p className="order-subtitle">Kelola semua pesanan pelanggan</p>
        </div>
        <button className="add-order-button" onClick={() => setShowForm(true)}>
          <Plus size={20} />
          Tambah Order
        </button>
      </header>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Tambah Order Baru</h2>
              <button className="close-button" onClick={() => setShowForm(false)}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="order-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="pekerjaan">Jenis Pekerjaan</label>
                  <select
                    id="pekerjaan"
                    name="pekerjaan"
                    value={formData.pekerjaan}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="fotocopy">Fotocopy</option>
                    <option value="cetak">Cetak</option>
                    <option value="print">Print</option>
                    <option value="jilid">Jilid</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="deadline">Deadline</label>
                  <input
                    type="date"
                    id="deadline"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    min={getCurrentDate()}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="satuan">Satuan</label>
                  <select
                    id="satuan"
                    name="satuan"
                    value={formData.satuan}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="pcs">Pcs</option>
                    <option value="lembar">Lembar</option>
                    <option value="lembar bolak balik">Lembar Bolak Balik</option>
                    <option value="unit">Unit</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="jumlah">Jumlah</label>
                  <input
                    type="number"
                    id="jumlah"
                    name="jumlah"
                    value={formData.jumlah}
                    onChange={handleInputChange}
                    min="1"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="harga">Harga Satuan</label>
                  <input
                    type="number"
                    id="harga"
                    name="harga"
                    value={formData.harga}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Total</label>
                  <div className="total-display">{formatCurrency(calculateTotal())}</div>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="keterangan">Keterangan</label>
                  <textarea
                    id="keterangan"
                    name="keterangan"
                    value={formData.keterangan}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Masukkan keterangan tambahan..."
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={() => setShowForm(false)}>
                  Batal
                </button>
                <button type="submit" className="submit-button">
                  <Save size={20} />
                  Simpan Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="orders-content">
        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>Belum Ada Order</h3>
            <p>Klik tombol "Tambah Order" untuk membuat pesanan baru</p>
          </div>
        ) : (
          <div className="orders-table-wrapper">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>ID Pesanan</th>
                  <th>Pekerjaan</th>
                  <th>Tgl Masuk</th>
                  <th>Deadline</th>
                  <th>Satuan</th>
                  <th>Jumlah</th>
                  <th>Harga</th>
                  <th>Total</th>
                  <th>Keterangan</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="order-id">{order.id}</td>
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
                    <td className="keterangan">{order.keterangan || '-'}</td>
                    <td>
                      <button
                        className="delete-button"
                        onClick={() => handleDelete(order.id)}
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

export default Order;
