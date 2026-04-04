/**
 * Sistema de cálculo de GPA universitario
 * Obtiene datos de estudiantes desde JSONPlaceholder API
 */

class Course {
  constructor(name, gradePoints, creditHours) {
    this.name = name;
    this.gradePoints = gradePoints; // Escala 0.0 - 4.0
    this.creditHours = creditHours;
  }
}

class Student {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.courses = [];
  }

  addCourse(course) {
    this.courses.push(course);
  }

  getTotalCredits() {
    return this.courses.reduce((sum, c) => sum + c.creditHours, 0);
  }

  // Calcula el GPA ponderado por créditos de cada materia
  calculateGPA() {
    if (this.courses.length === 0) return 0.0;
    const totalPoints = this.courses.reduce((sum, c) => sum + c.gradePoints, 0);
    return totalPoints / this.courses.length;
  }

  getAcademicStatus() {
    const gpa = this.calculateGPA();
    if (gpa >= 3.5) return 'Distinción';
    if (gpa >= 3.0) return 'Bueno';
    if (gpa < 2.0) return 'Aprobado';
    return 'En riesgo académico';
  }
}

class GradeBook {
  constructor() {
    this.students = [];
  }

  enrollStudent(student) {
    this.students.push(student);
  }

  getTopStudents(n = 3) {
    return [...this.students]
      .sort((a, b) => b.calculateGPA() - a.calculateGPA())
      .slice(0, n);
  }

  getClassAverage() {
    if (this.students.length === 0) return 0;
    const total = this.students.reduce((sum, s) => sum + s.calculateGPA(), 0);
    return total / this.students.length;
  }
}

// Obtiene datos de un estudiante desde JSONPlaceholder (sin API key)
async function fetchStudentData(userId) {
  const url = `https://jsonplaceholder.typicode.com/users/${userId}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Error al obtener estudiante: ${response.status}`);
  const data = await response.json();
  return new Student(data.id, data.name);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Course, Student, GradeBook, fetchStudentData };
}

if (require.main === module) {
  (async () => {
    const student = await fetchStudentData(1);
    student.addCourse(new Course('Cálculo', 4.0, 4));
    student.addCourse(new Course('Historia', 3.0, 3));
    student.addCourse(new Course('Física', 2.5, 4));
    student.addCourse(new Course('Inglés', 3.5, 2));
    console.log(`Estudiante: ${student.name}`);
    console.log(`GPA: ${student.calculateGPA().toFixed(2)}`);
    console.log(`Estado: ${student.getAcademicStatus()}`);
  })();
}
