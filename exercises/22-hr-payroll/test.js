/**
 * Pruebas para: Sistema de Nómina de Recursos Humanos
 *
 * Por defecto prueban buggy-code.js para que veas los errores.
 * Cambia a solution.js cuando hayas corregido el código.
 *
 * Ejecutar con: npm test exercises/22-hr-payroll
 */

// IMPORTANTE: Cambiar esta línea para probar tu solución
const { Employee, Department, PayrollCalculator } = require('./buggy-code.js');
// const { } = require('./solution.js');

describe('Sistema de Nómina de Recursos Humanos', () => {
  let calc;

  beforeEach(() => {
    calc = new PayrollCalculator();
  });

  describe('calculateMonthlyGross - Salario bruto mensual', () => {
    test('debe dividir el salario anual entre 12 para obtener el salario mensual', () => {
      const emp = new Employee('E001', 'Ana', 60000, 'Colombia');
      // $60,000 / 12 meses = $5,000 por mes
      expect(calc.calculateMonthlyGross(emp)).toBeCloseTo(5000, 2);
    });

    test('debe calcular el salario mensual de $120,000 anuales correctamente', () => {
      const emp = new Employee('E002', 'Carlos', 120000, 'Mexico');
      // $120,000 / 12 = $10,000 por mes
      expect(calc.calculateMonthlyGross(emp)).toBeCloseTo(10000, 2);
    });

    test('debe calcular el salario mensual de $36,000 anuales correctamente', () => {
      const emp = new Employee('E003', 'María', 36000, 'Perú');
      // $36,000 / 12 = $3,000 por mes
      expect(calc.calculateMonthlyGross(emp)).toBeCloseTo(3000, 2);
    });

    test('debe calcular el salario mensual de $24,000 anuales correctamente', () => {
      const emp = new Employee('E004', 'Luis', 24000, 'Argentina');
      // $24,000 / 12 = $2,000 por mes
      expect(calc.calculateMonthlyGross(emp)).toBeCloseTo(2000, 2);
    });

    test('debe calcular el salario mensual de $180,000 anuales correctamente', () => {
      const emp = new Employee('E005', 'Sara', 180000, 'Chile');
      // $180,000 / 12 = $15,000 por mes
      expect(calc.calculateMonthlyGross(emp)).toBeCloseTo(15000, 2);
    });
  });

  describe('calculateTaxAmount - Monto de impuestos mensuales', () => {
    test('debe calcular el impuesto mensual con tasa del 20%', () => {
      const emp = new Employee('E006', 'Pedro', 60000, 'México');
      // Mensual: $5,000. Impuesto 20%: $1,000
      expect(calc.calculateTaxAmount(emp, 20)).toBeCloseTo(1000, 2);
    });

    test('debe calcular el impuesto mensual con tasa del 15%', () => {
      const emp = new Employee('E007', 'Rosa', 120000, 'España');
      // Mensual: $10,000. Impuesto 15%: $1,500
      expect(calc.calculateTaxAmount(emp, 15)).toBeCloseTo(1500, 2);
    });
  });

  describe('calculateNetSalary - Salario neto mensual', () => {
    test('debe restar el impuesto del salario bruto mensual', () => {
      const emp = new Employee('E008', 'Julia', 60000, 'Colombia');
      // Mensual bruto: $5,000. Impuesto 19%: $950. Neto: $4,050
      expect(calc.calculateNetSalary(emp, 19)).toBeCloseTo(4050, 2);
    });

    test('debe calcular el neto correctamente con salario de $120,000 y tasa del 25%', () => {
      const emp = new Employee('E009', 'Diego', 120000, 'USA');
      // Mensual: $10,000. Impuesto 25%: $2,500. Neto: $7,500
      expect(calc.calculateNetSalary(emp, 25)).toBeCloseTo(7500, 2);
    });

    test('debe retornar el bruto completo cuando la tasa de impuesto es 0%', () => {
      const emp = new Employee('E010', 'Sofía', 36000, 'Panamá');
      // Sin impuestos, neto = bruto mensual = $3,000
      expect(calc.calculateNetSalary(emp, 0)).toBeCloseTo(3000, 2);
    });
  });

  describe('Department - Gestión del departamento', () => {
    test('debe contar correctamente los empleados del departamento', () => {
      const dept = new Department('Ingeniería');
      dept.addEmployee(new Employee('E011', 'A', 60000, 'CO'));
      dept.addEmployee(new Employee('E012', 'B', 80000, 'CO'));
      expect(dept.getHeadcount()).toBe(2);
    });

    test('debe calcular la nómina anual total del departamento', () => {
      const dept = new Department('Marketing');
      dept.addEmployee(new Employee('E013', 'A', 60000, 'CO'));
      dept.addEmployee(new Employee('E014', 'B', 40000, 'CO'));
      expect(dept.getTotalAnnualPayroll(calc)).toBe(100000);
    });
  });
});
