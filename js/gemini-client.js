/**
 * gemini-client.js
 * Cliente JavaScript para interação direta com a API do Google Gemini
 * Não requer servidor intermediário, funciona diretamente no navegador
 */

class GeminiClient {
  constructor() {
    // Configuração inicial
    this.apiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
    this.apiKey = null;
  }

  /**
   * Inicializa o cliente com a chave da API
   * @param {string} apiKey - Chave da API do Gemini
   */
  initialize(apiKey) {
    if (!apiKey) {
      console.error('❌ GeminiClient: API Key não fornecida');
      throw new Error('API Key é obrigatória para inicializar o cliente Gemini');
    }
    
    this.apiKey = apiKey;
    console.log('✅ GeminiClient: Inicializado com sucesso');
    return this;
  }

  /**
   * Envia um prompt para a API do Gemini
   * @param {string} prompt - O texto do prompt para enviar ao modelo
   * @param {Object} options - Opções adicionais de configuração
   * @returns {Promise<Object>} - Resposta da API do Gemini
   */
  async generateContent(prompt, options = {}) {
    if (!this.apiKey) {
      throw new Error('Cliente não inicializado. Chame initialize() primeiro com uma API Key válida');
    }

    if (!prompt) {
      throw new Error('Prompt é obrigatório');
    }

    // Validar o comprimento do prompt
    if (prompt.length > 10000) {
      throw new Error('O prompt é muito longo (máx 10000 caracteres)');
    }

    // Construir URL com a chave da API
    const apiUrl = `${this.apiEndpoint}?key=${this.apiKey}`;
    
    // Configurações padrão que podem ser substituídas por options
    const defaultConfig = {
      temperature: 0.7,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 4096,
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

    // Mesclar configurações padrão com as opções fornecidas
    const generationConfig = {
      ...defaultConfig,
      ...options.generationConfig
    };

    // Construir o corpo da requisição
    const requestBody = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: generationConfig.temperature,
        topP: generationConfig.topP,
        topK: generationConfig.topK,
        maxOutputTokens: generationConfig.maxOutputTokens
      }
    };

    // Se houver configurações de segurança personalizadas, use-as
    if (options.safetySettings) {
      requestBody.safetySettings = options.safetySettings;
    } else if (defaultConfig.safetySettings) {
      requestBody.safetySettings = defaultConfig.safetySettings;
    }

    console.log('🤖 GeminiClient: Enviando requisição para API Gemini...');
    
    try {
      const startTime = Date.now();
      
      // Fazer a chamada para a API
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      const responseTime = Date.now() - startTime;
      console.log(`⏱️ GeminiClient: Resposta recebida em ${responseTime}ms`);

      // Verificar se a resposta é bem-sucedida
      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ GeminiClient: Erro da API Gemini:', errorData);
        
        throw {
          status: response.status,
          statusText: response.statusText,
          error: errorData.error?.message || 'Erro na API do Gemini',
          details: errorData.error?.details || 'Sem detalhes adicionais',
          code: errorData.error?.code,
          requestId: response.headers.get('x-goog-request-id')
        };
      }

      // Processar a resposta
      const result = await response.json();
      console.log('✅ GeminiClient: Resposta processada com sucesso');
      
      return {
        success: true,
        data: result,
        metadata: {
          model: 'gemini-2.5-flash',
          timestamp: new Date().toISOString(),
          requestId: response.headers.get('x-goog-request-id'),
          responseTime: `${responseTime}ms`
        }
      };
      
    } catch (error) {
      console.error('❌ GeminiClient: Erro ao chamar a API Gemini:', error);
      
      // Verificar se é um erro de rede
      if (error.name === 'TypeError' && error.message.includes('fetch failed')) {
        throw {
          success: false,
          error: 'Serviço indisponível',
          details: 'Não foi possível conectar ao serviço do Gemini. Verifique sua conexão com a internet.',
          code: 'SERVICE_UNAVAILABLE',
          timestamp: new Date().toISOString()
        };
      }
      
      // Se for um erro já formatado por nós, apenas repasse
      if (error.status && error.error) {
        throw error;
      }
      
      // Outros erros inesperados
      throw {
        success: false,
        error: 'Erro ao processar requisição',
        details: error.message || 'Erro desconhecido',
        code: 'UNEXPECTED_ERROR',
        timestamp: new Date().toISOString()
      };
    }
  }
}

// Exportar o cliente para uso global
window.GeminiClient = GeminiClient;
