import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';

type AppFixtures = {
    loginPage: LoginPage;
    inventoryPage: InventoryPage;
    cartPage: CartPage;
};

export const test = base.extend<AppFixtures>({
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigate();
        await use(loginPage);
    },

    inventoryPage: async ({ page }, use) => {
        // Corregido: faltaba navegar antes de llenar el formulario
        await page.goto('https://www.saucedemo.com');
        await page.locator('#user-name').fill('standard_user');
        await page.locator('#password').fill('secret_sauce');
        await page.locator('#login-button').click();
        await expect(page).toHaveURL(/inventory/);

        const inventoryPage = new InventoryPage(page);
        await use(inventoryPage);
    },

    cartPage: async ({ page, inventoryPage }, use) => {
        // Reutiliza el fixture inventoryPage como dependencia, en vez de
        // repetir el login manualmente (a diferencia de la diapositiva,
        // que sí lo repite en cada fixture). Al pedir `inventoryPage`
        // como parámetro, Playwright garantiza que su setup (goto+login)
        // ya corrió antes de llegar aquí.
        await page.locator('.btn_inventory').first().click();
        await page.locator('.shopping_cart_link').click();
        await expect(page).toHaveURL(/cart/);

        // El cambio de URL ocurre antes de que el item se renderice en el
        // DOM; getItemCount() usa .count(), que NO espera automáticamente
        // (a diferencia de expect()). Sin esta línea, el test consumidor
        // puede ver el carrito todavía vacío justo después de navegar.
        await expect(page.locator('.cart_item').first()).toBeVisible();

        const cartPage = new CartPage(page);
        await use(cartPage);
    },
});

export { expect } from '@playwright/test';