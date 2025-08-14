# 🚀 Configuração do Vercel - RD Station Integration

## 🔐 **VARIÁVEIS DE AMBIENTE OBRIGATÓRIAS**

Para que a integração com RD Station funcione em produção, você **DEVE** configurar a seguinte variável de ambiente no Vercel:

### **Variável de Ambiente:**
```
Nome da Variável: RD_STATION_PUBLIC_TOKEN
Valor: ef5c109023707516953d6f7a1de43eeb
```

## 📋 **Como Configurar no Vercel:**

### **Método 1: Via Dashboard do Vercel**
1. Acesse seu projeto no [Vercel Dashboard](https://vercel.com/dashboard)
2. Vá em **Settings** → **Environment Variables**
3. Clique em **Add New**
4. Configure:
   - **Name**: `RD_STATION_PUBLIC_TOKEN`
   - **Value**: `ef5c109023707516953d6f7a1de43eeb`
   - **Environment**: `Production`, `Preview`, `Development` (marque todos)
5. Clique em **Save**

### **Método 2: Via Vercel CLI**
```bash
vercel env add RD_STATION_PUBLIC_TOKEN
# Cole o valor: ef5c109023707516953d6f7a1de43eeb
# Selecione todos os ambientes (Production, Preview, Development)
```

## 🎯 **Informações do Evento RD Station:**

### **Conversion Identifier Atualizado:**
```
Evento: Lead-Calculadora-ROI
```

Este é o identificador que será usado para rastrear as conversões no RD Station Marketing.

## 🔒 **Segurança Implementada:**

### ✅ **O que foi corrigido:**
- **Token removido** do código frontend
- **Token removido** de qualquer hardcode no backend
- **Token protegido** via variável de ambiente
- **Endpoint seguro** `/api/rd-station` implementado

### ❌ **O que NÃO fazer:**
- Nunca colocar o token diretamente no código
- Nunca fazer commit do token no Git
- Nunca expor o token no frontend

## 🧪 **Como Testar:**

### **1. Desenvolvimento Local:**
```bash
# Definir variável de ambiente local
export RD_STATION_PUBLIC_TOKEN=ef5c109023707516953d6f7a1de43eeb

# Executar servidor de desenvolvimento
node dev-server.js
```

### **2. Produção (Vercel):**
- Configure a variável de ambiente conforme instruções acima
- Faça deploy do projeto
- Teste o formulário de leads

## 📊 **Monitoramento:**

### **Logs Esperados em Produção:**
```
🚀 [RD STATION API] ===== INÍCIO DA REQUISIÇÃO =====
🔑 [RD STATION API] Token configurado: ef5c1090...
📦 [RD STATION API] Payload montado com campos corretos
🔄 [RD STATION API] === TENTATIVA 1: OAuth2 Bearer token ===
✅ [RD STATION API] SUCESSO com OAuth2 Bearer token!
```

### **Como Verificar Logs no Vercel:**
1. Vá em **Functions** no dashboard do projeto
2. Clique na função `/api/rd-station`
3. Veja os logs em tempo real

## 🎯 **Campos Mapeados Corretamente:**

### **Payload Final Enviado:**
```json
{
  "event_type": "CONVERSION",
  "event_family": "CDP",
  "payload": {
    "conversion_identifier": "Lead-Calculadora-ROI",
    "name": "Nome do Lead",
    "email": "email@exemplo.com",
    "personal_phone": "(11) 99999-8888",
    "cargo_": "Gerente / Head",
    "tamanho_de_empresa": "100-200 funcionários",
    "cf_origem": "Calculadora de Custos",
    "traffic_source": "Calculadora Harpio"
  }
}
```

## 🔧 **Troubleshooting:**

### **Erro: "Token RD Station não encontrado"**
- ✅ Verifique se a variável `RD_STATION_PUBLIC_TOKEN` está configurada
- ✅ Confirme se o valor está correto: `ef5c109023707516953d6f7a1de43eeb`
- ✅ Certifique-se de que está configurada para todos os ambientes

### **Erro: "Falha na comunicação com RD Station"**
- ✅ Verifique se o token está válido no painel do RD Station
- ✅ Confirme se o evento "Lead-Calculadora-ROI" existe no RD Station
- ✅ Verifique os logs detalhados para identificar o problema específico

## 📞 **Suporte:**

Se encontrar problemas:
1. **Verifique os logs** detalhados implementados
2. **Confirme a configuração** da variável de ambiente
3. **Teste localmente** primeiro com o servidor de desenvolvimento
4. **Valide no painel** do RD Station se os leads estão chegando

---

**✅ Configuração completa e segura implementada!**
**🔒 Token protegido via variável de ambiente**
**🎯 Evento atualizado para "Lead-Calculadora-ROI"**
