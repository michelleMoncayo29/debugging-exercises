# Skill: brainstorm-exercises

Genera ideas originales y educativamente ricas para nuevos ejercicios de debugging en el proyecto `debugging-exercises`. Las ideas deben ser frescas, distintas de todo lo ya implementado, y cubrir conceptos técnicos y conceptuales sólidos.

## Trigger

Cuando el usuario pida ideas, sugerencias o lluvia de ideas para nuevos ejercicios (ej: "dame ideas para ejercicios", "necesito inspiración para el siguiente ejercicio", "brainstorm ejercicios", "qué ejercicios podría crear").

## Paso 1 — Leer el estado actual del proyecto

Antes de generar cualquier idea:

1. Leer el `README.md` raíz para obtener la lista completa de ejercicios implementados (01–N).
2. Consultar el backlog planeado en la memoria del proyecto.
3. Identificar todos los dominios existentes y planeados para no duplicarlos.

## Paso 2 — Criterios de aceptación para cada idea

Cada idea propuesta debe cumplir todos estos criterios:

**Originalidad**

- El dominio de negocio no existe en ejercicios actuales ni en el backlog
- No es variación superficial de algo existente (ej: si ya hay `library-catalog`, no proponer `bookstore-manager`)

**Riqueza técnica**

- Uso abundante de métodos de array: `filter`, `map`, `reduce`, `sort`, `find`, `findIndex`, `some`, `every`, `flat`, `flatMap`, `includes`, `splice`, `slice`, `Array.from`, etc.
- Mezcla significativa de clases y funciones
- Puede producir ~200+ líneas de código real
- El bug propuesto es realista, no trivial y causaría múltiples fallos en los tests

**Riqueza conceptual**

- Enseña uno o más conceptos clave de programación (ver lista de conceptos prioritarios)
- El dominio tiene lógica de negocio real y no trivial
- Comprensible para estudiantes sin experiencia de industria en ese sector

**Viabilidad para el proyecto**

- Sin async (no Promises, async/await, callbacks)
- Sin dependencias externas (JavaScript puro)
- El bug puede introducirse en `buggy-code.js` sin dejar pistas obvias

## Conceptos técnicos prioritarios

Priorizar ideas que cubran conceptos poco representados en el proyecto:

- **Algoritmos**: ordenamiento, búsqueda binaria, sliding window, two pointers, greedy
- **Estructuras de datos**: grafos simples (listas de adyacencia), árboles, colas, pilas, heaps simulados
- **Matemáticas aplicadas**: estadística descriptiva, probabilidad básica, geometría computacional
- **Lógica de negocio compleja**: reglas encadenadas, máquinas de estado, sistemas de puntos/niveles
- **Transformación de datos**: parsing, normalización, agrupación jerárquica, pivot/unpivot
- **Validación**: reglas complejas con múltiples condiciones anidadas
- **Simulaciones**: turnos, fases, rondas, tiempo discreto
- **Optimización discreta**: maximización/minimización con restricciones

## Formato de salida

Para cada idea, usar esta estructura:

```
### [##] kebab-case-name
**Dominio**: [sector o contexto]
**Tipo de implementación**: [Clase / Funciones / Mixto]
**Concepto técnico clave**: [qué aprende el estudiante]
**Descripción**: [2–3 oraciones explicando qué hace el sistema]
**Ejemplo de bug realista**: [tipo/zona del bug sin spoilers — nunca revelar la línea exacta]
**Nivel sugerido**: [Principiante 01–09 / Intermedio 10–19 / Avanzado 20–29]
**Por qué es educativo**: [qué conocimiento real aporta]
```

## Dominios sugeridos para explorar

Si se necesita inspiración de dominios no representados aún:

- Logística y rutas (paquetería, entregas, waypoints)
- Ciencias (estequiometría química, biología de poblaciones, física simplificada)
- Juegos de mesa y cartas (ajedrez simplificado, puntuación de cartas, dados RPG)
- Finanzas personales (amortización de préstamos, tramos de impuestos, interés compuesto)
- Salud y medicina (triaje hospitalario, calculadoras de IMC/dosis)
- Ingeniería civil simplificada (cómputo de materiales, presupuestos de obra)
- Conceptos de sistemas operativos (scheduler, memoria paginada, file system simple)
- Compiladores básicos (tokenizer, evaluador de expresiones, AST simplificado)
- Redes sociales (grafos de seguidores, grado de separación, puntuación de influencia)
- Videojuegos (sistemas de niveles/XP, inventario RPG, combate por turnos)
- Economía (oferta y demanda, elasticidad, equilibrio de mercado)
- Transporte público (tarifas por zonas, transbordos, rutas)

## Instrucciones de ejecución

1. Leer el estado actual del proyecto (ejercicios existentes + backlog).
2. Generar entre **5 y 10 ideas** originales que cumplan todos los criterios.
3. Ordenarlas de menor a mayor complejidad sugerida.
4. Al finalizar, recordar al usuario que puede usar el skill **`/create-exercise`** para implementar cualquier idea, siguiendo el flujo TDD obligatorio del proyecto.

## Nota de cierre (incluir siempre al terminar)

> **Siguiente paso**: Para implementar cualquiera de estas ideas, usa el skill `/create-exercise`. Guía el flujo TDD completo: `test.js` → `solution.js` → `buggy-code.js` → `README.md`, incluyendo el commit final con el formato correcto del proyecto (`feat :sparkles: add [name] exercise (##)`).
