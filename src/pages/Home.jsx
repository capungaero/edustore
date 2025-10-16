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

  // Get deadlines for a specific date
  const getDeadlinesForDate = (date) => {
    const dateKey = getDateKey(date);
    return orders.filter(order => {
      const deadlineKey = getDateKey(new Date(order.deadline));
      return deadlineKey === dateKey;
    });
  };

  // Get deadline color based on days until deadline (gradient from yellow to red)
  const getDeadlineColor = (deadlineDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadline = new Date(deadlineDate);
    deadline.setHours(0, 0, 0, 0);
    
    const daysUntil = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
    
    // 7+ hari = kuning (#fef08a)
    // 0 hari = merah (#ef4444)
    // Gradient: kuning → orange → merah
    if (daysUntil >= 7) return '#fef08a'; // kuning muda
    if (daysUntil >= 5) return '#fcd34d'; // kuning
    if (daysUntil >= 3) return '#fb923c'; // orange
    if (daysUntil >= 1) return '#f97316'; // orange tua
    return '#ef4444'; // merah (hari ini atau lewat)
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
          {/* Laporan & Reminder dalam satu panel */}
          <div className="stat-box combined-stats">
            <div className="stat-header" style={{ marginBottom: '0.5rem' }}>
              <h3>Laporan & Reminder</h3>
              <Calendar size={20} color="#4F46E5" />
            </div>
            <div className="combined-stats-content" style={{ gap: '0.5rem' }}>
              {/* Order Count */}
              <div className="stat-item">
                <div className="stat-label-small">Order Bulan Ini</div>
                <div className="stat-value-medium">{getCurrentMonthOrders().length}</div>
              </div>
              {/* Income */}
              <div className="stat-item">
                <div className="stat-icon-label">
                  <TrendingUp size={16} color="#10b981" />
                  <span className="stat-label-small">Pemasukan</span>
                </div>
                <div className="stat-value-medium income">{formatCurrency(getTotalIncome())}</div>
              </div>
              {/* Expense */}
              <div className="stat-item">
                <div className="stat-icon-label">
                  <TrendingDown size={16} color="#ef4444" />
                  <span className="stat-label-small">Pengeluaran</span>
                </div>
                <div className="stat-value-medium expense">{formatCurrency(getTotalExpenses())}</div>
              </div>
              {/* Divider */}
              <div className="stats-divider"></div>
              {/* Reminder Section */}
              <div className="reminder-panel-inside">
                <div className="reminder-header-row">
                  <span className="stat-label-small">Reminder</span>
                  <button className="add-reminder-btn" onClick={() => setShowReminderForm(true)}>
                    <Plus size={16} />
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
                <div className="reminders-list" style={{ marginTop: 4 }}>
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
                          <X size={14} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
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
            const dayDeadlines = getDeadlinesForDate(date);
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
                  {/* Deadlines */}
                  {dayDeadlines.length > 0 && (
                    <div className="deadlines-section">
                      {dayDeadlines.map(order => (
                        <div 
                          key={order.id} 
                          className="deadline-badge"
                          style={{ backgroundColor: getDeadlineColor(order.deadline) }}
                        >
                          <div className="deadline-title">{order.namaPemesan || 'Order'}</div>
                          <div className="deadline-desc">{order.pekerjaan}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Agendas */}
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
