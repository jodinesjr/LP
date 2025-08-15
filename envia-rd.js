// Script para integração com RD Station Marketing
// Configuração da API RD Station - DEEP DEBUG VERSION
const RD_API_CONFIG = {
    // Usar URL completa em desenvolvimento, relativa em produção
    BASE_URL: window.location.hostname === 'localhost' ? 'http://localhost:3001/api/rd-station' : '/api/rd-station',
    DEBUG: true, // Ativar logs detalhados
    CONVERSION_IDENTIFIER: 'Lead-Calculadora-ROI'
};

// Log da configuração de ambiente
console.log('🔄 [FRONTEND] Modo de desenvolvimento:', window.location.hostname === 'localhost');
console.log('🌐 [FRONTEND] URL da API:', RD_API_CONFIG.BASE_URL);

// Função para logs detalhados
function debugLog(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const prefix = `🔍 [FRONTEND DEBUG ${level.toUpperCase()}] ${timestamp}`;
    
    if (level === 'error') {
        console.error(`❌ ${prefix} ${message}`, data || '');
    } else if (level === 'warn') {
        console.warn(`⚠️ ${prefix} ${message}`, data || '');
    } else if (level === 'success') {
        console.log(`✅ ${prefix} ${message}`, data || '');
    } else {
        console.log(`📝 ${prefix} ${message}`, data || '');
    }
}

// Função para validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Função para validar se é e-mail corporativo (não pessoal)
function isCorporateEmail(email) {
    if (!email) return false;
    
    // Lista de domínios de e-mail pessoal que devem ser bloqueados
    const personalDomains = [
        'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'live.com',
        'icloud.com', 'me.com', 'aol.com', 'msn.com', 'terra.com.br',
        'uol.com.br', 'bol.com.br', 'ig.com.br', 'r7.com', 'globo.com',
        'globomail.com', 'oi.com.br', 'zipmail.com.br', 'pop.com.br',
        'click21.com.br', 'ibest.com.br', 'superig.com.br', 'yahoo.com.br',
        'hotmail.com.br', 'outlook.com.br', 'live.com.br', 'msn.com.br'
    ];
    
    const domain = email.toLowerCase().split('@')[1];
    
    debugLog('info', `Validando e-mail corporativo: ${email}`);
    debugLog('info', `Domínio extraído: ${domain}`);
    debugLog('info', `É domínio pessoal: ${personalDomains.includes(domain)}`);
    
    // Retorna true se NÃO for um domínio pessoal
    return !personalDomains.includes(domain);
}

// Função para validar telefone brasileiro
function isValidPhone(phone) {
    // Remove todos os caracteres não numéricos
    const cleanPhone = phone.replace(/\D/g, '');
    // Verifica se tem 10 ou 11 dígitos (com DDD)
    return cleanPhone.length >= 10 && cleanPhone.length <= 11;
}

// Função para formatar telefone
function formatPhone(phone) {
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length === 11) {
        return `(${cleanPhone.substr(0, 2)}) ${cleanPhone.substr(2, 5)}-${cleanPhone.substr(7, 4)}`;
    } else if (cleanPhone.length === 10) {
        return `(${cleanPhone.substr(0, 2)}) ${cleanPhone.substr(2, 4)}-${cleanPhone.substr(6, 4)}`;
    }
    return phone;
}

