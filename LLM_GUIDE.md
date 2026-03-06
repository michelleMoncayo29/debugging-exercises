# LLM Guide: Generating Debugging Exercises

This document provides comprehensive instructions for Large Language Models (LLMs) to autonomously generate high-quality debugging exercises that align with the project's standards and educational goals.

## Table of Contents

1. [Understanding Your Role](#understanding-your-role)
2. [Project Architecture Overview](#project-architecture-overview)
3. [Exercise Generation Workflow](#exercise-generation-workflow)
4. [File Creation Guidelines](#file-creation-guidelines)
5. [Bug Creation Principles](#bug-creation-principles)
6. [Quality Assurance Checklist](#quality-assurance-checklist)
7. [Examples and Templates](#examples-and-templates)

## Understanding Your Role

As an LLM generating exercises for this project, you are:

### **An Educator**

- Create exercises that teach valuable debugging skills
- Ensure bugs are realistic and representative of common mistakes
- Provide clear explanations that deepen understanding
- Progressive difficulty

### **CRITICAL: Language Requirements**

- **ALL documentation MUST be in Spanish**: README, EXPLANATION, comments, test descriptions
- **Code MUST be in English**: variable names, function names, code itself
- **NO mixing languages**: Keep documentation purely Spanish, code purely English

### **A Maintainer**

- Follow established project structure exactly
- Maintain consistency across all exercises
- Use standardized file names and formats
- Keep documentation thorough and clear

### **A Quality Controller**

- Verify all tests work correctly
- Ensure bugs are neither too obvious nor too obscure
- Check that solutions are complete and correct
- Validate that documentation is comprehensive

## Project Architecture Overview

### Directory Structure You Must Follow

```
exercises/
├── 01-exercise-name/
│   ├── README.md           # REQUIRED
│   ├── buggy-code.js       # REQUIRED
│   ├── solution.js         # REQUIRED
│   └── test.js             # REQUIRED
├── 02-another-exercise/
│   ├── README.md
│   ├── buggy-code.js
│   ├── solution.js
│   └── test.js
└── ...
```

**CRITICAL**: Exactly 4 files per exercise, no more, no less.

### File Naming Rules (STRICT)

| File            | Exact Name      | Case Sensitive          |
| --------------- | --------------- | ----------------------- |
| Exercise README | `README.md`     | YES - must be uppercase |
| Buggy code      | `buggy-code.js` | YES - must be lowercase |
| Solution        | `solution.js`   | YES - must be lowercase |
| Tests           | `test.js`       | YES - must be lowercase |

**CRITICAL**: Do not deviate from these names. Tools and documentation rely on this exact structure.

### Bug Type Tags

Each exercise should be tagged in its README with one of these types:

| Bug Type      | Description                   |
| ------------- | ----------------------------- |
| Logical Error | Wrong results, correct syntax |
| Syntax Error  | Code won't parse              |
| Runtime Error | Crashes during execution      |
| Async Error   | Async/Promise issues          |

**Note**: Exercises are numbered sequentially (01-, 02-, etc.) regardless of bug type.

## Exercise Generation Workflow

Follow these steps when generating a new exercise:

### Step 1: Determine Exercise Number and Bug Type

**Ask yourself**:

- What debugging skill should this exercise teach?
- What bug type does this exercise demonstrate?
- What is the next available exercise number?
- Is there already a similar exercise?

**Determine exercise number**:

- Check existing exercises in `exercises/` folder
- Use the next sequential number (e.g., if 01-calculator-error exists, use 02-)

**Tag the bug type** (in README):

- Logical error, Syntax error, Runtime error, or Async error

### Step 2: Create Exercise Name

**Format**: `##-lowercase-with-hyphens`

**Guidelines**:

- Start with two-digit number (01-, 02-, etc.)
- 2-4 words after the number
- Descriptive of the bug or scenario
- Memorable and clear
- Examples: `01-calculator-error`, `02-array-filter-bug`, `03-promise-chain-issue`

**Bad examples**:

- `Exercise1` (missing number prefix, not descriptive)
- `01-CalculatorBug` (wrong case)
- `1-calc` (single digit, too abbreviated)
- `01-the-bug-where-the-calculator-returns-wrong-values` (too long)

### Step 3: Design the Bug

**Requirements**:

1.  **Realistic**: Something a developer might actually write
2.  **Educational**: Teaches a valuable lesson
3.  **Debuggable**: Can be found through systematic debugging
4.  **Not Trivial**: Requires some thought, not instantly obvious
5.  **Not Obscure**: Doesn't require esoteric knowledge

**Process**:

1.  Start with correct code for a realistic scenario
2.  Introduce a specific bug
3.  Ensure the bug has clear symptoms
4.  Make sure tests can catch the bug

### Step 4: Create All Required Files — TDD Order

Generate all 4 files following the templates in this guide.

**TDD order of creation** (mandatory):

1. `test.js` — write all Jest tests first, defining expected behavior (RED phase)
2. `solution.js` — implement correct code until all tests pass (GREEN phase)
3. `buggy-code.js` — copy solution and introduce the one intentional bug; run tests and confirm they now FAIL
4. `README.md` — describe the exercise in Scrum-style format, NO hints

### Step 5: Test and Validate

**Before considering the exercise complete**:

1. Run `npm test exercises/##-name` with `buggy-code.js` import → must FAIL
2. Run `npm test exercises/##-name` with `solution.js` import → must PASS
3. Check that README documentation is clear and complete
4. Verify README has NO hints section

### Step 6: Update Main README

Add the new exercise to the main README.md in the "Current Exercises" section:

```markdown
## 📋 Current Exercises

1. ✅ **01-calculator-error** - Logical error: Mathematical calculation bug (Beginner)
2. ✅ **02-your-new-exercise** - [Bug Type]: Brief description (Difficulty)
```

### Step 7: Commit

After all QA checks pass, commit the exercise:

```bash
git add exercises/##-name/ README.md
git commit -m "feat :sparkles: add [name] exercise (##)"
```

One commit per exercise — no exceptions.

## File Creation Guidelines

### README.md Template

**CRITICAL REQUIREMENTS**:

1. **All text in Spanish**
2. **Scrum-style format**: User story + acceptance criteria + reported problem
3. **NO hints**: Do NOT include hints section - debugging is 100% the student's job
4. **Show the problem**: Describe what should happen vs. what actually happens

````markdown
# [Nombre del Ejercicio]

**Tipo**: [Error Lógico / Error de Sintaxis / Error de Ejecución / Error Asíncrono]

## 📋 Historia de Usuario

Como [rol de usuario], necesito [funcionalidad] para [beneficio/objetivo].

## 🎯 Criterios de Aceptación

- La funcionalidad debe hacer X correctamente
- La funcionalidad debe hacer Y correctamente
- La funcionalidad debe manejar Z apropiadamente

## 🐛 Problema Reportado

[Descripción clara del problema sin dar pistas de solución]

**Ejemplos del problema**:

- Con entrada X, se espera Y pero se obtiene Z
- Con entrada A, se espera B pero se obtiene C

## 📂 Archivos

- `buggy-code.js` - Código con el error
- `test.js` - Pruebas para validar la solución (Jest)
- `solution.js` - Solución de referencia (para comparar después)

## ✅ Cómo Verificar la Solución

```bash
npm test exercises/##-nombre-ejercicio
```

Todas las pruebas deben pasar para considerar el error corregido.

**Nota**: Los tests están configurados para probar `buggy-code.js` por defecto.
````

Todas las pruebas deben pasar (X/X) para considerar el error corregido.

## ⚙️ Nivel de Dificultad

**Nivel**: [Principiante / Intermedio / Avanzado]

**Tiempo Estimado**: [10-15 minutos / 15-25 minutos / 25-40 minutos]

````

### buggy-code.js Template

**CRITICAL**: Comments in Spanish, code in English

```javascript
/**
 * [Breve descripción de lo que este código debería hacer]
 *
 * [Contexto adicional si es necesario]
 */

// [Comentarios de escenario/contexto en español]

function mainFunction(parameter) {
  // Código con bug intencional
  // El bug debe ser:
  // - Realista (algo que alguien podría escribir)
  // - No inmediatamente obvio (requiere depuración)
  // - Educativo (enseña una lección valiosa)

  // IMPORTANTE: NO incluir comentarios que den pistas del bug
  // Los comentarios deben explicar la INTENCIÓN, no señalar errores

  return result;
}

// Funciones auxiliares adicionales si son necesarias

// Exportar para testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { mainFunction };
}

// Example usage (optional - shows how code is meant to be used)
if (require.main === module) {
  console.log(mainFunction(exampleInput));
}
````

**Bug Quality Guidelines**:

- **Logical Error Example**: Using `<` instead of `<=` in a loop condition
- **Syntax Error Example**: Missing closing brace }
- **Runtime Error Example**: Accessing undefined property
- **Async Error Example**: Not awaiting a promise

### solution.js Template

**CRITICAL**: Comments in Spanish, code in English

```javascript
/**
 * [Misma descripción que buggy-code.js]
 *
 * [Mismo contexto adicional]
 */

// [Mismos comentarios de escenario/contexto]

function mainFunction(parameter) {
  // CORREGIDO: [Explicación clara de qué estaba mal]
  // [Explicar el cambio específico y por qué soluciona el bug]

  correctCode; // La versión corregida

  return result;
}

// Funciones auxiliares adicionales si son necesarias (también corregidas si tenían bugs)

// Exportar para testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { mainFunction };
}

// Ejemplo de uso
if (require.main === module) {
  console.log(mainFunction(exampleInput));
}
```

**Formato de Comentarios CORREGIDO**:

```javascript
// CORREGIDO: [Qué estaba mal] → [Qué debería ser]
// Ejemplo: CORREGIDO: Cambió < a <= para incluir el elemento final
```

### test.js Template

**CRITICAL**: Use Jest framework, descriptions in Spanish, code in English

```javascript
/**
 * Pruebas para [Nombre del Ejercicio]
 * Ejecutar con: npm test exercises/##-nombre-ejercicio
 */

// IMPORTANTE: Cambiar esta línea para probar tu solución
const { functionName } = require('./buggy-code.js');
// const { functionName } = require('./solution.js');

describe('[Nombre del Ejercicio]', () => {
  describe('[Funcionalidad principal]', () => {
    test('debe [comportamiento esperado con entrada normal]', () => {
      expect(functionName(input1)).toBe(expectedOutput1);
    });

    test('debe [otro comportamiento esperado]', () => {
      expect(functionName(input2)).toBe(expectedOutput2);
    });

    test('debe manejar caso límite — [descripción]', () => {
      expect(functionName(edgeCase)).toBe(expectedEdgeOutput);
    });
  });

  describe('[Otra funcionalidad o escenario]', () => {
    test('debe [comportamiento]', () => {
      expect(functionName(input3)).toEqual(expectedObject);
    });

    test('debe lanzar error cuando [condición inválida]', () => {
      expect(() => functionName(invalidInput)).toThrow('[mensaje de error]');
    });
  });
});
```

**Test Coverage Requirements**:

- Minimum 5 test cases
- Cover normal inputs
- Cover edge cases (empty, null, boundary values)
- Cover error conditions if applicable
- Each test should have a clear, descriptive name

## Bug Creation Principles

### Logical Errors

**Good Logical Errors**:

- Off-by-one: `for (let i = 0; i < array.length - 1; i++)` (misses last element)
- Wrong operator: `if (x = 5)` instead of `if (x === 5)`
- Incorrect formula: Wrong order of operations in calculation
- Flawed logic: Checking condition before variable is updated

**Bad Logical Errors**:

- Obviously wrong: `return undefined` when should return a value
- Contrived: Unnecessarily complex logic with no real-world equivalent
- Multiple bugs: One exercise should focus on one primary bug

### Syntax Errors

**Good Syntax Errors**:

- Missing bracket: `function test() { console.log('hi');` ← missing }
- Wrong declaration: `const function test()` ← incorrect syntax
- Misplaced semicolon: Breaking ASI (Automatic Semicolon Insertion)

**Bad Syntax Errors**:

- Too trivial: Single missing semicolon at end of line
- Too obscure: Rare syntax edge case

### Runtime Errors

**Good Runtime Errors**:

- Null reference: `user.address.street` when `address` is undefined
- Type error: Calling a non-function `array.map` when array is actually a string
- Array out of bounds: `array[array.length]` (should be `array.length - 1`)

**Bad Runtime Errors**:

- Obvious: Calling a completely undefined function
- Contrived: Situations that would never occur in real code

### Async Errors

**Good Async Errors**:

- Missing await: `const data = fetchData()` instead of `await fetchData()`
- Unhandled rejection: Promise without .catch()
- Race condition: Dependent operations not properly sequenced

**Bad Async Errors**:

- Too complex: Multiple nested async operations in one exercise
- Unclear: Bug symptoms don't clearly point to async issue

## Quality Assurance Checklist

Before submitting an exercise, verify:

### Structure

- [ ] All 4 required files exist (README, buggy-code, solution, test)
- [ ] File names are exactly correct (case-sensitive)
- [ ] Exercise folder name follows convention (##-lowercase-with-hyphens)

### buggy-code.js

- [ ] Contains exactly one primary bug
- [ ] Bug is realistic and educational
- [ ] Code runs (for logical/runtime errors) or fails to parse (for syntax errors)
- [ ] Comments in Spanish explain intent, NOT the bug
- [ ] Code in English
- [ ] Exports functions for testing

### solution.js

- [ ] Fixes all bugs
- [ ] Includes CORREGIDO comments explaining changes (in Spanish)
- [ ] Code in English
- [ ] Code is identical to buggy version except for the fix
- [ ] Works correctly with all test cases

### test.js

- [ ] Uses Jest framework (`describe`, `test`, `expect`)
- [ ] Configured to test `buggy-code.js` by default
- [ ] Fails when testing buggy-code.js
- [ ] Passes when testing solution.js
- [ ] Has at least 8-10 meaningful test cases
- [ ] Test descriptions in Spanish
- [ ] Provides clear output with expectations

### README.md

- [ ] Written entirely in Spanish
- [ ] Scrum-style format (Historia de Usuario + Criterios + Problema)
- [ ] **NO hints section** - debugging is student's responsibility
- [ ] Clear problem description with examples
- [ ] Bug type tag included (Error Lógico/Sintaxis/Ejecución/Asíncrono)
- [ ] Lists all 4 files
- [ ] Explains how to run tests with Jest
- [ ] Difficulty level is appropriate
- [ ] Estimated time is realistic

### Educational Value

- [ ] Teaches a valuable debugging skill
- [ ] Bug is common enough to be worth learning
- [ ] Problem description is clear without giving away solution
- [ ] Applicable to real-world development

## Examples and Templates

### Example: Complete Logical Error Exercise

See the `calculator-bug` exercise in `exercises/01-logical-errors/` for a complete, working example of all concepts in this guide.

### Generating Your First Exercise

**Step-by-step process**:

1. **Choose a bug**: "Array filter function that uses wrong comparison operator"

2. **Goal**: Create a simple logical error exercise

3. **Exercise Number**: Check exercises/ folder, next is `02-`
4. **Name**: `02-sum-calculator-bug`
5. **Bug Type**: Logical Error
6. **Bug**: Function sums all numbers except the last one (off-by-one error)

7. **Create solution.js first**:

```javascript
function filterAdults(people) {
  // FIXED: Changed > to >= to include people exactly 18 years old
  return people.filter((person) => person.age >= 18);
}
```

8. **Create buggy-code.js** (introduce bug):

```javascript
function filterAdults(people) {
  // Filter array to only include adults (18 and over)
  return people.filter((person) => person.age > 18);
  // Bug: excludes people exactly 18 years old
}
```

9. **Create tests** that expect the full sum
10. **Write README** explaining it should sum all numbers (include bug type tag)
11. **Write EXPLANATION** about off-by-one errors
12. **Update main README.md** to list the new exercises

## Common Pitfalls to Avoid

### ❌ Don't:

- Create exercises with multiple unrelated bugs
- Make bugs so obvious they're trivial
- Make bugs so obscure they're impossible to find
- Include hints that directly reveal the answer
- Forget to test both buggy and solution versions
- Use outdated JavaScript patterns
- Create scenarios that are unrealistic

### ✅ Do:

- Focus on one primary bug per exercise
- Make bugs realistic and educational
- Provide progressive hints
- Test thoroughly
- Use modern JavaScript (ES6+)
- Create relatable scenarios
- Explain the "why" not just the "what"

## Advanced: Creating Exercise Series

When creating multiple related exercises:

1. **Progressive Difficulty**: Start simple, increase complexity
2. **Build on Concepts**: Later exercises can reference earlier ones
3. **Consistent Scenarios**: Use similar contexts for related bugs
4. **Avoid Repetition**: Each exercise should teach something new

## Summary

As an LLM generating exercises:

- **Follow the structure exactly** - Consistency is crucial
- **Prioritize education** - Every bug should teach a lesson
- **Test thoroughly** - Verify everything works
- **Document completely** - Students rely on clear explanations
- **Think like a teacher** - What will help students learn?

By following this guide, you'll create high-quality, educational debugging exercises that maintain project standards and provide real value to learners.
