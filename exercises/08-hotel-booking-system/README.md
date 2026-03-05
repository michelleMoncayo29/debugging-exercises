# Sistema de Reservas de Hotel Avanzado

**Tipo**: Error Lógico / Error de Ejecución / Error de Sintaxis

## 📋 Historia de Usuario

Como gerente de TI de una cadena hotelera, necesito un sistema de backend robusto que gestione nuestro motor de reservas. El sistema debe permitir calcular precios dinámicos basados en la temporada (verano, invierno, baja), validar que los clientes no reserven en fechas pasadas, gestionar la disponibilidad de habitaciones y generar reportes financieros mensuales para la junta directiva.

## 🎯 Criterios de Aceptación

1.  **getSeason**: Debe clasificar correctamente los meses. Verano (Jun-Sep), Invierno (Dic-Feb) y los demás como Temporada Baja.
2.  **calculateStayPrice**:
    - Debe calcular el precio noche a noche. Si una estancia empieza en temporada alta y termina en baja, el precio debe reflejar el cambio.
    - El IVA (tax) debe aplicarse sobre el subtotal acumulado.
    - Se debe verificar que no se permitan reservas con salida anterior o igual a la entrada.
3.  **processBookingBatch**:
    - Debe procesar múltiples reservas a la vez.
    - Si una reserva falla (ej. fecha inválida), debe registrarse en `failed` pero permitir que las demás del lote continúen.
    - Debe calcular métricas finales como el ingreso total y el promedio de noches reservadas.
4.  **generateRevenueReport**:
    - Debe agrupar los ingresos del año por mes.
    - El resultado debe ser una lista (array) ordenada descendientemente por ingresos.

## 🐛 Problema Reportado

La aplicación está perdiendo dinero y lanzando errores críticos en horas de alta demanda:

1.  **Precios Inconsistentes**: Los clientes que reservan en Octubre o Noviembre ven resultados `NaN` o errores imprevistos.
2.  **Cálculo Erróneo de Noches**: Las estancias se están cobrando por el doble de noches de lo real (un error en la constante de milisegundos).
3.  **Fuga de Ingresos**: El sistema no cambia el precio si la estancia cruza una temporada; cobra toda la estancia al precio del primer día.
4.  **Crashes en Reportes**: Al intentar ver el reporte mensual, el sistema se detiene porque intenta ordenar un objeto de datos como si fuera una lista.
5.  **Validación Temporal Fantasma**: Dependiendo de la hora en que se haga la reserva, el sistema a veces rechaza reservas del mismo día de hoy.

## 📂 Archivos

- `buggy-code.js` - Lógica de backend con múltiples bugs de cálculo y estructura.
- `test.js` - Pruebas exhaustivas para validar la integridad del sistema.
- `solution.js` - Referencia corregida con algoritmos de iteración diaria.

## ✅ Cómo Verificar la Solución

```bash
npm test exercises/08-hotel-booking-system
```

## ⚙️ Nivel de Dificultad

**Nivel**: Avanzado

**Tiempo Estimado**: 40-55 minutos