// Função para validar todos os campos do formulário
function validateLeadForm() {
    debugLog('info', '===== INÍCIO DO PROCESSAMENTO DO FORMULÁRIO =====');
    debugLog('info', 'Processando formulário de leads...');
    
    // Coletar dados do formulário com logs detalhados
    debugLog('info', 'Coletando dados dos campos do formulário...');
    
    const nomeElement = document.getElementById('name');
    const emailElement = document.getElementById('email');
    const celularElement = document.getElementById('personal_phone');
    const cargoElement = document.getElementById('cf_cargo');
    const tamanhoEmpresaElement = document.getElementById('cf_tamanho_de_empresa');
    
    debugLog('info', 'Verificando existência dos elementos DOM:', {
        nome: !!nomeElement,
        email: !!emailElement,
        celular: !!celularElement,
        cargo: !!cargoElement,
        tamanhoEmpresa: !!tamanhoEmpresaElement
    });
    
    const formData = {
        nome: nomeElement?.value.trim() || '',
        email: emailElement?.value.trim() || '',
        celular: celularElement?.value.trim() || '',
        cargo: cargoElement?.value.trim() || '',
        tamanhoEmpresa: tamanhoEmpresaElement?.value.trim() || ''
    };
    
    debugLog('info', 'Dados coletados do formulário:', formData);

    const errors = [];

    // Validação do nome
    if (!formData.nome || formData.nome.length < 2) {
        errors.push('Nome completo é obrigatório (mínimo 2 caracteres)');
    }

    // Validação do email
    if (!formData.email) {
        errors.push('E-mail é obrigatório');
    } else if (!isValidEmail(formData.email)) {
        errors.push('E-mail deve ter um formato válido');
    } else if (!isCorporateEmail(formData.email)) {
        errors.push('Por favor, use um e-mail corporativo (não pessoal como Gmail, Yahoo, Hotmail, etc.)');
    }

    // Validação do celular
    if (!formData.celular) {
        errors.push('Celular é obrigatório');
    } else if (!isValidPhone(formData.celular)) {
        errors.push('Celular deve ter um formato válido (DDD + número)');
    }

    // Validação do cargo
    if (!formData.cargo || formData.cargo.length < 2) {
        errors.push('Cargo é obrigatório (mínimo 2 caracteres)');
    }

    // Validação do tamanho da empresa
    if (!formData.tamanhoEmpresa) {
        errors.push('Tamanho da empresa é obrigatório');
    }

    // Validar campos obrigatórios com logs detalhados
    debugLog('info', 'Iniciando validação de campos obrigatórios...');
    
    const camposObrigatorios = ['nome', 'email', 'celular', 'cargo', 'tamanhoEmpresa'];
    const camposFaltando = camposObrigatorios.filter(campo => {
        const isEmpty = !formData[campo];
        debugLog('info', `Campo ${campo}:`, {
            valor: formData[campo],
            vazio: isEmpty,
            comprimento: formData[campo]?.length || 0
        });
        return isEmpty;
    });
    
    if (camposFaltando.length > 0) {
        debugLog('error', 'Campos obrigatórios faltando:', camposFaltando);
        alert(`Por favor, preencha os seguintes campos: ${camposFaltando.join(', ')}`);
        return;
    }
    
    debugLog('success', 'Todos os campos obrigatórios estão preenchidos!');

    return {
        isValid: errors.length === 0,
        errors: errors,
        data: {
            nome: formData.nome,
            email: formData.email,
            celular: formatPhone(formData.celular),
            cargo: formData.cargo,
            tamanhoEmpresa: formData.tamanhoEmpresa
        }
    };
}

// Função para exibir mensagens de erro
function showFormErrors(errors) {
    const errorContainer = document.getElementById('lead-form-errors');
    if (errors.length > 0) {
        errorContainer.innerHTML = `
            <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <div class="flex items-center mb-2">
                    <span class="material-icons text-red-500 mr-2">error</span>
                    <h4 class="text-red-800 font-semibold">Corrija os seguintes erros:</h4>
                </div>
                <ul class="list-disc list-inside text-red-700 text-sm">
                    ${errors.map(error => `<li>${error}</li>`).join('')}
                </ul>
            </div>
        `;
        errorContainer.classList.remove('hidden');
    } else {
        errorContainer.classList.add('hidden');
    }
}

// Função para exibir mensagem de sucesso
function showSuccessMessage(customMessage = null) {
    debugLog('info', 'Exibindo mensagem de sucesso...');
    
    // Exibir notificação moderna
    const notification = document.getElementById('success-notification');
    if (notification) {
        // Garantir que a notificação tenha z-index alto para ficar sobre tudo
        notification.style.zIndex = '10001';
        
        // Remover classes que escondem a notificação
        notification.classList.remove('translate-y-full', 'opacity-0');
        
        // Configurar timer para esconder a notificação após 5 segundos
        setTimeout(() => {
            notification.classList.add('translate-y-full', 'opacity-0');
        }, 5000);
        
        debugLog('success', 'Notificação de sucesso exibida');
    } else {
        debugLog('error', 'Elemento de notificação não encontrado!');
        
        // Fallback para o método antigo
        const successContainer = document.getElementById('lead-form-success');
        if (!successContainer) {
            debugLog('error', 'Container de sucesso não encontrado!');
            return;
        }
        
        successContainer.classList.remove('hidden');
        
        const message = customMessage || 'Formulário enviado com sucesso! Seus dados foram recebidos.';
        
        successContainer.innerHTML = `
            <div class="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <span class="material-icons text-green-500">check_circle</span>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm text-green-700">${message}</p>
                    </div>
                </div>
            </div>
        `;
        
        debugLog('success', 'Mensagem de sucesso exibida (fallback):', message);
    }
}

