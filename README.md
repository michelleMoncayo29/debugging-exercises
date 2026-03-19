# 🐛 Ejercicios de Debugging en JavaScript

Una colección completa de ejercicios prácticos de depuración diseñados para enseñar habilidades de debugging en JavaScript a través de la experiencia directa. Cada ejercicio contiene bugs intencionales que debes identificar, entender y corregir.

## 🎯 Propósito

Este proyecto ayuda a los desarrolladores a:

- **Dominar técnicas de depuración** a través de escenarios del mundo real
- **Desarrollar habilidades de resolución de problemas** identificando y corrigiendo bugs
- **Entender los errores comunes** en el desarrollo con JavaScript
- **Adoptar buenas prácticas** para escribir código libre de bugs

## 🚀 Primeros Pasos

### Prerrequisitos

- Node.js 14.x o superior
- Conocimientos básicos de JavaScript
- Un editor de texto o IDE

### Instalación

```bash
# Clonar el repositorio
git clone <repository-url>

# Navegar al directorio del proyecto
cd debugging-exercises

# Instalar dependencias (Jest)
npm install
```

### Cómo Usar

1. **Elige un ejercicio** del directorio `exercises/`
2. **Lee el README** de la carpeta del ejercicio para entender el contexto
3. **Examina `buggy-code.js`** — contiene el código roto que debes depurar
4. **Ejecuta las pruebas** para ver qué falla:
   ```bash
   npm test exercises/01-calculator-error
   ```
5. **Depura y corrige** el código en `buggy-code.js`
6. **Vuelve a ejecutar las pruebas** para verificar tu solución
7. **Compara con `solution.js`** para profundizar tu comprensión

## 📁 Estructura del Proyecto

```
debugging-exercises/
├── exercises/
│   ├── 01-calculator-error/    # Ejercicio individual
│   ├── 02-[siguiente]/         # Más ejercicios
│   └── ...
├── CLAUDE.md                   # Instrucciones para agentes IA
├── TESTING.md                  # Guía de testing con Jest
├── EXERCISE_TEMPLATE.md        # Plantilla para crear nuevos ejercicios
└── README.md                   # Este archivo
```

## 🏷️ Tipos de Ejercicios

Los ejercicios están etiquetados según el tipo de bug que contienen:

### 💭 Errores Lógicos

El código se ejecuta sin errores pero produce resultados incorrectos.

- Errores de límites (off-by-one)
- Operadores incorrectos
- Lógica condicional defectuosa
- Errores de cálculo matemático

**Ejemplo**: [01-calculator-error](./exercises/01-calculator-error/)

### 📝 Errores de Sintaxis

El código no puede parsearse debido a sintaxis incorrecta.

- Llaves o paréntesis faltantes
- Declaraciones inválidas
- Puntuación mal colocada

### ⚠️ Errores de Ejecución

Errores que ocurren durante la ejecución del código.

- Referencias nulas o indefinidas
- Errores de tipo
- Operaciones inválidas

### ⏱️ Errores Asíncronos

Problemas específicos del código asíncrono.

- Problemas con el manejo de Promesas
- Errores con callbacks
- Condiciones de carrera

**Ejemplo**: [03-async-user-auth](./exercises/03-async-user-auth/)

## 📚 Estructura de Cada Ejercicio

Cada ejercicio contiene exactamente **4 archivos**:

| Archivo          | Propósito                                                                                          |
| ---------------- | -------------------------------------------------------------------------------------------------- |
| `README.md`      | Descripción en formato Scrum: Historia de Usuario, Criterios de Aceptación y Problema Reportado    |
| `buggy-code.js`  | El código roto que debes depurar                                                                   |
| `solution.js`    | La solución de referencia con comentarios explicativos (para comparar después de resolver)         |
| `test.js`        | Pruebas automatizadas Jest para validar tu solución                                                |

## 🎓 Ruta de Aprendizaje

Los ejercicios están numerados en el orden de progresión recomendado:

1. Comienza con **01-calculator-error** (error lógico, nivel principiante)
2. Avanza por los ejercicios secuencialmente
3. Cada ejercicio desarrolla habilidades de depuración de forma progresiva
4. Consulta el README de cada ejercicio para ver el nivel de dificultad

## 🧪 Ejecutar las Pruebas

Cada ejercicio incluye pruebas Jest para validar tu solución:

```bash
# Ejecutar las pruebas de un ejercicio específico
npm test exercises/01-calculator-error

# Las pruebas mostrarán:
# ✓ Tests que pasan (verde)
# ✗ Tests que fallan (rojo con detalles)
```

Consulta [TESTING.md](./TESTING.md) para una guía completa sobre cómo interpretar los resultados y usar Jest.

## 🤝 Contribuir

