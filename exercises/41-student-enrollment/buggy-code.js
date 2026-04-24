/**
 * Student Enrollment System
 *
 * Sistema de inscripción universitaria con validación de prerequisitos,
 * control de créditos por semestre y reportes de disponibilidad.
 */

const MAX_CREDITS_PER_SEMESTER = 18;

class Course {
  constructor(id, name, credits, prerequisites) {
    this.id = id;
    this.name = name;
    this.credits = credits;
    this.prerequisites = prerequisites; // array de IDs de cursos
  }
}

class Student {
  constructor(id, name, completedCourses) {
    this.id = id;
    this.name = name;
    this.completedCourses = completedCourses; // IDs de cursos aprobados
    this.enrolledCourses = []; // IDs inscritos en semestre actual
  }

  // Todos los cursos aprobados + inscritos actualmente
  getAllCourseIds() {
    return [...this.completedCourses, ...this.enrolledCourses];
  }
}

class EnrollmentSystem {
  constructor() {
    this.courses = [];
    this.enrollments = []; // { student, courseId }
  }

  addCourse(course) {
    this.courses.push(course);
    return this;
  }

  getCourse(courseId) {
    return this.courses.find(c => c.id === courseId);
  }

  // Verifica que el estudiante tenga los prerequisitos necesarios
  hasPrerequisites(student, course) {
    // Usa some en lugar de every: aprueba si tiene al menos UN prerequisito
    return course.prerequisites.every(prereqId =>
      student.completedCourses.includes(prereqId)
    );
  }

  enroll(student, courseId) {
    const course = this.getCourse(courseId);
    if (!course) {
      throw new Error(`Curso ${courseId} no existe`);
    }

    // Verificar duplicado
    if (student.enrolledCourses.includes(courseId)) {
      throw new Error(`El estudiante ya está inscrito en ${courseId}`);
    }

    // Verificar prerequisitos
    if (!this.hasPrerequisites(student, course)) {
      const missing = course.prerequisites.filter(
        p => !student.completedCourses.includes(p)
      );
      throw new Error(
        `Prerequisitos faltantes para ${courseId}: ${missing.join(', ')}`
      );
    }

    // Verificar límite de créditos
    const currentCredits = this.getTotalCredits(student);
    if (currentCredits + course.credits > MAX_CREDITS_PER_SEMESTER) {
      throw new Error(
        `Excede el límite de ${MAX_CREDITS_PER_SEMESTER} créditos por semestre`
      );
    }

    student.enrolledCourses.push(courseId);
    this.enrollments.push({ student, courseId });
    return this;
  }

  // Suma de créditos de los cursos actualmente inscritos
  getTotalCredits(student) {
    return student.enrolledCourses.reduce((total, courseId) => {
      const course = this.getCourse(courseId);
      return total + (course ? course.credits : 0);
    }, 0);
  }

  // Cursos que el estudiante puede inscribir
  getAvailableCourses(student) {
    const currentCredits = this.getTotalCredits(student);
    return this.courses.filter(course => {
      const alreadyEnrolled = student.enrolledCourses.includes(course.id);
      const alreadyCompleted = student.completedCourses.includes(course.id);
      const hasPrereqs = this.hasPrerequisites(student, course);
      const fitsCredits = currentCredits + course.credits <= MAX_CREDITS_PER_SEMESTER;
      return !alreadyEnrolled && !alreadyCompleted && hasPrereqs && fitsCredits;
    });
  }

  // Estudiantes inscritos en un curso específico
  getEnrolledStudents(courseId) {
    return this.enrollments
      .filter(e => e.courseId === courseId)
      .map(e => e.student);
  }

  // Reporte de inscripciones completo
  getEnrollmentReport() {
    return this.courses.map(course => {
      const enrolledStudents = this.getEnrolledStudents(course.id);
      return {
        courseId: course.id,
        courseName: course.name,
        credits: course.credits,
        enrolledCount: enrolledStudents.length,
        students: enrolledStudents.map(s => ({ id: s.id, name: s.name })),
      };
    });
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Course, Student, EnrollmentSystem };
}

if (require.main === module) {
  const system = new EnrollmentSystem();
  system.addCourse(new Course('CS101', 'Intro to CS', 3, []));
  system.addCourse(new Course('CS201', 'Data Structures', 3, ['CS101']));
  system.addCourse(new Course('CS301', 'Algorithms', 4, ['CS201']));

  const student = new Student('S001', 'Ana López', ['CS101']);
  system.enroll(student, 'CS201');
  console.log('Inscritos:', student.enrolledCourses);
}
