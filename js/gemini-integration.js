/**
 * gemini-integration.js
 * Integração do cliente Gemini com a aplicação
 */

// Inicializar o cliente Gemini quando o documento estiver pronto
let geminiClient = null;

/**
 * Carrega a chave da API Gemini do servidor de configuração
 * @returns {Promise<boolean>} - true se a chave foi carregada com sucesso
 */
async function loadGeminiApiKey() {
  try {
    console.log('🔄 Carregando chave da API Gemini...');
    
    // Determinar se estamos em ambiente de desenvolvimento ou produção
    const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const baseUrl = isDev ? `http://${window.location.hostname}:3001` : '';
    const configUrl = `${baseUrl}/api/config`;
    
    console.log(`🌐 Ambiente: ${isDev ? 'Desenvolvimento' : 'Produção'}`);
    console.log(`🔗 URL base: ${baseUrl || 'Raiz do domínio atual'}`);
    console.log(`🔗 URL de configuração: ${configUrl}`);
    
    
    console.log(`📡 Buscando configuração em: ${configUrl}`);
    
    // Buscar a chave da API do endpoint de configuração
    const response = await fetch(configUrl);
    
    if (!response.ok) {
      throw new Error(`Erro ao carregar configuração: ${response.status} ${response.statusText}`);
    }
    
    const config = await response.json();
    
    if (!config || !config.geminiApiKey) {
      throw new Error('Configuração inválida: chave da API Gemini não encontrada');
    }
    
    // Configurar a chave da API
    if (!window.AppConfig) {
      window.AppConfig = {};
    }
    
    if (!window.AppConfig.gemini) {
      window.AppConfig.gemini = {};
    }
    
    window.AppConfig.gemini.apiKey = config.geminiApiKey;
    console.log('✅ Chave da API Gemini carregada com sucesso');
    
    return true;
  } catch (error) {
    console.error('❌ Erro ao carregar chave da API Gemini:', error);
    return false;
  }
}

// Função para inicializar o cliente Gemini
async function initializeGeminiClient() {
  try {
    // Carregar a chave da API
    const apiKeyLoaded = await loadGeminiApiKey();
    
    if (!apiKeyLoaded) {
      console.error('❌ Falha ao carregar a chave da API Gemini');
      return false;
    }
    
    // Inicializar o cliente
    geminiClient = new GeminiClient().initialize(window.AppConfig.gemini.apiKey);
    console.log('✅ Cliente Gemini inicializado com sucesso');
    return true;
  } catch (error) {
    console.error('❌ Erro ao inicializar o cliente Gemini:', error);
    return false;
  }
}

/**
 * Função para enviar um prompt ao Gemini e obter uma resposta
 * @param {string} prompt - O texto do prompt para enviar ao modelo
 * @param {Object} options - Opções adicionais de configuração
 * @returns {Promise<Object>} - Resposta processada da API do Gemini
 */
async function askGemini(prompt, options = {}) {
  try {
    // Verificar se o cliente está inicializado
    if (!geminiClient) {
      const initialized = await initializeGeminiClient();
      if (!initialized) {
        throw new Error('Não foi possível inicializar o cliente Gemini');
      }
    }
    
    // Mostrar indicador de carregamento (se fornecido)
    if (options.onStart) {
      options.onStart();
    }
    
    // Enviar o prompt para a API
    const response = await geminiClient.generateContent(prompt, options);
    
    // Processar a resposta
    if (response.success && response.data) {
      // Extrair o texto da resposta
      const textResponse = extractTextFromGeminiResponse(response.data);
      
      // Chamar o callback de sucesso (se fornecido)
      if (options.onSuccess) {
        options.onSuccess(textResponse, response);
      }
      
      return {
        success: true,
        text: textResponse,
        fullResponse: response
      };
    } else {
      throw new Error('Resposta inválida da API Gemini');
    }
  } catch (error) {
    console.error('❌ Erro ao processar requisição Gemini:', error);
    
    // Chamar o callback de erro (se fornecido)
    if (options.onError) {
      options.onError(error);
    }
    
    return {
      success: false,
      error: error.error || 'Erro ao processar a requisição',
      details: error.details || error.message || 'Erro desconhecido'
    };
  } finally {
    // Chamar o callback de finalização (se fornecido)
    if (options.onComplete) {
      options.onComplete();
    }
  }
}