// Função para enviar dados para o RD Station
async function sendToRDStation(leadData) {
    debugLog('info', '===== ENVIANDO PARA RD STATION =====');
    debugLog('info', 'Endpoint:', RD_API_CONFIG.BASE_URL);
    debugLog('info', 'Dados a serem enviados:', leadData);
    debugLog('info', 'Payload JSON:', JSON.stringify(leadData, null, 2));
    
    const requestConfig = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(leadData)
    };
    
    debugLog('info', 'Configuração da requisição:', {
        method: requestConfig.method,
        headers: requestConfig.headers,
        bodySize: requestConfig.body.length
    });
    
    debugLog('info', 'Fazendo requisição HTTP...');
    const response = await fetch(RD_API_CONFIG.BASE_URL, requestConfig);

    if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erro na resposta da API RD Station:', {
            status: response.status,
            statusText: response.statusText,
            error: errorText
        });
        throw new Error(`Falha no envio: ${response.status} - ${response.statusText}`);
    }

    debugLog('success', 'Resposta HTTP OK! Processando dados...');
    
    let result;
    try {
        const responseText = await response.text();
        debugLog('info', 'Resposta bruta do servidor:', responseText);
        
        if (responseText) {
            result = JSON.parse(responseText);
            debugLog('success', 'Resposta parseada com sucesso:', result);
        } else {
            debugLog('warn', 'Resposta vazia, considerando sucesso');
            result = { success: true, message: 'Resposta vazia mas status OK' };
        }
    } catch (e) {
        debugLog('error', 'Erro ao fazer parse da resposta JSON:', e.message);
        result = { success: true, message: 'Erro no parse mas status OK' };
    }
    
    debugLog('success', '===== LEAD ENVIADO COM SUCESSO! =====');
    debugLog('success', 'Resultado final:', result);
    return result;
}

