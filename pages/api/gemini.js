export default async function handler(req, res) {
  console.log('🤖 [GEMINI API] ===== INÍCIO DA REQUISIÇÃO =====');
  console.log('📅 [GEMINI API] Timestamp:', new Date().toISOString());
  console.log('🌐 [GEMINI API] Método:', req.method);
  console.log('🔗 [GEMINI API] URL:', req.url);
  console.log('📋 [GEMINI API] Headers recebidos:', JSON.stringify(req.headers, null, 2));
  
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Responder a requisições OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    console.log('✅ [GEMINI API] Respondendo a preflight OPTIONS');
    return res.status(200).end();
  }

  // Para debug: aceitar GET temporariamente
  if (req.method === 'GET') {
    console.log('🔍 [GEMINI API] Requisição GET recebida - retornando status da API');
    return res.status(200).json({ 
      status: 'API Gemini funcionando',
      method: req.method,
      timestamp: new Date().toISOString(),
      message: 'Use POST para gerar relatórios'
    });
  }

  // Apenas aceitar métodos POST
  if (req.method !== 'POST') {
    console.error('❌ [GEMINI API] Método não permitido:', req.method);
    return res.status(405).json({ 
      error: 'Método não permitido',
      received_method: req.method,
      allowed_methods: ['POST']
    });
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
