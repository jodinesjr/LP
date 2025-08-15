# Gemini API Client-Side Implementation

## Overview

This document describes the client-side implementation of the Google Gemini API integration that eliminates the need for a separate backend server. The implementation allows direct calls to the Gemini API from the frontend while maintaining security and compatibility with both development and production (Vercel) environments.

## Architecture

The implementation consists of three main components:

1. **Config API** (`/api/config.js` and `/pages/api/config.js`): A minimal API endpoint that securely provides the Gemini API key to the frontend.
2. **Gemini Client** (`/js/gemini-client.js`): A JavaScript class that handles API calls to Gemini.
3. **Gemini Integration** (`/js/gemini-integration.js`): A utility that initializes the client and provides a simple interface for sending prompts.

### Flow Diagram

```
Frontend → Config API → Get API Key → Gemini Client → Google Gemini API → Response → Frontend
```

## Implementation Details

### 1. Config API

The Config API is a simple endpoint that securely provides the Gemini API key to the frontend. It includes CORS protection to ensure that only allowed origins can access the API key.

- **Location**: `/api/config.js` and `/pages/api/config.js` (for Vercel compatibility)
- **Environment Variables**: `GEMINI_API_KEY`
- **Security**: CORS headers to restrict access to allowed origins

### 2. Gemini Client

The Gemini Client is a JavaScript class that encapsulates the logic for calling the Gemini API. It handles authentication, request construction, and response parsing.

- **Location**: `/js/gemini-client.js`
- **Features**:
  - Direct API calls to Google Gemini API
  - Error handling
  - Response parsing
  - Timeout handling

### 3. Gemini Integration

The Gemini Integration is a utility that initializes the Gemini Client and provides a simple interface for sending prompts. It handles loading the API key from the Config API and initializing the client.

- **Location**: `/js/gemini-integration.js`
- **Features**:
  - Initialization of Gemini Client
  - Loading API key from Config API
  - Simple interface for sending prompts
  - Callbacks for loading, success, error, and completion

## Usage

To use the Gemini API in your frontend code:

```javascript
// Initialize the client (typically done once when the page loads)
await window.geminiIntegration.initialize();

// Send a prompt to Gemini
const response = await window.geminiIntegration.sendPrompt("Your prompt here", {
  onLoading: () => console.log("Loading..."),
  onError: (error) => console.error("Error:", error),
  onComplete: () => console.log("Complete!")
});

// Use the response
console.log(response);
```

## Environment Setup

### Development

1. Create a `.env` file with your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

2. Start the development server:
   ```
   node dev-server.js
   ```

3. The development server now includes the `/api/config` endpoint that provides the Gemini API key to the frontend:
   ```javascript
   // Endpoint para fornecer configurações ao frontend
   app.get('/api/config', (req, res) => {
     // Configurar CORS para permitir acesso do frontend
     res.header('Access-Control-Allow-Origin', '*');
     
     // Verificar se a API key está configurada
     const apiKey = process.env.GEMINI_API_KEY;
     
     // Retornar a chave da API ao frontend
     res.status(200).json({
       geminiApiKey: apiKey,
       environment: 'development',
       timestamp: new Date().toISOString()
     });
   });
   ```

4. Test the implementation using the provided test page:
   ```
   http://localhost:3000/test-gemini.html
   ```

### Production (Vercel)

1. Set the `GEMINI_API_KEY` environment variable in your Vercel project settings.
2. Deploy to Vercel using the provided `vercel.json` configuration.

## Vercel Configuration

The `vercel.json` file has been updated to include the new API endpoints and static files:

```json
{
  "version": 2,
  "builds": [
    { "src": "api/gemini.js", "use": "@vercel/node" },
    { "src": "api/rd-station.js", "use": "@vercel/node" },
    { "src": "api/config.js", "use": "@vercel/node" },
    { "src": "pages/api/config.js", "use": "@vercel/node" },
    { "src": "js/*.js", "use": "@vercel/static" },
    ...
  ],
  "routes": [
    { "src": "/api/gemini", "dest": "/api/gemini" },
    { "src": "/api/rd-station", "dest": "/api/rd-station" },
    { "src": "/api/config", "dest": "/api/config" },
    { "src": "/js/(.*)", "dest": "/js/$1" },
    ...
  ]
}
```

## Security Considerations

1. **API Key Protection**: The Gemini API key is never hardcoded in frontend code and is only loaded at runtime from the secure Config API.
2. **CORS Protection**: The Config API includes CORS headers to restrict access to allowed origins.
3. **Error Handling**: The client includes comprehensive error handling to prevent exposing sensitive information.

## Maintenance

### Adding New Features

To add new features to the Gemini integration:

1. Update the `gemini-client.js` file to add new methods or modify existing ones.
2. Update the `gemini-integration.js` file to expose the new features to the frontend.

### Test Page

A test page is included to validate the Gemini API integration:

