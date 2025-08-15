/**
 * config.js
 * Configurações globais da aplicação
 * 
 * IMPORTANTE: Este arquivo NÃO deve conter chaves de API sensíveis.
 * A chave da API do Gemini será carregada dinamicamente do ambiente.
 */

// Configuração global da aplicação
const AppConfig = {
  // Configuração do Gemini
  gemini: {
    // A chave da API será carregada de uma variável de ambiente no Vercel
    // ou de um arquivo .env em desenvolvimento
    apiKey: '', // Será preenchida dinamicamente
    model: 'gemini-2.5-flash'
  },
  
  // Configurações de ambiente
  environment: {
    isDevelopment: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
    isProduction: window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
  }
};

// Função para carregar a chave da API do Gemini
async function loadGeminiApiKey() {
  try {
    // Em produção, buscamos a chave da API de um endpoint seguro
    if (AppConfig.environment.isProduction) {
      const response = await fetch('/api/config');
      if (response.ok) {
        const data = await response.json();
        if (data.geminiApiKey) {
          AppConfig.gemini.apiKey = data.geminiApiKey;
          console.log('✅ Chave da API Gemini carregada com sucesso do servidor');
          return true;
        }
      }
      console.error('❌ Falha ao carregar a chave da API Gemini do servidor');
      return false;
    } 
    // Em desenvolvimento, podemos usar uma chave de teste
    else {
      // Aqui você pode definir uma chave de teste para desenvolvimento
      // ou carregar de um arquivo .env local
      console.log('🔧 Ambiente de desenvolvimento detectado');
      
      // Tentar carregar a chave da API de um endpoint local
      try {
        const response = await fetch('/api/config');
        if (response.ok) {
          const data = await response.json();
          if (data.geminiApiKey) {
            AppConfig.gemini.apiKey = data.geminiApiKey;
            console.log('✅ Chave da API Gemini carregada com sucesso do servidor local');
            return true;
          }
        }
      } catch (error) {
        console.log('⚠️ Servidor local não disponível, tentando carregar de outras fontes');
      }
      
      return false;
    }
  } catch (error) {
    console.error('❌ Erro ao carregar a chave da API Gemini:', error);
    return false;
  }
}

// Exportar a configuração para uso global
window.AppConfig = AppConfig;
window.loadGeminiApiKey = loadGeminiApiKey;
