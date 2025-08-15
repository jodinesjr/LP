# Documentação do Formato de Payload para RD Station

Este documento descreve o formato correto do payload para envio de leads para o RD Station através da API.

## Formato do Payload para API Key

Quando utilizamos o método de autenticação via API Key (query parameter), o payload deve seguir este formato:

```json
{
  "event_type": "CONVERSION",
  "event_family": "CDP",
  "payload": {
    "conversion_identifier": "Lead-Calculadora-ROI",
    "email": "email@exemplo.com",
    "name": "Nome do Lead",
    "personal_phone": "(11) 98765-4321",
    "cf_cargo": "Especialista",
    "cf_tamanho_de_empresa": "25-50 funcionários",
    "cf_origem": "Calculadora de Custos",
    "traffic_source": "Calculadora Harpio",
    "available_for_mailing": true
  }
}
```

## Campos Obrigatórios

- `event_type`: Deve ser "CONVERSION"
- `event_family`: Deve ser "CDP"
- `payload`: Objeto contendo os dados do lead
  - `conversion_identifier`: Identificador da conversão
  - `email`: Email do lead (obrigatório)

## Valores Válidos para Campos Customizados

### cf_cargo

Valores aceitos pelo RD Station:
- "Estudante"
- "Estagiário(a)"
- "Auxiliar"
- "Assistente"
- "Analista"
- "Especialista"
- "Supervisor (a)"
- "Coordenador (a)"
- "Gerente / Head"
- "Diretor (a) / VP"
- "Sócio / CEO / Proprietário"
- "Business Partner"
- "Outros"

### cf_tamanho_de_empresa

Valores aceitos pelo RD Station:
- "1-5 funcionários"
- "5-25 funcionários"
- "25-50 funcionários"
- "50-100 funcionários"
- "100-200 funcionários"
- "200-500 funcionários"
- "500-1.000 funcionários"
- "1.000-5.000 funcionários"
- "5.000-10.000 funcionários"
- "10.000+ funcionários"

## Mapeamento de Valores

Para garantir compatibilidade com os valores aceitos pelo RD Station, implementamos funções de mapeamento:

### Mapeamento de Tamanho de Empresa

```javascript
const mapTamanhoEmpresa = (tamanho) => {
    const mapa = {
        "1-10": "1-5 funcionários",
        "11-50": "25-50 funcionários",
        "51-100": "50-100 funcionários",
        "101-500": "100-200 funcionários",
        "501+": "500-1.000 funcionários"
    };
    
    return mapa[tamanho] || "5-25 funcionários"; // Valor padrão se não encontrar
};
```

### Mapeamento de Cargo

```javascript
const mapCargo = (cargo) => {
    const mapa = {
        "Desenvolvedor": "Especialista",
        "Gerente": "Gerente / Head",
        "Diretor": "Diretor (a) / VP",
        "CEO": "Sócio / CEO / Proprietário",
        "Analista": "Analista",
        "Coordenador": "Coordenador (a)"
    };
    
    return mapa[cargo] || "Outros"; // Valor padrão se não encontrar
};
```

## Exemplo de Implementação

```javascript
const simplePayload = {
    "event_type": "CONVERSION",
    "event_family": "CDP",
    "payload": {
        "conversion_identifier": "Lead-Calculadora-ROI",
        "email": email,
        "name": nome || "Não informado",
        "personal_phone": celular || "",
        "cf_cargo": mapCargo(cargo),
        "cf_tamanho_de_empresa": mapTamanhoEmpresa(tamanhoEmpresa),
        "cf_origem": "Calculadora de Custos",
        "traffic_source": "Calculadora Harpio",
        "available_for_mailing": true
    }
};

// Envio para a API
const apiUrl = `https://api.rd.services/platform/conversions?api_key=${token}`;
const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Calculadora-Harpio/1.0'
    },
    body: JSON.stringify(simplePayload)
});
```

## Referências

- [Documentação oficial da API RD Station](https://developers.rdstation.com/reference/events)
- [Endpoint de Conversões](https://developers.rdstation.com/reference/post_platform-conversions)
