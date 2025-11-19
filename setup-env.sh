#!/bin/bash

# Script para configurar .env automaticamente

cd "$(dirname "$0")"

# Gerar NEXTAUTH_SECRET
SECRET=$(openssl rand -base64 32)

# Criar ou atualizar .env
if [ -f .env ]; then
    echo "⚠️  Arquivo .env já existe. Atualizando apenas se necessário..."
    
    # Verificar se DATABASE_URL existe
    if ! grep -q "DATABASE_URL" .env; then
        echo "DATABASE_URL=\"postgresql://$(whoami)@localhost:5432/motoboy_db?schema=public\"" >> .env
    fi
    
    # Verificar se NEXTAUTH_SECRET existe
    if ! grep -q "NEXTAUTH_SECRET" .env; then
        echo "NEXTAUTH_SECRET=\"$SECRET\"" >> .env
    fi
    
    # Verificar se NEXTAUTH_URL existe
    if ! grep -q "NEXTAUTH_URL" .env; then
        echo "NEXTAUTH_URL=\"http://localhost:3000\"" >> .env
    fi
    
    # Verificar se NODE_ENV existe
    if ! grep -q "NODE_ENV" .env; then
        echo "NODE_ENV=\"development\"" >> .env
    fi
else
    echo "Criando arquivo .env..."
    cat > .env << EOF
# Database
DATABASE_URL="postgresql://$(whoami)@localhost:5432/motoboy_db?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="$SECRET"

# App
NODE_ENV="development"
EOF
    echo "✅ Arquivo .env criado!"
fi

echo ""
echo "📋 Conteúdo do .env:"
echo "---"
cat .env | grep -v "SECRET" | sed 's/\(.*SECRET.*\)/NEXTAUTH_SECRET="***oculto***"/'
echo "---"
echo ""
echo "✅ Configuração concluída!"

