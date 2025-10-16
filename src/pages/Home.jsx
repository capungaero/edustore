import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, FileText, Wallet, Settings, Calendar, TrendingUp, TrendingDown, Bell, Plus, X, ChevronLeft, ChevronRight, Edit2, Save } from 'lucide-react';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [newReminder, setNewReminder] = useState('');
  const [logo, setLogo] = useState('');
  
  // Calendar states
  const [currentWeekStart, setCurrentWeekStart] = useState(getStartOfWeek(new Date()));
  const [agendas, setAgendas] = useState({});
  const [editingDate, setEditingDate] = useState(null);
  const [agendaInput, setAgendaInput] = useState('');

  useEffect(() => {
    // Load orders
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }

    // Load transactions
    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }

    // Load reminders
    const savedReminders = localStorage.getItem('reminders');
    if (savedReminders) {
      setReminders(JSON.parse(savedReminders));
    }

    // Load agendas
    const savedAgendas = localStorage.getItem('agendas');
    if (savedAgendas) {
      setAgendas(JSON.parse(savedAgendas));
    }

    // Load logo
    const savedLogo = localStorage.getItem('appLogo');
    if (savedLogo) {
      setLogo(savedLogo);
    }
  }, []);

  // Get start of week (Monday)
  function getStartOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(d.setDate(diff));
  }

  // Generate week days
  const getWeekDays = () => {
    const days = [];
    const start = new Date(currentWeekStart);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      days.push(date);
    }
    
    return days;
  };

  // Navigate weeks
  const goToPreviousWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeekStart(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeekStart(newDate);
  };

  const goToToday = () => {
    setCurrentWeekStart(getStartOfWeek(new Date()));
  };

  // Format date key for agenda storage
  const getDateKey = (date) => {
    return date.toISOString().split('T')[0];
  };

  // Add/Edit agenda
  const handleAddAgenda = (dateKey) => {
    if (agendaInput.trim()) {
      const updatedAgendas = {
        ...agendas,
        [dateKey]: [...(agendas[dateKey] || []), { id: Date.now(), text: agendaInput.trim() }]
      };
      setAgendas(updatedAgendas);
      localStorage.setItem('agendas', JSON.stringify(updatedAgendas));
      setAgendaInput('');
      setEditingDate(null);
    }
  };

  // Delete agenda item
  const handleDeleteAgenda = (dateKey, agendaId) => {
    const updatedAgendas = {
      ...agendas,
      [dateKey]: agendas[dateKey].filter(a => a.id !== agendaId)
    };
    setAgendas(updatedAgendas);
    localStorage.setItem('agendas', JSON.stringify(updatedAgendas));
  };

  // Check if date is today
  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

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

  // Get current month orders
  const getCurrentMonthOrders = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return orders.filter(order => {
      const orderDate = new Date(order.tglMasuk);
      return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
    });
  };

  // Get upcoming deadlines (nearest 5)
  const getUpcomingDeadlines = () => {
    const now = new Date();
    return orders
      .filter(order => new Date(order.deadline) >= now)
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
      .slice(0, 5);
  };

  // Get total income
  const getTotalIncome = () => {
    return transactions
      .filter(trans => trans.type === 'masuk')
      .reduce((sum, trans) => sum + trans.jumlah, 0);
  };

  // Get total expenses
  const getTotalExpenses = () => {
    return transactions
      .filter(trans => trans.type === 'keluar')
      .reduce((sum, trans) => sum + trans.jumlah, 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const getDaysUntil = (dateString) => {
    const now = new Date();
    const deadline = new Date(dateString);
    const diffTime = deadline - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleAddReminder = () => {
    if (newReminder.trim()) {
      const reminder = {
        id: Date.now(),
        text: newReminder,
        createdAt: new Date().toISOString()
      };
      const updatedReminders = [...reminders, reminder];
      setReminders(updatedReminders);
      localStorage.setItem('reminders', JSON.stringify(updatedReminders));
      setNewReminder('');
      setShowReminderForm(false);
    }
  };

  const handleDeleteReminder = (id) => {
    const updatedReminders = reminders.filter(r => r.id !== id);
    setReminders(updatedReminders);
    localStorage.setItem('reminders', JSON.stringify(updatedReminders));
  };

  return (
    <div className="home-container">
      <header className="home-header">
        {logo && (
          <div className="app-logo">
            <img src={logo} alt="Logo" />
          </div>
        )}
      </header>

      <div className="home-content">
        {/* Modules Grid - 2x2 */}
        <div className="modules-section">
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
                    <Icon className="module-icon" size={40} />
                  </div>
                  <h2 className="module-title">{module.title}</h2>
                  <p className="module-description">{module.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Statistics Panel */}
        <div className="statistics-panel">
          {/* Total Order Bulan Ini */}
          <div className="stat-box">
            <div className="stat-header">
              <h3>Order Bulan Ini</h3>
              <Calendar size={20} color="#4F46E5" />
            </div>
            <div className="stat-value">{getCurrentMonthOrders().length}</div>
            <div className="stat-label">Total Pesanan</div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="stat-box deadlines-box">
            <div className="stat-header">
              <h3>Deadline Terdekat</h3>
              <Bell size={20} color="#DC2626" />
            </div>
            <div className="deadlines-list">
              {getUpcomingDeadlines().length === 0 ? (
                <p className="no-data">Tidak ada deadline</p>
              ) : (
                getUpcomingDeadlines().map(order => {
                  const daysUntil = getDaysUntil(order.deadline);
                  return (
                    <div key={order.id} className="deadline-item">
                      <div className="deadline-info">
                        <div className="deadline-name">{order.namaPemesan || order.id}</div>
                        <div className="deadline-work">{order.pekerjaan}</div>
                      </div>
                      <div className={`deadline-days ${daysUntil <= 2 ? 'urgent' : ''}`}>
                        {daysUntil === 0 ? 'Hari ini' : daysUntil === 1 ? 'Besok' : `${daysUntil} hari`}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Income & Expenses */}
          <div className="finance-boxes">
            <div className="stat-box income-box">
              <div className="stat-header">
                <h3>Pemasukan</h3>
                <TrendingUp size={20} color="#10b981" />
              </div>
              <div className="stat-value finance">{formatCurrency(getTotalIncome())}</div>
            </div>

            <div className="stat-box expense-box">
              <div className="stat-header">
                <h3>Pengeluaran</h3>
                <TrendingDown size={20} color="#ef4444" />
              </div>
              <div className="stat-value finance">{formatCurrency(getTotalExpenses())}</div>
            </div>
          </div>

          {/* Reminders */}
          <div className="stat-box reminders-box">
            <div className="stat-header">
              <h3>Reminder</h3>
              <button className="add-reminder-btn" onClick={() => setShowReminderForm(true)}>
                <Plus size={18} />
              </button>
            </div>
            
            {showReminderForm && (
              <div className="reminder-form">
                <input
                  type="text"
                  placeholder="Tulis reminder..."
                  value={newReminder}
                  onChange={(e) => setNewReminder(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddReminder()}
                  autoFocus
                />
                <div className="reminder-form-actions">
                  <button onClick={handleAddReminder} className="save-btn">Simpan</button>
                  <button onClick={() => { setShowReminderForm(false); setNewReminder(''); }} className="cancel-btn">Batal</button>
                </div>
              </div>
            )}

            <div className="reminders-list">
              {reminders.length === 0 ? (
                <p className="no-data">Belum ada reminder</p>
              ) : (
                reminders.map(reminder => (
                  <div key={reminder.id} className="reminder-item">
                    <div className="reminder-text">{reminder.text}</div>
                    <button 
                      className="delete-reminder-btn" 
                      onClick={() => handleDeleteReminder(reminder.id)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Calendar Panel */}
      <div className="calendar-panel">
        <div className="calendar-header">
          <div className="calendar-title-section">
            <Calendar size={24} color="#4F46E5" />
            <h2>Kalender Mingguan & Agenda</h2>
          </div>
          <div className="calendar-navigation">
            <button onClick={goToPreviousWeek} className="nav-btn">
              <ChevronLeft size={20} />
            </button>
            <button onClick={goToToday} className="today-btn">
              Hari Ini
            </button>
            <button onClick={goToNextWeek} className="nav-btn">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="calendar-week">
          {getWeekDays().map((date, index) => {
            const dateKey = getDateKey(date);
            const dayAgendas = agendas[dateKey] || [];
            const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
            
            return (
              <div 
                key={index} 
                className={`calendar-day ${isToday(date) ? 'today' : ''}`}
              >
                <div className="day-header">
                  <div className="day-name">{dayNames[date.getDay()]}</div>
                  <div className="day-date">{date.getDate()}</div>
                  <div className="day-month">
                    {date.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}
                  </div>
                </div>

                <div className="day-content">
                  <div className="agendas-list">
                    {dayAgendas.map(agenda => (
                      <div key={agenda.id} className="agenda-item">
                        <div className="agenda-text">{agenda.text}</div>
                        <button 
                          className="delete-agenda-btn" 
                          onClick={() => handleDeleteAgenda(dateKey, agenda.id)}
                          title="Hapus"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {editingDate === dateKey ? (
                    <div className="agenda-form">
                      <input
                        type="text"
                        placeholder="Tambah agenda..."
                        value={agendaInput}
                        onChange={(e) => setAgendaInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddAgenda(dateKey)}
                        autoFocus
                      />
                      <div className="agenda-form-actions">
                        <button onClick={() => handleAddAgenda(dateKey)} className="save-agenda-btn">
                          <Save size={14} />
                        </button>
                        <button 
                          onClick={() => { setEditingDate(null); setAgendaInput(''); }} 
                          className="cancel-agenda-btn"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      className="add-agenda-btn" 
                      onClick={() => setEditingDate(dateKey)}
                    >
                      <Plus size={16} />
                      Tambah Agenda
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <footer className="home-footer">
        <p>&copy; 2025 Manajemen Order. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
