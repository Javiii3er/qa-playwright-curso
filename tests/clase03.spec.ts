import { test, expect } from '@playwright/test';
import * as fs from 'fs';

test.beforeAll(() => {
    if (!fs.existsSync('./evidencias')) {
        fs.mkdirSync('./evidencias');
    }
});

test.describe('Clase 03 - Locators en DemoBlaze', () => {

    test('Locator por texto: verificar elementos del menú', async ({ page }) => {
        await page.goto('/');

        const nav = page.locator('#navbarExample');
        await expect(nav.getByText('Home')).toBeVisible();
        await expect(nav.getByText('Contact')).toBeVisible();
        await expect(nav.getByText('About us')).toBeVisible();

        await expect(nav.getByText('Cart', { exact: true })).toBeVisible();
    });

    test('Locator por CSS: productos en la página principal', async ({ page }) => {
        await page.goto('/');
        await page.waitForSelector('.card-title');

        const tarjetas = page.locator('.card');
        const cantidad = await tarjetas.count();
        expect(cantidad).toBeGreaterThan(0);

        const primerProducto = page.locator('.card-title a').first();
        const nombreProducto = await primerProducto.textContent();
        expect(nombreProducto).not.toBeNull();
    });

    test('Locator por ID: campos del modal login', async ({ page }) => {
        await page.goto('/');

        await page.locator('#navbarExample')
            .getByRole('link', { name: 'Log in', exact: true }).click();
        await page.waitForSelector('#logInModal', { state: 'visible' });

        await expect(page.locator('#loginusername')).toBeVisible();
        await expect(page.locator('#loginpassword')).toBeVisible();
    });

    test('Locator por atributo: imagen del primer producto', async ({ page }) => {
        await page.goto('/');
        await page.waitForSelector('.card-title');

        await page.locator('.card-title a').first().click();
        await page.waitForLoadState('domcontentloaded');

        const imagenProducto = page.locator('.product-image img');
        await expect(imagenProducto).toBeVisible();

        const srcImagen = await imagenProducto.getAttribute('src');
        expect(srcImagen).not.toBeNull();
    });

    test('Locator encadenados: precio dentro de una tarjeta', async ({ page }) => {
        await page.goto('/');
        await page.waitForSelector('.card-title');

        const primeraTarjeta = page.locator('.card').first();
        const precio = primeraTarjeta.locator('h5');
        await expect(precio).toBeVisible();
    });

    test('Verificar que NO existe un elemento (negación)', async ({ page }) => {
        await page.goto('/');
        const mensajeVacio = page.getByText('No products found');
        await expect(mensajeVacio).not.toBeVisible();
    });

    // Tests retos

    test('Locator por rol: botón Place Order en el carrito', async ({ page }) => {
        await page.goto('/cart.html');

        const botonPlaceOrder = page.getByRole('button', { name: 'Place Order' });
        await expect(botonPlaceOrder).toBeVisible();
    });

    test('Locator con filter(): producto específico por nombre', async ({ page }) => {
        await page.goto('/');
        await page.waitForSelector('.card-title');

        const producto = page.locator('.card').filter({ hasText: 'Samsung galaxy s6' });
        await expect(producto).toBeVisible();

        const precio = await producto.locator('h5').textContent();
        expect(precio).not.toBeNull();
        console.log(`Precio de Samsung galaxy s6: ${precio}`);
    });

    test('Locator por atributo parcial: categorías del sidebar', async ({ page }) => {
        await page.goto('/');

        const categorias = page.locator('[onclick*="byCat"]');
        await expect(categorias).toHaveCount(3);

        await expect(categorias.filter({ hasText: 'Phones' })).toBeVisible();
        await expect(categorias.filter({ hasText: 'Laptops' })).toBeVisible();
        await expect(categorias.filter({ hasText: 'Monitors' })).toBeVisible();
    });

});