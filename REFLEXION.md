
## Reflexión: auto-wait vs. sleep()

Playwright implementa auto-wait en lugar de depender de sleep() porque
resuelve el problema de raíz de las pruebas automatizadas: no todos los
elementos de una página tardan lo mismo en estar listos para interactuar,
y ese tiempo puede variar entre ejecuciones por factores como la velocidad
de la red, la carga del servidor o el rendimiento de la máquina donde
corren los tests.

Con sleep(), el test espera un tiempo fijo sin importar qué está pasando
realmente en la página. Esto genera dos problemas opuestos: si el tiempo
es muy corto, el test falla porque intenta interactuar con un elemento
que todavía no está listo (produciendo pruebas "flaky", es decir,
inestables e inconsistentes); si el tiempo es muy largo, el test funciona
pero desperdicia tiempo de ejecución esperando de más, lo cual se vuelve
crítico cuando se tienen cientos de pruebas corriendo en un pipeline de
CI/CD.

El auto-wait de Playwright, en cambio, verifica activamente el estado
real del elemento (que exista en el DOM, que sea visible, que esté
habilitado, que no esté siendo animado, que reciba eventos) antes de
ejecutar la acción, y reintenta automáticamente hasta un timeout
configurable. Esto hace que el test avance tan pronto como el elemento
esté realmente listo, ni un milisegundo antes ni uno después.

La ventaja principal para pruebas automatizadas es la combinación de
velocidad y confiabilidad: los tests corren tan rápido como la aplicación
lo permite, y fallan solo cuando hay un problema real, no por una
condición de carrera entre el test y la interfaz. Esto es especialmente
valioso en proyectos con integración continua, donde las pruebas se
ejecutan constantemente y una prueba inestable erosiona la confianza del
equipo en toda la suite de pruebas.

## Evidencia de los tests pasando (Clase 2)

![Tests pasando - terminal](./evidencias/06-terminal-tests-pasando.png)