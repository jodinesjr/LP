// Endpoint para verificar as variáveis de ambiente
const express = require('express');
const router = express.Router();

// Rota para verificar as variáveis de ambiente
router.get('/', (req, res) => {
  // Verificar se as variáveis de ambiente estão definidas
  const envVars = {
    RD_STATION_PUBLIC_TOKEN: process.env.RD_STATION_PUBLIC_TOKEN ? 'Definido' : 'Não definido',
    GEMINI_API_KEY: process.env.GEMINI_API_KEY ? 'Definido' : 'Não definido',
    // Adicione outras variáveis de ambiente que você queira verificar
  };

  // Mostrar os primeiros 8 caracteres do token para verificação
  const tokenPrefix = process.env.RD_STATION_PUBLIC_TOKEN 
    ? `${process.env.RD_STATION_PUBLIC_TOKEN.substring(0, 8)}...` 
    : 'Não disponível';

  // Retornar informações sobre as variáveis de ambiente
  res.status(200).json({
    message: 'Verificação de variáveis de ambiente',
    environment: process.env.NODE_ENV || 'development',
    variables: envVars,
    tokenPrefix: tokenPrefix,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
