# Sistema Bancario Orientado a Objetos

**Tipo**: Error Lógico / Error de Ejecución

## 📋 Historia de Usuario

Como desarrollador de un sistema financiero, necesito implementar un módulo de gestión bancaria utilizando programación orientada a objetos. El módulo debe modelar cuentas bancarias estándar y cuentas de ahorro, con soporte para depósitos, retiros, transferencias entre cuentas y cálculo de intereses, asegurando la integridad del saldo en todo momento.

## 🎯 Criterios de Aceptación

- **`Transaction`**: Debe registrar el tipo, monto y descripción de cada operación. El método `getNetEffect()` debe retornar un valor positivo para depósitos y negativo para retiros/transferencias.
- **`BankAccount`**:
  - `deposit()` suma el monto al saldo; `withdraw()` lo resta.
  - Se permite retirar exactamente el saldo disponible (sin quedar en negativo).
  - `transfer()` descuenta de la cuenta origen y acredita en la destino, en ese orden.
  - `getTransactionHistory()` retorna una **copia** del historial, no el array interno.
  - `getCalculatedBalance()` reconstruye el saldo sumando el efecto neto de cada transacción desde cero.
- **`SavingsAccount`**:
  - La `interestRate` se almacena internamente como decimal (ej. `5` → `0.05`).
  - `applyInterest()` calcula el interés como `saldo × tasa` y lo registra como depósito.
  - `withdraw()` impide que el saldo resultante caiga **por debajo** del `minimumBalance`. Retirar hasta dejarlo exactamente en el mínimo está permitido.

## 🐛 Problema Reportado

El equipo de QA ha bloqueado el release por múltiples fallos críticos en el módulo bancario. Las operaciones básicas no producen los resultados esperados y varias funciones auxiliares también presentan comportamiento incorrecto.

**Ejemplos del problema**:

- `new BankAccount('Ana', 100); acc.deposit(50)` → el saldo queda en `50` en lugar de `150`.
- `new SavingsAccount('Lucía', 1000, 10, 0); sa.applyInterest()` → el interés es `100` pero el saldo baja en vez de subir.
- `getCalculatedBalance()` lanza: `TypeError: reduce of empty array with no initial value`.
- `sa.withdraw(400)` sobre una cuenta de $500 con mínimo $100 lanza error innecesariamente.

## 📂 Archivos

- `buggy-code.js` - Código con los errores.
- `test.js` - Pruebas para validar la solución (Jest).
- `solution.js` - Implementación correcta con comentarios `// CORREGIDO:`.

## ✅ Cómo Verificar la Solución

```bash
npm test exercises/05-bank-account-oop
```

## ⚙️ Nivel de Dificultad

**Nivel**: Avanzado

**Tiempo Estimado**: 30-40 minutos
