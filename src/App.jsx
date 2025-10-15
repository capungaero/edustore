import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Order from './pages/Order';
import Laporan from './pages/Laporan';
import Keuangan from './pages/Keuangan';
import Konfigurasi from './pages/Konfigurasi';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/order" element={<Order />} />
        <Route path="/laporan" element={<Laporan />} />
        <Route path="/keuangan" element={<Keuangan />} />
        <Route path="/konfigurasi" element={<Konfigurasi />} />
      </Routes>
    </Router>
  );
}

export default App;
