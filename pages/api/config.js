/**
 * /pages/api/config.js
 * Endpoint seguro para fornecer configurações ao frontend
 * Inclui a chave da API do Gemini de forma segura
 */

export default function handler(req, res) {
  // Configurar CORS para permitir requisições do frontend
  const origin = req.headers.origin;
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:8080',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:8080',
    'https://calculadora-eta-umber.vercel.app',
    'https://lp-jodinesjr.vercel.app',
    'https://lp-git-main-jodinesjr.vercel.app',
    'https://lp.vercel.app'
  ];
  
  // Adicionar automaticamente a URL do ambiente Vercel atual
  if (process.env.VERCEL_URL) {
    allowedOrigins.push(`https://${process.env.VERCEL_URL}`);
    // Também adicionar variações comuns de subdomínios
    allowedOrigins.push(`https://${process.env.VERCEL_URL.replace('www.', '')}`);
    allowedOrigins.push(`https://www.${process.env.VERCEL_URL}`);
  }
  
  // Verificar se a origem está na lista de permitidas ou se estamos em desenvolvimento
  if (allowedOrigins.includes(origin) || !origin) {
    // Se a origem é permitida ou não há origem (como em requisições de servidor para servidor)
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  } else {
    // Em desenvolvimento, permitir qualquer origem
    if (process.env.NODE_ENV === 'development') {
      res.setHeader('Access-Control-Allow-Origin', '*');
      console.log('🔓 [DEV] CORS: Permitindo qualquer origem em ambiente de desenvolvimento');
    } else {
      // Em produção, verificar se é um domínio Vercel
      if (origin && (origin.includes('vercel.app') || origin.includes('localhost'))) {
        console.log(`✅ [PROD] CORS: Permitindo origem Vercel não listada: ${origin}`);
        res.setHeader('Access-Control-Allow-Origin', origin);
        // Adicionar à lista para futuras requisições
        allowedOrigins.push(origin);
      } else {
        console.log(` [PROD] CORS: Bloqueando origem não permitida: ${origin}`);
        res.setHeader('Access-Control-Allow-Origin', 'https://calculadora-eta-umber.vercel.app/');
      }
    }
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Responder a requisições OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Apenas aceitar métodos GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }
  
  try {
    // Obter a chave da API do Gemini do ambiente
    const geminiApiKey = process.env.GEMINI_API_KEY;
    
    if (!geminiApiKey) {
      console.error('GEMINI_API_KEY não configurada no ambiente');
      return res.status(500).json({
        error: 'Configuração incompleta',
        message: 'A chave da API Gemini não está configurada no servidor'
      });
    }
    
    // Retornar a configuração ao cliente
    res.status(200).json({
      geminiApiKey,
      environment: process.env.NODE_ENV || 'production',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Erro ao processar requisição de configuração:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Ocorreu um erro ao processar a requisição'
    });
  }
}
