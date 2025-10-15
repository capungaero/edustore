import { useNavigate } from 'react-router-dom';
import { ShoppingCart, FileText, Wallet, Settings } from 'lucide-react';
import './Home.css';

function Home() {
  const navigate = useNavigate();

  const modules = [
    {
      id: 'order',
      title: 'Order',
      description: 'Kelola pesanan pelanggan',
      icon: ShoppingCart,
      color: '#4F46E5',
      path: '/order'
    },
    {
      id: 'laporan',
      title: 'Laporan',
      description: 'Lihat laporan dan statistik',
      icon: FileText,
      color: '#059669',
      path: '/laporan'
    },
    {
      id: 'keuangan',
      title: 'Keuangan',
      description: 'Manajemen keuangan',
      icon: Wallet,
      color: '#DC2626',
      path: '/keuangan'
    },
    {
      id: 'konfigurasi',
      title: 'Konfigurasi',
      description: 'Pengaturan aplikasi',
      icon: Settings,
      color: '#7C3AED',
      path: '/konfigurasi'
    }
  ];

  return (
    <div className="home-container">
      <header className="home-header">
        <h1 className="home-title">Manajemen Order</h1>
        <p className="home-subtitle">Sistem Manajemen Pesanan Terintegrasi</p>
      </header>

      <div className="modules-grid">
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <div
              key={module.id}
              className="module-card"
              onClick={() => navigate(module.path)}
              style={{ '--module-color': module.color }}
            >
              <div className="module-icon-wrapper">
                <Icon className="module-icon" size={48} />
              </div>
              <h2 className="module-title">{module.title}</h2>
              <p className="module-description">{module.description}</p>
            </div>
          );
        })}
      </div>

      <footer className="home-footer">
        <p>&copy; 2025 Manajemen Order. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
