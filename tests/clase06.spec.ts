import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { MenuPage } from '../pages/MenuPage';

test.beforeAll(() => {
  if (!fs.existsSync('./evidencias')) {
    fs.mkdirSync('./evidencias');
  }
});

test.describe('Clase 06 - Page Object Model en Sauce Demo', () => {

  test('Login exitoso con POM', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.expectToBeOnInventoryPage();
    console.log('Login con POM exitoso');
    await page.screenshot({ path: './evidencias/clase06-01-login-exitoso.png' });
  });

  test('Login fallido con POM', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('wrong_user', 'wrong_pass');
    await loginPage.expectLoginError('Username and password do not match');
    console.log('Error de login capturado con POM');
    await page.screenshot({ path: './evidencias/clase06-02-login-fallido.png' });
  });

  test('Flujo completo: login -> agregar 2 productos-> verificar carrito', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.expectToBeOnInventoryPage();

    await inventoryPage.addProductByName('Sauce Labs Backpack');
    await inventoryPage.addProductByName('Sauce Labs Bike Light');

    await expect(inventoryPage.cartBadge).toHaveText('2');

    await inventoryPage.goToCart();
    await cartPage.expectItemCount(2);
    console.log('Flujo completo con POM: 2 productos en carrito');
    await page.screenshot({ path: './evidencias/clase06-03-flujo-carrito.png', fullPage: true });
  });

  test('Verificar que el inventario tiene 6 productos', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
    const count = await inventoryPage.getProductCount();
    expect(count).toBe(6);
    await page.screenshot({ path: './evidencias/clase06-04-inventario-6-productos.png' });
  });

  test('Ordenar productos de mayor a menor precio', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');

    await inventoryPage.sortBy('hilo');

    const precios = page.locator('.inventory_item_price');
    const todosLosPrecios = await precios.allTextContents();
    const numericos = todosLosPrecios.map(p => parseFloat(p.replace('$', '')));

    for (let i = 0; i < numericos.length - 1; i++) {
      expect(numericos[i]).toBeGreaterThanOrEqual(numericos[i + 1]);
    }
    await page.screenshot({ path: './evidencias/clase06-05-orden-precio.png' });
  });

  // Reto 1, 2 y 3

  test('Reto 1 - CheckoutPage: completar una compra de principio a fin', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addFirstProductToCart();
    await inventoryPage.goToCart();

    await cartPage.proceedToCheckout();
    await checkoutPage.fillInformation('Javier', 'Rivera', '01001');
    await checkoutPage.continueToOverview();
    await checkoutPage.finishPurchase();
    await checkoutPage.expectOrderComplete();

    console.log('Reto 1: compra completada de principio a fin con CheckoutPage');
    await page.screenshot({ path: './evidencias/clase06-06-reto1-checkout-completo.png' });
  });

  test('Reto 2 - MenuPage: logout desde el menú hamburguesa', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const menuPage = new MenuPage(page);

    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.expectToBeOnInventoryPage();

    await menuPage.logout();

    await expect(page.locator('#login-button')).toBeVisible();
    console.log('Reto 2: logout exitoso desde el menú hamburguesa');
    await page.screenshot({ path: './evidencias/clase06-07-reto2-logout.png' });
  });

  test('Reto 3 - removeProductByName(): quitar producto y verificar que el badge desaparece', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');

    await inventoryPage.addProductByName('Sauce Labs Backpack');
    await expect(inventoryPage.cartBadge).toHaveText('1');

    await inventoryPage.removeProductByName('Sauce Labs Backpack');
    await inventoryPage.expectCartBadgeHidden();

    console.log('Reto 3: producto removido y badge del carrito desaparece al llegar a 0');
    await page.screenshot({ path: './evidencias/clase06-08-reto3-remove-product.png' });
  });

});