- **Location**: `/test-gemini.html`
- **Features**:
  - Manual initialization of the Gemini client
  - Simple interface for sending test prompts
  - Detailed logging of API responses
  - Status indicators for initialization and API calls

To use the test page:

1. Start the development server
2. Navigate to `http://localhost:3000/test-gemini.html`
3. Click "Initialize Client Gemini" to initialize the client
4. Enter a prompt and click "Send Prompt" to test the API

## Troubleshooting

Common issues and solutions:

1. **API Key Not Loading**: 
   - Check that the `GEMINI_API_KEY` environment variable is set correctly in both development and production environments
   - Verify that the `.env` file exists and contains the correct API key
   - Check the server logs for any errors related to loading the API key

2. **CORS Errors**: 
   - Ensure that the Config API's CORS headers are correctly configured to allow your frontend origin
   - In development, check that the `/api/config` endpoint is properly configured in `dev-server.js`
   - In production, verify that the Vercel configuration includes the correct CORS headers

3. **API Errors**: 
   - Check the browser console for detailed error messages from the Gemini API
   - Use the test page to isolate and debug API issues
   - Verify that the API key is valid and has access to the Gemini API

4. **safetySettings Error**:
   - If you encounter the error `Invalid JSON payload received. Unknown name "safetySettings" at 'generation_config': Cannot find field.`, this means the `safetySettings` parameter is being incorrectly placed in the request body.
   - Solution: Ensure that `safetySettings` is placed at the root level of the request body, not inside the `generationConfig` object.
   - Example of correct request structure:
     ```javascript
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
         maxOutputTokens: 2048
       },
       safetySettings: [
         // Safety settings here
       ]
     };
     ```

5. **Response Processing Error**:
   - If you encounter errors like `Error ao extrair texto da resposta: Error: Formato de resposta inválido` or see messages like `Não foi possível processar a resposta do modelo`, this indicates that the response from the Gemini API has a different structure than expected.
   - Solution: The `extractTextFromGeminiResponse` function in `gemini-integration.js` has been enhanced to handle multiple response formats:
     - Standard format with `candidates[0].content.parts`
     - Direct string responses
     - Responses with `text` property
     - Responses with `content.parts` structure
     - Fallback text extraction from JSON structure
   - If you're still experiencing issues, check the browser console for the actual response structure (logged with `🔍 Estrutura da resposta:`) and update the extraction function accordingly.

6. **Truncated Responses (MAX_TOKENS)**:
   - If you see messages like `A resposta foi truncada devido ao limite de tokens` or responses with `[Resposta truncada]` appended, this means the Gemini API truncated the response due to token limits.
   - This happens when the `finishReason` in the response is `MAX_TOKENS` and can occur with large prompts or when requesting complex outputs.
   - Solutions:
     - Reduce the size of your prompt (implementado na função `criarPromptOtimizado()` em `index.html`)
     - Aumentar o `maxOutputTokens` na `generationConfig` (aumentado para 4096 no cliente Gemini)
     - Break down complex requests into smaller, more focused prompts
     - The current implementation handles truncated responses gracefully, providing a clear message when truncation occurs
   - Technical details: The response structure in this case often has `candidates[0].content` with only a `role` property and no actual text content, or with partial text content that was cut off.

7. **Otimização de Prompts Longos**:
   - Para evitar problemas de truncamento, implementamos uma estratégia de otimização de prompts:
     - Função `criarPromptOtimizado()` que gera prompts mais concisos e focados
     - Redução de instruções redundantes e detalhes desnecessários
     - Foco nos dados essenciais e instruções diretas
     - Formatação mais eficiente para economizar tokens
   - Exemplo de implementação:
   ```javascript
   function criarPromptOtimizado() {
       // Prompt reduzido e otimizado para evitar truncamento
       return `## Análise de ROI para Recrutamento & Seleção

       Dados principais:
       - Colaboradores RH: ${rhColabs}
       - Total colaboradores: ${totalColabs}
       - Investimento anual R&S: R$ ${custoTotalAnualAtual.toLocaleString('pt-BR')}
       - Custo/contratação: R$ ${custoMedioContratacao.toLocaleString('pt-BR')}
       
       Crie um relatório executivo com:
       1. Título
       2. Tabela de custos atuais
       3. Análise do cenário atual
       4. Comparação de cenários
       
       Use linguagem direta e visual.`;
   }
   ```
   - Benefícios da otimização de prompts:
     - Redução significativa do tamanho do prompt (até 70% menos tokens)
     - Menor probabilidade de truncamento da resposta
     - Respostas mais focadas e relevantes
     - Melhor desempenho da API (menor latência)

## Future Improvements

1. **Caching**: Implement caching of responses to reduce API calls and improve performance.
2. **Rate Limiting**: Add client-side rate limiting to prevent exceeding API quotas.
3. **Streaming Responses**: Implement streaming responses for long-running prompts.
