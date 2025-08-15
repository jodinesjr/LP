// Script para debugar as validações do wizard
console.log('=== DEBUG VALIDAÇÃO WIZARD ===');

// Função para testar seletores
function testSelectors() {
    console.log('\n1. Testando seletores de inputs:');
    
    // Testar cada etapa
    for (let step = 0; step < 3; step++) {
        const currentStepEl = document.querySelector(`.form-step[data-step="${step}"]`);
        if (!currentStepEl) {
            console.log(`❌ Etapa ${step} não encontrada`);
            continue;
        }
        
        const inputs = currentStepEl.querySelectorAll('input[type="number"], input[type="text"], input[class*="currency-input"], input[class*="number-input"]');
        console.log(`✅ Etapa ${step}: ${inputs.length} inputs encontrados`);
        
        inputs.forEach((input, index) => {
            const label = input.previousElementSibling;
            const labelText = label ? label.textContent.trim().substring(0, 30) : 'Sem label';
            console.log(`  - Input ${index + 1}: ${input.id || 'sem id'} (${input.type}) - ${labelText}...`);
        });
    }
}

// Função para testar extração de texto das labels
function testLabelExtraction() {
    console.log('\n2. Testando extração de texto das labels:');
    
    const allInputs = document.querySelectorAll('input[type="number"], input[type="text"], input[class*="currency-input"], input[class*="number-input"]');
    
    allInputs.forEach((input, index) => {
        let labelElement = input.previousElementSibling;
        let labelText = '';
        
        if (input.id === 'turnover-colabs') {
            const labelDiv = labelElement.querySelector('div.flex.items-center');
            if (labelDiv) {
                labelText = labelDiv.textContent.replace(/^\s*\w+\s*/, '').trim();
            }
        } else {
            if (labelElement) {
                const iconSpan = labelElement.querySelector('.material-icons');
                if (iconSpan) {
                    labelText = labelElement.textContent.replace(iconSpan.textContent, '').trim();
                } else {
                    labelText = labelElement.textContent.trim();
                }
            }
        }
        
        console.log(`Input ${input.id || index}: "${labelText}"`);
    });
}

// Função para simular validação
function simulateValidation(step) {
    console.log(`\n3. Simulando validação da etapa ${step}:`);
    
    const currentStepEl = document.querySelector(`.form-step[data-step="${step}"]`);
    if (!currentStepEl) {
        console.log(`❌ Etapa ${step} não encontrada`);
        return;
    }
    
    const inputs = currentStepEl.querySelectorAll('input[type="number"], input[type="text"], input[class*="currency-input"], input[class*="number-input"]');
    
    inputs.forEach(input => {
        let isEmpty = false;
        
        if (input.classList.contains('currency-input')) {
            isEmpty = !input.value || input.value.trim() === '' || input.value.trim() === 'R$ ';
        } else {
            isEmpty = !input.value || input.value.trim() === '';
        }
        
        console.log(`${input.id || 'sem id'}: ${isEmpty ? '❌ Vazio' : '✅ Preenchido'} (valor: "${input.value}")`);
    });
}

// Executar testes
if (typeof window !== 'undefined') {
    // No navegador
    document.addEventListener('DOMContentLoaded', function() {
        testSelectors();
        testLabelExtraction();
        
        // Adicionar botões de teste
        const debugDiv = document.createElement('div');
        debugDiv.style.position = 'fixed';
        debugDiv.style.top = '10px';
        debugDiv.style.right = '10px';
        debugDiv.style.background = 'white';
        debugDiv.style.border = '1px solid #ccc';
        debugDiv.style.padding = '10px';
        debugDiv.style.zIndex = '9999';
        debugDiv.innerHTML = `
            <h4>Debug Validação</h4>
            <button onclick="simulateValidation(0)">Testar Etapa 1</button>
            <button onclick="simulateValidation(1)">Testar Etapa 2</button>
            <button onclick="simulateValidation(2)">Testar Etapa 3</button>
        `;
        document.body.appendChild(debugDiv);
        
        // Expor funções globalmente
        window.simulateValidation = simulateValidation;
        window.testSelectors = testSelectors;
        window.testLabelExtraction = testLabelExtraction;
    });
} else {
    // No Node.js
    module.exports = { testSelectors, testLabelExtraction, simulateValidation };
}
