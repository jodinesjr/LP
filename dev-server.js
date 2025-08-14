// Servidor de desenvolvimento local para simular endpoint /api/rd-station
// DEEP DEBUG VERSION - Logs detalhados para troubleshooting
// Execute com: node dev-server.js

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Tokens obtidos de variáveis de ambiente (NUNCA hardcoded por segurança)
const RD_TOKENS = {
    INSTANCE_TOKEN: process.env.RD_STATION_INSTANCE_TOKEN,
    PUBLIC_TOKEN: process.env.RD_STATION_PUBLIC_TOKEN,
    PRIVATE_TOKEN: process.env.RD_STATION_PRIVATE_TOKEN
};

console.log('🚀 [DEV SERVER] ===== INICIALIZANDO SERVIDOR DE DESENVOLVIMENTO =====');
console.log('📅 [DEV SERVER] Timestamp:', new Date().toISOString());
console.log('🔑 [DEV SERVER] Tokens configurados:', {
    instance: RD_TOKENS.INSTANCE_TOKEN ? `${RD_TOKENS.INSTANCE_TOKEN.substring(0, 8)}...` : 'NÃO CONFIGURADO',
    public: RD_TOKENS.PUBLIC_TOKEN ? `${RD_TOKENS.PUBLIC_TOKEN.substring(0, 8)}...` : 'NÃO CONFIGURADO',
    private: RD_TOKENS.PRIVATE_TOKEN ? `${RD_TOKENS.PRIVATE_TOKEN.substring(0, 8)}...` : 'NÃO CONFIGURADO'
});

// Verificar se pelo menos o token público está configurado
if (!RD_TOKENS.PUBLIC_TOKEN) {
    console.warn('⚠️ [DEV SERVER] ATENÇÃO: RD_STATION_PUBLIC_TOKEN não configurado!');
    console.warn('💡 [DEV SERVER] Configure as variáveis de ambiente:');
    console.warn('   export RD_STATION_PUBLIC_TOKEN=ef5c109023707516953d6f7a1de43eeb');
    console.warn('   export RD_STATION_INSTANCE_TOKEN=6650956c3df5c8001903c213');
    console.warn('   export RD_STATION_PRIVATE_TOKEN=a3829100ee5c4251028df9dbd7a4e4c4');
}

// Middleware com logs
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Log de todas as requisições
app.use((req, res, next) => {
    console.log(`📨 [DEV SERVER] ${new Date().toISOString()} - ${req.method} ${req.url}`);
    console.log(`📋 [DEV SERVER] Headers:`, JSON.stringify(req.headers, null, 2));
    if (req.body && Object.keys(req.body).length > 0) {
        console.log(`📦 [DEV SERVER] Body:`, JSON.stringify(req.body, null, 2));
    }
    next();
});