// Função principal para processar o formulário de leads
async function processLeadForm(event) {
    event.preventDefault();
    
    debugLog('info', '===== INÍCIO DO PROCESSAMENTO DO FORMULÁRIO =====');
    debugLog('info', 'Processando formulário de leads...');
    
    // Validar formulário
    const validation = validateLeadForm();
    
    if (!validation.isValid) {
        console.log('❌ Formulário inválido:', validation.errors);
        showFormErrors(validation.errors);
        return false;
    }

    // Limpar mensagens de erro
    showFormErrors([]);
    
    // Mostrar loading
    const submitButton = document.getElementById('lead-submit-btn');
    const originalButtonText = submitButton.innerHTML;
    submitButton.innerHTML = `
        <span class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Enviando...
        </span>
    `;
    submitButton.disabled = true;
    
    // Esperar 2 segundos antes de enviar (para mostrar o loader)
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
        // Enviar para RD Station
        debugLog('info', '🚀 Iniciando envio para RD Station...');
        await sendToRDStation(validation.data);
        debugLog('success', '✅ Lead enviado com sucesso para RD Station!');
        
        // Mostrar notificação de sucesso
        debugLog('info', '💬 Mostrando notificação de sucesso...');
        showSuccessMessage();
        
        // Fechar modal imediatamente
        debugLog('info', '🚪 Fechando modal imediatamente...');
        closeLeadModal();
        
        // Mostrar resultados da calculadora imediatamente
        debugLog('info', '📊 Mostrando resultados da calculadora...');
        showCalculationResults();
        
        debugLog('success', '🎉 Redirecionamento concluído com sucesso!');

    } catch (error) {
        debugLog('error', '===== ERRO NO ENVIO =====');
        debugLog('error', 'Tipo do erro:', error.constructor.name);
        debugLog('error', 'Mensagem do erro:', error.message);
        debugLog('error', 'Stack trace:', error.stack);
        
        // Verificar se é um erro de backend indisponível (404, Failed to fetch, CORS, etc.)
        const isBackendError = error.message.includes('404') || 
                              error.message.includes('Failed to fetch') ||
                              error.message.includes('CORS') ||
                              error.message.includes('ERR_FAILED');
        
        if (isBackendError) {
            debugLog('warn', 'ERRO DE BACKEND: Endpoint indisponível - usando fallback');
            debugLog('warn', 'Tipo de erro detectado:', error.message);
            debugLog('warn', 'Possíveis causas:', [
                'Arquivo aberto via file:// (CORS bloqueado)',
                'Servidor backend não está rodando',
                'Rota /api/rd-station não existe',
                'Problema de configuração do Vercel',
                'Arquivo api/rd-station.js não encontrado'
            ]);
            
            // Fallback: simular sucesso para permitir que o usuário veja os resultados
            debugLog('info', 'Ativando fallback: simulando envio bem-sucedido');
            debugLog('warn', 'ATENÇÃO: Os dados NÃO foram enviados para o RD Station (backend indisponível)');
            
            // Fechar modal imediatamente
            debugLog('info', '🚪 Fechando modal imediatamente (fallback)...');
            closeLeadModal();
            
            // Mostrar resultados da calculadora imediatamente
            debugLog('info', '📊 Mostrando resultados da calculadora (fallback)...');
            showCalculationResults();
            
            debugLog('success', '🎉 Redirecionamento concluído com sucesso (fallback)!');
            
            return; // Sair da função sem erro
        }
        
        debugLog('error', 'Dados que estavam sendo enviados:', validation.data);
        
        // Mostrar mensagem de erro para o usuário
        const errorMessage = document.createElement('div');
        errorMessage.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4';
        errorMessage.innerHTML = `
            <strong>Erro no envio:</strong><br>
            ${error.message}<br>
            <small>Verifique o console para mais detalhes.</small>
        `;
        
        const form = document.getElementById('lead-form');
        if (form) {
            form.insertBefore(errorMessage, form.firstChild);
        } else {
            debugLog('error', 'Formulário não encontrado para inserir mensagem de erro');
        }
        
        // Remover mensagem após 10 segundos (mais tempo para debug)
        setTimeout(() => {
            errorMessage.remove();
        }, 10000);
        
        // Reabilitar botão em caso de erro
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
        
        return;
    }
}

// Função para coletar dados do wizard para os cálculos
function collectWizardData() {
    debugLog('info', '📋 Coletando dados do wizard...');
    
    try {
        const wizardData = {
            // Dados do Step 1
            faturamentoAnual: document.getElementById('faturamento')?.value || '',
            numeroFuncionarios: document.getElementById('funcionarios')?.value || '',
            
            // Dados do Step 2
            tempoMedioVenda: document.getElementById('tempo-venda')?.value || '',
            ticketMedio: document.getElementById('ticket-medio')?.value || '',
            
            // Dados do Step 3
            leadsMes: document.getElementById('leads-mes')?.value || '',
            taxaConversao: document.getElementById('conversao')?.value || '',
            
            // Dados do Step 4
            investimentoMarketing: document.getElementById('investimento')?.value || '',
            custoAquisicao: document.getElementById('custo-aquisicao')?.value || ''
        };
        
        debugLog('info', 'Dados do wizard coletados:', wizardData);
        
        // Verificar se pelo menos alguns campos foram preenchidos
        const hasData = Object.values(wizardData).some(value => value && value.trim() !== '');
        if (hasData) {
            debugLog('success', 'Dados do wizard válidos encontrados');
            return wizardData;
        } else {
            debugLog('warn', 'Nenhum dado válido encontrado no wizard');
            return null;
        }
        
    } catch (error) {
        debugLog('error', 'Erro ao coletar dados do wizard:', error);
        return null;
    }
}

