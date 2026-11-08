import { test, expect } from '@playwright/test';

test.describe('NFT Marketplace — Fluxos Principais e Cenários de Falha', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('1. Busca, filtros combinados, ordenação, paginação e histórico', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Aether Chronos #01' })).toBeVisible();
    await page.getByLabel('Categoria').selectOption('Generativo');
    await expect(page.getByText('Solaris Singularity #88')).toBeVisible();
    await page.getByLabel('Ordenação').selectOption('price_asc');
    await expect(page.getByText('Quantum Arboretum #23')).toBeVisible();
  });

  test('2. Acesso direto ao detalhe e tratamento de NFT inexistente (404)', async ({ page }) => {
    await page.getByRole('button', { name: /Simular Acesso 404/i }).click();
    await expect(page.getByText(/NFT não encontrado/i)).toBeVisible();
    await page.getByRole('button', { name: /Voltar ao Catálogo/i }).click();
    await expect(page.getByRole('heading', { name: 'Aether Chronos #01' })).toBeVisible();
  });

  test('3. Cadastro com conflito 409, login, logout e isolamento de sessão', async ({ page }) => {
    await page.getByRole('button', { name: /Conecte-se/i }).click();
    await page.getByRole('button', { name: /Criar nova conta/i }).click();
    await page.getByLabel('Nome Completo').fill('Marina Duplicada');
    await page.getByLabel('E-mail').fill('colecionador@nft.io');
    await page.getByLabel('Senha').fill('123456');
    await page.getByRole('button', { name: /Criar Conta/i }).click();
    await expect(page.getByRole('alert')).toContainText('409');
  });

  test('4. Favoritos com atualização otimista e rollback em falha 503', async ({ page }) => {
    await page.getByRole('button', { name: /Conecte-se/i }).click();
    await page.getByRole('button', { name: /Entrar/i }).click();
    await page.getByRole('button', { name: /Controles de Cenário/i }).click();
    await page.getByRole('button', { name: /Falhar Favorito/i }).click();
    await page.getByRole('button', { name: /Favoritar Cyber Samurai/i }).click();
    await expect(page.getByText(/Rollback aplicado/i)).toBeVisible();
  });

  test('5. Carrinho, aplicação de cupom e preservação ao autenticar', async ({ page }) => {
    await page.getByRole('button', { name: /Carrinho com 1 itens/i }).click();
    await page.getByPlaceholder(/Código do cupom/i).fill('WEB3VIP');
    await page.getByRole('button', { name: /Aplicar/i }).click();
    await expect(page.getByText(/WEB3VIP \(-10%\)/i)).toBeVisible();
  });

  test('6 e 7. Checkout, recuperação de timeout por idempotência e recibo confirmado', async ({
    page
  }) => {
    await page.getByRole('button', { name: /Conecte-se/i }).click();
    await page.getByRole('button', { name: /Entrar/i }).click();
    await page.getByRole('button', { name: /Carrinho com/i }).click();
    await page.getByRole('button', { name: /Ir para o Checkout/i }).click();

    await page.getByRole('button', { name: /Controles de Cenário/i }).click();
    await page.getByRole('button', { name: /Timeout no Pedido/i }).click();

    await page.getByRole('button', { name: /Confirmar Compra/i }).click();
    await expect(page.getByText(/Timeout de requisição/i)).toBeVisible();

    await page.getByRole('button', { name: /Confirmar Compra/i }).click();
    await page.getByRole('button', { name: /Confirmar Pedido \(Socket\.IO\)/i }).click();
    await expect(page.getByRole('heading', { name: /Confirmação do Pedido e Recibo/i })).toBeVisible();
  });
});
