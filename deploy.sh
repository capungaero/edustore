#!/bin/bash

# Script untuk deploy aplikasi ke GitHub Pages

echo "🚀 Deployment Script untuk Manajemen Order"
echo "=========================================="
echo ""

# Cek apakah ada remote origin
if git remote get-url origin &> /dev/null; then
    echo "✅ Remote origin sudah terkonfigurasi"
    REPO_URL=$(git remote get-url origin)
    echo "   Repository: $REPO_URL"
else
    echo "⚠️  Remote origin belum terkonfigurasi!"
    echo ""
    echo "Silakan ikuti langkah berikut:"
    echo ""
    echo "1. Buat repository baru di GitHub:"
    echo "   https://github.com/new"
    echo ""
    echo "2. Setelah membuat repository, jalankan:"
    echo "   git remote add origin https://github.com/USERNAME/REPO-NAME.git"
    echo ""
    echo "3. Lalu jalankan script ini lagi"
    exit 1
fi

echo ""
echo "📦 Building aplikasi..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build berhasil!"
else
    echo "❌ Build gagal!"
    exit 1
fi

echo ""
echo "📤 Pushing ke GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo "✅ Push berhasil!"
else
    echo "❌ Push gagal!"
    echo ""
    echo "Jika ini adalah push pertama, coba jalankan:"
    echo "git push -u origin main"
    exit 1
fi

echo ""
echo "🎉 Deployment selesai!"
echo ""
echo "Langkah selanjutnya:"
echo "1. Buka repository GitHub Anda"
echo "2. Pergi ke Settings > Pages"
echo "3. Di 'Source', pilih 'GitHub Actions'"
echo "4. Workflow akan otomatis berjalan dan deploy aplikasi"
echo ""
echo "Aplikasi Anda akan tersedia di:"
echo "https://USERNAME.github.io/REPO-NAME/"
echo ""