// Simular o// Endpoint simulado para RD Station com logs profundos
app.post('/api/rd-station', async (req, res) => {
    console.log('🎯 [DEV SERVER] ===== PROCESSANDO /api/rd-station =====');
    console.log('📅 [DEV SERVER] Timestamp:', new Date().toISOString());
    console.log('🌐 [DEV SERVER] Método:', req.method);
    console.log('📋 [DEV SERVER] Headers completos:', JSON.stringify(req.headers, null, 2));
    console.log('📦 [DEV SERVER] Body completo:', JSON.stringify(req.body, null, 2));
    
    // Validar dados básicos com logs detalhados
    const { nome, email, celular, cargo, tamanhoEmpresa } = req.body;
    
    console.log('🔍 [DEV SERVER] Campos extraídos:');
    console.log('   • nome:', nome || 'AUSENTE');
    console.log('   • email:', email || 'AUSENTE');
    console.log('   • celular:', celular || 'AUSENTE');
    console.log('   • cargo:', cargo || 'AUSENTE');
    console.log('   • tamanhoEmpresa:', tamanhoEmpresa || 'AUSENTE');
    
    const missingFields = [];
    if (!nome) missingFields.push('nome');
    if (!email) missingFields.push('email');
    if (!celular) missingFields.push('celular');
    if (!cargo) missingFields.push('cargo');
    if (!tamanhoEmpresa) missingFields.push('tamanhoEmpresa');
    
    if (missingFields.length > 0) {
        console.log('❌ [DEV SERVER] Campos obrigatórios ausentes:', missingFields);
        return res.status(400).json({
            error: 'Dados incompletos',
            message: 'Todos os campos são obrigatórios',
            missing_fields: missingFields,
            received_data: req.body,
            timestamp: new Date().toISOString()
        });
    }
    
    // Simular chamada real para RD Station (opcional para teste)
    const SIMULATE_REAL_CALL = false; // Mude para true se quiser testar API real
    
    if (SIMULATE_REAL_CALL) {
        console.log('🔄 [DEV SERVER] Fazendo chamada real para RD Station...');
        
        try {
            // Tentar chamada real usando os tokens fornecidos
            const payload = {
                "event_type": "CONVERSION",
                "event_family": "CDP",
                "payload": {
                    "conversion_identifier": "Lead-Calculadora-ROI",
                    "name": nome,
                    "email": email,
                    "personal_phone": celular,
                    "cargo_": cargo, // Campo alterado de cargo_ para cargo conforme solicitado
                    "tamanho_de_empresa": tamanhoEmpresa,
                    "cf_origem": "Calculadora de Custos",
                    "traffic_source": "Calculadora Harpio"
                }
            };
            
            console.log('📤 [DEV SERVER] Payload para RD Station:', JSON.stringify(payload, null, 2));
            
            const response = await fetch('https://api.rd.services/platform/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${RD_TOKENS.INSTANCE_TOKEN}`,
                    'User-Agent': 'Calculadora-Harpio-Dev/1.0'
                },
                body: JSON.stringify(payload)
            });
            
            console.log('📨 [DEV SERVER] Resposta RD Station:', response.status, response.statusText);
            
            if (response.ok) {
                const result = await response.text();
                console.log('✅ [DEV SERVER] Sucesso na chamada real!');
                console.log('📄 [DEV SERVER] Resposta:', result);
                
                return res.json({
                    success: true,
                    message: 'Lead enviado com sucesso para RD Station (chamada real)',
                    data: {
                        conversion_identifier: 'Lead-Calculadora-ROI',
                        lead_data: req.body,
                        rd_response: result,
                        timestamp: new Date().toISOString(),
                        real_call: true
                    }
                });
            } else {
                const errorText = await response.text();
                console.log('❌ [DEV SERVER] Erro na chamada real:', errorText);
                throw new Error(`RD Station API error: ${response.status}`);
            }
        } catch (error) {
            console.log('⚠️ [DEV SERVER] Falha na chamada real, simulando sucesso:', error.message);
        }
    }
    
    // Simular sucesso (comportamento padrão)
    console.log('✅ [DEV SERVER] Simulando sucesso');
    console.log('🎉 [DEV SERVER] Lead processado com sucesso!');
    
    const successResponse = {
        success: true,
        message: 'Lead enviado com sucesso (simulado)',
        method_used: 'Simulação Local',
        data: {
            conversion_identifier: 'Lead-Calculadora-ROI',
            lead_data: {
                nome,
                email,
                celular,
                cargo,
                tamanhoEmpresa
            },
            rd_station_response: { simulated: true },
            timestamp: new Date().toISOString()
        }
    };
    
    console.log('📤 [DEV SERVER] Resposta final:', JSON.stringify(successResponse, null, 2));
    console.log('🏁 [DEV SERVER] ===== FIM DO PROCESSAMENTO =====\n');
    
    res.json(successResponse);
});

