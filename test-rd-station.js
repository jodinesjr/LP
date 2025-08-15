// Script para testar o endpoint /api/rd-station
// Executa uma requisição POST para o endpoint com dados de teste

const fetch = require('node-fetch');

// URL da aplicação no Vercel (produção)
const PROD_URL = 'https://123-two-sage.vercel.app';

// URL local para testes
const LOCAL_URL = 'http://localhost:3000';

// Escolha qual URL usar
const BASE_URL = PROD_URL; // Altere para LOCAL_URL se quiser testar localmente

// Dados de teste para envio
const testData = {
  nome: 'Teste Automatizado',
  email: 'teste@exemplo.com',
  celular: '(11) 98765-4321',
  cargo: 'Desenvolvedor',
  tamanhoEmpresa: '11-50',
  resultados: {
    custoTotal: 10000,
    economiaEstimada: 5000,
    tempoRetorno: 6
  }
};

// Função para testar o endpoint
async function testRdStationEndpoint() {
  console.log(`\n🚀 Testando endpoint /api/rd-station em ${BASE_URL}`);
  console.log('📦 Payload:', JSON.stringify(testData, null, 2));
  
  try {
    const response = await fetch(`${BASE_URL}/api/rd-station`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Test-Script/1.0'
      },
      body: JSON.stringify(testData)
    });
    
    const responseData = await response.json();
    
    console.log(`\n📊 Status: ${response.status} ${response.statusText}`);
    console.log('📄 Headers:', JSON.stringify(Object.fromEntries([...response.headers]), null, 2));
    console.log('📝 Resposta:', JSON.stringify(responseData, null, 2));
    
    if (response.ok) {
      console.log('\n✅ Teste concluído com SUCESSO!');
    } else {
      console.log('\n❌ Teste falhou com erro!');
    }
  } catch (error) {
    console.error('\n❌ Erro ao executar teste:', error);
    console.error('Stack:', error.stack);
  }
}

// Executar o teste
testRdStationEndpoint();
