import { test as base, expect } from '@playwright/test';

/**
 * Tarea 09 - Tests reto: fixtures avanzados
 */

// ===== Reto 1 y 2: fixtures personalizados =====
type TestFixtures = {
    cronometro: void;
};

type WorkerFixtures = {
    contadorWorker: { valor: number };
};

const test = base.extend<TestFixtures, WorkerFixtures>({
    // Reto 1: fixture con teardown real.
    // Todo lo que va ANTES de `await use()` es el setup; todo lo que va
    // DESPUÉS es el teardown, y corre SIEMPRE al terminar el test —
    // incluso si el test falla o lanza una excepción.
    cronometro: async ({}, use, testInfo) => {
        const inicio = Date.now();
        console.log(`[cronometro] Iniciado para "${testInfo.title}"`);

        await use(); // Aquí se ejecuta el cuerpo del test

        const duracion = Date.now() - inicio;
        console.log(`[cronometro] "${testInfo.title}" tardó ${duracion}ms (status: ${testInfo.status})`);
    },

    // Reto 2: fixture de alcance worker ({ scope: 'worker' }).
    // A diferencia de un fixture normal (que se crea y destruye en cada
    // test), este se crea UNA sola vez por worker y su estado persiste
    // entre todos los tests que corran en ese mismo worker.
    contadorWorker: [async ({}, use) => {
        const estado = { valor: 0 };
        await use(estado);
    }, { scope: 'worker' }],
});

test('Reto 1: fixture con teardown mide cuánto tardó el login', async ({ page, cronometro }) => {
    await page.goto('https://www.saucedemo.com');
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();
    await expect(page).toHaveURL(/inventory/);
});

// NOTA Reto 2: para que el contador realmente suba de 1 a 2
// entre estos dos tests, ambos deben correr en el MISMO worker. Con la
// configuración por defecto (fullyParallel no activado), los tests de
// un mismo archivo ya corren secuencialmente en un solo worker; si tu
// config lo tuviera activado, correr con `--workers=1` lo garantiza.

test('Reto 2 (1/2): primer test incrementa el contador de worker', async ({ contadorWorker }) => {
    contadorWorker.valor++;
    console.log(`Contador de worker: ${contadorWorker.valor}`);
    expect(contadorWorker.valor).toBe(1);
});

test('Reto 2 (2/2): segundo test ve el contador en 2 (mismo worker)', async ({ contadorWorker }) => {
    contadorWorker.valor++;
    console.log(`Contador de worker: ${contadorWorker.valor}`);
    expect(contadorWorker.valor).toBe(2);
});

// ===== Reto 3: test.use() + parametrización de viewports =====

const viewports = [
    { nombre: 'móvil', width: 375, height: 667 },
    { nombre: 'escritorio', width: 1280, height: 800 },
];

for (const viewport of viewports) {
    base.describe(`Reto 3: viewport ${viewport.nombre}`, () => {
        // test.use() dentro de un describe aplica esa configuración
        // (aquí, el tamaño de viewport) a todos los tests de ese bloque.
        base.use({ viewport: { width: viewport.width, height: viewport.height } });

        base(`El login se ve correctamente en ${viewport.nombre}`, async ({ page }) => {
            await page.goto('https://www.saucedemo.com');
            await expect(page.locator('#login-button')).toBeVisible();
            console.log(`Login visible en viewport ${viewport.nombre} (${viewport.width}x${viewport.height})`);
        });
    });
}