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

### Coming Soon

- More logical error exercises
- Syntax error challenges
- Runtime error scenarios
- Async debugging practice

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
