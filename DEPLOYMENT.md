# Aplikasi Manajemen Order

Sistem Manajemen Pesanan Terintegrasi untuk bisnis percetakan dan jasa.

## 🚀 Fitur

### Modul Order
- **Auto-generate ID Pesanan** dengan format unik
- **Jenis Pekerjaan**: Fotocopy, Cetak, Print, Jilid
- **Tanggal Masuk**: Otomatis terisi tanggal hari ini
- **Deadline**: Input tanggal dengan validasi
- **Satuan**: Pcs, Lembar, Lembar Bolak Balik, Unit
- **Jumlah & Harga**: Input manual dengan kalkulasi total otomatis
- **Keterangan**: Catatan tambahan untuk pesanan
- **Data Persistent**: Tersimpan di localStorage

### Modul Lainnya (Coming Soon)
- Laporan
- Keuangan
- Konfigurasi

## 🛠️ Teknologi

- React 18.2.0
- React Router DOM 7.9.4
- Lucide React (Icons)
- Vite 6.3.6
- CSS Modern

## 📦 Instalasi

```bash
# Install dependencies
npm install

# Jalankan development server
npm start

# Build untuk production
npm run build

# Preview production build
npm preview
```

## 🌐 Deploy ke GitHub Pages

### Cara 1: Manual dengan gh-pages

```bash
# Deploy ke GitHub Pages
npm run deploy
```

### Cara 2: Otomatis dengan GitHub Actions

1. **Push ke GitHub**:
```bash
git add .
git commit -m "Update aplikasi"
git push origin main
```

2. **Aktifkan GitHub Pages**:
   - Buka repository di GitHub
   - Pergi ke **Settings** > **Pages**
   - Di **Source**, pilih **GitHub Actions**
   
3. **Selesai!** Aplikasi akan otomatis ter-deploy setiap kali ada push ke branch `main`

### Setup Repository Baru

Jika belum memiliki repository GitHub:

```bash
# Buat repository baru di GitHub (lewat web)
# Lalu tambahkan remote:
git remote add origin https://github.com/USERNAME/REPO-NAME.git
git branch -M main
git push -u origin main
```

## 📝 Struktur Project

```
src/
├── pages/
│   ├── Home.jsx          # Halaman utama
│   ├── Order.jsx         # Modul order
│   ├── Laporan.jsx       # Modul laporan
│   ├── Keuangan.jsx      # Modul keuangan
│   └── Konfigurasi.jsx   # Modul konfigurasi
├── App.jsx               # Router utama
└── index.jsx             # Entry point
```

## 💡 Cara Penggunaan

1. **Halaman Utama**: Klik salah satu dari 4 modul yang tersedia
2. **Modul Order**: 
   - Klik tombol **"Tambah Order"**
   - Isi form pesanan
   - Klik **"Simpan Order"**
   - Data akan muncul di tabel

## 🎨 Fitur Desain

- Gradient background yang elegan
- Animasi smooth pada hover
- Responsive design untuk mobile
- Modal form yang modern
- Tabel data yang profesional
- Icon yang menarik dari Lucide React

## 📄 License

MIT License

## 👨‍💻 Developer

Dibuat dengan ❤️ menggunakan React dan Vite

---

**Live Demo**: [Akan tersedia setelah deployment]
