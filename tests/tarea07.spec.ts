import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

/**
 * Tarea 07 - Tests reto (evidencias avanzadas)
 */

test.describe('Tarea 07 - Tests reto', () => {

  test('Reto 1 - test.step(): flujo estructurado en pasos nombrados', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    // Cada test.step() aparece por separado en el reporte HTML y en el
    // Trace Viewer, lo que facilita ver EXACTAMENTE en qué paso falló
    // un test, sin tener que leer todo el código línea por línea.
    await test.step('Navegar a la página de login', async () => {
      await loginPage.navigate();
    });

    await test.step('Iniciar sesión con credenciales válidas', async () => {
      await loginPage.login('standard_user', 'secret_sauce');
    });

    await test.step('Verificar que se llegó al inventario', async () => {
      await inventoryPage.expectToBeOnInventoryPage();
    });
  });

  test('Reto 2 - testInfo.attach(): adjuntar datos capturados al reporte', async ({ page }, testInfo) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');

    const cantidadProductos = await page.locator('.inventory_item').count();
    const urlActual = page.url();
    const fecha = new Date().toISOString();

    const contenido = [
      `Cantidad de productos: ${cantidadProductos}`,
      `URL: ${urlActual}`,
      `Fecha de captura: ${fecha}`,
    ].join('\n');

    // testInfo.attach() adjunta un archivo directamente al reporte HTML
    // (visible en npx playwright show-report, dentro del test), sin
    // necesidad de guardarlo aparte en el sistema de archivos.
    await testInfo.attach('datos-inventario.txt', {
      body: contenido,
      contentType: 'text/plain',
    });

    expect(cantidadProductos).toBeGreaterThan(0);
  });

  test('Reto 3 - toHaveScreenshot(): comparación visual contra baseline', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');

    // La primera vez que se corre este test, Playwright NO tiene una
    // imagen de referencia (baseline) y genera una automáticamente en
    // una carpeta tests/tarea07.spec.ts-snapshots/. Esa imagen debe
    // comitearse al repositorio: en corridas futuras, Playwright compara
    // pixel a pixel la captura actual contra ese baseline y el test
    // falla si hay diferencias visuales inesperadas (regresión visual).
    await expect(page).toHaveScreenshot('inventario-pagina-completa.png', {
      fullPage: true,
    });
  });

});