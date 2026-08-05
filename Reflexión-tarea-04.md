## ¿Cuál principio te parece más importante y por qué?

**Principio 2: las pruebas exhaustivas son imposibles**

Elegí este porque creo que es el que más te obliga a pensar como QA en el
día a día. En teoría uno quisiera probar todo, pero en la práctica es
imposible — ni con tiempo infinito se alcanzan todas las combinaciones
posibles de entradas y flujos. Entonces el trabajo real no es "cubrir
todo", sino decidir bien qué probar y qué dejar fuera según el riesgo.

Se me hizo bastante claro con el test de "login con credenciales
incorrectas" de esta clase: no probamos todas las contraseñas incorrectas
que existen (eso ni tendría sentido), solo un caso que representa el
comportamiento que nos interesa validar. Y aun así el test cumple su
propósito.

Creo que por eso este principio es el más importante para mí: te recuerda
que ser QA no es cuestión de probar más, sino de probar mejor, priorizando
lo que de verdad importa.

## Evidencia de los tests pasando

![Tests pasando - Clase 4](../evidencias/08-terminal-clase04-tests-pasando.png)