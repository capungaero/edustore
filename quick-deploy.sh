#!/bin/bash

echo "╔════════════════════════════════════════════════════════╗"
echo "║   🚀 QUICK DEPLOY - Manajemen Order ke GitHub Pages   ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}Pilih metode deployment:${NC}"
echo ""
echo "1. GitHub CLI (Otomatis - Tercepat)"
echo "2. Manual (Setup repository manual)"
echo "3. Deploy saja (Repository sudah ada)"
echo ""
read -p "Pilihan (1/2/3): " choice

case $choice in
    1)
        echo ""
        echo -e "${YELLOW}🔐 Login ke GitHub...${NC}"
        gh auth login
        
        echo ""
        read -p "Nama repository (default: manajemen-order): " repo_name
        repo_name=${repo_name:-manajemen-order}
        
        echo ""
        echo -e "${YELLOW}📦 Membuat repository: $repo_name${NC}"
        gh repo create $repo_name --public --source=. --remote=origin --push
        
        if [ $? -eq 0 ]; then
            echo ""
            echo -e "${GREEN}✅ Repository berhasil dibuat dan di-push!${NC}"
            echo ""
            echo -e "${BLUE}Langkah selanjutnya:${NC}"
            echo "1. Buka: https://github.com/$(gh api user -q .login)/$repo_name/settings/pages"
            echo "2. Di 'Source', pilih 'GitHub Actions'"
            echo "3. Tunggu beberapa menit untuk deployment"
            echo ""
            echo -e "${GREEN}🌐 Aplikasi akan tersedia di:${NC}"
            echo "   https://$(gh api user -q .login).github.io/$repo_name/"
        else
            echo -e "${YELLOW}⚠️  Gagal membuat repository. Coba metode manual.${NC}"
        fi
        ;;
        
    2)
        echo ""
        echo -e "${BLUE}📋 Instruksi Manual:${NC}"
        echo ""
        echo "1. Buat repository baru di: https://github.com/new"
        echo "   - Nama: manajemen-order (atau nama lain)"
        echo "   - Public"
        echo "   - JANGAN init dengan README"
        echo ""
        echo "2. Setelah dibuat, jalankan:"
        read -p "   Masukkan username GitHub Anda: " username
        read -p "   Masukkan nama repository: " repo_name
        
        echo ""
        echo -e "${YELLOW}🔗 Menambahkan remote...${NC}"
        git remote add origin https://github.com/$username/$repo_name.git 2>/dev/null
        
        echo -e "${YELLOW}📤 Pushing ke GitHub...${NC}"
        git push -u origin main
        
        if [ $? -eq 0 ]; then
            echo ""
            echo -e "${GREEN}✅ Push berhasil!${NC}"
            echo ""
            echo -e "${BLUE}Langkah selanjutnya:${NC}"
            echo "1. Buka: https://github.com/$username/$repo_name/settings/pages"
            echo "2. Di 'Source', pilih 'GitHub Actions'"
            echo ""
            echo -e "${GREEN}🌐 Aplikasi akan tersedia di:${NC}"
            echo "   https://$username.github.io/$repo_name/"
        fi
        ;;
        
    3)
        echo ""
        echo -e "${YELLOW}📦 Building aplikasi...${NC}"
        npm run build
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Build berhasil!${NC}"
        else
            echo -e "${YELLOW}❌ Build gagal!${NC}"
            exit 1
        fi
        
        echo ""
        echo -e "${YELLOW}📤 Pushing ke GitHub...${NC}"
        git push origin main
        
        if [ $? -eq 0 ]; then
            echo ""
            echo -e "${GREEN}✅ Deploy berhasil!${NC}"
            echo ""
            echo -e "${BLUE}GitHub Actions akan otomatis men-deploy aplikasi.${NC}"
            echo "Cek progress di tab 'Actions' di repository GitHub Anda."
        else
            echo -e "${YELLOW}⚠️  Push gagal. Pastikan remote origin sudah terkonfigurasi.${NC}"
        fi
        ;;
        
    *)
        echo ""
        echo -e "${YELLOW}Pilihan tidak valid!${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✨ Deployment process selesai!${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════${NC}"
echo ""
