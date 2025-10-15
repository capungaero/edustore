# 📦 Aplikasi Manajemen Order

> Sistem Manajemen Pesanan Terintegrasi untuk bisnis percetakan dan jasa.

![React](https://img.shields.io/badge/React-18.2.0-61dafb?logo=react)
![Vite](https://img.shields.io/badge/Vite-6.3.6-646cff?logo=vite)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Fitur Utama

### 🛒 Modul Order
- ✅ **Auto-generate ID Pesanan** dengan format unik
- 📋 **Jenis Pekerjaan**: Fotocopy, Cetak, Print, Jilid
- 📅 **Tanggal Masuk**: Otomatis terisi tanggal hari ini
- ⏰ **Deadline**: Input tanggal dengan validasi
- 📏 **Satuan**: Pcs, Lembar, Lembar Bolak Balik, Unit
- 💰 **Harga & Total**: Kalkulasi otomatis
- 📝 **Keterangan**: Catatan tambahan untuk pesanan
- 💾 **Data Persistent**: Tersimpan di localStorage

### 📊 Modul Lainnya (Coming Soon)
- 📈 Laporan & Statistik
- 💸 Manajemen Keuangan
- ⚙️ Konfigurasi Harga & Pengaturan

## 🚀 Quick Start

### Instalasi

```bash
# Clone repository
git clone https://github.com/USERNAME/manajemen-order.git
cd manajemen-order

# Install dependencies
npm install

# Jalankan development server
npm start
```

Aplikasi akan berjalan di `http://localhost:3000`

## 🌐 Deploy ke GitHub Pages

### Metode Tercepat (Recommended)

Jalankan script interaktif:

```bash
./quick-deploy.sh
```

Pilih salah satu opsi:
1. **GitHub CLI** - Otomatis setup repository dan deploy
2. **Manual** - Setup repository manual dengan panduan
3. **Deploy Only** - Jika repository sudah ada

### Atau Deploy Manual

```bash
# 1. Build aplikasi
npm run build

# 2. Deploy dengan gh-pages
npm run deploy
```

📖 **Panduan Lengkap**: Lihat [DEPLOY-GUIDE.md](DEPLOY-GUIDE.md)

## 🛠️ Teknologi

- **Frontend Framework**: React 18.2.0
- **Routing**: React Router DOM 7.9.4
- **Icons**: Lucide React
- **Build Tool**: Vite 6.3.6
- **Styling**: CSS3 Modern
- **Deployment**: GitHub Actions + GitHub Pages

## 📁 Struktur Project

```
src/
├── pages/
│   ├── Home.jsx          # Halaman utama dengan navigasi
│   ├── Order.jsx         # Modul order (lengkap)
│   ├── Laporan.jsx       # Modul laporan
│   ├── Keuangan.jsx      # Modul keuangan
│   └── Konfigurasi.jsx   # Modul konfigurasi
├── App.jsx               # Router utama
└── index.jsx             # Entry point
```

## 💻 Available Scripts

```bash
npm start      # Development server
npm run build  # Production build
npm run preview # Preview production build
npm test       # Run tests
npm run deploy # Deploy to GitHub Pages
```

## 🎨 Fitur Desain

- 🌈 Gradient background yang elegan
- ✨ Animasi smooth pada hover
- 📱 Responsive design untuk semua device
- 🎭 Modal form yang modern
- 📊 Tabel data profesional
- 🎯 Icon menarik dari Lucide React
- 🎨 Color-coded badges untuk kategori

## 📝 Cara Penggunaan

1. **Halaman Utama**: Pilih modul dari 4 kartu yang tersedia
2. **Modul Order**: 
   - Klik tombol **"Tambah Order"**
   - Isi form pesanan dengan lengkap
   - Klik **"Simpan Order"**
   - Data akan tersimpan dan ditampilkan dalam tabel
   - Gunakan tombol hapus untuk menghapus pesanan

## 💡 Default Konfigurasi Harga

| Jenis Pekerjaan | Harga |
|----------------|--------|
| Fotocopy | Rp 500 |
| Cetak | Rp 1.000 |
| Print | Rp 1.500 |
| Jilid | Rp 5.000 |

*Harga dapat disesuaikan melalui modul Konfigurasi (coming soon)*

## 🔮 Roadmap

- [ ] Modul Laporan dengan grafik dan statistik
- [ ] Modul Keuangan untuk tracking pembayaran
- [ ] Modul Konfigurasi untuk pengaturan harga
- [ ] Export data ke Excel/PDF
- [ ] Notifikasi deadline pesanan
- [ ] Multi-user support
- [ ] Dark mode

## 🐛 Bug Reports & Feature Requests

Silakan buat [issue baru](https://github.com/USERNAME/manajemen-order/issues) untuk melaporkan bug atau request fitur.

## 📄 License

MIT License - bebas digunakan untuk keperluan komersial maupun personal.

## 👨‍💻 Developer

Dibuat dengan ❤️ menggunakan React dan Vite

---

**⭐ Jangan lupa beri star jika project ini bermanfaat!**
