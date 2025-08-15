// Script para testar o endpoint /api/rd-station
// Executa uma requisição POST para o endpoint com dados de teste

const fetch = require('node-fetch');

// URL da aplicação no Vercel (produção)
const PROD_URL = 'https://123-7qc48dxll-jodinesjrs-projects.vercel.app';

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
    
    console.log(`\n📊 Status: ${response.status} ${response.statusText}`);
    console.log('📔 Headers:', JSON.stringify(Object.fromEntries([...response.headers]), null, 2));
    
    // Obter o texto da resposta primeiro
    const responseText = await response.text();
    console.log('\n📝 Resposta bruta:', responseText.substring(0, 500) + '...');
    
    // Tentar converter para JSON se possível
    try {
      if (responseText.trim().startsWith('{')) {
        const responseData = JSON.parse(responseText);
        console.log('\n📝 Resposta JSON:', JSON.stringify(responseData, null, 2));
      } else {
        console.log('\n⚠️ A resposta não é um JSON válido');
      }
    } catch (jsonError) {
      console.log('\n⚠️ Erro ao fazer parse do JSON:', jsonError.message);
    }
    
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
