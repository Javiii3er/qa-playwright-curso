import { test, expect, Page } from '@playwright/test';
import { loginAs } from '../helpers/auth';

/**
 * Tarea 08 - Tests reto: hooks y suites avanzados
 */

test.describe('Tarea 08 - Reto 1: suite serial con página compartida', () => {
  test.describe.configure({ mode: 'serial' });

  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await loginAs(page, 'standard_user');
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('Paso 1: agregar un producto al carrito', async () => {
    await page.locator('.btn_inventory').first().click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('Paso 2: el producto persiste al navegar al carrito (misma page)', async () => {
    await page.locator('.shopping_cart_link').click();
    await expect(page.locator('.cart_item')).toHaveCount(1);
  });

  test('Paso 3: proceder al checkout', async () => {
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(/checkout-step-one/);
  });
});

test('Reto 2: usuario con lentitud artificial usando test.slow()', async ({ page }, testInfo) => {
  testInfo.slow();

  const inicio = Date.now();
  await loginAs(page, 'performance_glitch_user');
  const tiempoLogin = Date.now() - inicio;

  console.log(`Tiempo de login con test.slow() activo: ${tiempoLogin}ms`);
  await expect(page).toHaveURL(/inventory/);
});

test('Reto 3: se omite dinámicamente si el navegador no es Chromium', async ({ page, browserName }) => {
  test.skip(
    browserName !== 'chromium',
    'Este test verifica un detalle de layout confirmado solo en Chromium; se omite en otros motores para evitar falsos negativos por diferencias de renderizado.'
  );

  await loginAs(page, 'standard_user');
  await expect(page.locator('.inventory_list')).toBeVisible();
});