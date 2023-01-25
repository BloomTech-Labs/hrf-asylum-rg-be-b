const db = require('../../data/db-config');

/*
  Find operations for cases
*/

const findAll = async () => {
  return await db('cases');
};

const findBy = (filter) => {
  return db('cases').where(filter);
};

const findById = async (id) => {
  return db('cases').where({ id }).first().select('*');
};

/*
  CRUD operations for cases
*/

const create = async (_case) => {
  return db('cases').insert(_case).returning('*');
};

const batchCreate = async (_cases) => {
  return await db.batchInsert('cases', _cases, 1000).returning('*');
};

const update = (id, _case) => {
  console.log(_case);
  return db('cases').where({ id: id }).update(_case).returning('*');
};

const remove = async (id) => {
  return await db('cases').where({ id }).del();
};

/*
  Count operations for cases
*/

const totalCases = async () => {
  return await db('cases').count('id');
};

const totalCasesByCountry = async (country) => {
  return await db('cases').where({ citizenship: country }).count('id');
};

const totalCasesByCountryAndOutcome = async (country, outcome) => {
  return await db('cases')
    .where({ citizenship: country, case_outcome: outcome })
    .count('id');
};

const totalCasesByOffice = async (office) => {
  return await db('cases').where({ asylum_office: office }).count('id');
};

const totalCasesByFiscalYear = async (year) => {
  return await db('cases').where({ fiscal_year: year }).count('id');
};

const totalCasesByOutcome = async (outcome) => {
  return await db('cases').where({ case_outcome: outcome }).count('id');
};

const totalCasesByOutcomeAndFiscalYear = async (year, outcome) => {
  return await db('cases')
    .where({ fiscal_year: year, case_outcome: outcome })
    .count('id');
};

const totalCasesByOutcomeAndFiscalYearAndOffice = async (
  year,
  outcome,
  office
) => {
  return await db('cases')
    .where({ fiscal_year: year, case_outcome: outcome, asylum_office: office })
    .count('id');
};

/*
  Distinct operations for cases
*/

const distinctFiscalYears = async () => {
  return await db('cases').distinct('fiscal_year').select('fiscal_year');
};

const distinctOffices = async () => {
  return await db('cases').distinct('asylum_office').select('asylum_office');
};

const distinctCountries = async () => {
  return await db('cases').distinct('citizenship').select('citizenship');
};

/*
  Summary operations for cases
*/

const fiscalYearSummary = async (year) => {
  return await {
    totalCases: await totalCasesByFiscalYear(year).then((res) => +res[0].count),
    granted: await totalCasesByOutcomeAndFiscalYear(year, 'Grant').then(
      (res) => +res[0].count
    ),
    denied: await totalCasesByOutcomeAndFiscalYear(year, 'Deny/Referral').then(
      (res) => +res[0].count
    ),
    adminClosed: await totalCasesByOutcomeAndFiscalYear(
      year,
      'Admin Close/Dismissal'
    ).then((res) => +res[0].count),
    closedNacaraGrant: await totalCasesByOutcomeAndFiscalYear(
      year,
      'Admin Close - NACARA Grant'
    ).then((res) => +res[0].count),
    asylumTerminated: await totalCasesByOutcomeAndFiscalYear(
      year,
      'Asylum Terminated'
    ).then((res) => +res[0].count),
    yearData: await distinctOfficeSummaries(year).then((res) => res),
  };
};

const fiscalYearOfficeSummary = async (year, office) => {
  return await {
    totalCases: await totalCasesByOutcomeAndFiscalYearAndOffice(
      year,
      'Grant',
      office
    ).then((res) => +res[0].count),
    granted: await totalCasesByOutcomeAndFiscalYearAndOffice(
      year,
      'Grant',
      office
    ).then((res) => +res[0].count),
    denied: await totalCasesByOutcomeAndFiscalYearAndOffice(
      year,
      'Deny/Referral',
      office
    ).then((res) => +res[0].count),
    adminClosed: await totalCasesByOutcomeAndFiscalYearAndOffice(
      year,
      'Admin Close/Dismissal',
      office
    ).then((res) => +res[0].count),
    closedNacaraGrant: await totalCasesByOutcomeAndFiscalYearAndOffice(
      year,
      'Admin Close - NACARA Grant',
      office
    ).then((res) => +res[0].count),
    asylumTerminated: await totalCasesByOutcomeAndFiscalYearAndOffice(
      year,
      'Asylum Terminated',
      office
    ).then((res) => +res[0].count),
  };
};