// Função para fechar o modal de leads
function closeLeadModal() {
    debugLog('info', '🚪 Fechando modal de leads...');
    
    const modal = document.getElementById('lead-modal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto'; // Restaurar scroll da página
        debugLog('success', 'Modal de leads fechado com sucesso');
        debugLog('info', 'Scroll da página restaurado');
    } else {
        debugLog('error', 'Modal de leads não encontrado (ID: lead-modal)');
    }
    
    // Garantir que o formulário seja resetado para próxima utilização
    const leadForm = document.getElementById('lead-form');
    if (leadForm) {
        leadForm.reset();
        debugLog('info', 'Formulário de leads resetado');
    }
    
    // Limpar mensagens de erro/sucesso
    const errorContainer = document.getElementById('lead-form-errors');
    const successContainer = document.getElementById('lead-form-success');
    
    if (errorContainer) {
        errorContainer.classList.add('hidden');
        errorContainer.innerHTML = '';
    }
    
    if (successContainer) {
        successContainer.classList.add('hidden');
        successContainer.innerHTML = '';
    }
    
    debugLog('success', 'Modal completamente fechado e limpo');
}

// Função para mostrar os resultados da calculadora
function showCalculationResults() {
    debugLog('info', '📊 Mostrando resultados da calculadora...');
    
    try {
        // Esconder a seção hero
        const heroSection = document.getElementById('home');
        if (heroSection) {
            heroSection.style.display = 'none';
            debugLog('success', 'Seção hero escondida');
        } else {
            debugLog('warn', 'Seção hero não encontrada (ID: home)');
        }
        
        // Garantir que a seção de formulário (wizard) seja escondida
        const wizardSection = document.getElementById('wizard-view');
        if (wizardSection) {
            wizardSection.style.display = 'none';
            debugLog('success', 'Seção do wizard escondida');
        }
        
        // Garantir que o main calculator container seja exibido
        const mainCalculator = document.getElementById('calculator');
        if (mainCalculator) {
            mainCalculator.style.display = 'block';
            debugLog('success', 'Main calculator container exibido');
        }
        
        // Garantir que a seção de resultados seja exibida
        const resultsSection = document.getElementById('results-view');
        if (resultsSection) {
            // Forçar exibição removendo todas as classes e estilos que podem esconder
            resultsSection.style.display = 'block';
            resultsSection.style.visibility = 'visible';
            resultsSection.classList.remove('hidden');
            resultsSection.classList.add('block');
            
            // Obter a altura do header fixo
            const header = document.querySelector('.fixed-header');
            const headerHeight = header ? header.offsetHeight : 0;
            
            // Ajustar o padding-top da seção de resultados para garantir que fique abaixo do header
            resultsSection.style.paddingTop = `${headerHeight + 40}px`;
            
            // Rolar para o topo da página
            window.scrollTo(0, 0);
            
            // Usamos um timeout para garantir que o scroll seja aplicado após a renderização da página
            setTimeout(() => {
                // Garantir que a seção de resultados esteja completamente visível
                window.scrollTo({
                    top: 0,
                    behavior: 'auto'
                });
                debugLog('info', 'Rolagem para o topo aplicada após renderização');
            }, 100);
            
            debugLog('success', `Seção de resultados exibida com padding-top ajustado para ${headerHeight + 40}px`);
            debugLog('info', 'Classes atuais:', resultsSection.className);
            debugLog('info', 'Style display:', resultsSection.style.display);
            debugLog('info', 'Style visibility:', resultsSection.style.visibility);
        }
        
        // Verificar se todos os campos do wizard têm dados antes de executar cálculos
        const wizardData = collectWizardData();
        if (wizardData) {
            debugLog('info', 'Dados do wizard coletados:', wizardData);
        } else {
            debugLog('warn', 'Nenhum dado do wizard encontrado - usando valores padrão');
        }
        
        // Executar a função de cálculo existente - MELHORADO COM VERIFICAÇÃO ROBUSTA
        debugLog('info', 'Verificando disponibilidade da função calculateAndShowResults...');
        
        // Verificar se os dados do wizard estão disponíveis ANTES de chamar a função
        debugLog('info', 'Verificando dados do wizard antes dos cálculos...');
        const rhColabsValue = document.getElementById('rh-colabs')?.value;
        const totalColabsValue = document.getElementById('total-colabs')?.value;
        const rhSalaryValue = document.getElementById('rh-salary')?.value;
        const monthlyJobsValue = document.getElementById('monthly-jobs')?.value;
        
        debugLog('info', 'Valores dos campos do wizard:', {
            'rh-colabs': rhColabsValue,
            'total-colabs': totalColabsValue,
            'rh-salary': rhSalaryValue,
            'monthly-jobs': monthlyJobsValue
        });
        
        // Verificação robusta da função calculateAndShowResults
        let calculateFunctionFound = false;
        
        // Verificar todas as possíveis localizações da função
        if (typeof window.calculateAndShowResults === 'function') {
            debugLog('success', 'Função encontrada em window.calculateAndShowResults');
            window.calculateAndShowResults();
            calculateFunctionFound = true;
        } else if (typeof calculateAndShowResults === 'function') {
            debugLog('success', 'Função encontrada em calculateAndShowResults (escopo local)');
            calculateAndShowResults();
            calculateFunctionFound = true;
        } else if (typeof window['calculateAndShowResults'] === 'function') {
            debugLog('success', 'Função encontrada via window["calculateAndShowResults"]');
            window['calculateAndShowResults']();
            calculateFunctionFound = true;
        } else {
            // Última tentativa: procurar a função no escopo global
            debugLog('warn', 'Função não encontrada diretamente, procurando no escopo global...');
            
            // Tentar encontrar a função no escopo global
            let globalCalculateFunction = null;
            try {
                // Avaliar o código para obter a função
                globalCalculateFunction = eval('calculateAndShowResults');
                if (typeof globalCalculateFunction === 'function') {
                    debugLog('success', 'Função encontrada via eval (não recomendado, mas funcional)');
                    globalCalculateFunction();
                    calculateFunctionFound = true;
                }
            } catch (e) {
                debugLog('error', 'Erro ao tentar acessar função via eval:', e.message);
            }
        }
        
        if (calculateFunctionFound) {
            debugLog('success', 'Cálculos executados com sucesso');
            
            // Verificar se a seção de resultados está visível após a execução
            setTimeout(() => {
                const resultsSection = document.getElementById('results-view');
                if (resultsSection) {
                    const isVisible = !resultsSection.classList.contains('hidden') && 
                                    resultsSection.style.display !== 'none';
                    debugLog('info', 'Seção de resultados visível após cálculos:', isVisible);
                    
                    // Verificar se os resultados foram populados
                    const roiElement = document.getElementById('roi-highlight');
                    const totalMonthlyElement = document.getElementById('stat-total-monthly');
                    debugLog('info', 'Verificando se resultados foram populados:', {
                        'roi-highlight': roiElement?.textContent,
                        'stat-total-monthly': totalMonthlyElement?.textContent
                    });
                    
                    if (!isVisible) {
                        debugLog('warn', 'Forçando exibição da seção de resultados...');
                        resultsSection.style.display = 'block';
                        resultsSection.classList.remove('hidden');
                        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            }, 100);
        } else {
            debugLog('error', 'ERRO CRÍTICO: Função calculateAndShowResults não encontrada em nenhum escopo!');
            debugLog('error', 'Tentando fallback manual...');
            
            // Fallback: mostrar seção de resultados mesmo sem cálculos
            const fallbackResultsSection = document.getElementById('results-view');
            if (fallbackResultsSection) {
                fallbackResultsSection.style.display = 'block';
                fallbackResultsSection.style.visibility = 'visible';
                fallbackResultsSection.classList.remove('hidden');
                fallbackResultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                debugLog('info', 'Fallback: seção de resultados exibida diretamente');
            } else {
                debugLog('error', 'ERRO CRÍTICO: Seção results-view não encontrada no DOM!');
            }
        }
        
        // Scroll suave para a seção de resultados
        setTimeout(() => {
            const resultsSection = document.getElementById('results-view');
            if (resultsSection) {
                resultsSection.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
                debugLog('success', 'Scroll para resultados executado');
            }
        }, 300);
        

        
        debugLog('success', 'Redirecionamento para resultados concluído!');
        
    } catch (error) {
        debugLog('error', 'Erro ao mostrar resultados:', error.message);
        
        // Fallback em caso de erro
        const resultsSection = document.getElementById('results-section');
        if (resultsSection) {
            resultsSection.style.display = 'block';
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            debugLog('info', 'Fallback de emergência executado');
        }
    }
}

// Função para mostrar mensagem de erro para um campo específico
function showFieldError(fieldId, message) {
    // Procurar pelo elemento de erro existente ou criar um novo
    let errorElement = document.getElementById(`${fieldId}-error`);
    
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.id = `${fieldId}-error`;
        errorElement.className = 'text-red-500 text-xs mt-1';
        
        const field = document.getElementById(fieldId);
        if (field && field.parentNode) {
            field.parentNode.appendChild(errorElement);
        }
    }
    
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

// Função para limpar mensagem de erro de um campo
function clearFieldError(fieldId) {
    const errorElement = document.getElementById(`${fieldId}-error`);
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

// Função para validar formulário em tempo real
function validateFormRealTime() {
    const nomeElement = document.getElementById('name');
    const emailElement = document.getElementById('email');
    const celularElement = document.getElementById('personal_phone');
    const cargoElement = document.getElementById('cf_cargo');
    const tamanhoEmpresaElement = document.getElementById('cf_tamanho_de_empresa');
    const submitButton = document.getElementById('lead-submit-btn');
    
    // Validar nome
    const isNomeValid = nomeElement?.value.trim().length >= 2;
    if (nomeElement && nomeElement.value.trim()) {
        if (!isNomeValid) {
            showFieldError('name', 'Nome deve ter pelo menos 2 caracteres');
        } else {
            clearFieldError('name');
        }
    }
    
    // Validar email
    let isEmailValid = false;
    if (emailElement && emailElement.value.trim()) {
        if (!isValidEmail(emailElement.value.trim())) {
            showFieldError('email', 'Formato de e-mail inválido');
        } else if (!isCorporateEmail(emailElement.value.trim())) {
            showFieldError('email', 'Por favor, use um e-mail corporativo');
        } else {
            clearFieldError('email');
            isEmailValid = true;
        }
    }
    
    // Validar celular
    let isCelularValid = false;
    if (celularElement && celularElement.value.trim()) {
        if (!isValidPhone(celularElement.value.trim())) {
            showFieldError('personal_phone', 'Formato de telefone inválido (DDD + número)');
        } else {
            clearFieldError('personal_phone');
            isCelularValid = true;
        }
    }
    
    // Validar cargo
    const isCargoValid = cargoElement?.value.trim().length > 0;
    if (cargoElement && !isCargoValid && cargoElement.value !== '') {
        showFieldError('cf_cargo', 'Selecione um cargo válido');
    } else {
        clearFieldError('cf_cargo');
    }
    
    // Validar tamanho da empresa
    const isTamanhoValid = tamanhoEmpresaElement?.value.trim().length > 0;
    if (tamanhoEmpresaElement && !isTamanhoValid && tamanhoEmpresaElement.value !== '') {
        showFieldError('cf_tamanho_de_empresa', 'Selecione o tamanho da empresa');
    } else {
        clearFieldError('cf_tamanho_de_empresa');
    }
    
    const isFormValid = isNomeValid && isEmailValid && isCelularValid && isCargoValid && isTamanhoValid;
    
    if (submitButton) {
        submitButton.disabled = !isFormValid;
        submitButton.classList.toggle('opacity-50', !isFormValid);
        submitButton.classList.toggle('cursor-not-allowed', !isFormValid);
    }
    
    return isFormValid;
}

// Inicializar quando o DOM estiver carregado - COM DEBUG PROFUNDO
document.addEventListener('DOMContentLoaded', function() {
    debugLog('info', '===== INICIALIZAÇÃO DO SCRIPT =====');
    debugLog('info', 'Script envia-rd.js carregado e DOM pronto!');
    debugLog('info', 'URL atual:', window.location.href);
    debugLog('info', 'User Agent:', navigator.userAgent);
    
    // Verificar todos os elementos necessários
    const elementos = {
        phoneInput: document.getElementById('personal_phone'),
        leadForm: document.getElementById('lead-form'),
        nomeInput: document.getElementById('name'),
        emailInput: document.getElementById('email'),
        cargoSelect: document.getElementById('cf_cargo'),
        tamanhoSelect: document.getElementById('cf_tamanho_de_empresa'),
        closeButton: document.getElementById('close-lead-modal'),
        submitButton: document.getElementById('lead-submit-btn')
    };
    
    debugLog('info', 'Verificação de elementos DOM:', {
        phoneInput: !!elementos.phoneInput,
        leadForm: !!elementos.leadForm,
        nomeInput: !!elementos.nomeInput,
        emailInput: !!elementos.emailInput,
        cargoSelect: !!elementos.cargoSelect,
        tamanhoSelect: !!elementos.tamanhoSelect,
        closeButton: !!elementos.closeButton,
        submitButton: !!elementos.submitButton
    });
    
    // Aplicar máscara de telefone
    if (elementos.phoneInput) {
        applyPhoneMask(elementos.phoneInput);
        debugLog('success', 'Máscara de telefone aplicada com sucesso');
    } else {
        debugLog('error', 'Campo de telefone não encontrado! ID esperado: personal_phone');
    }
    
    // Configurar envio do formulário
    if (elementos.leadForm) {
        // Remover event listeners existentes para evitar duplicação
        elementos.leadForm.removeEventListener('submit', processLeadForm);
        elementos.leadForm.addEventListener('submit', processLeadForm);
        debugLog('success', 'Event listener do formulário configurado com sucesso');
    } else {
        debugLog('error', 'Formulário de leads não encontrado! ID esperado: lead-form');
    }
    
    // Log das opções dos selects para verificar mapeamento
    if (elementos.cargoSelect) {
        const cargoOptions = Array.from(elementos.cargoSelect.options).map(opt => opt.value);
        debugLog('info', 'Opções do campo Cargo:', cargoOptions);
    }
    
    if (elementos.tamanhoSelect) {
        const tamanhoOptions = Array.from(elementos.tamanhoSelect.options).map(opt => opt.value);
        debugLog('info', 'Opções do campo Tamanho da Empresa:', tamanhoOptions);
    }
    
    // Configurar botão de fechar modal
    if (elementos.closeButton) {
        elementos.closeButton.addEventListener('click', function() {
            closeLeadModal();
            debugLog('success', 'Botão de fechar modal clicado');
        });
        debugLog('success', 'Event listener do botão de fechar configurado com sucesso');
    } else {
        debugLog('error', 'Botão de fechar modal não encontrado! ID esperado: close-lead-modal');
    }
    
    // Desabilitar o botão de envio inicialmente
    if (elementos.submitButton) {
        elementos.submitButton.disabled = true;
        elementos.submitButton.classList.add('opacity-50', 'cursor-not-allowed');
        debugLog('info', 'Botão de envio desabilitado inicialmente');
    }
    
    // Configurar validação em tempo real para todos os campos
    if (elementos.nomeInput) {
        elementos.nomeInput.addEventListener('input', validateFormRealTime);
    }
    
    if (elementos.emailInput) {
        elementos.emailInput.addEventListener('input', validateFormRealTime);
    }
    
    if (elementos.phoneInput) {
        elementos.phoneInput.addEventListener('input', validateFormRealTime);
    }
    
    if (elementos.cargoSelect) {
        elementos.cargoSelect.addEventListener('change', validateFormRealTime);
    }
    
    if (elementos.tamanhoSelect) {
        elementos.tamanhoSelect.addEventListener('change', validateFormRealTime);
    }
    
    debugLog('success', 'Event listeners para validação em tempo real configurados com sucesso');
    
    debugLog('success', 'Inicialização concluída!');
    debugLog('info', '===== FIM DA INICIALIZAÇÃO =====\n');
});

// Função para aplicar máscara de telefone (sem Cleave.js) - COM DEBUG
function applyPhoneMask(input) {
    debugLog('info', 'Aplicando máscara de telefone ao elemento:', input.id);
    
    input.addEventListener('input', function(e) {
        const originalValue = e.target.value;
        let value = originalValue.replace(/\D/g, '');
        
        debugLog('info', `Máscara telefone - Original: "${originalValue}" | Limpo: "${value}"`);
        
        if (value.length >= 11) {
            value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else if (value.length >= 7) {
            value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
        } else if (value.length >= 3) {
            value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
        }
        
        debugLog('info', `Máscara telefone - Resultado: "${value}"`);
        e.target.value = value;
    });
}
