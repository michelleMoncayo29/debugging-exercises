/**
 * Grade Book
 *
 * Sistema de calificaciones con categorías ponderadas, letra de calificación,
 * ranking del grupo y detección de estudiantes en riesgo.
 */

class Student {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.grades = {};
  }

  addGrade(category, score) {
    this.grades[category] = score;
    return this;
  }
}

class GradeBook {
  constructor(categories) {
    this.categories = categories;
  }

  // Calcula la nota ponderada del estudiante
  getWeightedAverage(student) {
    return this.categories.reduce((sum, cat) => {
      const grade = student.grades[cat.name] || 0;
      return sum + grade * cat.weight;
    }, 0);
  }

  getLetterGrade(student) {
    const avg = this.getWeightedAverage(student);
    if (avg >= 90) return 'A';
    if (avg >= 80) return 'B';
    if (avg >= 70) return 'C';
    if (avg >= 60) return 'D';
    return 'F';
  }

  getRanking(students) {
    return [...students]
      .map(s => ({ ...s, weightedAvg: this.getWeightedAverage(s) }))
      .sort((a, b) => b.weightedAvg - a.weightedAvg);
  }

  getClassAverage(students) {
    if (students.length === 0) return 0;
    const total = students.reduce((sum, s) => sum + this.getWeightedAverage(s), 0);
    return Math.round((total / students.length) * 100) / 100;
  }

  getAtRiskStudents(students) {
    return students.filter(s => this.getWeightedAverage(s) < 60);
  }

  getCategoryStats(students, categoryName) {
    const scores = students
      .map(s => s.grades[categoryName])
      .filter(g => g !== undefined);

    if (scores.length === 0) return null;
    const sorted = [...scores].sort((a, b) => a - b);
    const avg = scores.reduce((s, v) => s + v, 0) / scores.length;

    return {
      category: categoryName,
      average: Math.round(avg * 100) / 100,
      highest: sorted[sorted.length - 1],
      lowest: sorted[0],
      median: sorted.length % 2 === 0
        ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
        : sorted[Math.floor(sorted.length / 2)],
    };
  }

  generateReport(students) {
    const ranking = this.getRanking(students);
    return {
      totalStudents: students.length,
      classAverage: this.getClassAverage(students),
      gradeDistribution: ['A', 'B', 'C', 'D', 'F'].reduce((dist, letter) => {
        dist[letter] = students.filter(s => this.getLetterGrade(s) === letter).length;
        return dist;
      }, {}),
      topStudent: ranking[0] || null,
      atRisk: this.getAtRiskStudents(students).map(s => s.name),
      categoryStats: this.categories.map(cat =>
        this.getCategoryStats(students, cat.name)
      ),
    };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GradeBook, Student };
}

if (require.main === module) {
  const gb = new GradeBook([
    { name: 'Exámenes', weight: 0.50 },
    { name: 'Tareas', weight: 0.30 },
    { name: 'Participación', weight: 0.20 },
  ]);
  const student = new Student('S1', 'Ana');
  student.addGrade('Exámenes', 90).addGrade('Tareas', 80).addGrade('Participación', 70);
  console.log('Nota ponderada (incorrecta):', gb.getWeightedAverage(student));
}
