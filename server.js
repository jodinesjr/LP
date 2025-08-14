require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Servir arquivos estáticos

// Rota da API do Gemini
app.post('/api/gemini', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt é obrigatório' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY não configurada');
      return res.status(500).json({ error: 'Configuração do servidor incompleta' });
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const requestBody = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    };

    console.log('🤖 Fazendo chamada para API Gemini...');
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Erro da API Gemini:', result);
      return res.status(response.status).json({
        error: result.error?.message || 'Erro na API do Gemini'
      });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('Erro no servidor:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: error.message
    });
  }
});

// Rota da API do RD Station
app.post('/api/rd-station', async (req, res) => {
  try {
    console.log('🎯 [API RD STATION] Processando requisição...');
    console.log('📦 [API RD STATION] Body:', JSON.stringify(req.body, null, 2));
    
    const { nome, email, celular, cargo, tamanhoEmpresa } = req.body;
    
    // Validar campos obrigatórios
    const missingFields = [];
    if (!nome) missingFields.push('nome');
    if (!email) missingFields.push('email');
    if (!celular) missingFields.push('celular');
    if (!cargo) missingFields.push('cargo');
    if (!tamanhoEmpresa) missingFields.push('tamanhoEmpresa');
    
    if (missingFields.length > 0) {
      console.log('❌ [API RD STATION] Campos obrigatórios ausentes:', missingFields);
      return res.status(400).json({
        error: 'Dados incompletos',
        message: 'Todos os campos são obrigatórios',
        missing_fields: missingFields,
        timestamp: new Date().toISOString()
      });
    }

    // Simular resposta de sucesso (em desenvolvimento)
    const successResponse = {
      success: true,
      message: 'Lead enviado com sucesso (simulado)',
      method_used: 'Simulação Local',
      data: {
        nome,
        email,
        celular,
        cargo,
        tamanhoEmpresa,
        timestamp: new Date().toISOString()
      }
    };

    console.log('✅ [API RD STATION] Lead processado com sucesso');
    res.status(200).json(successResponse);
    
  } catch (error) {
    console.error('❌ [API RD STATION] Erro no servidor:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: error.message,
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
