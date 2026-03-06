# 🐛 JavaScript Debugging Exercises

A comprehensive collection of hands-on debugging exercises designed to teach JavaScript debugging skills through practical experience. Each exercise contains intentional bugs that you must identify, understand, and fix.

## 🎯 Purpose

This project helps developers:

- **Master debugging techniques** through real-world scenarios
- **Build problem-solving skills** by identifying and fixing bugs
- **Understand common pitfalls** in JavaScript development
- **Develop best practices** to write bug-free code

## 🚀 Getting Started

### Prerequisites

- Node.js 14.x or higher
- Basic JavaScript knowledge
- A text editor or IDE

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd debugging-exercises

# No dependencies to install - uses vanilla JavaScript!
```

### How to Use

1. **Choose an exercise** from the `exercises/` directory
2. **Read the README** in the exercise folder to understand the context
3. **Examinar buggy-code.js** - este contiene el código roto
4. **Ejecutar las pruebas** para ver qué falla:
   ```bash
   npm test exercises/01-calculator-error
   ```
5. **Depurar y corregir** el código
6. **Run tests again** to verify your solution
7. **Compare with solution.js** to deepen understanding

## 📁 Project Structure

```
debugging-exercises/
├── exercises/
│   ├── 01-calculator-error/    # Individual exercise
│   ├── 02-[next-exercise]/     # Future exercises
│   └── ...
├── base-prompt.md              # Complete project context
├── STRUCTURE.md                # Detailed structure explanation
├── LLM_GUIDE.md                # Guide for LLMs to create exercises
├── EXERCISE_TEMPLATE.md        # Template for new exercises
└── README.md                   # This file
```

See [STRUCTURE.md](./STRUCTURE.md) for detailed information about the folder organization.

## 🏷️ Exercise Types

Exercises are tagged by the type of bug they contain:

### 💭 Logical Errors

Code runs without errors but produces incorrect results.

- Off-by-one errors
- Wrong operators
- Flawed conditional logic
- Calculation mistakes

**Example**: [01-calculator-error](./exercises/01-calculator-error/)

### 📝 Syntax Errors

Code fails to parse due to incorrect syntax.

- Missing brackets/parentheses
- Invalid declarations
- Misplaced punctuation

### ⚠️ Runtime Errors

Errors that occur during code execution.

- Null/undefined references
- Type errors
- Invalid operations

### ⏱️ Async Errors

Issues specific to asynchronous code.

- Promise handling problems
- Callback mistakes
- Race conditions

**Example**: [03-async-user-auth](./exercises/03-async-user-auth/)

## 📚 Exercise Structure

Each exercise contains:

| File             | Purpose                                     |
| ---------------- | ------------------------------------------- |
| `README.md`      | Exercise description, objectives, and hints |
| `buggy-code.js`  | The broken code to debug                    |
| `solution.js`    | Corrected code with explanations            |
| `EXPLANATION.md` | Deep dive into the bug and how to fix it    |
| `test.js`        | Automated tests for validation              |

## 🎓 Learning Path

Exercises are numbered in recommended order of progression:

1. Start with **01-calculator-error** (logical error, beginner-friendly)
2. Progress through exercises sequentially
3. Each exercise builds debugging skills progressively
4. Check the README of each exercise for difficulty level

## 🧪 Running Tests

Each exercise includes tests to validate your solution:

```bash
# Run a specific exercise test
node exercises/01-calculator-error/test.js

# The test will show:
# ✓ Passed tests (green)
# ✗ Failed tests (red with details)
```

## 🤝 Contributing

Want to add new exercises? Great! Follow these steps:

1. Read [LLM_GUIDE.md](./LLM_GUIDE.md) or [EXERCISE_TEMPLATE.md](./EXERCISE_TEMPLATE.md)
2. Create your exercise following the standard structure
3. Ensure tests validate the solution
4. Document thoroughly
5. Submit a pull request

## 📖 For Educators

This project is perfect for:

- **Classroom instruction** - Assign exercises as homework or lab work
- **Coding bootcamps** - Build debugging skills early
- **Self-study** - Students can learn independently
- **Interview prep** - Practice finding bugs under pressure

## 🤖 For LLMs

This project is designed to be LLM-friendly. See [LLM_GUIDE.md](./LLM_GUIDE.md) for detailed instructions on:

- Generating new exercises
- Maintaining project consistency
- Following quality standards
- Creating appropriate difficulty levels

## 💡 Tips for Success

1. **Don't rush to the solution** - Practice debugging techniques
2. **Use console.log()** - Track values through the code
3. **Read error messages carefully** - They often point to the problem
4. **Form hypotheses** - Guess what's wrong, then test it
5. **Learn from explanations** - Understand the "why" behind bugs

## 📋 Current Exercises

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

## 🔧 Troubleshooting

### Tests won't run

- Ensure Node.js is installed: `node --version`
- Navigate to the correct directory
- Check file paths are correct

### Can't find the bug

- Read the hints in the exercise README
- Add console.log() statements to track values
- Check test output for clues
- Compare your logic to expected behavior

## 📄 License

This project is open source and available for educational purposes.

## 🙏 Acknowledgments

Created to help developers build essential debugging skills through practical, hands-on experience.

---

**Happy Debugging! 🐛➡️✨**

Remember: Every bug you fix makes you a better developer!
