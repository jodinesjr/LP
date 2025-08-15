// Script para testar o endpoint /api/auth-test
// Verifica se há problemas de autenticação no Vercel

const fetch = require('node-fetch');

// URL da aplicação no Vercel (produção)
const PROD_URL = 'https://123-i1h4ibz46-jodinesjrs-projects.vercel.app';

// URL local para testes
const LOCAL_URL = 'http://localhost:3001';

// Escolha qual URL usar
const BASE_URL = PROD_URL; // Altere para LOCAL_URL se quiser testar localmente

async function testAuthentication() {
  console.log(`\n🔍 Testando autenticação em ${BASE_URL}/api/auth-test`);
  
  try {
    const response = await fetch(`${BASE_URL}/api/auth-test`);
    const responseClone = response.clone(); // Clonar a resposta para evitar o erro "body used already"
    
    console.log(`\n📊 Status: ${response.status} ${response.statusText}`);
    console.log('📔 Headers:', JSON.stringify(Object.fromEntries([...response.headers]), null, 2));
    
    try {
      // Tentar analisar como JSON
      const data = await response.json();
      console.log('\n📝 Resposta JSON:', JSON.stringify(data, null, 2));
      
      if (response.ok) {
        console.log('\n✅ Teste de autenticação bem-sucedido!');
      } else {
        console.log('\n❌ Teste de autenticação falhou!');
      }
    } catch (error) {
      // Se não for JSON, mostrar o texto bruto
      const text = await responseClone.text();
      console.log('\n⚠️ A resposta não é um JSON válido');
      console.log('\n📝 Resposta bruta:', text.substring(0, 500) + '...');
      console.log('\n❌ Teste de autenticação falhou!');
    }
  } catch (error) {
    console.error('\n❌ Erro ao fazer a requisição:', error);
  }
}

// Executar o teste
testAuthentication();
