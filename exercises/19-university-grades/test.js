/**
 * Pruebas para: Calculadora de GPA Universitario
 *
 * Por defecto prueban buggy-code.js para que veas los errores.
 * Cambia a solution.js cuando hayas corregido el código.
 *
 * Ejecutar con: npm test exercises/19-university-grades
 */

// IMPORTANTE: Cambiar esta línea para probar tu solución
const { Course, Student, GradeBook } = require('./buggy-code.js');
// const { } = require('./solution.js');

describe('Calculadora de GPA Universitario', () => {
  describe('calculateGPA - GPA ponderado por créditos', () => {
    test('debe ponderar una materia de muchos créditos con nota baja más que una de pocos créditos con nota alta', () => {
      const student = new Student(1, 'Ana');
      student.addCourse(new Course('Materia fácil', 4.0, 1));
      student.addCourse(new Course('Materia difícil', 2.0, 3));
      // Ponderado: (4.0*1 + 2.0*3) / (1+3) = (4+6)/4 = 10/4 = 2.5
      // Simple (buggy): (4.0+2.0)/2 = 3.0
      expect(student.calculateGPA()).toBeCloseTo(2.5, 5);
    });

    test('debe calcular GPA correcto con dos materias de igual créditos (ambas versiones coinciden)', () => {
      const student = new Student(2, 'Carlos');
      student.addCourse(new Course('Matemáticas', 3.0, 3));
      student.addCourse(new Course('Literatura', 1.0, 3));
      // Ponderado: (3.0*3 + 1.0*3) / 6 = 12/6 = 2.0
      // Simple: (3.0+1.0)/2 = 2.0 → coinciden solo porque los créditos son iguales
      expect(student.calculateGPA()).toBeCloseTo(2.0, 5);
    });

    test('debe dar mayor peso a la materia de 4 créditos con nota alta', () => {
      const student = new Student(3, 'María');
      student.addCourse(new Course('Ingeniería', 4.0, 4));
      student.addCourse(new Course('Arte', 1.0, 1));
      // Ponderado: (4.0*4 + 1.0*1) / (4+1) = (16+1)/5 = 17/5 = 3.4
      // Simple (buggy): (4.0+1.0)/2 = 2.5
      expect(student.calculateGPA()).toBeCloseTo(3.4, 5);
    });

    test('debe calcular GPA correcto con tres materias de distintos créditos', () => {
      const student = new Student(4, 'Luis');
      student.addCourse(new Course('Física', 3.5, 4));
      student.addCourse(new Course('Historia', 2.0, 2));
      student.addCourse(new Course('Idiomas', 4.0, 1));
      // Ponderado: (3.5*4 + 2.0*2 + 4.0*1) / (4+2+1) = (14+4+4)/7 = 22/7 ≈ 3.143
      // Simple (buggy): (3.5+2.0+4.0)/3 = 9.5/3 ≈ 3.167
      expect(student.calculateGPA()).toBeCloseTo(22 / 7, 5);
    });

    test('debe retornar 0.0 cuando el estudiante no tiene materias', () => {
      const student = new Student(5, 'Vacío');
      expect(student.calculateGPA()).toBe(0.0);
    });

    test('debe retornar el mismo GPA cuando hay una sola materia', () => {
      const student = new Student(6, 'Solo');
      student.addCourse(new Course('Única', 3.7, 5));
      // Con una sola materia, ponderado = simple = 3.7
      expect(student.calculateGPA()).toBeCloseTo(3.7, 5);
    });

    test('debe calcular GPA de 4.0 cuando todas las materias tienen 4.0', () => {
      const student = new Student(7, 'Perfecto');
      student.addCourse(new Course('A', 4.0, 3));
      student.addCourse(new Course('B', 4.0, 4));
      student.addCourse(new Course('C', 4.0, 2));
      expect(student.calculateGPA()).toBeCloseTo(4.0, 5);
    });
  });

  describe('getAcademicStatus - Estado académico basado en GPA', () => {
    test('debe retornar Distinción para GPA >= 3.5', () => {
      const student = new Student(8, 'Estrella');
      student.addCourse(new Course('Todo', 4.0, 3));
      expect(student.getAcademicStatus()).toBe('Distinción');
    });

    test('debe retornar En riesgo académico para GPA < 2.0', () => {
      const student = new Student(9, 'Riesgo');
      student.addCourse(new Course('Difícil', 1.0, 4));
      student.addCourse(new Course('Fácil', 3.0, 1));
      // Ponderado: (1.0*4 + 3.0*1) / 5 = 7/5 = 1.4
      expect(student.getAcademicStatus()).toBe('En riesgo académico');
    });
  });

  describe('GradeBook - Libro de calificaciones', () => {
    test('debe retornar los estudiantes con mayor GPA ponderado al ordenarlos', () => {
      const gradeBook = new GradeBook();

      const s1 = new Student(1, 'Alto');
      s1.addCourse(new Course('Materia', 4.0, 4));
      s1.addCourse(new Course('Otra', 1.0, 1));
      // GPA ponderado: (16+1)/5 = 3.4

      const s2 = new Student(2, 'Bajo');
      s2.addCourse(new Course('Materia', 2.0, 4));
      s2.addCourse(new Course('Otra', 4.0, 1));
      // GPA ponderado: (8+4)/5 = 2.4

      gradeBook.enrollStudent(s1);
      gradeBook.enrollStudent(s2);

      const top = gradeBook.getTopStudents(1);
      expect(top[0].name).toBe('Alto');
    });
  });

  describe('getTotalCredits - Total de créditos cursados', () => {
    test('debe sumar correctamente los créditos de todas las materias', () => {
      const student = new Student(10, 'Créditos');
      student.addCourse(new Course('A', 3.0, 4));
      student.addCourse(new Course('B', 2.5, 3));
      student.addCourse(new Course('C', 4.0, 2));
      expect(student.getTotalCredits()).toBe(9);
    });
  });
});