/**
 * Extrai o texto da resposta da API Gemini
 * @param {Object|string} response - Resposta da API Gemini
 * @returns {string} - Texto extraído da resposta
 */
function extractTextFromGeminiResponse(response) {
    console.log('🔍 Estrutura da resposta:', JSON.stringify(response, null, 2));
    
    try {
        // Se a resposta já for uma string, retorna diretamente
        if (typeof response === 'string') {
            return response;
        }

        // Verifica se a resposta foi truncada (MAX_TOKENS)
        if (response.candidates && 
            response.candidates[0] && 
            response.candidates[0].finishReason === 'MAX_TOKENS') {
            // Verifica se há algum texto disponível mesmo com truncamento
            if (response.candidates[0].content && 
                response.candidates[0].content.parts && 
                response.candidates[0].content.parts[0] && 
                response.candidates[0].content.parts[0].text) {
                return response.candidates[0].content.parts[0].text + ' [Resposta truncada]';
            } else {
                // Resposta truncada sem texto disponível
                return 'A resposta foi truncada devido ao limite de tokens. Por favor, tente um prompt mais curto ou aumente o limite de tokens.';
            }
        }

        // Formato padrão da resposta
        if (response.candidates && 
            response.candidates[0] && 
            response.candidates[0].content && 
            response.candidates[0].content.parts && 
            response.candidates[0].content.parts[0] && 
            response.candidates[0].content.parts[0].text) {
            return response.candidates[0].content.parts[0].text;
        }

        // Formato alternativo 1
        if (response.text) {
            return response.text;
        }

        // Formato alternativo 2
        if (response.content && response.content.parts && response.content.parts[0] && response.content.parts[0].text) {
            return response.content.parts[0].text;
        }

        // Caso especial: content existe mas não tem texto (apenas role)
        if (response.candidates && 
            response.candidates[0] && 
            response.candidates[0].content && 
            response.candidates[0].content.role === 'model') {
            return 'A API retornou uma resposta sem conteúdo de texto. Isso pode ocorrer devido a limitações de tokens ou problemas com o modelo.';
        }

        // Tentativa de extrair qualquer texto disponível na estrutura JSON
        const responseStr = JSON.stringify(response);
        const textMatches = responseStr.match(/"text":"([^"]+)"/g);
        if (textMatches && textMatches.length > 0) {
            const extractedText = textMatches[0].replace(/"text":"/, '').replace(/"$/, '');
            if (extractedText) {
                return extractedText;
            }
        }

        throw new Error('Formato de resposta inválido');
    } catch (error) {
        console.error('❌ Erro ao extrair texto da resposta:', error);
        return 'Não foi possível processar a resposta do modelo.';
    }
}

// Criar o objeto de integração para uso global
window.geminiIntegration = {
  /**
   * Inicializa o cliente Gemini
   * @returns {Promise<boolean>} - true se inicializado com sucesso
   */
  initialize: async function() {
    return await initializeGeminiClient();
  },
  
  /**
   * Envia um prompt para o Gemini e retorna a resposta
   * @param {string} prompt - O texto do prompt
   * @param {Object} options - Opções como callbacks
   * @returns {Promise<string|Object>} - Texto da resposta ou objeto com erro
   */
  sendPrompt: async function(prompt, options = {}) {
    try {
      console.log('🚀 [geminiIntegration] Enviando prompt para o Gemini...');
      
      if (options.onLoading) {
        options.onLoading();
      }
      
      const response = await askGemini(prompt, {
        onStart: options.onLoading,
        onSuccess: options.onSuccess,
        onError: options.onError,
        onComplete: options.onComplete
      });
      
      if (response.success && response.text) {
        console.log('✅ [geminiIntegration] Resposta recebida com sucesso');
        return response.text;
      } else {
        throw new Error(response.error || 'Erro desconhecido ao processar a requisição');
      }
    } catch (error) {
      console.error('❌ [geminiIntegration] Erro ao enviar prompt:', error);
      
      if (options.onError) {
        options.onError(error);
      }
      
      return {
        error: error.message || 'Erro ao processar a requisição',
        details: error.details || error.stack || 'Sem detalhes adicionais'
      };
    } finally {
      if (options.onComplete) {
        options.onComplete();
      }
    }
  }
};

// Manter compatibilidade com código existente
window.initializeGeminiClient = initializeGeminiClient;
window.askGemini = askGemini;
