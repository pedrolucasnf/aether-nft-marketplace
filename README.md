# Aether — NFT Marketplace

Aplicação de descoberta, compra e gestão de conta para colecionadores de NFTs desenvolvida em React e TypeScript. Os fluxos de catálogo, carrinho, checkout idempotente, recibo imutável, autenticação, carteiras e eventos em tempo real operam sobre uma camada de simulação determinística com MSW e Socket.IO.

## 1. Pilha Tecnológica

- Interface e Linguagem: React 18, TypeScript 5, Vite
- Roteamento e Estado de URL: TanStack Router (@tanstack/react-router)
- Estado Remoto e Cache: TanStack Query v5 (@tanstack/react-query)
- Cliente HTTP: Axios
- Tempo Real: Socket.IO Client (socket.io-client)
- Estilização e Componentes: Tailwind CSS + componentes shadcn/ui (Radix UI)
- Mocks de Rede e Eventos: Mock Service Worker (msw v2) + @mswjs/socket.io-binding
- Testes E2E e Regressão Visual: Playwright (@playwright/test)
- Auditoria de Performance e Qualidade: Lighthouse CI (@lhci/cli)

## 2. Configuração e Variáveis de Ambiente

Variáveis padrão em .env.example:
- VITE_API_BASE_URL=/api
- VITE_ENABLE_MSW=true
- VITE_SOCKET_URL=http://localhost:5173

### Comandos de Execução

- npm install : Instala dependências
- npm run dev : Inicia ambiente de desenvolvimento com MSW e Socket.IO ativos
- npm run build : Gera build otimizado de produção
- npm run preview : Executa build localmente
- npm run typecheck : Verificação estática de tipos TypeScript
- npm run lint : Executa linter
- npm run test:e2e : Executa suíte E2E Playwright (Desktop 1440px e Mobile 390px)
- npm run lhci : Executa auditorias Lighthouse (Home e Detalhe em perfis Desktop e Mobile)

## 3. Credenciais Fictícias e Dados de Teste

Nenhuma senha é armazenada em texto claro (comparação via hash simulado sha256_).

| Perfil | E-mail | Senha | Estado Inicial da Fixture |
| :--- | :--- | :--- | :--- |
| Colecionadora 1 | colecionador@nft.io | 123456 | 2 carteiras (Ethereum principal e Polygon secundária), 2 favoritos (nft-1, nft-3) e 1 item no carrinho (nft-2). |
| Colecionador 2 | whale@nft.io | 123456 | 2 carteiras (Ethereum Multisig e Arbitrum), favoritos próprios (nft-5, nft-8) e carrinho vazio. |

### Cupons de Desconto Disponíveis

- WEB3VIP : 10% de desconto sobre o subtotal em ETH.
- GENESIS20 : 20% de desconto sobre o subtotal em ETH.
- EXPIRED10 : Simula cupom expirado (HTTP 422).
- Qualquer outro código : Simula cupom inexistente (HTTP 404).

## 4. Seleção, Reprodução de Falhas e Reset de Cenários

O botão flutuante "Controles de Cenário (MSW / Socket)" no canto inferior direito permite reproduzir todos os cenários determinísticos:

1. Alteração de preço ou esgotamento com carrinho aberto (nft.updated):
   Abra o carrinho ou a tela de Checkout e clique em "Alterar Preço (+0.25 ETH)" ou "Esgotar Edição (0 disp.)". O resumo é recalculado na hora e o Checkout bloqueia o envio até confirmar os novos valores.
2. Eventos duplicados ou fora de ordem:
   Clique em "Emitir Duplicata (mesma v)" ou "Emitir Evento Antigo (v-1)". O controle de versão descarta o evento sem regredir o estado.
3. Queda de conexão Socket.IO e reconciliação REST:
   Clique no indicador "Socket: ON" no topo para desconectar (OFF), dispare eventos e clique novamente para reconectar e reconciliar os recursos ativos via REST.
4. Timeout na criação do pedido com recuperação por Idempotência:
   No Checkout, ative "Timeout no Pedido (504)" e clique em "Confirmar Compra". Após o erro 504, clique novamente em "Confirmar Compra": a mesma Idempotency-Key recupera o pedido criado sem duplicar a compra.
5. Expiração de sessão durante navegação ou checkout:
   Ative "Expirar Sessão (401)" e realize qualquer ação. A aplicação redireciona para /login preservando a rota anterior e retoma o contexto após autenticar.
6. Reset completo:
   Clique em "Reset" no painel para restaurar integralmente as fixtures iniciais e limpar o localStorage.
   
