# 🚀 Panduan Deploy ke GitHub Pages

## Metode 1: Deploy Otomatis dengan GitHub Actions (Direkomendasikan)

### Langkah-langkah:

#### 1. Buat Repository GitHub Baru

Pilih salah satu cara:

**Cara A: Lewat GitHub CLI**
```bash
gh auth login
gh repo create manajemen-order --public --source=. --remote=origin
```

**Cara B: Lewat Web Browser**
1. Buka https://github.com/new
2. Nama repository: `manajemen-order` (atau nama lain)
3. Pilih **Public**
4. **JANGAN** centang "Initialize this repository with a README"
5. Klik **Create repository**

#### 2. Tambahkan Remote Origin (Jika menggunakan Cara B)

```bash
git remote add origin https://github.com/USERNAME/manajemen-order.git
```

Ganti `USERNAME` dengan username GitHub Anda.

#### 3. Push ke GitHub

```bash
git push -u origin main
```

#### 4. Aktifkan GitHub Pages

1. Buka repository Anda di GitHub
2. Klik **Settings** (tab paling kanan)
3. Klik **Pages** (menu kiri)
4. Di bagian **Source**, pilih **GitHub Actions**
5. Klik **Save**

#### 5. Selesai! 🎉

GitHub Actions akan otomatis:
- Build aplikasi
- Deploy ke GitHub Pages
- Aplikasi akan tersedia di: `https://USERNAME.github.io/manajemen-order/`

### Melihat Progress Deployment

1. Buka tab **Actions** di repository GitHub
2. Anda akan melihat workflow "Deploy to GitHub Pages" sedang berjalan
3. Tunggu hingga selesai (biasanya 1-2 menit)
4. Status akan berubah menjadi ✅ hijau jika berhasil

---

## Metode 2: Deploy Manual dengan gh-pages

### Langkah-langkah:

#### 1. Setup Repository (sama seperti Metode 1, langkah 1-3)

#### 2. Deploy Manual

```bash
npm run deploy
```

Script ini akan:
- Build aplikasi (`npm run build`)
- Deploy folder `dist` ke branch `gh-pages`

#### 3. Aktifkan GitHub Pages

1. Buka repository di GitHub
2. **Settings** > **Pages**
3. Source: Pilih **Deploy from a branch**
4. Branch: Pilih **gh-pages** dan folder **/ (root)**
5. Klik **Save**

#### 4. Akses Aplikasi

Aplikasi akan tersedia di: `https://USERNAME.github.io/manajemen-order/`

---

## 📝 Menggunakan Script Deploy Otomatis

Saya sudah menyiapkan script untuk mempermudah deployment:

```bash
./deploy.sh
```

Script ini akan:
1. Check konfigurasi git
2. Build aplikasi
3. Push ke GitHub
4. Memberikan instruksi selanjutnya

---

## 🔄 Update Aplikasi Setelah Deploy

Setiap kali Anda membuat perubahan:

```bash
# 1. Tambahkan perubahan
git add .

# 2. Commit
git commit -m "Deskripsi perubahan"

# 3. Push
git push origin main
```

Jika menggunakan **GitHub Actions**, aplikasi akan otomatis ter-deploy.

Jika menggunakan **gh-pages manual**, jalankan:
```bash
npm run deploy
```

---

## ⚙️ Konfigurasi Base URL

File `vite.config.js` sudah dikonfigurasi untuk:
- Local development: `/codespaces-react/`
- GitHub Actions: `/` (otomatis detect)

Jika nama repository Anda berbeda, update `vite.config.js`:

```javascript
export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/' : '/NAMA-REPO-ANDA/',
  // ...
})
```

---

## 🐛 Troubleshooting

### Masalah: Pages tidak aktif

**Solusi:**
- Pastikan repository adalah **Public**
- Atau aktifkan GitHub Pro untuk private repository

### Masalah: 404 Not Found

**Solusi:**
- Check apakah `base` di `vite.config.js` sesuai dengan nama repository
- Pastikan GitHub Pages source sudah diset dengan benar

### Masalah: Blank page

**Solusi:**
- Buka browser console (F12)
- Check error
- Biasanya masalah di routing atau base path

### Masalah: Push ditolak (Permission denied)

**Solusi:**
```bash
# Setup GitHub authentication
gh auth login

# Atau setup SSH key
ssh-keygen -t ed25519 -C "email@example.com"
```

---

## 📚 Referensi

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [gh-pages Package](https://www.npmjs.com/package/gh-pages)

---

## ✅ Checklist Deployment

- [ ] Repository GitHub sudah dibuat
- [ ] Remote origin sudah ditambahkan
- [ ] Code sudah di-push ke GitHub
- [ ] GitHub Pages sudah diaktifkan
- [ ] Source sudah dipilih (GitHub Actions atau gh-pages branch)
- [ ] Workflow berhasil dijalankan (cek tab Actions)
- [ ] Aplikasi bisa diakses di URL GitHub Pages

---

**Happy Deploying! 🚀**
