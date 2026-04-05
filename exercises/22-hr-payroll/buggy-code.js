/**
 * Sistema de nómina de recursos humanos
 * Obtiene información de países desde REST Countries API (sin API key)
 */

class Employee {
  constructor(id, name, annualSalary, country) {
    this.id = id;
    this.name = name;
    this.annualSalary = annualSalary;
    this.country = country;
  }
}

class Department {
  constructor(name) {
    this.name = name;
    this.employees = [];
  }

  addEmployee(employee) {
    this.employees.push(employee);
  }

  getHeadcount() {
    return this.employees.length;
  }

  getTotalAnnualPayroll(payrollCalculator) {
    return this.employees.reduce(
      (sum, emp) => sum + emp.annualSalary,
      0,
    );
  }
}

class PayrollCalculator {
  // Calcula el salario bruto mensual de un empleado a partir de su salario anual
  calculateMonthlyGross(employee) {
    return employee.annualSalary / 12;
  }

  calculateTaxAmount(employee, taxRate) {
    const monthly = this.calculateMonthlyGross(employee);
    return monthly * (taxRate / 100);
  }

  calculateNetSalary(employee, taxRate) {
    const monthly = this.calculateMonthlyGross(employee);
    const tax = this.calculateTaxAmount(employee, taxRate);
    return monthly - tax;
  }

  getPayrollSummary(employee, taxRate) {
    const monthly = this.calculateMonthlyGross(employee);
    const tax = this.calculateTaxAmount(employee, taxRate);
    return {
      employeeId: employee.id,
      name: employee.name,
      annualSalary: employee.annualSalary,
      monthlyGross: Math.round(monthly * 100) / 100,
      taxRate: `${taxRate}%`,
      taxAmount: Math.round(tax * 100) / 100,
      netSalary: Math.round((monthly - tax) * 100) / 100,
    };
  }
}

// Obtiene información de un país desde REST Countries (sin API key)
async function fetchCountryInfo(countryName) {
  const query = encodeURIComponent(countryName);
  const url = `https://restcountries.com/v3.1/name/${query}?fields=name,currencies,region`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Error al obtener país: ${response.status}`);
  const data = await response.json();
  const country = data[0];
  const currencyCode = Object.keys(country.currencies)[0];
  return {
    name: country.name.common,
    region: country.region,
    currency: currencyCode,
    currencySymbol: country.currencies[currencyCode].symbol,
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Employee, Department, PayrollCalculator, fetchCountryInfo };
}

if (require.main === module) {
  (async () => {
    const calc = new PayrollCalculator();
    const countryInfo = await fetchCountryInfo('Colombia');
    const emp = new Employee('E001', 'Laura Gómez', 60000, 'Colombia');
    console.log(`País: ${countryInfo.name} (${countryInfo.currency})`);
    console.log('Nómina:', calc.getPayrollSummary(emp, 19));
  })();
}
