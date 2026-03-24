# Calculadora de Estadísticas Descriptivas

**Tipo**: Logical Error

## 📋 Historia de Usuario

Como analista de datos, quiero una calculadora que compute las métricas estadísticas descriptivas fundamentales —tendencia central, dispersión, normalización, correlación y detección de valores atípicos— para analizar conjuntos de datos numéricos con precisión estadística.

## 🎯 Criterios de Aceptación

- [ ] La mediana debe calcularse sobre los datos ordenados, independientemente del orden original del arreglo de entrada.
- [ ] La moda debe retornar todos los valores que comparten la frecuencia máxima, nunca un arreglo vacío cuando los datos tienen repeticiones.
- [ ] La varianza y la desviación estándar deben aplicar la corrección de Bessel (divisor n−1) propia de las estadísticas muestrales.
- [ ] Los z-scores deben estandarizar correctamente los datos, produciendo un conjunto con media aproximada a 0 y desviación estándar aproximada a 1.
- [ ] El coeficiente de correlación de Pearson debe retornar 1 o −1 para conjuntos con relación lineal perfecta.
- [ ] La detección de valores atípicos debe aplicar el criterio de Tukey usando Q1 y Q3 como base de las vallas, clasificando correctamente outliers y valores normales.

## 🐛 Problema Reportado

Se reportan múltiples comportamientos incorrectos en distintos cálculos del sistema de estadísticas descriptivas:

- Al calcular la mediana de un conjunto desordenado, el sistema retorna un valor que no corresponde al punto central de la distribución; el resultado varía según el orden de ingreso de los datos en lugar de reflejar el valor estadísticamente correcto.
- Al calcular la moda de un conjunto donde existen valores repetidos, el sistema retorna sistemáticamente un arreglo vacío, sin importar cuántas veces aparezca un valor determinado.
- Al medir la dispersión de una muestra, la varianza y la desviación estándar retornan valores consistentemente más bajos que los esperados; la diferencia es especialmente notable en muestras pequeñas.
- Al estandarizar un conjunto de datos, los valores resultantes no cumplen la propiedad estadística esperada: la media del conjunto transformado no se aproxima a 0 ni su dispersión se aproxima a 1.
- Al medir la relación entre dos conjuntos que exhiben una relación lineal perfecta, el sistema retorna un coeficiente que no alcanza los valores extremos esperados (1 o −1).
- Al detectar valores atípicos, el sistema clasifica incorrectamente los datos: valores que deberían identificarse como outliers aparecen como normales, o viceversa.

## 📂 Archivos

- `buggy-code.js` - Código con los errores
- `test.js` - Pruebas para validar la solución (Jest)
- `solution.js` - Solución de referencia (para comparar después)

## ✅ Cómo Verificar la Solución

```bash
npm test exercises/74-stats-calculator
```

Todas las pruebas deben pasar para considerar los errores corregidos.

**Nota**: Los tests están configurados para probar `buggy-code.js` por defecto.
Cuando corrijas los errores, cambia la línea de importación en `test.js` a `solution.js`
para verificar tu solución.

## ⚙️ Nivel de Dificultad

**Nivel**: Avanzado

**Tiempo Estimado**: 50-80 minutos
