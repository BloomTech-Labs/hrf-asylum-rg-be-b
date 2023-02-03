const db = require('../../../data/db-config');

/*
  Building yearData object
*/

/*
  1. Total cases by office and fiscal year
*/

const totalCasesByOfficeAndOutcomeAndFiscalYear = async (
  office,
  outcome,
  fiscalYear
) => {
  return await db('cases')
    .where({
      asylum_office: office,
      case_outcome: outcome,
      fiscal_year: fiscalYear,
    })
    .count('id');
};

/*
  2. Total cases by office and fiscal year
*/

const totalCasesByOfficeAndFiscalYear = async (office, fiscalYear) => {
  return await db('cases')
    .where({ asylum_office: office, fiscal_year: fiscalYear })
    .count('id');
};

/*
  3. Percent cases by office and outcome and fiscal year
*/

const percentCasesByOfficeAndOutcomeAndFiscalYear = async (
  office,
  outcome,
  fiscalYear
) => {
  const totalCases = await totalCasesByOfficeAndFiscalYear(office, fiscalYear);
  const totalCasesByOutcome = await totalCasesByOfficeAndOutcomeAndFiscalYear(
    office,
    outcome,
    fiscalYear
  );
  return totalCasesByOutcome[0].count / totalCases[0].count;
};

/*
    4. Distinct offices
*/

const distinctOffices = async () => {
  return await db('cases').distinct('asylum_office').select('asylum_office');
};

/*
    5. Year data object
*/

const yearDataObj = async (year, office) => {
  const totalCases = await totalCasesByOfficeAndFiscalYear(office, year);
  const percentGranted = await percentCasesByOfficeAndOutcomeAndFiscalYear(
    office,
    'Grant',
    year
  );
  const totalGranted = await totalCasesByOfficeAndOutcomeAndFiscalYear(
    office,
    'Grant',
    year
  );
  const totalDenied = await totalCasesByOfficeAndOutcomeAndFiscalYear(
    office,
    'Deny/Referral',
    year
  );
  const totalAdminClosed = await totalCasesByOfficeAndOutcomeAndFiscalYear(
    office,
    'Admin Close/Dismissal',
    year
  );
  const totalAsylumTerminated = await totalCasesByOfficeAndOutcomeAndFiscalYear(
    office,
    'Asylum Terminated',
    year
  );
  const totalClosedNacaraGrant =
    await totalCasesByOfficeAndOutcomeAndFiscalYear(
      office,
      'Admin Close - NACARA Grant',
      year
    );
  return {
    office: office,
    totalCases: parseInt(totalCases[0].count),
    granted: percentGranted,
    totalGranted: parseInt(totalGranted[0].count),
    denied: parseInt(totalDenied[0].count),
    adminClosed: parseInt(totalAdminClosed[0].count),
    asylumTerminated: parseInt(totalAsylumTerminated[0].count),
    closedNacaraGrant: parseInt(totalClosedNacaraGrant[0].count),
  };
};

/*
    6. Year data
*/

const yearData = async (year) => {
  const offices = await distinctOffices();
  const yearData = await Promise.all(
    offices.map((office) => yearDataObj(year, office.asylum_office))
  );
  return yearData;
};

/*
    Build yearResults object
*/

/*
    1. Total cases by fiscal year and outcome
*/

const totalCasesByFiscalYearAndOutcome = async (year, outcome) => {
  return await db('cases')
    .where({ fiscal_year: year, case_outcome: outcome })
    .count('id');
};

/*
    2. Total cases by fiscal year
*/

const totalCasesByFiscalYear = async (year) => {
  return await db('cases').where({ fiscal_year: year }).count('id');
};

/*
    3. Percent cases by fiscal year and outcome
*/

const percentCasesByFiscalYearAndOutcome = async (year, outcome) => {
  const totalCases = await totalCasesByFiscalYear(year);
  const totalCasesByOutcome = await totalCasesByFiscalYearAndOutcome(
    year,
    outcome
  );
  return totalCasesByOutcome[0].count / totalCases[0].count;
};

/*
    4. Distinct fiscal years
*/

const distinctFiscalYears = async () => {
  return await db('cases').distinct('fiscal_year').select('fiscal_year');
};

/*
    5. Fiscal year data object
*/

const fiscalYearDataObj = async (year) => {
  const totalCases = await totalCasesByFiscalYear(year);
  const percentGranted = await percentCasesByFiscalYearAndOutcome(
    year,
    'Grant'
  );
  const percentDenied = await totalCasesByFiscalYearAndOutcome(
    year,
    'Deny/Referral'
  );
  const percentAdminClosed = await totalCasesByFiscalYearAndOutcome(
    year,
    'Admin Close/Dismissal'
  );
  const percentAsylumTerminated = await totalCasesByFiscalYearAndOutcome(
    year,
    'Asylum Terminated'
  );
  const percentClosedNacaraGrant = await totalCasesByFiscalYearAndOutcome(
    year,
    'Admin Close - NACARA Grant'
  );
  const data = await yearData(year);
  return {
    fiscal_year: year.toString(),
    totalCases: parseInt(totalCases[0].count),
    granted: percentGranted,
    denied: parseInt(percentDenied[0].count),
    adminClosed: parseInt(percentAdminClosed[0].count),
    asylumTerminated: parseInt(percentAsylumTerminated[0].count),
    closedNacaraGrant: parseInt(percentClosedNacaraGrant[0].count),
    yearData: data,
  };
};

/*
    6. Fiscal year data
*/

const fiscalYearData = async () => {
  const years = await distinctFiscalYears();
  const fiscalYearData = await Promise.all(
    years.map((year) => fiscalYearDataObj(year.fiscal_year))
  );
  return fiscalYearData;
};

/*
    Building fiscal year summary
*/

/*
    1. Total cases by outcome
*/

const totalCasesByOutcome = async (outcome) => {
  return await db('cases').where({ case_outcome: outcome }).count('id');
};

/*
    2. Total cases
*/

const totalCases = async () => {
  return await db('cases').count('id');
};

/*
    3. Percent cases by outcome
*/

// eslint-disable-next-line no-unused-vars
const percentCasesByOutcome = async (outcome) => {
  const numCases = await totalCases();
  const numCasesByOutcome = await totalCasesByOutcome(outcome);
  return numCasesByOutcome[0].count / numCases[0].count;
};

/*
    4. Fiscal year summary
*/

const fiscalYearSummary = async () => {
  const numCases = await totalCases();
  const totalGranted = await totalCasesByOutcome('Grant');
  const percentGranted = await percentCasesByOutcome('Grant');
  const totalDenied = await totalCasesByOutcome('Deny/Referral');
  const totalAdminClosed = await totalCasesByOutcome('Admin Close/Dismissal');
  const totalAsylumTerminated = await totalCasesByOutcome('Asylum Terminated');
  const totalClosedNacaraGrant = await totalCasesByOutcome(
    'Admin Close - NACARA Grant'
  );
  const data = await fiscalYearData();
  return {
    totalCases: parseInt(numCases[0].count),
    granted: percentGranted,
    totalGranted: parseInt(totalGranted[0]['count']),
    denied: parseInt(totalDenied[0]['count']),
    adminClosed: parseInt(totalAdminClosed[0]['count']),
    asylumTerminated: parseInt(totalAsylumTerminated[0]['count']),
    closedNacaraGrant: parseInt(totalClosedNacaraGrant[0]['count']),
    yearResults: data,
  };
};

module.exports = {
  fiscalYearSummary,
  totalCases,
};
