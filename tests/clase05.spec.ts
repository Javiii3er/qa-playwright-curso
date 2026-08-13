import { test, expect } from '@playwright/test';
import * as fs from 'fs';

test.beforeAll(() => {
  if (!fs.existsSync('./evidencias')) {
    fs.mkdirSync('./evidencias');
  }
});

test.describe('Clase 05 - Assertions y técnicas de diseño de pruebas en Sauce Demo', () => {

  test('CE válida: login con credenciales correctas', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');

    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();

    await expect(page).toHaveURL(/inventory/);
    await expect(page.locator('.inventory_container')).toBeVisible();

    console.log('CE válida: login exitoso');
    await page.screenshot({ path: './evidencias/01-login-valido.png' });
  });

  test('CE inválida: usuario no existe', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');

    await page.locator('#user-name').fill('usuario_inexistente');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();

    const errorMsg = page.locator('[data-test="error"]');
    await expect(errorMsg).toBeVisible();
    await expect(errorMsg).toContainText('Username and password do not match');

    await expect(page).not.toHaveURL(/inventory/);
    await page.screenshot({ path: './evidencias/02-login-usuario-no-existe.png' });
  });

  test('CE inválida: usuario bloqueado', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');

    await page.locator('#user-name').fill('locked_out_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();

    const errorMsg = page.locator('[data-test="error"]');
    await expect(errorMsg).toBeVisible();
    await expect(errorMsg).toContainText('locked out');

    console.log('CE usuario bloqueado: mensaje correcto mostrado');
    await page.screenshot({ path: './evidencias/03-login-usuario-bloqueado.png' });
  });

  test('Valor en frontera: campos vacíos (frontera de longitud mínima)', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');

    await page.locator('#login-button').click();

    const errorMsg = page.locator('[data-test="error"]');
    await expect(errorMsg).toBeVisible();
    await expect(errorMsg).toContainText('Username is required');

    console.log('Valor frontera: campo vacío maneja error correctamente');
    await page.screenshot({ path: './evidencias/04-campos-vacios.png' });
  });

  test('Verificar que el inventario tiene exactamente 6 productos', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();
    await expect(page).toHaveURL(/inventory/);

    const productos = page.locator('.inventory_item');
    await expect(productos).toHaveCount(6);

    console.log('El inventario tiene exactamente 6 productos');
    await page.screenshot({ path: './evidencias/05-inventario-6-productos.png', fullPage: true });
  });

  test('Verificar precio del primer producto con regex', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();
    await expect(page).toHaveURL(/inventory/);

    const textoPrecio = await page.locator('.inventory_item_price').first().textContent();

    expect(textoPrecio?.trim()).toMatch(/^\$\d+\.\d{2}$/);
    await page.screenshot({ path: './evidencias/06-precio-regex.png' });
  });

  test('Verificar atributos y estados de los elementos del inventario', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();
    await expect(page).toHaveURL(/inventory/);

    const primerBoton = page.locator('.btn_inventory').first();
    await expect(primerBoton).toBeEnabled();
    await expect(primerBoton).toHaveText('Add to cart');

    await primerBoton.click();
    await expect(primerBoton).toHaveText('Remove');

    const badgeCarrito = page.locator('.shopping_cart_badge');
    await expect(badgeCarrito).toBeVisible();
    await expect(badgeCarrito).toHaveText('1');

    console.log('El botón cambia de estado y el carrito se actualiza');
    await page.screenshot({ path: './evidencias/07-inventario-atributos-estados.png' });
  });

  test('Verificar múltiples propiedades del primer producto con soft assertions', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();

    const primerProducto = page.locator('.inventory_item').first();

    await expect.soft(primerProducto.locator('.inventory_item_name')).toBeVisible();
    await expect.soft(primerProducto.locator('.inventory_item_desc')).toBeVisible();
    await expect.soft(primerProducto.locator('.inventory_item_price')).toBeVisible();
    await expect.soft(primerProducto.locator('.btn_inventory')).toBeEnabled();
    await expect.soft(primerProducto.locator('img')).toBeVisible();

    console.log('Soft assertions del primer producto completadas');
    await primerProducto.screenshot({ path: './evidencias/08-soft-assertions-producto.png' });
  });

  test('Tabla de decisión - Regla 1: logueado con items -> puede pagar', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();

    await page.locator('.btn_inventory').first().click();

    await page.locator('.shopping_cart_link').click();
    await expect(page).toHaveURL(/cart/);

    const btnCheckout = page.getByText('Checkout');
    await expect(btnCheckout).toBeVisible();
    await expect(btnCheckout).toBeEnabled();

    await page.screenshot({ path: './evidencias/09-tabla-decision-regla1.png' });
  });

  test('Tabla de decisión - Regla 2: logueado sin items -> carrito vacío', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();

    await page.locator('.shopping_cart_link').click();

    const itemsCarrito = page.locator('.cart_item');
    await expect(itemsCarrito).toHaveCount(0);

    await page.screenshot({ path: './evidencias/10-tabla-decision-regla2.png' });
  });

  // Reto 1, 2 y 3

  test('Reto 1 - Ordenar catálogo por precio y verificar value + nuevo primer precio', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();
    await expect(page).toHaveURL(/inventory/);

    const sortSelect = page.locator('[data-test="product-sort-container"]');
    await sortSelect.selectOption('lohi');

    await expect(sortSelect).toHaveValue('lohi');

    const nuevoPrimerPrecio = await page.locator('.inventory_item_price').first().textContent();
    console.log('Nuevo primer precio tras ordenar (low to high):', nuevoPrimerPrecio);
    expect(nuevoPrimerPrecio).toBe('$7.99');

    await page.screenshot({ path: './evidencias/11-reto1-ordenar-precio.png', fullPage: true });
  });

  test('Reto 2 - El campo de usuario recibe el foco al hacer clic', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');

    const userField = page.locator('#user-name');
    await userField.click();

    await expect(userField).toBeFocused();

    await page.screenshot({ path: './evidencias/12-reto2-campo-focused.png' });
  });

  test('Reto 3 - El botón "Add to cart" tiene cursor pointer', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();
    await expect(page).toHaveURL(/inventory/);

    const primerBoton = page.locator('.btn_inventory').first();

    await expect(primerBoton).toHaveCSS('cursor', 'pointer');

    await page.screenshot({ path: './evidencias/13-reto3-cursor-pointer.png' });
  });

});