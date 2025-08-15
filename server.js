require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Configuração CORS
const corsOptions = {
  origin: [
    'http://localhost:5173',  // Vite dev server
    'http://localhost:3000',  // Previous local production build
    'http://localhost:3001',  // New local production build port
    'https://calculadora-eta-umber.vercel.app',  // Vercel production
    'https://*.vercel.app'    // Any Vercel deployment
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static('.')); // Servir arquivos estáticos

// Log de todas as requisições para debug
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Rota de health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rota da API do RD Station
app.post('/api/rd-station', async (req, res) => {
  try {
    console.log('🚀 [RD STATION API] ===== INÍCIO DA REQUISIÇÃO =====');
    console.log('📅 [RD STATION API] Timestamp:', new Date().toISOString());
    console.log('🔗 [RD STATION API] URL:', req.url);
    console.log('📋 [RD STATION API] Body recebido:', req.body);
    
    const { nome, email, celular, cargo, tamanhoEmpresa } = req.body;
    
    // Validação básica
    if (!nome || !email || !celular || !cargo || !tamanhoEmpresa) {
      console.error('❌ [RD STATION API] Dados incompletos');
      return res.status(400).json({ 
        error: 'Todos os campos são obrigatórios',
        missing: {
          nome: !nome,
          email: !email,
          celular: !celular,
          cargo: !cargo,
          tamanhoEmpresa: !tamanhoEmpresa
        }
      });
    }
    
    // Aqui você normalmente enviaria os dados para o RD Station
    // Por enquanto, apenas logamos e retornamos sucesso
    console.log('✅ [RD STATION API] Lead recebido com sucesso:', {
      nome,
      email,
      celular,
      cargo,
      tamanhoEmpresa
    });
    
    return res.status(200).json({ 
      success: true,
      message: 'Lead recebido com sucesso!'
    });
    
  } catch (error) {
    console.error('❌ [RD STATION API] Erro ao processar lead:', error);
    return res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: error.message 
    });
  }
});

// Rota da API do Gemini
app.post('/api/gemini', async (req, res) => {
  try {
    console.log('🔍 Dados recebidos na requisição:', {
      headers: req.headers,
      body: req.body ? { ...req.body, prompt: req.body.prompt ? `${req.body.prompt.substring(0, 100)}...` : 'vazio' } : 'sem corpo'
    });

    const { prompt } = req.body;
    
    if (!prompt) {
      console.error('❌ Erro: Prompt não fornecido');
      return res.status(400).json({ 
        error: 'Prompt é obrigatório',
        receivedData: req.body 
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      const errorMsg = 'GEMINI_API_KEY não configurada no ambiente';
      console.error(`❌ ${errorMsg}`);
      console.log('Variáveis de ambiente disponíveis:', Object.keys(process.env));
      return res.status(500).json({ 
        error: 'Erro de configuração do servidor',
        message: 'Chave da API não configurada',
        details: 'A chave da API do Gemini não foi configurada corretamente no ambiente.'
      });
    }

    const model = 'gemini-2.5-flash';
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    
    const requestBody = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
      },
    };

    console.log('🤖 Iniciando chamada para API Gemini...');
    console.log('📤 URL da API:', `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.substring(0, 8)}...`);
    
    const startTime = Date.now();
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    const responseTime = Date.now() - startTime;
    console.log(`⏱️  Tempo de resposta da API: ${responseTime}ms`);
    
    const result = await response.json().catch(e => ({
      error: 'Erro ao processar resposta JSON',
      details: e.message,
      status: response.status,
      statusText: response.statusText
    }));

    console.log('📥 Resposta da API Gemini:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries([...response.headers.entries()])
    });

    if (!response.ok) {
      console.error('❌ Erro da API Gemini:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries([...response.headers.entries()]),
        body: result
      });
      
      return res.status(response.status).json({
        error: 'Erro ao processar a requisição para a API Gemini',
        status: response.status,
        statusText: response.statusText,
        details: result.error || result,
        requestInfo: {
          endpoint: '/api/gemini',
          method: 'POST',
          headers: req.headers
        }
      });
    }

    console.log('✅ Resposta da API Gemini processada com sucesso');
    res.json(result);
    
  } catch (error) {
    console.error('❌ Erro ao processar a requisição:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
  }
});

// Rota para servir o arquivo index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`🔌 API Gemini disponível em http://localhost:${PORT}/api/gemini`);
});
