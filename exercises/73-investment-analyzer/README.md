# Analizador de Inversiones

**Tipo**: Logical Error

## 📋 Historia de Usuario

Como analista financiero, quiero un sistema que calcule métricas clave de inversiones —ROI, valor futuro, CAGR, punto de equilibrio, volatilidad y más— para evaluar y comparar activos de un portafolio con precisión.

## 🎯 Criterios de Aceptación

- [ ] El ROI total debe expresar la ganancia o pérdida como porcentaje del capital inicialmente invertido.
- [ ] El valor futuro debe reflejar el efecto del interés compuesto en lugar del crecimiento lineal.
- [ ] El CAGR debe representar la tasa anual constante equivalente al crecimiento total del período.
- [ ] La regla del 72 debe estimar en años el tiempo necesario para duplicar una inversión a una tasa dada.
- [ ] El punto de equilibrio debe expresar el número mínimo de unidades necesarias para cubrir todos los costos, incluyendo los variables.
- [ ] La volatilidad debe calcularse como desviación estándar muestral, aplicando la corrección estadística correspondiente.
- [ ] El ranking de inversiones debe presentarse en orden descendente, con el mayor retorno en la primera posición.

## 🐛 Problema Reportado

Se reportan múltiples comportamientos incorrectos en distintos cálculos del sistema de análisis de inversiones:

- Al calcular el retorno de una inversión que duplica su valor, el sistema reporta la mitad del porcentaje esperado.
- Al proyectar el crecimiento de una inversión a varios años, los resultados son menores a los esperados: el sistema no refleja el efecto acumulativo de los intereses sobre los intereses ya generados.
- Al calcular la tasa de crecimiento anual de un activo, el sistema retorna valores varios órdenes de magnitud superiores a los esperados; para períodos de cinco años, el resultado es astronómicamente alto.
- Al estimar el tiempo de duplicación de una inversión mediante la regla del 72, el sistema retorna valores prácticamente nulos (fracciones de año) en lugar de plazos razonables de varios años.
- Al calcular el punto de equilibrio, el sistema indica que se necesitan significativamente menos unidades de las reales para cubrir todos los costos del negocio.
- Al medir la dispersión de retornos históricos, la volatilidad calculada es consistentemente menor al valor estadísticamente correcto para una muestra.
- Al ordenar inversiones por rendimiento, el ranking aparece invertido: el activo con menor retorno ocupa la primera posición y el de mayor retorno queda al final.

## 📂 Archivos

- `buggy-code.js` - Código con los errores
- `test.js` - Pruebas para validar la solución (Jest)
- `solution.js` - Solución de referencia (para comparar después)

## ✅ Cómo Verificar la Solución

```bash
npm test exercises/73-investment-analyzer
```

Todas las pruebas deben pasar para considerar los errores corregidos.

**Nota**: Los tests están configurados para probar `buggy-code.js` por defecto.
Cuando corrijas los errores, cambia la línea de importación en `test.js` a `solution.js`
para verificar tu solución.

## ⚙️ Nivel de Dificultad

**Nivel**: Avanzado

**Tiempo Estimado**: 45-70 minutos
