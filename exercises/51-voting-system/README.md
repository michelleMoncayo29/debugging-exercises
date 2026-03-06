# Voting System

**Tipo**: Error Lógico

## 📋 Historia de Usuario

Como administrador de una elección, necesito que el sistema determine correctamente al ganador por mayoría absoluta para garantizar que solo se declare ganador a quien supere estrictamente el 50% de los votos.

## 🎯 Criterios de Aceptación

- `tallyVotes(ballots)` cuenta cuántos votos recibió cada candidato
- `getWinner(ballots)` retorna el candidato con **más del 50%** de los votos, o `null` si nadie lo supera
- Un resultado de exactamente el 50% **no** es mayoría absoluta y debe retornar `null`
- `getRankedResults(ballots)` retorna candidatos ordenados de mayor a menor cantidad de votos con su porcentaje
- `eliminateLowest(ballots)` retorna la lista de candidatos sin el de menor cantidad de votos

## 🐛 Problema Reportado

En elecciones donde dos candidatos empatan al 50% cada uno, el sistema declara ganador al primero encontrado en lugar de retornar `null`, violando la definición de mayoría absoluta.

**Ejemplos del problema**:

- `['Alice', 'Alice', 'Bob', 'Bob']` (50% cada uno) → retorna `'Alice'` en lugar de `null`
- `['Alice', 'Alice', 'Bob']` (Alice con 66.7%) → retorna `'Alice'` correctamente
- El operador de comparación usado permite el empate cuando debería requerir superarlo

## 📂 Archivos

- `buggy-code.js` - Código con el error
- `test.js` - Pruebas para validar la solución (Jest)
- `solution.js` - Solución de referencia (para comparar después)

## ✅ Cómo Verificar la Solución

```bash
npm test exercises/51-voting-system
```

Todas las pruebas deben pasar para considerar el error corregido.

**Nota**: Los tests están configurados para probar `buggy-code.js` por defecto. Cuando corrijas el error, cambia la línea de importación en `test.js` a `solution.js` para verificar tu solución.

## ⚙️ Nivel de Dificultad

**Nivel**: Intermedio

**Tiempo Estimado**: 15-25 minutos
