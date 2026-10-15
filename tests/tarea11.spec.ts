import { test, expect } from '@playwright/test';

const BASE_URL = 'https://practice.expandtesting.com';
const TEXTO_CORRECTO = "Sometimes you'll see a typo, other times you won't.";

/**
 * Tarea 11 - Tests reto: documentar defectos con Playwright
 *   Reto 1: medir un defecto intermitente (testInfo.attach + annotations)
 *   Reto 2: test.fixme con una anotación de tipo 'issue'
 *   Reto 3: borrador de reporte en Markdown desde un afterEach
 */

test.describe('Tarea 11 - Tests reto', () => {

  // Reto 3: si el test termina con errores, se adjunta al reporte HTML un
  // borrador del bug report en Markdown con título, ambiente, URL y
  // resultado obtenido. Corre después de CADA test del describe; si el test
  // no tiene errores, no adjunta nada.
  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.errors.length === 0) return;

    const mensaje = (testInfo.errors[0].message ?? 'Sin mensaje de error')
      .replace(/\x1b\[[0-9;]*m/g, '')
      .split('\n')
      .slice(0, 6)
      .join('\n');

    const borrador = [
      `# Borrador de reporte - ${testInfo.title}`,
      '',
      `**Título:** [completar] ${testInfo.title}`,
      `**Ambiente:** ${process.platform}, proyecto ${testInfo.project.name}`,
      `**URL:** ${page.url()}`,
      '',
      '## Resultado obtenido',
      '```',
      mensaje,
      '```',
    ].join('\n');

    await testInfo.attach('borrador-reporte.md', {
      body: borrador,
      contentType: 'text/markdown',
    });
  });

  // Reto 1: /typos muestra un error de texto de forma aleatoria. Se recarga
  // 12 veces, se cuenta en cuántas aparece el error y la frecuencia se
  // adjunta al reporte y se deja como anotación. El test mide, por eso
  // pasa sin importar cuántas veces aparezca el error.
  test('Reto 1 - Medir un defecto intermitente en /typos', async ({ page }) => {
    test.setTimeout(240000);

    const parrafo = page.locator('main p', { hasText: 'Sometimes' });
    const repeticiones = 12;
    let conError = 0;

    await page.goto(`${BASE_URL}/typos`, { waitUntil: 'domcontentloaded' });

    for (let i = 1; i <= repeticiones; i++) {
      if (i > 1) {
        await page.reload({ waitUntil: 'domcontentloaded' });
      }
      const texto = ((await parrafo.first().textContent()) ?? '').trim();
      if (texto !== TEXTO_CORRECTO) {
        conError++;
      }
    }

    const frecuencia = `${conError} de ${repeticiones} cargas mostraron el error de texto`;

    await test.info().attach('frecuencia-typos.txt', {
      body: frecuencia,
      contentType: 'text/plain',
    });
    test.info().annotations.push({ type: 'frecuencia', description: frecuencia });

    console.log(frecuencia);
    expect(conError).toBeLessThanOrEqual(repeticiones);
  });

  // Reto 2: el test que exige el texto sin errores queda escrito pero NO se
  // ejecuta mientras el defecto siga abierto (test.fixme lo marca como
  // omitido) y se enlaza con el Issue mediante una anotación de tipo 'issue'.
  test.fixme('Reto 2 - El texto de /typos debe mostrarse sin errores', {
    annotation: {
      type: 'issue',
      description: 'https://github.com/Javiii3er/qa-playwright-curso/issues/2',
    },
  }, async ({ page }) => {
    await page.goto(`${BASE_URL}/typos`);
    await expect(page.locator('main p', { hasText: 'Sometimes' }).first())
      .toHaveText(TEXTO_CORRECTO);
  });

  // Reto 3: este test falla a propósito por el defecto de
  // /broken-images, pero test.fail() lo deja en verde. Como sí tiene errores,
  // el afterEach de arriba adjunta el borrador del reporte.
  test('Reto 3 - Borrador de reporte al fallar (imágenes rotas)', async ({ page }) => {
    test.fail(true, 'BUG-001: asdf.jpg y hjkl.jpg responden 404');

    await page.goto(`${BASE_URL}/broken-images`);
    const imagenes = page.locator('main img');

    await expect.poll(() => imagenes.evaluateAll(
      imgs => imgs.every(img => (img as HTMLImageElement).complete),
    )).toBe(true);

    const anchos = await imagenes.evaluateAll(
      imgs => imgs.map(img => (img as HTMLImageElement).naturalWidth),
    );
    for (const ancho of anchos) {
      expect(ancho).toBeGreaterThan(0);
    }
  });

});