¿Quieres agregar nuevos ejercicios? Sigue estos pasos:

1. Lee `EXERCISE_TEMPLATE.md` para la estructura estándar
2. Crea tu ejercicio siguiendo el flujo TDD obligatorio
3. Asegúrate de que las pruebas fallen con `buggy-code.js` y pasen con `solution.js`
4. Documenta el ejercicio completamente en español
5. Envía un pull request

## 📖 Para Educadores

Este proyecto es ideal para:

- **Instrucción en clase** — asigna ejercicios como tarea o práctica de laboratorio
- **Bootcamps de programación** — desarrolla habilidades de depuración desde el inicio
- **Estudio independiente** — los estudiantes pueden aprender de forma autónoma
- **Preparación para entrevistas** — practica encontrar bugs bajo presión

## 💡 Consejos para el Éxito

1. **No vayas directo a la solución** — practica las técnicas de depuración
2. **Usa `console.log()`** — rastrea valores intermedios en el código
3. **Lee los mensajes de error con atención** — suelen apuntar al problema
4. **Formula hipótesis** — adivina qué está mal y luego pruébalo
5. **Aprende de las soluciones** — entiende el *por qué* detrás de cada bug

## 📋 Ejercicios Disponibles

1. ✅ **01-calculator-error** - Error Lógico: Bug en cálculo matemático (Principiante)
2. ✅ **02-inventory-manager** - Error de Ejecución: Null references y validaciones faltantes (Intermedio)
3. ✅ **03-async-user-auth** - Error Asíncrono: Promesas y fetch con API externa (Intermedio)
4. ✅ **04-online-store-logic** - Error Lógico: Motor de tienda online con 7 funciones (Intermedio)
5. ✅ **05-bank-account-oop** - Error Lógico: Sistema bancario con clases OOP (Avanzado)
6. ✅ **06-task-manager** - Error de Ejecución: Accesos inválidos y validaciones ausentes (Intermedio)
7. ✅ **07-api-integration** - Error Asíncrono: fetch y JSONPlaceholder (Avanzado)
8. ✅ **08-hotel-booking-system** - Error Lógico: Lógica de negocio y reportes financieros (Avanzado)
9. ✅ **09-ecommerce-cart-manager** - Error Lógico / Ejecución: Control de stock, fechas e impuestos (Intermedio)
10. ✅ **10-subscription-billing** - Error Lógico: Prorrateo, reembolsos y descuentos en suscripciones SaaS (Intermedio)
11. ✅ **11-password-validator** - Error Lógico: Validación de longitud, complejidad y fortaleza de contraseñas (Principiante)
12. ✅ **12-library-catalog** - Error de Ejecución: Préstamos y devoluciones de libros con referencias nulas (Intermedio)
13. ✅ **13-weather-forecast** - Error Asíncrono: Consultas de clima en paralelo con Promise.all y async/await (Intermedio)
14. ✅ **14-tournament-standings** - Error Lógico: Puntuación, registro de partidos y tabla de posiciones (Avanzado)
15. ✅ **15-text-statistics** - Error Lógico: Conteo de palabras, promedio de longitud y frecuencia (Intermedio)
16. ✅ **16-flight-booking-system** - Error de Ejecución: Accesos a propiedades undefined y división por cero en reservas de vuelos (Intermedio)
17. ✅ **17-crypto-portfolio-tracker** - Error Lógico: Costo promedio por unidad dividido entre transacciones en lugar de unidades totales (Intermedio) — CoinGecko API
18. ✅ **18-rideshare-pricing** - Error Lógico: Surge pricing aplicado solo a la tarifa base, no al total del viaje (Intermedio) — Nominatim API
19. ✅ **19-university-grades** - Error Lógico: GPA calculado como promedio simple sin ponderar por créditos de cada materia (Intermedio) — JSONPlaceholder API
20. ✅ **20-recipe-nutrition** - Error Lógico: Calorías por porción divididas entre ingredientes en lugar de porciones (Principiante) — Open Food Facts API
21. ✅ **21-event-ticketing** - Error Lógico: Descuento de grupo usa `>` en vez de `>=`, excluyendo el mínimo exacto (Principiante) — JSONPlaceholder API
22. ✅ **22-hr-payroll** - Error Lógico: Salario mensual calculado dividiendo entre 52 semanas en lugar de 12 meses (Principiante) — REST Countries API
23. ✅ **23-gym-membership** - Error Lógico: Fecha de vencimiento suma días fijos en lugar de incrementar meses reales (Intermedio) — Open-Meteo API
24. ✅ **24-social-analytics** - Error Lógico: Engagement rate dividido entre número de posts en lugar de seguidores (Principiante) — JSONPlaceholder API
25. ✅ **25-book-recommender** - Error Lógico: Score de relevancia dividido entre temas del libro en lugar de intereses del usuario (Intermedio) — Open Library API
26. ✅ **26-real-estate-evaluator** - Error Lógico: Mediana calculada sin ordenar el arreglo de precios primero (Principiante) — JSONPlaceholder API
27. ✅ **27-delivery-route** - Error Lógico: Distancia total de ruta omite el tramo de regreso al depósito (Intermedio) — Nominatim API
28. ✅ **28-crypto-rebalancer** - Error Lógico: Plan de rebalanceo usa distribución equitativa ignorando los porcentajes objetivo (Intermedio) — CoinGecko API
29. ✅ **29-log-parser** - Error Lógico: Desestructuración de grupos de captura regex en orden incorrecto intercambia level y message (Intermedio)
30. ✅ **30-email-extractor** - Error Lógico: Flag `i` ausente en el regex impide capturar emails con letras mayúsculas (Intermedio)
31. ✅ **31-slug-generator** - Error Lógico: `toLowerCase()` aplicado después del filtro regex omite letras mayúsculas del slug (Intermedio)
32. ✅ **32-roman-numeral-converter** - Error Lógico: Tabla de valores en orden ascendente impide que el algoritmo greedy aplique las reglas de sustracción (Intermedio)
33. ✅ **33-run-length-encoder** - Error Lógico: Patrón `\d` en lugar de `\d+` en decode impide manejar conteos de dos o más dígitos (Intermedio)
34. ✅ **34-vending-machine** - Error Lógico: Sort ascendente en lugar de descendente hace que el algoritmo greedy use demasiadas monedas pequeñas (Intermedio)
35. ✅ **35-matrix-rotation** - Error Lógico: Invertir filas antes de transponer produce rotación antihoraria en lugar de horaria (Intermedio)
36. ✅ **36-grade-curve** - Error Lógico: Curva calculada dividiendo entre el promedio en lugar del máximo, distorsionando las proporciones (Intermedio)
37. ✅ **37-poker-hand-ranker** - Error Lógico: Operador `||` en lugar de `&&` en la condición de full house clasifica tríos incorrectamente (Intermedio)
38. ✅ **38-calendar-builder** - Error Lógico: `getDay()` sin conversión coloca lunes en índice 1 en vez de 0, desfasando toda la cuadrícula (Intermedio)
39. ✅ **39-playlist-manager** - Error Lógico: Comparador numérico invertido (`b - a`) ordena canciones por duración y BPM de forma descendente en lugar de ascendente (Intermedio)
40. ✅ **40-survey-analyzer** - Error Lógico: Percentil usa `n` en lugar de `n-1` como límite del índice, desplazando todos los valores y generando `undefined` en percentil 100 (Intermedio)
41. ✅ **41-student-enrollment** - Error Lógico: Validación de prerequisitos usa `some` en lugar de `every`, permitiendo inscripción con prerequisitos incompletos (Intermedio)
42. ✅ **42-scrabble-scorer** - Error Lógico: Multiplicador de palabra aplicado antes que los de letra invierte el orden de cálculo, dando puntajes incorrectos al combinar ambos (Intermedio)
43. ✅ **43-restaurant-billing** - Error Lógico: División de cuenta usa cantidad de ítems en lugar del número de comensales, dando montos incorrectos por persona (Principiante)
44. ✅ **44-employee-scheduler** - Error Lógico: Detección de solapamiento usa `>=` en lugar de `>`, bloqueando turnos consecutivos válidos como conflictos (Intermedio)
45. ✅ **45-budget-planner** - Error Lógico: Tasa de ahorro divide entre gastos en lugar de ingresos, produciendo valores mayores a 1 (Principiante)
46. ✅ **46-product-recommender** - Error Lógico: Similitud de Jaccard usa la unión en el numerador en lugar de la intersección, retornando siempre 1 (Intermedio)
47. ✅ **47-parking-lot** - Error Lógico: `park` asigna el primer spot libre ignorando el tipo, desperdiciando spots grandes en vehículos pequeños (Intermedio)
48. ✅ **48-grade-book** - Error Lógico: Nota ponderada se divide entre el número de categorías cuando los pesos ya suman 1, reduciendo todas las notas a un tercio (Principiante)
49. ✅ **49-caesar-cipher** - Error Lógico: `decrypt` aplica el desplazamiento en la misma dirección que `encrypt`, cifrando dos veces en lugar de descifrar (Principiante)
50. ✅ **50-tax-calculator** - Error Lógico: Tasa impositiva de cada tramo se aplica al ingreso total en lugar de solo al monto dentro del tramo, produciendo impuestos inflados (Intermedio)
51. ✅ **51-voting-system** - Error Lógico: `getWinner` usa `>= 0.5` en lugar de `> 0.5`, declarando ganador con exactamente el 50% de los votos en lugar de exigir mayoría absoluta estricta (Intermedio)
52. ✅ **52-inventory-reorder** - Error Lógico: Punto de reorden usa `demanda × safetyStock + leadTime` en lugar de `demanda × leadTime + safetyStock`, intercambiando los operandos y produciendo valores incorrectos (Principiante)
53. ✅ **53-discount-engine** - Error Lógico: `stackDiscounts` suma todas las tasas y aplica una sola vez al precio original en lugar de aplicar cada descuento secuencialmente sobre el precio resultante, sobreestimando el ahorro (Principiante)
54. ✅ **54-leaderboard** - Error Lógico: `getPlayerBest` retorna el primer puntaje enviado (`scores[0]`) en lugar del máximo (`Math.max`), ignorando cualquier mejora posterior del jugador (Principiante)
55. ✅ **55-word-frequency** - Error Lógico: `termFrequency` divide entre palabras únicas en lugar del total de palabras, inflando los valores de TF y haciendo que su suma supere 1 (Intermedio)
56. ✅ **56-library-fines** - Error Lógico: `calculateFine` calcula `dueDate - returnDate` en lugar de `returnDate - dueDate`, invirtiendo el signo y cobrando $0 por devoluciones tardías (Principiante)
57. ✅ **57-stock-portfolio** - Error Lógico: `getAnnualizedReturn` usa `totalReturn / years` (promedio simple) en lugar de la fórmula CAGR compuesta `(1+r)^(1/n) - 1`, sobreestimando el retorno anual (Intermedio)
58. ✅ **58-event-calendar** - Error Lógico: `generateRecurringDates` empieza el bucle en `i = 1` en lugar de `i = 0`, omitiendo la fecha de inicio y desplazando todas las ocurrencias un intervalo hacia adelante (Principiante)
59. ✅ **59-luhn-validator** - Error Lógico: `luhnCheck` dobla los dígitos en posiciones pares del arreglo invertido en lugar de las impares, invirtiendo la lógica del algoritmo de Luhn y haciendo que números válidos sean rechazados (Avanzado)
60. ✅ **60-morse-code-translator** - Múltiples Errores: Defectos distribuidos a lo largo de todas las funciones del módulo de traducción Morse (Avanzado)
61. ✅ **61-investment-calculator** - Error Lógico: Bug en fórmula financiera que afecta ROI, ranking y filtrado de inversiones (Avanzado)
62. ✅ **62-contact-book** - Error de Tipo de Retorno: Bug en búsqueda por teléfono que devuelve un tipo incorrecto y afecta múltiples operaciones (Intermedio)
66. ✅ **66-expense-splitter** - Error Lógico: Bug en el cálculo de lo que debe cada participante provoca balances incorrectos en cadena (Intermedio)
68. ✅ **68-anagram-finder** - Error Lógico: `filterWordsWithMinAnagrams` usa `>` en lugar de `>=` al comparar el umbral, excluyendo palabras con exactamente el mínimo requerido de anagramas (Intermedio)
69. ✅ **69-matrix-stats** - Error Lógico: `colSums` usa `row[0]` en lugar de `row[col]`, produciendo la misma suma para todas las columnas (Intermedio)
72. ✅ **72-loan-manager** - Múltiples Errores Lógicos: 6 bugs de asignación, comparación y tipos afectan disponibilidad de libros, cálculo de multas, registro de devoluciones, consulta por miembro, ordenamiento y renovaciones (Avanzado)
73. ✅ **73-investment-analyzer** - Múltiples Errores Lógicos: 7 bugs en fórmulas financieras (ROI, interés compuesto, CAGR, Regla del 72, Break-Even, volatilidad y ranking) producen cálculos de inversiones incorrectos (Avanzado)

## 🔧 Solución de Problemas

### Las pruebas no ejecutan

- Verifica que Node.js esté instalado: `node --version`
- Instala las dependencias: `npm install`
- Asegúrate de estar en el directorio correcto

### No puedo encontrar el bug

- Re-lee la sección **Problema Reportado** del README del ejercicio
- Agrega `console.log()` para rastrear valores intermedios
- Revisa el output de los tests: el mensaje de error muestra el valor esperado vs. el recibido
- Ejecuta el archivo con `node buggy-code.js` para ver el comportamiento en aislado
- Compara línea a línea el código con los criterios de aceptación del README

## 📄 Licencia

Este proyecto es de código abierto y está disponible para uso educativo.

## 🙏 Agradecimientos

Creado para ayudar a los desarrolladores a construir habilidades esenciales de depuración a través de experiencia práctica.

---

**¡Feliz Debugging! 🐛➡️✨**

Recuerda: cada bug que corriges te hace un mejor desarrollador.
