# Integración Avanzada con API (JSONPlaceholder)

**Tipo**: Error Asíncrono / Error de Lógica / Error de Sintaxis

## 📋 Historia de Usuario

Como desarrollador senior, necesito crear un módulo de procesamiento de datos que no solo consulte una API externa, sino que también cruce información entre diferentes recursos (usuarios, publicaciones y comentarios) y realice cálculos estadísticos sobre el contenido (conteo de palabras, métricas de engagement) para un tablero de administración.

## 🎯 Criterios de Aceptación

- **getFullPostProfile**: Debe retornar un objeto que combine la información de una publicación, los datos de su autor (nombre, email y empresa) y la lista de comentarios asociados.
- **getTrendingPosts**: Debe filtrar las publicaciones basándose en un número mínimo de **palabras** en el cuerpo del texto. Debe retornar un máximo de 5 resultados transformados que incluyan el conteo de palabras y una etiqueta (la primera palabra del título).
- **findUserEngagement**: Debe analizar toda la actividad de un usuario. Esto implica buscar sus publicaciones y, para cada una, recopilar todos los comentarios recibidos para identificar quiénes han interactuado con él (identificados por su email único).
- **secureCreatePost**: Debe validar el esquema de datos antes de realizar el envío. El título no puede estar vacío (ni solo espacios) y el cuerpo debe tener una longitud mínima.

## 🛠️ Endpoints Utilizados

1. **GET `/posts`**: Obtiene el listado global de publicaciones.
2. **GET `/posts/:id`**: Obtiene el detalle de una publicación.
3. **GET `/users/:id`**: Obtiene la información del perfil de un usuario.
4. **GET `/posts/:id/comments`**: Obtiene los comentarios de una publicación específica.
5. **GET `/users/:id/posts`**: Obtiene todas las publicaciones pertenecientes a un usuario.
6. **POST `/posts`**: Simula la creación de una publicación.

## 🐛 Problema Reportado

El módulo está fallando en producción con errores de lógica y colapsos de red:

1. **Promesas Pendientes**: Algunas funciones retornan objetos vacíos porque no se espera a que la API responda.
2. **Lógica de Conteo Incorrecta**: El sistema de "Trending" cuenta caracteres en lugar de palabras, dando resultados absurdos.
3. **Relaciones Rotas**: Al buscar el autor de una publicación, el sistema parece confundir el ID del post con el ID del usuario.
4. **Fallas en Agregación**: Al intentar calcular el engagement de un usuario, el sistema no espera a que se carguen todos los comentarios de sus múltiples publicaciones.
5. **Validación Débil**: Se están permitiendo publicaciones con títulos que solo contienen espacios en blanco.

## 📂 Archivos

- `buggy-code.js` - Código con errores de asincronía, lógica de strings y manejo de arrays de promesas.
- `test.js` - Suite de pruebas avanzadas.
- `solution.js` - Referencia corregida con lógica optimizada.

## ✅ Cómo Verificar la Solución

```bash
npm test exercises/07-api-integration
```

## ⚙️ Nivel de Dificultad

**Nivel**: Avanzado

**Tiempo Estimado**: 30-45 minutos
