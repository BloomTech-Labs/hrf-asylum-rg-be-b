function calculateFiscalYear(date, opt_monthStart /* default: 9 (October) */) {
  opt_monthStart = opt_monthStart == undefined ? 9 : opt_monthStart;
  var month = date.getMonth(),
    year = date.getFullYear(),
    yearOffset = Math.floor((month - (opt_monthStart % 12 || 12)) / 12) + 1;
  return yearOffset + year;
}

module.exports = {
  calculateFiscalYear: calculateFiscalYear,
};
