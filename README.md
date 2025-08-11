# Calculadora de Custos de Recrutamento - Harpio Sprint

Uma aplicação web para calcular custos de recrutamento e seleção com análise de IA.

## 🚀 Deploy no Vercel

### Pré-requisitos
1. Conta no [Vercel](https://vercel.com)
2. API Key do Google Gemini (obtenha em: https://makersuite.google.com/app/apikey)

### Passos para Deploy

1. **Clone ou faça upload do projeto para o GitHub**

2. **Conecte o repositório no Vercel**
   - Acesse [vercel.com](https://vercel.com)
   - Clique em "New Project"
   - Importe seu repositório do GitHub

3. **Configure a variável de ambiente**
   - No painel do Vercel, vá em "Settings" > "Environment Variables"
   - Adicione a variável:
     - **Name:** `GEMINI_API_KEY`
     - **Value:** Sua chave da API do Google Gemini
     - **Environment:** Production (e Development se necessário)

4. **Deploy**
   - Clique em "Deploy"
   - Aguarde o build e deploy automático

### 🔒 Segurança

A API key do Google Gemini agora está protegida:
- ✅ **Não exposta** no código frontend
- ✅ **Armazenada** como variável de ambiente no Vercel
- ✅ **Processada** apenas no backend seguro
- ✅ **Protegida** contra acesso não autorizado

### 📁 Estrutura do Projeto

```
├── index.html          # Frontend da aplicação
├── api/
│   └── gemini.js       # API backend segura
├── vercel.json         # Configuração do Vercel
├── .env.example        # Exemplo de variáveis de ambiente
└── README.md           # Este arquivo
```

### 🛠️ Desenvolvimento Local

Para testar localmente:

1. **Instale o Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Crie arquivo .env.local:**
   ```bash
   cp .env.example .env.local
   # Edite .env.local e adicione sua GEMINI_API_KEY
   ```

3. **Execute localmente:**
   ```bash
   vercel dev
   ```

### 📞 Suporte

Se encontrar problemas durante o deploy:
1. Verifique se a `GEMINI_API_KEY` está configurada corretamente
2. Confirme que a API key do Gemini está ativa e válida
3. Consulte os logs no painel do Vercel para diagnóstico
