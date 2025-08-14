// API endpoint seguro para integração com RD Station Marketing
// Este arquivo deve ser usado em produção (Vercel) para manter a API key segura
// DEEP DEBUG VERSION - Logs detalhados para troubleshooting

export default async function handler(req, res) {
    console.log('🚀 [RD STATION API] ===== INÍCIO DA REQUISIÇÃO =====');
    console.log('📅 [RD STATION API] Timestamp:', new Date().toISOString());
    console.log('🌐 [RD STATION API] Método:', req.method);
    console.log('🔗 [RD STATION API] URL:', req.url);
    console.log('📋 [RD STATION API] Headers recebidos:', JSON.stringify(req.headers, null, 2));
    
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Responder a requisições OPTIONS (preflight)
    if (req.method === 'OPTIONS') {
        console.log(' [RD STATION API] Respondendo a preflight OPTIONS');
        res.status(200).end();
        return;
    }

    // Endpoint de debug para validação de deploy/roteamento
    if (req.method === 'GET') {
        return res.status(200).json({
            ok: true,
            message: 'RD Station API online',
            method: req.method,
            time: new Date().toISOString()
        });
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
        // Baseado na resposta da API: event_type, event_family e payload são obrigatórios
        // CAMPOS CORRIGIDOS conforme painel RD Station (cargo_ e tamanho_de_empresa)
        const payload = {
            "event_type": "CONVERSION",
            "event_family": "CDP",
            "payload": {
                "conversion_identifier": "Lead-Calculadora-ROI",
                "name": nome,
                "email": email,
                "personal_phone": celular,
                "cargo": cargo, // Campo alterado de cargo_ para cargo conforme solicitado
                "tamanho_de_empresa": tamanhoEmpresa, // Campo correto conforme painel RD Station
                "cf_origem": "Calculadora de Custos",
                "traffic_source": "Calculadora Harpio"
            }
        };
        
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
        let response;
        let lastError;
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
                
                // Payload simplificado para API Key (sem event_type/event_family)
                const simplePayload = payload.payload || payload;
                
                console.log(' [RD STATION API] URL:', apiUrl.replace(token, '***'));
                console.log(' [RD STATION API] API Key:', `${token.substring(0, 8)}...`);
                console.log(' [RD STATION API] Payload (API Key):', JSON.stringify(simplePayload, null, 2));
                
                response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'User-Agent': 'Calculadora-Harpio/1.0'
                    },
                    body: JSON.stringify(simplePayload)
                });

                console.log(' [RD STATION API] Status resposta API Key:', response.status, response.statusText);

                if (response.ok) {
                    console.log(' [RD STATION API] SUCESSO com API Key!');
                } else {
                    const errorText = await response.text();
                    console.log(' [RD STATION API] Erro API Key:', errorText);
                    throw new Error(`Erro ${response.status}: ${response.statusText}`);
                }
            } catch (apiKeyError) {
                console.log(' [RD STATION API] API Key também falhou:', apiKeyError.message);
                lastError = apiKeyError;
                method_used = 'AMBOS FALHARAM';
                // Se ambos falharam, usar a última resposta para tratamento de erro
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
        
        let result;
        try {
            const responseText = await response.text();
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
        
        res.status(500).json({ 
            error: 'Erro interno do servidor',
            message: 'Ocorreu um erro ao processar sua solicitação',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}
