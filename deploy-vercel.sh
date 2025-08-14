#!/bin/bash

# Script para deploy no Vercel com todas as variáveis de ambiente necessárias

echo "Iniciando deploy para Vercel..."

# Verificar se o CLI do Vercel está instalado
if ! command -v vercel &> /dev/null; then
    echo "Vercel CLI não encontrado. Instalando..."
    npm install -g vercel
fi

# Obter variáveis do arquivo .env
if [ -f .env ]; then
    echo "Carregando variáveis do arquivo .env..."
    export $(grep -v '^#' .env | xargs)
else
    echo "Arquivo .env não encontrado!"
    exit 1
fi

# Verificar se as variáveis essenciais estão definidas
if [ -z "$GEMINI_API_KEY" ]; then
    echo "ERRO: GEMINI_API_KEY não está definida no arquivo .env"
    exit 1
fi

if [ -z "$RD_STATION_PUBLIC_TOKEN" ]; then
    echo "ERRO: RD_STATION_PUBLIC_TOKEN não está definida no arquivo .env"
    exit 1
fi

# Fazer deploy com as variáveis de ambiente
echo "Fazendo deploy com as variáveis de ambiente configuradas..."
vercel --prod \
    -e GEMINI_API_KEY="$GEMINI_API_KEY" \
    -e RD_STATION_PUBLIC_TOKEN="$RD_STATION_PUBLIC_TOKEN"

echo "Deploy concluído!"
