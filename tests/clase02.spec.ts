import { test, expect } from '@playwright/test';
import * as fs from 'fs';

test.beforeAll(() => {
    if (!fs.existsSync('./evidencias')) {
        fs.mkdirSync('./evidencias');
    }
});

test.describe('Clase 02 - Navegacion y esperas en DemoBlaze', () => {

    test('Navegar al carrito y regresar al inicio', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveURL(/demoblaze/);

        await page.screenshot({ path: 'evidencias/01-pagina-inicio.png', fullPage: true });

        await page.getByText('Cart').click();
        await page.waitForURL('**/cart.html');
        await expect(page).toHaveURL(/cart/);

        await page.screenshot({ path: 'evidencias/02-carrito-vacio.png', fullPage: true });

        await page.goBack();
        await expect(page).toHaveURL(/demoblaze\.com\/?$/);
    });

    test('Navegar a la categoria Phones y ver un producto', async ({ page }) => {
        await page.goto('/');
        await page.getByText('Phones').click();

        await page.waitForSelector('.card-title a');

        const productos = page.locator('.card-title a');
        expect(await productos.count()).toBeGreaterThan(0);

        await productos.first().click();
        await page.waitForLoadState('domcontentloaded');
        await page.screenshot({ path: 'evidencias/03-producto.png', fullPage: true });

        await expect(page.getByText('Add to cart')).toBeVisible();
    });

    test('Capturar el navbar y el footer por separado', async ({ page }) => {
        await page.goto('/');
        const navbar = page.locator('#navbarExample');
        await navbar.screenshot({ path: './evidencias/04-navbar.png' });
        const footer = page
            .locator('footer, .container-fluid')
            .filter({ hasText: 'Product Store' })
            .last();

        await footer.scrollIntoViewIfNeeded();
        await expect(footer).toBeVisible();
        await footer.screenshot({ path: './evidencias/05-footer.png' });
    });

    test('Verificar tiempo de carga de la página', async ({ page }) => {
        const startTime = Date.now();

        await page.goto('/');
        await page.waitForLoadState('load');

        const loadTime = Date.now() - startTime;
        console.log(`Tiempo de carga: ${loadTime} ms`);
        expect(loadTime).toBeLessThan(10000);
    });

});