export default async function handler(req, res) {
  // Configurar CORS para permitir requisições do frontend
  // Usar origin dinâmico para permitir tanto localhost quanto o domínio de produção
  const origin = req.headers.origin;
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:8080',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:8080',
    'https://calculadora-eta-umber.vercel.app',
    'https://lp-jodinesjr.vercel.app',
    'https://lp-git-main-jodinesjr.vercel.app',
    'https://lp.vercel.app'
  ];
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    // Permitir qualquer origem em desenvolvimento
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Responder a requisições OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Endpoint de debug para validação de deploy/roteamento
  if (req.method === 'GET') {
    return res.status(200).json({
      ok: true,
      message: 'Gemini API online',
      method: req.method,
      time: new Date().toISOString()
    });
  }

  // Apenas aceitar métodos POST para funcionalidade principal
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    // Verificar se a API key está configurada
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY não configurada');
      return res.status(500).json({ 
        error: 'Configuração do servidor incompleta' 
      });
    }

    // Extrair o prompt do corpo da requisição
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ 
        error: 'Prompt é obrigatório' 
      });
    }

    // Fazer a chamada para a API do Gemini
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

    // Retornar a resposta do Gemini
    res.status(200).json(result);

  } catch (error) {
    console.error('Erro no servidor:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
}