const countrySummary = async (country) => {
  return await {
    totalCases: await totalCasesByCountry(country).then((res) => +res[0].count),
    granted: await totalCasesByCountryAndOutcome(country, 'Grant').then(
      (res) => +res[0].count
    ),
    denied: await totalCasesByCountryAndOutcome(country, 'Deny/Referral').then(
      (res) => +res[0].count
    ),
    adminClosed: await totalCasesByCountryAndOutcome(
      country,
      'Admin Close/Dismissal'
    ).then((res) => +res[0].count),
    closedNacaraGrant: await totalCasesByCountryAndOutcome(
      country,
      'Admin Close - NACARA Grant'
    ).then((res) => +res[0].count),
    asylumTerminated: await totalCasesByCountryAndOutcome(
      country,
      'Asylum Terminated'
    ).then((res) => +res[0].count),
  };
};

/*
  Distinct summary operations for cases
*/

const distinctFiscalYearSummaries = async () => {
  const years = await distinctFiscalYears();
  const summaries = [];
  for (let i = 0; i < years.length; i++) {
    const year = years[i].fiscal_year;
    const summary = await fiscalYearSummary(year);
    summaries.push({
      fiscal_year: year,
      totalCases: summary.totalCases,
      granted: summary.granted,
      denied: summary.denied,
      adminClosed: summary.adminClosed,
      closedNacaraGrant: summary.closedNacaraGrant,
      asylumTerminated: summary.asylumTerminated,
      yearData: summary.yearData,
    });
  }
  return summaries;
};

const distinctOfficeSummaries = async (year) => {
  const offices = await distinctOffices();
  const summaries = [];
  for (let i = 0; i < offices.length; i++) {
    const office = offices[i].asylum_office;
    const summary = await fiscalYearOfficeSummary(year, office);
    summaries.push({
      asylum_office: office,
      totalCases: summary.totalCases,
      granted: summary.granted,
      denied: summary.denied,
      adminClosed: summary.adminClosed,
      closedNacaraGrant: summary.closedNacaraGrant,
      asylumTerminated: summary.asylumTerminated,
    });
  }
  return summaries;
};

const distinctCountrySummaries = async () => {
  const countries = await distinctCountries();
  const summaries = [];
  for (let i = 0; i < countries.length; i++) {
    const country = countries[i].citizenship;
    const summary = await countrySummary(country);
    summaries.push({
      citizenship: country,
      totalCases: summary.totalCases,
      granted: summary.granted,
      denied: summary.denied,
      adminClosed: summary.adminClosed,
      closedNacaraGrant: summary.closedNacaraGrant,
      asylumTerminated: summary.asylumTerminated,
    });
  }
  return summaries;
};

/*
  Main summary operation for cases
*/

const summary = async () => {
  return await {
    totalCases: await totalCases().then((res) => +res[0].count),
    granted: await totalCasesByOutcome('Grant').then((res) => +res[0].count),
    denied: await totalCasesByOutcome('Deny/Referral').then(
      (res) => +res[0].count
    ),
    adminClosed: await totalCasesByOutcome('Admin Close/Dismissal').then(
      (res) => +res[0].count
    ),
    closedNacaraGrant: await totalCasesByOutcome(
      'Admin Close - NACARA Grant'
    ).then((res) => +res[0].count),
    asylumTerminated: await totalCasesByOutcome('Asylum Terminated').then(
      (res) => +res[0].count
    ),
    yearResults: await distinctFiscalYearSummaries().then((res) => res),
  };
};

module.exports = {
  findAll,
  findBy,
  findById,
  create,
  update,
  summary,
  distinctCountrySummaries,
  batchCreate,
  totalCases,
};
