export default async function handler(req, res) {
  // Configurar CORS para permitir requisições do frontend
  // Usar origin dinâmico para permitir tanto localhost quanto o domínio de produção
  const origin = req.headers.origin;
  const allowedOrigins = [
    'http://localhost:3000',
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
  
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Responder a requisições OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Apenas aceitar métodos POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    // Log detalhado da requisição recebida
    console.log('🔍 [BACKEND] Nova requisição recebida:', {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body ? {
        ...req.body,
        prompt: req.body.prompt ? `${req.body.prompt.substring(0, 100)}...` : 'vazio'
      } : 'sem corpo'
    });

    // Verificar se a API key está configurada
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      const errorMsg = 'GEMINI_API_KEY não configurada no ambiente';
      console.error(`❌ ${errorMsg}`);
      return res.status(500).json({ 
        success: false,
        error: 'Configuração do servidor incompleta',
        details: errorMsg,
        timestamp: new Date().toISOString()
      });
    }

    // Extrair o prompt do corpo da requisição
    const { prompt } = req.body;
    
    if (!prompt) {
      const errorMsg = 'Nenhum prompt fornecido no corpo da requisição';
      console.error(`❌ ${errorMsg}`);
      return res.status(400).json({ 
        success: false,
        error: 'Dados inválidos',
        details: errorMsg,
        required: ['prompt'],
        received: Object.keys(req.body || {})
      });
    }

    // Validar o comprimento do prompt
    if (prompt.length > 10000) {
      const errorMsg = 'O prompt é muito longo (máx 10000 caracteres)';
      console.error(`❌ ${errorMsg}`);
      return res.status(400).json({
        success: false,
        error: 'Dados inválidos',
        details: errorMsg,
        prompt_length: prompt.length
      });
    }

    // Fazer a chamada para a API do Gemini
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const requestBody = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 2048,
      },
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_NONE'
        },
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_NONE'
        },
        {
          category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          threshold: 'BLOCK_NONE'
        },
        {
          category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
          threshold: 'BLOCK_NONE'
        }
      ]
    };

    console.log('🤖 [BACKEND] Fazendo chamada para API Gemini...', {
      url: apiUrl.replace(apiKey, '***REDACTED***'),
      requestBody: {
        ...requestBody,
        contents: [{
          parts: [{
            text: `${requestBody.contents[0].parts[0].text.substring(0, 100)}...`
          }]
        }]
      },
      timestamp: new Date().toISOString()
    });
    
    const startTime = Date.now();
    let response;
    let result;
    
    try {
      response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      const responseTime = Date.now() - startTime;
      console.log(`⏱️ [BACKEND] Resposta da API Gemini recebida em ${responseTime}ms`, {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });

      // Tentar analisar a resposta como JSON primeiro
      try {
        result = await response.clone().json();
      } catch (jsonError) {
        // Se falhar ao analisar como JSON, tentar como texto
        const textResponse = await response.text();
        console.error('❌ [BACKEND] Falha ao analisar resposta como JSON:', {
          status: response.status,
          statusText: response.statusText,
          responseText: textResponse,
          error: jsonError.message
        });
        
        return res.status(500).json({
          success: false,
          error: 'Erro ao processar a resposta da API',
          details: 'A resposta não está no formato JSON esperado',
          response: textResponse,
          status: response.status,
          statusText: response.statusText
        });
      }

      if (!response.ok) {
        console.error('❌ [BACKEND] Erro da API Gemini:', {
          status: response.status,
          statusText: response.statusText,
          error: result,
          requestId: response.headers.get('x-goog-request-id'),
          timestamp: new Date().toISOString()
        });

        return res.status(response.status).json({
          success: false,
          error: result.error?.message || 'Erro na API do Gemini',
          details: result.error?.details || 'Sem detalhes adicionais',
          code: result.error?.code,
          status: response.status,
          requestId: response.headers.get('x-goog-request-id')
        });
      }

      console.log('✅ [BACKEND] Resposta da API Gemini processada com sucesso');
      
      // Retornar a resposta do Gemini
      return res.status(200).json({
        success: true,
        data: result,
        metadata: {
          model: 'gemini-2.5-flash',
          timestamp: new Date().toISOString(),
          requestId: response.headers.get('x-goog-request-id'),
          responseTime: `${responseTime}ms`
        }
      });

    } catch (fetchError) {
      const errorTime = Date.now() - startTime;
      console.error('❌ [BACKEND] Erro ao chamar a API Gemini:', {
        error: fetchError.message,
        stack: fetchError.stack,
        timeElapsed: `${errorTime}ms`,
        timestamp: new Date().toISOString()
      });

      // Verificar se é um erro de rede
      if (fetchError.name === 'TypeError' && fetchError.message.includes('fetch failed')) {
        return res.status(503).json({
          success: false,
          error: 'Serviço indisponível',
          details: 'Não foi possível conectar ao serviço do Gemini. Verifique sua conexão com a internet.',
          code: 'SERVICE_UNAVAILABLE',
          timestamp: new Date().toISOString()
        });
      }

      // Outros erros inesperados
      return res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        details: fetchError.message,
        code: 'INTERNAL_SERVER_ERROR',
        timestamp: new Date().toISOString()
      });
    }

  } catch (error) {
    console.error('🔥 [BACKEND] Erro inesperado no manipulador:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    
    return res.status(500).json({ 
      success: false,
      error: 'Erro interno do servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Ocorreu um erro inesperado',
      code: 'UNEXPECTED_ERROR',
      timestamp: new Date().toISOString()
    });
  }
}
