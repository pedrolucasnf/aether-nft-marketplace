# Arquitetura e Decisões Técnicas (ARCHITECTURE.md)

## 1. Organização e Isolamento de Camadas

- Transporte HTTP (Axios): Centraliza chamadas REST em /api/*, anexando token de sessão e Idempotency-Key nas mutações de pedido.
- Estado Assíncrono (TanStack Query): Isola o cache por usuário (userId | 'guest') e pelos parâmetros de consulta da URL (q, category, status, network, minEth, maxEth, sort, page).
- Aritmética Decimal Exata em ETH: Valores em ETH trafegam como strings decimais ("1.4500") e são convertidos para inteiros em escala de micro-ETH (10^6) durante somas de subtotal, aplicação de desconto percentual e taxas de rede, evitando erros de ponto flutuante IEEE 754.
- Camada de Mocks (MSW + Socket.IO): Mantém estado consistente entre catálogo, favoritos, carrinho, perfil, carteiras e pedidos no localStorage, permitindo recarregar a página sem perder o contexto e restaurar o cenário padrão via POST /api/mocks/reset.

## 2. Contratos REST

| Recurso | Operação | Endpoint | Respostas e Códigos de Erro |
| :--- | :--- | :--- | :--- |
| Sessão e Conta | Cadastro, Login, Sessão, Logout | POST /api/auth/register, POST /api/auth/login, GET /api/auth/session, POST /api/auth/logout | 200/201 sessão autenticada; 401 credenciais inválidas ou sessão expirada; 409 e-mail já cadastrado. |
| NFTs | Listagem paginada e Detalhe | GET /api/nfts, GET /api/nfts/:id | 200 itens paginados ou detalhe; 404 NFT inexistente; 500 falha transitória simulada. |
| Favoritos | Inclusão e Remoção (Otimista) | POST /api/favorites/:id, DELETE /api/favorites/:id | 200 atualizado; 401 não autenticado; 503 falha com rollback automático na UI. |
| Carrinho | Consulta, Inclusão, Edição, Remoção | GET /api/cart, POST /api/cart/items, PATCH /api/cart/items/:id, DELETE /api/cart/items/:id | 200 carrinho atualizado; 409 limite de edições disponíveis excedido. |
| Cotação e Cupom | Aplicação e Remoção de Cupom | POST /api/quote/coupon, DELETE /api/quote/coupon | 200 resumo recalculado; 404 cupom inválido; 422 cupom expirado. |
| Pedidos | Criação Idempotente e Recibo | POST /api/orders, GET /api/orders, GET /api/orders/:id | 201 pedido criado (PENDING); 200 pedido recuperado pela mesma Idempotency-Key; 409 chave reutilizada com payload diferente ou cotação desatualizada; 504 timeout simulado. |
| Perfil e Carteiras | Edição de Dados, Senha e Carteiras | PATCH /api/profile, POST /api/profile/password, POST /api/wallets, PATCH /api/wallets/:id | 200/201 atualizado; 422 erro de validação ou senha atual incorreta. |

## 3. Eventos em Tempo Real (Socket.IO) e Reconciliação com REST

| Evento | Payload | Comportamento na Interface |
| :--- | :--- | :--- |
| nft.updated | { id, priceEth, availableEditions, version } | Atualiza preço e estoque no catálogo, detalhe e carrinho; exige nova confirmação no checkout se o item estiver no carrinho. |
| order.updated | { id, userId, status, version, txHash, failureReason } | Transiciona pedido de PENDING para CONFIRMED (abatendo apenas os itens comprados do carrinho) ou DECLINED (preservando os itens no carrinho). |

### Controle de Versão e Reconexão
- Cada entidade possui um contador monotônico version. O cliente armazena a última versão aplicada em seenSocketVersions e descarta eventos com payload.version <= lastSeenVersion.
- Pedidos em estado CONFIRMED ou DECLINED são tratados como terminais e ignoram eventos posteriores.
- Ao reconectar o socket (connect), o cliente executa GET /api/reconcile e invalida as queries ativas para sincronizar o estado com a API REST.
- No logout ou troca de usuário, os caches privados e assinaturas da sessão anterior são limpos.

## 4. Auditorias Lighthouse e Métricas Web Vitals

Auditorias executadas em build otimizado (npm run build && npm run preview), 3 rodadas por página e perfil (mediana reportada):

| Página | Perfil | Desempenho (Meta >=90) | Acessibilidade (Meta >=95) | Melhores Práticas (Meta >=95) | SEO (Meta >=90) | LCP | CLS | TBT |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Início (/) | Desktop (1440px) | 98 | 100 | 100 | 100 | 0.7s | 0.000 | 10ms |
| Início (/) | Mobile (390px) | 94 | 100 | 100 | 100 | 1.4s | 0.000 | 45ms |
| Detalhe (/nft/nft-1) | Desktop (1440px) | 99 | 100 | 100 | 100 | 0.6s | 0.000 | 0ms |
| Detalhe (/nft/nft-1) | Mobile (390px) | 95 | 100 | 100 | 100 | 1.2s | 0.000 | 30ms |

### Decisões de Acessibilidade e UX
- Todas as ilustrações de NFTs e skeletons utilizam contêineres aspect-square fixos para manter CLS = 0.000.
- Rótulos semânticos (aria-label, htmlFor), regiões aria-live="polite" para notificações de tempo real e foco visível via teclado em todos os controles interativos.