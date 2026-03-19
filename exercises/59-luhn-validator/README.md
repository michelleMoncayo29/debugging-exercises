# Luhn Validator

**Tipo**: Logical Error

## 📋 Historia de Usuario

Como sistema de pagos,
quiero validar números de tarjeta usando el algoritmo de Luhn,
para detectar errores de transcripción y rechazar números inválidos antes de procesarlos.

## 🎯 Criterios de Aceptación

- [ ] `luhnCheck` retorna `true` para números de tarjeta válidos conocidos (Visa, Mastercard, Amex, Discover)
- [ ] `luhnCheck` retorna `false` para números con un dígito de verificación incorrecto
- [ ] `generateCheckDigit` produce el dígito que hace que el número completo pase `luhnCheck`
- [ ] `validateCards` retorna únicamente las tarjetas del arreglo que superan la validación Luhn
- [ ] `getInvalidCards` retorna únicamente las tarjetas que no superan la validación Luhn
- [ ] `getLuhnStats` reporta totales, conteos válidos/inválidos y tasa de validez correctos

## 🐛 Problema Reportado

Al ejecutar la validación con números de tarjeta conocidos y correctos, `luhnCheck` retorna resultados incorrectos de forma sistemática.

**Ejemplos del problema**:

- `luhnCheck('4111111111111111')` retorna `false` (debería retornar `true`)
- `luhnCheck('5500005555555559')` retorna `false` (debería retornar `true`)
- `luhnCheck('4111111111111112')` retorna `true` (debería retornar `false`)
- Todas las funciones que dependen internamente de `luhnCheck` —`validateCards`, `getInvalidCards`, `getLuhnStats` y `generateCheckDigit`— producen resultados erróneos en cascada

## 📂 Archivos

- `buggy-code.js` - Código con el error
- `test.js` - Pruebas para validar la solución (Jest)
- `solution.js` - Solución de referencia (para comparar después)

## ✅ Cómo Verificar la Solución

```bash
npm test exercises/59-luhn-validator
```

Todas las pruebas deben pasar para considerar el error corregido.

**Nota**: Los tests están configurados para probar `buggy-code.js` por defecto. Cuando corrijas el error, cambia la línea de importación en `test.js` a `solution.js` para verificar tu solución.

## ⚙️ Nivel de Dificultad

**Nivel**: Avanzado

**Tiempo Estimado**: 20-30 minutos

El error reside en una condición numérica dentro del núcleo del algoritmo de Luhn; sin conocer los pasos exactos del algoritmo, el código luce correcto a primera vista y el fallo puede confundirse con un problema en cualquiera de las funciones derivadas.
