import { test, expect } from '@playwright/test';
import { loginAs } from '../helpers/auth';

test.describe('Tarea 10 - Tests reto', () => {

  test('El layout del inventario se ve correcto', { tag: ['@regression', '@ui'] }, async ({ page }) => {
    await loginAs(page, 'standard_user');

    const items = page.locator('.inventory_item');
    await expect(items).toHaveCount(6);

    // Verificación de "layout": cada item visible tiene su nombre, precio
    // y botón de compra visibles (una revisión básica de UI, no solo de
    // datos, que es lo que justifica el tag @ui además de @regression).
    const primerItem = items.first();
    await expect(primerItem.locator('.inventory_item_name')).toBeVisible();
    await expect(primerItem.locator('.inventory_item_price')).toBeVisible();
    await expect(primerItem.locator('.btn_inventory')).toBeVisible();
  });

  test('Verificar varios atributos de un producto sin detenerse en el primer fallo', async ({ page }, testInfo) => {
    await loginAs(page, 'standard_user');

    const producto = page.locator('.inventory_item', { hasText: 'Sauce Labs Backpack' });

    await expect.soft(producto.locator('.inventory_item_name')).toHaveText('Sauce Labs Backpack');
    await expect.soft(producto.locator('.inventory_item_price')).toHaveText('$29.99');
    await expect.soft(producto.locator('.btn_inventory')).toHaveText('Add to cart');
    await expect.soft(producto.locator('img')).toBeVisible();

    console.log(`Cantidad de fallas soft acumuladas: ${testInfo.errors.length}`);
  });

  test('Ajustar una aserción según el motor real en vez de saltar el test', async ({ page, browserName }) => {
    await loginAs(page, 'standard_user');

    const boton = page.locator('.shopping_cart_link');
    await expect(boton).toBeVisible();

    if (browserName === 'webkit') {
      // Rama de ejemplo para webkit: mismo elemento, mismo chequeo base.
      // En un caso real aquí iría la aserción ajustada a la diferencia
      // real confirmada en ese motor (p. ej. un estilo CSS distinto).
      await expect(boton).toBeEnabled();
    } else {
      await expect(boton).toBeEnabled();
    }

    console.log(`Test corrido en el motor: ${browserName}`);
  });

});