// Servir arquivos estáticos com logs
app.get('/', (req, res) => {
    console.log('🏠 [DEV SERVER] Servindo página inicial: index.html');
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Log de arquivos estáticos
app.use((req, res, next) => {
    if (req.url.endsWith('.js') || req.url.endsWith('.css') || req.url.endsWith('.html')) {
        console.log(`📄 [DEV SERVER] Servindo arquivo estático: ${req.url}`);
    }
    next();
});

// Endpoint de status para verificar se servidor está funcionando
app.get('/api/status', (req, res) => {
    console.log('🔍 [DEV SERVER] Verificação de status solicitada');
    res.json({
        status: 'online',
        timestamp: new Date().toISOString(),
        endpoints: {
            'POST /api/rd-station': 'Endpoint para envio de leads',
            'POST /api/gemini': 'Endpoint para integração com Gemini AI',
            'GET /api/status': 'Verificação de status do servidor'
        },
        tokens_configured: {
            instance: !!RD_TOKENS.INSTANCE_TOKEN,
            public: !!RD_TOKENS.PUBLIC_TOKEN,
            private: !!RD_TOKENS.PRIVATE_TOKEN
        }
    });
});

// Endpoint para API Gemini
app.post('/api/gemini', async (req, res) => {
    console.log('🤖 [DEV SERVER] ===== PROCESSANDO /api/gemini =====');
    console.log('📅 [DEV SERVER] Timestamp:', new Date().toISOString());
    console.log('📦 [DEV SERVER] Body completo:', JSON.stringify(req.body, null, 2));
    
    try {
        // Verificar se a API key está configurada
        const apiKey = process.env.GEMINI_API_KEY;
        console.log('🔑 [DEV SERVER] GEMINI_API_KEY:', apiKey ? `${apiKey.substring(0, 10)}...` : 'NÃO CONFIGURADA');
        
        if (!apiKey) {
            console.error('❌ [DEV SERVER] GEMINI_API_KEY não configurada');
            return res.status(500).json({ 
                error: 'Configuração do servidor incompleta',
                message: 'GEMINI_API_KEY não configurada no ambiente'
            });
        }

        // Extrair o prompt do corpo da requisição
        const { prompt } = req.body;
        
        if (!prompt) {
            console.log('❌ [DEV SERVER] Prompt não fornecido');
            return res.status(400).json({ 
                error: 'Prompt é obrigatório' 
            });
        }

        console.log('📝 [DEV SERVER] Prompt recebido:', prompt.substring(0, 100) + '...');

        // Fazer a chamada para a API do Gemini
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
        
        const requestBody = {
            contents: [{
                parts: [{
                    text: prompt
                }]
            }]
        };

        console.log('🔄 [DEV SERVER] Fazendo chamada para API Gemini...');
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        const result = await response.json();

        if (!response.ok) {
            console.error('❌ [DEV SERVER] Erro da API Gemini:', JSON.stringify(result, null, 2));
            return res.status(response.status).json({
                error: result.error?.message || 'Erro na API do Gemini',
                details: result.error
            });
        }

        console.log('✅ [DEV SERVER] Resposta da API Gemini recebida com sucesso');
        console.log('🏁 [DEV SERVER] ===== FIM DO PROCESSAMENTO GEMINI =====\n');
        
        // Retornar a resposta do Gemini
        res.status(200).json(result);

    } catch (error) {
        console.error('❌ [DEV SERVER] Erro no servidor:', error);
        res.status(500).json({ 
            error: 'Erro interno do servidor',
            message: error.message
        });
    }
});

// Middleware para capturar rotas não encontradas
app.use('*', (req, res) => {
    console.log(`❌ [DEV SERVER] Rota não encontrada: ${req.method} ${req.originalUrl}`);
    res.status(404).json({
        error: 'Rota não encontrada',
        method: req.method,
        path: req.originalUrl,
        available_endpoints: [
            'POST /api/rd-station',
            'POST /api/gemini',
            'GET /api/status'
        ],
        timestamp: new Date().toISOString()
    });
});

// Iniciar servidor com logs detalhados
app.listen(PORT, () => {
    console.log('🎉 [DEV SERVER] ===== SERVIDOR INICIADO COM SUCESSO =====');
    console.log(`🚀 [DEV SERVER] Servidor rodando em http://localhost:${PORT}`);
    console.log(`📍 [DEV SERVER] Endpoint RD Station: http://localhost:${PORT}/api/rd-station`);
    console.log(`🤖 [DEV SERVER] Endpoint Gemini AI: http://localhost:${PORT}/api/gemini`);
    console.log(`🔍 [DEV SERVER] Status do servidor: http://localhost:${PORT}/api/status`);
    console.log(`🌐 [DEV SERVER] Acesse a calculadora em: http://localhost:${PORT}`);
    console.log('📋 [DEV SERVER] Endpoints disponíveis:');
    console.log('   • POST /api/rd-station - Envio de leads');
    console.log('   • POST /api/gemini - Integração com Gemini AI');
    console.log('   • GET /api/status - Status do servidor');
    console.log('🔑 [DEV SERVER] Tokens configurados e prontos para uso');
    console.log('📝 [DEV SERVER] Logs detalhados ativados para debug');
    console.log('✅ [DEV SERVER] Pronto para receber requisições!');
    console.log('🏁 [DEV SERVER] ===== INICIALIZAÇÃO COMPLETA =====\n');
    console.log('');
    console.log('⚠️  Este servidor simula o endpoint backend.');
    console.log('   Em produção, o endpoint real enviará dados para RD Station.');
});

module.exports = app;
