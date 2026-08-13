# Tabla de decisión — Proceso de checkout

## Verificación previa del comportamiento real

- Acceder directamente a `checkout-step-one.html` sin sesión redirige al login (`/`) con el error
  `Epic sadface: You can only access '/checkout-step-one.html' when you are logged in.`
- El botón "Checkout" aparece habilitado en el carrito aunque tenga 0 items, y el checkout
  **no bloquea** el avance por tener el carrito vacío.
- El mensaje de error del formulario **cambia según el campo faltante**: `Error: First Name is required`,
  `Error: Last Name is required`, `Error: Postal Code is required` (no es un mensaje genérico único).

## Condiciones

| # | Condición |
|---|---|
| C1 | Usuario autenticado |
| C2 | Carrito tiene al menos 1 item |
| C3 | Formulario de checkout completo (Nombre, Apellido, Código postal) |
| C4 | Clic en botón "Finish" |

## Reglas

| Condición / Acción | R1 | R2 | R3 | R4 | R5 | R6 |
|---|---|---|---|---|---|---|
| C1: Usuario autenticado | No | Sí | Sí | Sí | Sí | Sí |
| C2: Carrito tiene items | - | No | Sí | Sí | Sí | No |
| C3: Formulario completo | - | - | No | Sí | Sí | Sí |
| C4: Clic en "Finish" | - | - | - | No | Sí | Sí |
| A1: Redirige a login con error | X | | | | | |
| A2: Permanece/avanza a checkout-step-one.html | | X | | | | |
| A3: Muestra "Error: <Campo> is required" | | | X | | | |
| A4: Avanza a checkout-step-two.html (overview) | | | | X | | |
| A5: Completa la orden → checkout-complete.html | | | | | X | X |

**Nota:** R6 muestra que un carrito vacío tampoco bloquea la finalización de la orden — el sistema no valida cantidad de items en ningún punto del flujo de checkout.

## Evidencia de los tests pasando (Clase 5)
![Tests pasando - terminal](./evidencias/09-terminal-clase05-tests-pasados.png)