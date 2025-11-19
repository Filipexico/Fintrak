#!/bin/bash

# Script de Setup do Banco de Dados PostgreSQL
# Para Mac com Homebrew

set -e

echo "🐘 Configurando PostgreSQL para RiderFlow..."
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar se Homebrew está instalado
if ! command -v brew &> /dev/null; then
    echo -e "${RED}❌ Homebrew não encontrado!${NC}"
    echo "Instale Homebrew primeiro:"
    echo "/bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
    exit 1
fi

echo -e "${GREEN}✅ Homebrew encontrado${NC}"

# Verificar se PostgreSQL está instalado
if ! command -v psql &> /dev/null; then
    echo -e "${YELLOW}⚠️  PostgreSQL não encontrado. Instalando...${NC}"
    brew install postgresql@14
    echo -e "${GREEN}✅ PostgreSQL instalado${NC}"
else
    echo -e "${GREEN}✅ PostgreSQL já instalado${NC}"
fi

# Iniciar PostgreSQL
echo -e "${YELLOW}🔄 Iniciando PostgreSQL...${NC}"
brew services start postgresql@14 || brew services restart postgresql@14
sleep 2

# Obter usuário atual do Mac
MAC_USER=$(whoami)
echo -e "${GREEN}✅ Usuário do sistema: ${MAC_USER}${NC}"

# Criar banco de dados
echo -e "${YELLOW}🔄 Criando banco de dados...${NC}"

# Tentar criar banco (pode falhar se já existir, mas não é problema)
psql -U $MAC_USER -d postgres -c "CREATE DATABASE motoboy_db;" 2>/dev/null || echo "Banco já existe ou será criado"

# Verificar se banco foi criado
if psql -U $MAC_USER -d motoboy_db -c "\q" 2>/dev/null; then
    echo -e "${GREEN}✅ Banco de dados 'motoboy_db' criado/verificado${NC}"
else
    echo -e "${YELLOW}⚠️  Tentando criar banco como superuser...${NC}"
    psql postgres -c "CREATE DATABASE motoboy_db;" 2>/dev/null || true
fi

# Configurar .env
echo -e "${YELLOW}🔄 Configurando arquivo .env...${NC}"

if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  Arquivo .env não existe. Criando...${NC}"
    cp .env.example .env 2>/dev/null || touch .env
fi

# Gerar NEXTAUTH_SECRET se não existir
if ! grep -q "NEXTAUTH_SECRET=" .env || grep -q "NEXTAUTH_SECRET=your-secret" .env; then
    SECRET=$(openssl rand -base64 32)
    if grep -q "NEXTAUTH_SECRET=" .env; then
        sed -i '' "s/NEXTAUTH_SECRET=.*/NEXTAUTH_SECRET=\"$SECRET\"/" .env
    else
        echo "" >> .env
        echo "NEXTAUTH_SECRET=\"$SECRET\"" >> .env
    fi
    echo -e "${GREEN}✅ NEXTAUTH_SECRET gerado${NC}"
fi

# Configurar DATABASE_URL
DB_URL="postgresql://${MAC_USER}@localhost:5432/motoboy_db?schema=public"

if grep -q "DATABASE_URL=" .env; then
    sed -i '' "s|DATABASE_URL=.*|DATABASE_URL=\"$DB_URL\"|" .env
    echo -e "${GREEN}✅ DATABASE_URL atualizado${NC}"
else
    echo "" >> .env
    echo "DATABASE_URL=\"$DB_URL\"" >> .env
    echo -e "${GREEN}✅ DATABASE_URL adicionado${NC}"
fi

# Configurar NEXTAUTH_URL se não existir
if ! grep -q "NEXTAUTH_URL=" .env; then
    echo "NEXTAUTH_URL=\"http://localhost:3000\"" >> .env
    echo -e "${GREEN}✅ NEXTAUTH_URL configurado${NC}"
fi

# Configurar NODE_ENV se não existir
if ! grep -q "NODE_ENV=" .env; then
    echo "NODE_ENV=\"development\"" >> .env
    echo -e "${GREEN}✅ NODE_ENV configurado${NC}"
fi

echo ""
echo -e "${GREEN}✅ Configuração do .env concluída!${NC}"
echo ""

# Executar Prisma
echo -e "${YELLOW}🔄 Configurando Prisma...${NC}"

# Gerar Prisma Client
npm run db:generate
echo -e "${GREEN}✅ Prisma Client gerado${NC}"

# Executar migrations
echo -e "${YELLOW}🔄 Executando migrations...${NC}"
npm run db:migrate || npm run db:push
echo -e "${GREEN}✅ Migrations executadas${NC}"

# Executar seed
echo -e "${YELLOW}🔄 Executando seed...${NC}"
npm run db:seed
echo -e "${GREEN}✅ Seed executado${NC}"

echo ""
echo -e "${GREEN}🎉 Setup completo!${NC}"
echo ""
echo "📋 Próximos passos:"
echo "1. Verifique o arquivo .env"
echo "2. Execute: npm run dev"
echo "3. Acesse: http://localhost:3000"
echo ""
echo "🔑 Credenciais de teste:"
echo "   Email: admin@motoboy.app"
echo "   Senha: admin123"
echo ""
echo "💡 Para abrir Prisma Studio: npm run db:studio"
