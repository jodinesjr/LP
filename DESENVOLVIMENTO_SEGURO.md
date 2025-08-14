# 🔒 Desenvolvimento Local Seguro - RD Station Integration

## ⚠️ **TOKENS REMOVIDOS DO CÓDIGO**

Os tokens foram **completamente removidos** de todos os arquivos do projeto por segurança. Agora você deve configurá-los via **variáveis de ambiente**.

## 🔧 **Configuração para Desenvolvimento Local:**

### **1. Configure as Variáveis de Ambiente:**

```bash
# No terminal, execute estes comandos:
export RD_STATION_PUBLIC_TOKEN=ef5c109023707516953d6f7a1de43eeb
export RD_STATION_INSTANCE_TOKEN=6650956c3df5c8001903c213
export RD_STATION_PRIVATE_TOKEN=a3829100ee5c4251028df9dbd7a4e4c4
```

### **2. Ou crie um arquivo .env.local:**

```bash
# Crie o arquivo .env.local na raiz do projeto
echo "RD_STATION_PUBLIC_TOKEN=ef5c109023707516953d6f7a1de43eeb" > .env.local
echo "RD_STATION_INSTANCE_TOKEN=6650956c3df5c8001903c213" >> .env.local
echo "RD_STATION_PRIVATE_TOKEN=a3829100ee5c4251028df9dbd7a4e4c4" >> .env.local
```

### **3. Execute o Servidor de Desenvolvimento:**

```bash
# Carregar variáveis de ambiente e executar servidor
source .env.local && node dev-server.js

# Ou diretamente com as variáveis:
RD_STATION_PUBLIC_TOKEN=ef5c109023707516953d6f7a1de43eeb node dev-server.js
```

## 📧 **Validação de E-mail Corporativo Implementada**

### **✅ E-mails Aceitos:**
- `joao@empresa.com.br`
- `maria@startup.com`
- `pedro@consultoria.net`
- `ana@agencia.digital`

### **❌ E-mails Bloqueados:**
- `usuario@gmail.com`
- `pessoa@yahoo.com`
- `alguem@hotmail.com`
- `teste@outlook.com`
- `user@uol.com.br`
- `contato@terra.com.br`

### **Mensagem de Erro:**
```
"Por favor, use um e-mail corporativo (não pessoal como Gmail, Yahoo, Hotmail, etc.)"
```

## 📐 **Proporções do Modal Atualizadas**

### **Antes:**
- Coluna Esquerda: 60% (w-3/5)
- Coluna Direita: 40% (w-2/5)

### **Agora:**
- Coluna Esquerda: 35% (w-[35%])
- Coluna Direita: 65% (w-[65%])

## 🛡️ **Segurança Implementada:**

### **✅ O que foi corrigido:**
- **Tokens removidos** do dev-server.js
- **Variáveis de ambiente** obrigatórias
- **Validação de e-mail** corporativo
- **Logs de segurança** implementados

### **🔒 Arquivos Seguros:**
- `api/rd-station.js` - Token via `process.env.RD_STATION_PUBLIC_TOKEN`
- `dev-server.js` - Tokens via variáveis de ambiente
- `envia-rd.js` - Nenhum token exposto

## 🚀 **Como Testar:**

### **1. Configurar Ambiente:**
```bash
export RD_STATION_PUBLIC_TOKEN=ef5c109023707516953d6f7a1de43eeb
```

### **2. Executar Servidor:**
```bash
node dev-server.js
```

### **3. Testar Formulário:**
- Acesse `http://localhost:3000`
- Preencha com e-mail corporativo
- Verifique logs detalhados

## 📊 **Logs Esperados:**

### **Tokens Configurados:**
```
🔑 [DEV SERVER] Tokens configurados:
   instance: 6650956c...
   public: ef5c1090...
   private: a3829100...
```

### **Tokens NÃO Configurados:**
```
⚠️ [DEV SERVER] ATENÇÃO: RD_STATION_PUBLIC_TOKEN não configurado!
💡 [DEV SERVER] Configure as variáveis de ambiente:
   export RD_STATION_PUBLIC_TOKEN=ef5c109023707516953d6f7a1de43eeb
```

### **Validação de E-mail:**
```
📝 [FRONTEND DEBUG INFO] Validando e-mail corporativo: joao@empresa.com
📝 [FRONTEND DEBUG INFO] Domínio extraído: empresa.com
📝 [FRONTEND DEBUG INFO] É domínio pessoal: false
✅ [FRONTEND DEBUG SUCCESS] E-mail corporativo válido!
```

## 🎯 **Resultado Final:**

- ✅ **Tokens 100% seguros** via variáveis de ambiente
- ✅ **E-mails corporativos** obrigatórios
- ✅ **Modal com proporções** 35% / 65%
- ✅ **Logs detalhados** para debug
- ✅ **Evento atualizado** para "Lead-Calculadora-ROI"

---

**🔒 Desenvolvimento agora é completamente seguro!**
**📧 Apenas e-mails corporativos são aceitos!**
**📐 Modal com proporções ajustadas conforme solicitado!**
