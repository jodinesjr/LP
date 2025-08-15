#!/bin/bash

# Script para deploy no Vercel com todas as variáveis de ambiente necessárias
# Versão 2.0 - Otimizado para integração com Google Gemini API

# Cores para melhor visualização
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
BLUE="\033[0;34m"
NC="\033[0m" # No Color

echo -e "${BLUE}=== HARPIO SPRINT - DEPLOY AUTOMATIZADO ===${NC}"
echo -e "${YELLOW}Iniciando processo de deploy para Vercel...${NC}"

# Verificar se o CLI do Vercel está instalado
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}Vercel CLI não encontrado. Instalando...${NC}"
    npm install -g vercel
fi

# Verificar se o Git está instalado
if ! command -v git &> /dev/null; then
    echo -e "${RED}ERRO: Git não está instalado. Por favor, instale o Git para continuar.${NC}"
    exit 1
fi

# Obter variáveis do arquivo .env
if [ -f .env ]; then
    echo -e "${GREEN}Carregando variáveis do arquivo .env...${NC}"
    export $(grep -v '^#' .env | xargs)
else
    echo -e "${YELLOW}Arquivo .env não encontrado! Criando um novo...${NC}"
    cp .env.example .env
    echo -e "${RED}Por favor, edite o arquivo .env com suas credenciais e execute novamente este script.${NC}"
    exit 1
fi

# Verificar se as variáveis essenciais estão definidas
if [ -z "$GEMINI_API_KEY" ]; then
    echo -e "${RED}ERRO: GEMINI_API_KEY não está definida no arquivo .env${NC}"
    exit 1
fi

# Validar a API key do Gemini com uma chamada de teste usando o mesmo modelo do projeto
echo -e "${BLUE}Validando API key do Google Gemini...${NC}"
GEMINI_TEST_RESPONSE=$(curl -s -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=$GEMINI_API_KEY" \
-H "Content-Type: application/json" \
-d '{"contents":[{"parts":[{"text":"Hello"}]}]}')

# Alternativas caso a primeira falhe
if echo "$GEMINI_TEST_RESPONSE" | grep -q "error"; then
    echo -e "${YELLOW}Tentando endpoint alternativo (gemini-pro)...${NC}"
    GEMINI_TEST_RESPONSE=$(curl -s -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=$GEMINI_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{"contents":[{"parts":[{"text":"Hello"}]}]}')
fi

# Última tentativa com modelo mais antigo
if echo "$GEMINI_TEST_RESPONSE" | grep -q "error"; then
    echo -e "${YELLOW}Tentando modelo mais antigo (gemini-1.0-pro)...${NC}"
    GEMINI_TEST_RESPONSE=$(curl -s -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent?key=$GEMINI_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{"contents":[{"parts":[{"text":"Hello"}]}]}')
fi

if echo "$GEMINI_TEST_RESPONSE" | grep -q "error"; then
    echo -e "${RED}ERRO: A API key do Gemini parece ser inválida ou está com problemas.${NC}"
    echo -e "${RED}Resposta da API: $GEMINI_TEST_RESPONSE${NC}"
    exit 1
else
    echo -e "${GREEN}API key do Gemini validada com sucesso!${NC}"
fi

# Verificar se há mudanças não commitadas
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}AVISO: Existem mudanças não commitadas no repositório.${NC}"
    echo -e "${YELLOW}Deseja continuar mesmo assim? (s/n)${NC}"
    read -r resposta
    if [ "$resposta" != "s" ]; then
        echo -e "${BLUE}Deploy cancelado. Faça commit das suas mudanças antes de continuar.${NC}"
        exit 0
    fi
fi

# Verificar se a pasta node_modules existe e está atualizada
if [ ! -d "node_modules" ] || [ ! -f "node_modules/.package-lock.json" ]; then
    echo -e "${YELLOW}Instalando dependências...${NC}"
    npm install
fi

# Fazer deploy com as variáveis de ambiente
echo -e "${GREEN}Fazendo deploy com as variáveis de ambiente configuradas...${NC}"
vercel --prod \
    -e GEMINI_API_KEY="$GEMINI_API_KEY" \
    -e RD_STATION_PUBLIC_TOKEN="$RD_STATION_PUBLIC_TOKEN"

DEPLOY_STATUS=$?

if [ $DEPLOY_STATUS -eq 0 ]; then
    echo -e "${GREEN}Deploy concluído com sucesso!${NC}"
    echo -e "${BLUE}Acesse sua aplicação em: https://$(vercel env ls | grep URL_PRODUCTION | awk '{print $2}')${NC}"
    
    # Perguntar se deseja criar uma nova tag/release no GitHub
    echo -e "${YELLOW}Deseja criar uma nova tag/release no GitHub? (s/n)${NC}"
    read -r criar_tag
    if [ "$criar_tag" = "s" ]; then
        echo -e "${BLUE}Digite o número da versão (ex: 1.0.0):${NC}"
        read -r versao
        echo -e "${BLUE}Digite uma descrição para esta versão:${NC}"
        read -r descricao
        
        git tag -a "v$versao" -m "$descricao"
        git push origin "v$versao"
        
        echo -e "${GREEN}Tag v$versao criada e enviada para o GitHub!${NC}"
    fi
else
    echo -e "${RED}Erro durante o deploy. Verifique os logs acima.${NC}"
fi
