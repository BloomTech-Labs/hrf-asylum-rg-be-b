const express = require('express');
const Cases = require('../cases/casesModel');
const FiscalYearSummaries = require('./fiscalYearSummariesModel');
const calculateFiscalYear = require('../../helpers/calculateFiscalYear');
const router = express.Router();

router.put('/updateCases', function (req, res) {
    Cases.findAll()
      .then((cases) => {
        cases.forEach(_case => {
            const date = new Date(_case.completion_date);
            const fiscalYear = calculateFiscalYear.calculateFiscalYear(date);
            Cases.update(_case.id, { fiscal_year: fiscalYear })
                .then((updatedCase) => { console.log(`Case ${updatedCase.id} updated`)})
                .catch((err) => { console.log(err) });
        });
      })
      .then(() => {
        res.status(200).json({ message: 'Cases updated' });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ message: err.message });
      });
  });

  module.exports = router;