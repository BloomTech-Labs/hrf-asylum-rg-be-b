const db = require('../../../data/db-config');

/*
  Building year data object
*/

/*
  1. Total cases by office and fiscal year
*/

const totalCasesByOfficeAndOutcomeAndFiscalYear = async ( office, outcome, fiscalYear ) => {
    return await db('cases')
        .where({ asylum_office: office, case_outcome: outcome, fiscal_year: fiscalYear })
        .count('id');
};

/*
  2. Total cases by office and fiscal year
*/

const totalCasesByOfficeAndFiscalYear = async ( office, fiscalYear ) => {
    return await db('cases')
        .where({ asylum_office: office, fiscal_year: fiscalYear })
        .count('id');
};

/*
  3. Percent cases by office and outcome and fiscal year
*/

const percentCasesByOfficeAndOutcomeAndFiscalYear = async ( office, outcome, fiscalYear ) => {
    const totalCases = await totalCasesByOfficeAndFiscalYear(office, fiscalYear);
    const totalCasesByOutcome = await totalCasesByOfficeAndOutcomeAndFiscalYear(office, outcome, fiscalYear);
    return (totalCasesByOutcome[0].count / totalCases[0].count);
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
    const percentGranted = await percentCasesByOfficeAndOutcomeAndFiscalYear(office, 'Grant', year);
    const percentDenied = await percentCasesByOfficeAndOutcomeAndFiscalYear(office, 'Deny/Referral', year);
    const percentAdminClosed = await percentCasesByOfficeAndOutcomeAndFiscalYear(office, 'Admin Close/Dismissal', year);
    const percentAsylumTerminated = await percentCasesByOfficeAndOutcomeAndFiscalYear(office, 'Asylum Terminated', year);
    const percentClosedNacaraGrant = await percentCasesByOfficeAndOutcomeAndFiscalYear(office, 'Admin Close - NACARA Grant', year);
    return {
        office: office,
        totalCases: parseInt(totalCases[0].count),
        granted: percentGranted,
        denied: percentDenied,
        adminClosed: percentAdminClosed,
        asylumTerminated: percentAsylumTerminated,
        closedNacaraGrant: percentClosedNacaraGrant
    };
};

/*
    6. Year data
*/

const yearData = async (year) => {
    const offices = await distinctOffices();
    const yearData = await Promise.all(offices.map(office => yearDataObj(year, office.asylum_office)));
    return yearData;
};

/*
    Build year results object
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
    return await db('cases')
        .where({ fiscal_year: year })
        .count('id');
};

/*
    3. Percent cases by fiscal year and outcome
*/

const percentCasesByFiscalYearAndOutcome = async (year, outcome) => {
    const totalCases = await totalCasesByFiscalYear(year);
    const totalCasesByOutcome = await totalCasesByFiscalYearAndOutcome(year, outcome);
    return (totalCasesByOutcome[0].count / totalCases[0].count);
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
    const percentGranted = await percentCasesByFiscalYearAndOutcome(year, 'Grant');
    const percentDenied = await percentCasesByFiscalYearAndOutcome(year, 'Deny/Referral');
    const percentAdminClosed = await percentCasesByFiscalYearAndOutcome(year, 'Admin Close/Dismissal');
    const percentAsylumTerminated = await percentCasesByFiscalYearAndOutcome(year, 'Asylum Terminated');
    const percentClosedNacaraGrant = await percentCasesByFiscalYearAndOutcome(year, 'Admin Close - NACARA Grant');
    const data = await yearData(year);
    return {
        year: year,
        totalCases: parseInt(totalCases[0].count),
        granted: percentGranted,
        denied: percentDenied,
        adminClosed: percentAdminClosed,
        asylumTerminated: percentAsylumTerminated,
        closedNacaraGrant: percentClosedNacaraGrant,
        yearData: data
    };
};

/*
    6. Fiscal year data
*/

const fiscalYearData = async () => {
    const years = await distinctFiscalYears();
    const fiscalYearData = await Promise.all(years.map(year => fiscalYearDataObj(year.fiscal_year)));
    return fiscalYearData;
};

/*
    Building fiscal year summary
*/

/*
    1. Total cases by outcome
*/

const totalCasesByOutcome = async (outcome) => {
    return await db('cases')
        .where({ case_outcome: outcome })
        .count('id');
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

const percentCasesByOutcome = async (outcome) => {
    const numCases = await totalCases();
    const numCasesByOutcome = await totalCasesByOutcome(outcome);
    return (numCasesByOutcome[0].count / numCases[0].count);
};

/*
    4. Fiscal year summary
*/

const fiscalYearSummary = async () => {
    const numCases = await totalCases();
    const percentGranted = await percentCasesByOutcome('Grant');
    const percentDenied = await percentCasesByOutcome('Deny/Referral');
    const percentAdminClosed = await percentCasesByOutcome('Admin Close/Dismissal');
    const percentAsylumTerminated = await percentCasesByOutcome('Asylum Terminated');
    const percentClosedNacaraGrant = await percentCasesByOutcome('Admin Close - NACARA Grant');
    const data = await fiscalYearData();
    return {
        totalCases: parseInt(numCases[0].count),
        granted: percentGranted,
        denied: percentDenied,
        adminClosed: percentAdminClosed,
        asylumTerminated: percentAsylumTerminated,
        closedNacaraGrant: percentClosedNacaraGrant,
        yearResults: data
    };
};


module.exports = {
    fiscalYearSummary
};