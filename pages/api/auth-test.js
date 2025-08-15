// Endpoint simples para testar autenticação no Vercel
export default function handler(req, res) {
  // Configurar CORS para permitir acesso do frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Retornar informações básicas
  res.status(200).json({
    message: 'Teste de autenticação bem-sucedido',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    headers: req.headers,
    environment: process.env.NODE_ENV || 'development',
    vercel: process.env.VERCEL === '1' ? true : false
  });
}
