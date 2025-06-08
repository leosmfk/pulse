# Deployment Guide - Heart Monitor Dashboard

## Configuração de URLs

O dashboard pode ser configurado para conectar a diferentes backends através da variável de ambiente `REACT_APP_BACKEND_URL`.

### Desenvolvimento Local
Para desenvolvimento local, use:
```bash
npm start
```
Por padrão, conectará ao backend em `http://10.232.32.9:3000`

### Produção
Para produção com backend local, use:
```bash
npm run build:prod
```
Ou para iniciar em modo de desenvolvimento com configuração de produção:
```bash
npm run start:prod
```

### Configuração Manual
Você também pode definir a variável de ambiente manualmente:
```bash
REACT_APP_BACKEND_URL=http://SEU_IP:3000 npm start
```

### Deploy no Vercel
Ao fazer deploy no Vercel, configure a variável de ambiente:
1. No dashboard do Vercel, vá em Settings > Environment Variables  
2. Adicione: `REACT_APP_BACKEND_URL` = `http://SEU_IP_LOCAL:3000`
3. Faça redeploy da aplicação

## URL do Frontend Deployado
O frontend está disponível em: https://pulse-ten-cyan.vercel.app

## Configuração do Backend
O backend já foi configurado para aceitar conexões do frontend deployado através das configurações CORS. 