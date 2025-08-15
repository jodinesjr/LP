// Script para testar o endpoint /api/check-env
// Verifica se as variáveis de ambiente estão configuradas corretamente no Vercel

const fetch = require('node-fetch');

// URL da aplicação no Vercel (produção)
const PROD_URL = 'https://123-7k26syauv-jodinesjrs-projects.vercel.app';

// URL local para testes
const LOCAL_URL = 'http://localhost:3000';

// Escolha qual URL usar
const BASE_URL = PROD_URL; // Altere para LOCAL_URL se quiser testar localmente

async function checkEnvironmentVariables() {
  console.log(`\n🔍 Verificando variáveis de ambiente em ${BASE_URL}/api/check-env`);
  
  try {
    const response = await fetch(`${BASE_URL}/api/check-env`);
    
    console.log(`\n📊 Status: ${response.status} ${response.statusText}`);
    console.log('📔 Headers:', JSON.stringify(Object.fromEntries([...response.headers]), null, 2));
    
    // Obter o texto da resposta primeiro
    const responseText = await response.text();
    
    // Tentar converter para JSON se possível
    try {
      if (responseText.trim().startsWith('{')) {
        const responseData = JSON.parse(responseText);
        console.log('\n📝 Resposta JSON:', JSON.stringify(responseData, null, 2));
        
        // Verificar especificamente o token RD Station
        if (responseData.variables && responseData.variables.RD_STATION_PUBLIC_TOKEN === 'Definido') {
          console.log('\n✅ Token RD Station está configurado!');
          console.log(`   Prefixo do token: ${responseData.tokenPrefix}`);
        } else {
          console.log('\n❌ Token RD Station NÃO está configurado!');
        }
      } else {
        console.log('\n⚠️ A resposta não é um JSON válido');
        console.log('\n📝 Resposta bruta:', responseText.substring(0, 500) + '...');
      }
    } catch (jsonError) {
      console.log('\n⚠️ Erro ao fazer parse do JSON:', jsonError.message);
      console.log('\n📝 Resposta bruta:', responseText.substring(0, 500) + '...');
    }
    
    if (response.ok) {
      console.log('\n✅ Verificação concluída com sucesso!');
    } else {
      console.log('\n❌ Verificação falhou com erro!');
    }
  } catch (error) {
    console.error('\n❌ Erro ao executar verificação:', error);
    console.error('Stack:', error.stack);
  }
}

// Executar a verificação
checkEnvironmentVariables();
