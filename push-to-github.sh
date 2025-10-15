#!/bin/bash

# Warna untuk output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║          PUSH APLIKASI KE GITHUB - MANAJEMEN ORDER            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Tanya apakah sudah membuat repository
echo -e "${YELLOW}Apakah Anda sudah membuat repository di GitHub? (y/n)${NC}"
read -r answer

if [[ "$answer" != "y" ]]; then
    echo ""
    echo -e "${RED}Silakan buat repository terlebih dahulu!${NC}"
    echo ""
    echo "1. Buka: https://github.com/new"
    echo "2. Repository name: manajemen-order (atau nama lain)"
    echo "3. Pilih: Public"
    echo "4. JANGAN centang 'Add a README file'"
    echo "5. Klik: Create repository"
    echo ""
    echo -e "${YELLOW}Setelah selesai, jalankan script ini lagi!${NC}"
    exit 0
fi

echo ""
echo -e "${BLUE}Masukkan URL repository Anda:${NC}"
echo -e "${YELLOW}Contoh: https://github.com/capungaero/manajemen-order.git${NC}"
read -r repo_url

if [[ -z "$repo_url" ]]; then
    echo -e "${RED}URL repository tidak boleh kosong!${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Menambahkan remote origin...${NC}"

# Hapus remote origin jika sudah ada
git remote remove origin 2>/dev/null

# Tambahkan remote origin baru
git remote add origin "$repo_url"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Remote origin berhasil ditambahkan${NC}"
else
    echo -e "${RED}✗ Gagal menambahkan remote origin${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Pushing code ke GitHub...${NC}"

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║              🎉 PUSH BERHASIL! 🎉                              ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${YELLOW}LANGKAH SELANJUTNYA:${NC}"
    echo ""
    echo "1. Buka repository Anda di GitHub"
    echo "2. Klik tab: ${BLUE}Settings${NC}"
    echo "3. Klik menu: ${BLUE}Pages${NC} (di sidebar kiri)"
    echo "4. Di 'Source': Pilih ${GREEN}GitHub Actions${NC}"
    echo "5. Klik: ${GREEN}Save${NC}"
    echo ""
    echo "6. Klik tab: ${BLUE}Actions${NC}"
    echo "7. Tunggu workflow 'Deploy to GitHub Pages' selesai (1-2 menit)"
    echo ""
    echo -e "${GREEN}Aplikasi akan tersedia di:${NC}"
    
    # Extract username and repo name from URL
    repo_path=$(echo "$repo_url" | sed -E 's|https://github.com/(.+)\.git|\1|')
    echo -e "${BLUE}https://$(echo $repo_path | cut -d'/' -f1).github.io/$(echo $repo_path | cut -d'/' -f2)/${NC}"
    echo ""
else
    echo ""
    echo -e "${RED}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║                  ✗ PUSH GAGAL ✗                                ║${NC}"
    echo -e "${RED}╚════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${YELLOW}Kemungkinan penyebab:${NC}"
    echo "1. URL repository salah"
    echo "2. Tidak ada akses ke repository"
    echo "3. Authentication error"
    echo ""
    echo -e "${YELLOW}Coba jalankan script ini lagi dengan URL yang benar!${NC}"
    exit 1
fi
