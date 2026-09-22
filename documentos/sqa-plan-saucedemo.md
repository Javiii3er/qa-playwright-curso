# SQA Plan mínimo — Sauce Demo

**Curso 048 - Aseguramiento de la Calidad del Software**
**Clase 8 - Proceso Fundamental del Testing**

## Propósito

Verificar que las funciones críticas de Sauce Demo (login, inventario, carrito y checkout) funcionan correctamente antes de considerar la aplicación lista para un deploy.

## Alcance

Se prueba el flujo completo de un usuario autenticado: login, visualización del inventario, agregar productos al carrito y llegar al checkout; no se prueban pagos reales ni la creación de cuentas nuevas, ya que Sauce Demo usa usuarios fijos predefinidos.

## Herramientas

Playwright + TypeScript, ejecutado en Chromium, con reportes HTML generados automáticamente por Playwright.

## Criterios de salida

Se considera listo cuando el 100% de los tests críticos (login, inventario y checkout) pasan tanto en modo paralelo como en modo secuencial, sin necesidad de reintentos.