# Páginas da Calculadora de ROI - Harpio Sprint

## 📄 Páginas Disponíveis

### 1. `index.html` (Página Principal)
- **URL:** `/` ou `/index.html`
- **Descrição:** Versão completa da calculadora com formulário de leads obrigatório
- **Funcionalidade:** Ao clicar em "Calcular", o usuário precisa preencher um formulário do RD Station antes de visualizar os resultados
- **Integração:** Conectada ao RD Station Marketing para captura de leads

### 2. `calculadora.html` (Versão Sem Formulário)
- **URL:** `/calculadora.html`
- **Descrição:** Versão simplificada da calculadora sem formulário obrigatório
- **Funcionalidade:** 
  - Página inicia diretamente no formulário (hero section removida)
  - Ao clicar em "Calcular", os resultados são mostrados diretamente
  - Scroll automático para o topo ao exibir resultados
- **Integração:** Script do RD Station desabilitado

## 🔧 Diferenças Técnicas

| Característica | index.html | calculadora.html |
|---------------|------------|------------------|
| Hero Section | ✅ Presente | ❌ Removida |
| Formulário RD Station | ✅ Obrigatório | ❌ Desabilitado |
| Script `envia-rd.js` | ✅ Ativo | ❌ Comentado |
| Página Inicial | Hero + Botão | Formulário direto |
| Exibição de Resultados | Após formulário | Direta |
| Scroll de Resultados | Meio da página | Topo da página |
| Captura de Leads | Sim | Não |

## 📝 Notas

- Ambas as páginas compartilham a mesma estrutura visual e funcionalidades de cálculo
- A página `index.html` não deve ser alterada para manter a integração com RD Station
- A página `calculadora.html` pode ser usada para demonstrações ou testes sem captura de leads
