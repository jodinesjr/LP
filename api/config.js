/**
 * api/config.js
 * Endpoint para fornecer configurações seguras para o frontend
 */

// Importar dependências
const cors = require('cors');

// Configuração de CORS para permitir acesso do frontend
const corsOptions = {
  origin: function (origin, callback) {
    // Permitir requisições sem origin (como apps mobile ou curl)
    if (!origin) return callback(null, true);
    
    // Lista de origens permitidas
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173'
    ];
    
    // Em produção, permitir a origem do Vercel
    if (process.env.VERCEL_URL) {
      allowedOrigins.push(`https://${process.env.VERCEL_URL}`);
    }
    
    // Verificar se a origem está na lista de permitidas
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Bloqueado por política de CORS'));
    }
  },
  methods: ['GET', 'OPTIONS'],
  credentials: true
};

// Handler da API
module.exports = async (req, res) => {
  // Aplicar CORS
  await new Promise((resolve, reject) => {
    cors(corsOptions)(req, res, (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });

  // Verificar método
  if (req.method !== 'GET') {
    return res.status(405).json({
      error: 'Método não permitido',
      message: 'Este endpoint só aceita requisições GET'
    });
  }

  try {
    // Verificar se a chave da API está configurada
    const geminiApiKey = process.env.GEMINI_API_KEY;
    
    if (!geminiApiKey) {
      console.error('❌ [API CONFIG] Chave da API Gemini não configurada no ambiente');
      return res.status(500).json({
        error: 'Configuração incompleta',
        message: 'A chave da API Gemini não está configurada no servidor'
      });
    }
    
    // Retornar configurações seguras
    console.log('✅ [API CONFIG] Fornecendo configurações para o cliente');
    return res.status(200).json({
      geminiApiKey: geminiApiKey,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ [API CONFIG] Erro ao processar requisição:', error);
    return res.status(500).json({
      error: 'Erro interno',
      message: 'Ocorreu um erro ao processar a requisição'
    });
  }
};
