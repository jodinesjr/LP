# Integração com RD Station Marketing - Guia Completo

## 📋 Visão Geral

Esta integração permite capturar leads através de um formulário modal que é exibido quando o usuário clica no botão "Calcular" na última etapa do wizard. Os dados são enviados para o RD Station Marketing através de uma API segura.

## 🔧 Configuração no Vercel

### 1. Variáveis de Ambiente
Configure a seguinte variável de ambiente no painel do Vercel:

```
RD_STATION_PUBLIC_TOKEN=6650956c3df5c8001903c213
```

**Nota**: O sistema suporta tanto tokens OAuth2 quanto API Keys do RD Station. O endpoint backend tentará automaticamente ambos os métodos de autenticação.

### 2. Deploy
Após configurar a variável de ambiente, faça o deploy normalmente.

**Como adicionar no Vercel:**
1. Acesse o dashboard do seu projeto no Vercel
2. Vá para "Settings" > "Environment Variables"
3. Adicione cada variável com seu respectivo valor
4. Certifique-se de que estão configuradas para "Production", "Preview" e "Development"

### 2. Deploy

Após configurar as variáveis de ambiente, faça o deploy normalmente. O Vercel irá:
- Construir as APIs em `/api/gemini.js` e `/api/rd-station.js`
- Servir os arquivos estáticos (HTML, CSS, JS)
- Aplicar as rotas configuradas no `vercel.json`

## 🏠 Desenvolvimento Local

Para desenvolvimento local, você pode usar diretamente a API do RD Station ou configurar variáveis de ambiente locais.

### Opção 1: Usar API Direta (Mais Simples)
O código já está configurado para detectar ambiente local e usar a API direta do RD Station.

### Opção 2: Usar Variáveis de Ambiente Locais
1. Copie o arquivo `.env.example` para `.env`
2. Configure as variáveis conforme necessário
3. Use um servidor local que suporte variáveis de ambiente

## 📊 Fluxo de Funcionamento

### 1. Usuário Preenche o Wizard
- Usuário completa as 4 etapas do formulário de cálculo
- Na última etapa, clica no botão "Calcular"

### 2. Modal de Leads é Exibido
- Modal full-page é exibido com duas colunas:
  - **Esquerda (60%)**: Animação do `form.html` (dashboard IA)
  - **Direita (40%)**: Formulário de captura de leads

### 3. Validação e Envio
- Formulário valida todos os campos obrigatórios:
  - Nome completo (mínimo 2 caracteres)
  - E-mail corporativo (formato válido)
  - Celular (formato brasileiro com DDD)
  - Cargo (mínimo 2 caracteres)
  - Tamanho da empresa (seleção obrigatória)

### 4. Integração com RD Station
- **Desenvolvimento**: Envia diretamente para API do RD Station
- **Produção**: Envia para endpoint `/api/rd-station` (mais seguro)

### 5. Exibição dos Resultados
- Após envio bem-sucedido, modal é fechado
- Resultados da calculadora são exibidos automaticamente

## 🔒 Segurança

### Produção (Vercel)
- API key fica protegida no servidor (variável de ambiente)
- Endpoint `/api/rd-station.js` faz a comunicação segura
- Validações server-side para todos os dados

### Desenvolvimento Local
- API key exposta no frontend (apenas para desenvolvimento)
- Comunicação direta com RD Station para facilitar testes

## 📝 Campos Enviados para RD Station

### Campos Padrão do RD Station
- `name`: Nome completo do lead (campo HTML: `id="name"`)
- `email`: E-mail corporativo (campo HTML: `id="email"`)
- `personal_phone`: Celular formatado (campo HTML: `id="personal_phone"`)

### Campos Personalizados do RD Station (prefixo cf_)
- `cf_cargo`: Cargo/função do lead (campo HTML: `id="cf_cargo"`)
- `cf_tamanho_de_empresa`: Tamanho da empresa (campo HTML: `id="cf_tamanho_de_empresa"`)
- `cf_origem`: "Calculadora de Custos" (fixo, adicionado automaticamente)
- `cf_data_calculo`: Data/hora do cálculo (fixo, adicionado automaticamente)
- `traffic_source`: "Calculadora Harpio" (fixo, adicionado automaticamente)

### Campos Técnicos (apenas produção)
- `cf_user_agent`: Navegador do usuário (adicionado automaticamente)
- `cf_ip_address`: IP do usuário (adicionado automaticamente)

### ⚠️ Importante: Mapeamento de Campos
Os campos do formulário HTML usam exatamente os mesmos IDs que o RD Station espera:
- **Campos padrão**: `name`, `email`, `personal_phone`
- **Campos personalizados**: devem começar com `cf_` seguido do nome exato configurado no RD Station

## 🎯 Identificador de Conversão

O identificador usado é: `contato-calculadora-harpio`

Este identificador permite:
- Segmentar leads vindos da calculadora
- Criar automações específicas no RD Station
- Acompanhar performance da landing page

## 🚨 Troubleshooting

### Erro: "Configuração do servidor incompleta"
- Verifique se a variável `RD_STATION_PUBLIC_TOKEN` está configurada no Vercel
- Certifique-se de que o valor está correto

### Erro: "Dados incompletos"
- Todos os campos do formulário são obrigatórios
- Verifique se as validações client-side estão funcionando

### Erro: "Email inválido"
- Validação server-side rejeitou o formato do email
- Verifique se o email tem formato válido (usuario@dominio.com)

### Modal não abre
- Verifique se o script `envia-rd.js` está carregando
- Confirme se a função `showLeadModal()` está definida
- Verifique console do navegador para erros JavaScript

### Resultados não aparecem após envio
- Verifique se a função `calculateAndShowResults()` existe
- Confirme se `window.showCalculationResults` está definida
- Verifique logs do console para erros

## 📈 Monitoramento

### Logs de Desenvolvimento
- Abra o console do navegador (F12)
- Procure por mensagens com prefixos:
  - `📝` - Ações do formulário
  - `📊` - Envios para RD Station
  - `✅` - Sucessos
  - `❌` - Erros

### Logs de Produção
- Acesse "Functions" no dashboard do Vercel
- Visualize logs da função `/api/rd-station`
- Monitore erros e sucessos

## 🔄 Atualizações Futuras

### Para adicionar novos campos:
1. Adicione o campo no HTML do formulário
2. Inclua validação no JavaScript (`validateLeadForm()`)
3. Adicione ao payload no endpoint `/api/rd-station.js`
4. Configure o campo personalizado no RD Station

### Para modificar validações:
1. Atualize `validateLeadForm()` no `envia-rd.js`
2. Atualize validações server-side no `/api/rd-station.js`

## 📞 Suporte

Para dúvidas sobre a integração:
1. Verifique os logs de erro no console
2. Confirme configuração das variáveis de ambiente
3. Teste primeiro em desenvolvimento local
4. Verifique se o RD Station está recebendo os dados

---

**Nota**: Esta integração foi desenvolvida especificamente para a Calculadora de Custos da Harpio e utiliza o token público do RD Station Marketing fornecido.
