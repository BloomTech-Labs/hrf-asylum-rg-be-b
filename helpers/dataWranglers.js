/*
    calculateFiscalYears: This function intakes an array of years, checks for cases where completion_date contains the given year, and updates those cases fiscal_year fields in batches. Returns a promise so we can chain a .then/.catch off of it in our endpoint.
*/

function calculateFiscalYears(years, findByYear, batchUpdateYears) {
  years.forEach((year) => {
    findByYear(year).then((cases) => {
      batchUpdateYears(cases, year);
    });
  });

  return Promise.resolve();
}

/*
    translateOfficeCodes: This function intakes the office codes for the offices we're renaming within our database, accesses the models that do the work, and processes the editing of those cases asylum_office fields. Returns a promise so we can chain a .then/.catch off of it in our endpoint.
*/

function translateOfficeCodes(
  offices,
  officeCodeTranslator,
  findByOffice,
  batchUpdateOffices
) {
  offices.forEach((office) => {
    let fullOfficeName = officeCodeTranslator({
      asylum_office: office,
    });
    findByOffice(office).then((cases) => {
      batchUpdateOffices(cases, fullOfficeName.asylum_office);
    });
  });

  return Promise.resolve();
}

module.exports = {
  calculateFiscalYears,
  translateOfficeCodes,
};
