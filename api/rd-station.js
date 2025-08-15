// API endpoint seguro para integração com RD Station Marketing
// Este arquivo deve ser usado em produção (Vercel) para manter a API key segura
// DEEP DEBUG VERSION - Logs detalhados para troubleshooting

// Importar fetch para Node.js (necessário para versões do Node < 18)
import fetch from 'node-fetch';

export default async function handler(req, res) {
    console.log('🚀 [RD STATION API] ===== INÍCIO DA REQUISIÇÃO =====');
    console.log('📅 [RD STATION API] Timestamp:', new Date().toISOString());
    console.log('🌐 [RD STATION API] Método:', req.method);
    console.log('🔗 [RD STATION API] URL:', req.url);
    console.log('📋 [RD STATION API] Headers recebidos:', JSON.stringify(req.headers, null, 2));
    
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Responder a requisições OPTIONS (preflight)
    if (req.method === 'OPTIONS') {
        console.log(' [RD STATION API] Respondendo a preflight OPTIONS');
        res.status(200).end();
        return;
    }

    // Verificar método HTTP
    if (req.method !== 'POST') {
        console.error(' [RD STATION API] Método não permitido:', req.method);
        console.log(' [RD STATION API] Métodos aceitos: POST');
        return res.status(405).json({ 
            error: 'Método não permitido',
            message: 'Apenas POST é aceito',
            received_method: req.method,
            allowed_methods: ['POST']
        });
    }

    try {
        // Obter token da variável de ambiente (NUNCA hardcoded por segurança)
        const RD_API_KEY = process.env.RD_STATION_PUBLIC_TOKEN;
        
        console.log(' [RD STATION API] Token configurado:', RD_API_KEY ? `${RD_API_KEY.substring(0, 8)}...` : 'NÃO ENCONTRADO');
        console.log(' [RD STATION API] Variáveis de ambiente disponíveis:', Object.keys(process.env).filter(key => key.includes('RD')));
        
        if (!RD_API_KEY) {
            console.error(' [RD STATION API] Token RD Station não configurado');
            console.log(' [RD STATION API] Configure RD_STATION_PUBLIC_TOKEN nas variáveis de ambiente');
            return res.status(500).json({ 
                error: 'Configuração inválida',
                message: 'Token RD Station não encontrado',
                environment_vars: Object.keys(process.env).filter(key => key.includes('RD'))
            });
        }

        // Validar dados recebidos com logs detalhados
        console.log(' [RD STATION API] Body recebido (raw):', JSON.stringify(req.body, null, 2));
        
        const { nome, email, celular, cargo, tamanhoEmpresa } = req.body;
        
        console.log(' [RD STATION API] Campos extraídos:');
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
            console.error(' [RD STATION API] Campos obrigatórios ausentes:', missingFields);
            return res.status(400).json({ 
                error: 'Dados incompletos',
                message: 'Todos os campos são obrigatórios',
                missing_fields: missingFields,
                received_data: req.body
            });
        }

        // Validar formato do email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                error: 'Email inválido',
                message: 'Formato de email inválido' 
            });
        }

        // Montar payload correto para RD Station API de eventos/conversões via API Key
        // Baseado na documentação mais recente da RD Station
        // Formato para API de Conversões
        const conversionPayload = {
            "conversion_identifier": "Lead-Calculadora-ROI",
            "name": nome,
            "email": email,
            "personal_phone": celular,
            "cf_cargo": cargo, // Campo com prefixo cf_ para campo personalizado
            "cf_tamanho_de_empresa": tamanhoEmpresa, // Campo com prefixo cf_ para campo personalizado
            "cf_origem": "Calculadora de Custos",
            "traffic_source": "Calculadora Harpio",
            "available_for_mailing": true
        };
        
        // Formato para API de Eventos
        const eventsPayload = {
            "event_type": "CONVERSION",
            "event_family": "CDP",
            "payload": {
                "conversion_identifier": "Lead-Calculadora-ROI",
                "name": nome,
                "email": email,
                "personal_phone": celular,
                "cf_cargo": cargo,
                "cf_tamanho_de_empresa": tamanhoEmpresa,
                "cf_origem": "Calculadora de Custos",
                "traffic_source": "Calculadora Harpio",
                "available_for_mailing": true
            }
        };
        
        // Usar o payload de eventos para a primeira tentativa
        const payload = eventsPayload;
        
        console.log(' [RD STATION API] Payload montado:', JSON.stringify(payload, null, 2));

        console.log(' [RD STATION API] Enviando lead para RD Station:');
        console.log('   Conversion ID:', payload.payload.conversion_identifier);
        console.log('   Nome:', nome);
        console.log('   Email:', email);
        console.log('   Celular:', celular);
        console.log('   Cargo:', cargo);
        console.log('   Tamanho Empresa:', tamanhoEmpresa);
        console.log('   Timestamp:', new Date().toISOString());

        // Fazer requisição para RD Station - tentativa com diferentes métodos de autenticação
        const token = RD_API_KEY;
        let response = null;
        let lastError = null;
        let method_used = '';

        // Método 1: Tentar endpoint /platform/events com Bearer token (OAuth2)
        try {
            method_used = 'OAuth2 Bearer Token';
            console.log(' [RD STATION API] === TENTATIVA 1: OAuth2 Bearer token ===');
            const apiUrl = `https://api.rd.services/platform/events`;
            
            console.log(' [RD STATION API] URL:', apiUrl);
            console.log(' [RD STATION API] Authorization: Bearer', `${token.substring(0, 8)}...`);
            console.log(' [RD STATION API] Payload (OAuth2):', JSON.stringify(payload, null, 2));
            
            response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'User-Agent': 'Calculadora-Harpio/1.0'
                },
                body: JSON.stringify(payload)
            });

            console.log(' [RD STATION API] Status resposta OAuth2:', response.status, response.statusText);
            
            if (response.ok) {
                console.log(' [RD STATION API] SUCESSO com OAuth2 Bearer token!');
            } else if (response.status === 401) {
                const errorText = await response.text();
                console.log(' [RD STATION API] Erro 401 OAuth2:', errorText);
                throw new Error('Token OAuth2 inválido, tentando API Key...');
            } else {
                const errorText = await response.text();
                console.log(' [RD STATION API] Erro OAuth2:', errorText);
                throw new Error(`Erro ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.log(' [RD STATION API] OAuth2 falhou:', error.message);
            lastError = error;

            // Método 2: Tentar endpoint /platform/conversions com API Key
            try {
                method_used = 'API Key Query Parameter';
                console.log(' [RD STATION API] === TENTATIVA 2: API Key ===');
                const apiUrl = `https://api.rd.services/platform/conversions?api_key=${token}`;
                
                // Usar o payload específico para API de conversões
                const simplePayload = conversionPayload;
                
                console.log(' [RD STATION API] URL:', apiUrl.replace(token, '***'));
                console.log(' [RD STATION API] API Key:', `${token.substring(0, 8)}...`);
                console.log(' [RD STATION API] Payload (API Key):', JSON.stringify(simplePayload, null, 2));
                
                console.log(' [RD STATION API] Iniciando fetch para API Key...');
                response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'User-Agent': 'Calculadora-Harpio/1.0'
                    },
                    body: JSON.stringify(simplePayload)
                });
            } catch (apiKeyError) {
                console.error(' [RD STATION API] Erro na tentativa com API Key:', apiKeyError.message);
                lastError = apiKeyError;
            }
        }

        if (!response || !response.ok) {
            const errorData = response ? await response.text() : 'Sem resposta';
            console.error(' [RD STATION API] ===== ERRO FINAL =====');
            console.error(' [RD STATION API] Status:', response?.status || 'N/A');
            console.error(' [RD STATION API] StatusText:', response?.statusText || 'N/A');
            console.error(' [RD STATION API] Método usado:', method_used);
            console.error(' [RD STATION API] Último erro:', lastError?.message || 'N/A');
            console.error(' [RD STATION API] Resposta erro:', errorData);
            console.error(' [RD STATION API] Token usado:', `${token.substring(0, 8)}...`);
            
            return res.status(500).json({ 
                error: 'Erro no envio para RD Station',
                message: `Falha na comunicação com RD Station: ${response?.status || 'Sem resposta'}`,
                details: errorData,
                method_attempted: method_used,
                last_error: lastError?.message,
                token_prefix: `${token.substring(0, 8)}...`,
                timestamp: new Date().toISOString()
            });
        }

        // RD Station API pode retornar 200 com texto vazio ou JSON
        console.log(' [RD STATION API] ===== SUCESSO! =====');
        console.log(' [RD STATION API] Status final:', response.status);
        console.log(' [RD STATION API] Método que funcionou:', method_used);
        
        // Clone a resposta antes de usar o corpo para evitar o erro "body used already"
        const responseClone = response.clone();
        
        let result;
        try {
            const responseText = await responseClone.text();
            console.log(' [RD STATION API] Resposta bruta:', responseText);
            result = responseText ? JSON.parse(responseText) : { success: true };
            console.log(' [RD STATION API] Resposta parseada:', JSON.stringify(result, null, 2));
        } catch (e) {
            console.log(' [RD STATION API] Não foi possível fazer parse JSON, considerando sucesso');
            result = { success: true, message: 'Lead enviado com sucesso' };
        }
        
        console.log(' [RD STATION API] Lead enviado com sucesso para RD Station!');
        console.log(' [RD STATION API] Resultado final:', JSON.stringify(result, null, 2));

        // Retornar sucesso com logs detalhados
        const successResponse = {
            success: true,
            message: 'Lead enviado com sucesso para RD Station',
            method_used: method_used,
            data: {
                conversion_identifier: 'contato-calculadora-harpio',
                lead_data: {
                    nome,
                    email,
                    celular,
                    cargo,
                    tamanhoEmpresa
                },
                rd_station_response: result,
                timestamp: new Date().toISOString()
            }
        };
        
        console.log(' [RD STATION API] Resposta final para frontend:', JSON.stringify(successResponse, null, 2));
        console.log(' [RD STATION API] ===== FIM DA REQUISIÇÃO =====\n');
        
        res.status(200).json(successResponse);

    } catch (error) {
        console.error(' [RD Station API] Erro interno:', error);
        console.error(' [RD Station API] Stack trace:', error.stack);
        console.error(' [RD Station API] Tipo de erro:', error.constructor.name);
        
        // Verificar se é um erro de rede ou de fetch
        const errorMessage = error.message || 'Erro desconhecido';
        const isFetchError = errorMessage.includes('fetch') || 
                           errorMessage.includes('network') || 
                           errorMessage.includes('Failed to fetch');
        
        console.error(' [RD STATION API] É erro de fetch/rede:', isFetchError);
        
        // Verificar se é um erro de CORS
        const isCorsError = errorMessage.includes('CORS') || 
                          errorMessage.includes('cross-origin') || 
                          errorMessage.includes('Access-Control');
                          
        console.error(' [RD STATION API] É erro de CORS:', isCorsError);
        
        // Verificar se é um erro de autenticação
        const isAuthError = errorMessage.includes('auth') || 
                          errorMessage.includes('token') || 
                          errorMessage.includes('401') || 
                          errorMessage.includes('403');
                          
        console.error(' [RD STATION API] É erro de autenticação:', isAuthError);
        
        res.status(500).json({ 
            error: 'Erro interno do servidor',
            message: 'Ocorreu um erro ao processar sua solicitação',
            error_type: error.constructor.name,
            is_fetch_error: isFetchError,
            is_cors_error: isCorsError,
            is_auth_error: isAuthError,
            details: error.message,
            timestamp: new Date().toISOString()
        });
    }
}
