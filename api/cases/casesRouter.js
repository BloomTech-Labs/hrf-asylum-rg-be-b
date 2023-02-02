const express = require('express');
const router = express.Router();

// Models
const Cases = require('./models/baseModel');
const FiscalSummary = require('./models/fiscalYearModel');

// Helpers
const calculateFiscalYear = require('../../helpers/calculateFiscalYear');


/*
  Cases Routes
*/

/*
 GET /cases: Returns an array of all cases
*/  

router.get('/', function (req, res) {
  Cases.findAll()
    .then((cases) => {
      res.status(200).json(cases);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: err.message });
    });
});

/*
  GET /cases/:id: Returns a case with the specified id
*/

router.get('/:id', function (req, res) {
  const id = String(req.params.id);
  Cases.findById(id)
    .then((_case) => {
      if (_case) {
        res.status(200).json(_case);
      } else {
        res.status(404).json({ error: 'CaseNotFound' });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

/*
  POST /cases: Creates a new case
*/

router.post('/', async (req, res) => {
  const cases = req.body;
  if (cases) {
    try {
      cases.forEach(async (case_) => {
        const { id } = case_;
        const caseExists = await Cases.findById(id);
        if (!caseExists) {
          await Cases.create(case_).then((case_) =>
            res.status(200).json({ message: 'case created', case: case_[0] })
          );
        } else {
          res.status(400).json({ message: 'cases could not be processed' });
        }
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: e.message });
    }
  } else {
    res.status(404).json({ message: 'case missing' });
  }
});

/*
  PUT /cases/:id: Updates a case with the specified id
*/

router.put('/:id', function (req, res) {
  const id = String(req.params.id);
  const _case = req.body;
  if (_case) {
    Cases.update(id, _case)
      .then((updatedCase) => {
        res.status(200).json(updatedCase);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  } else {
    res.status(404).json({ error: 'CaseNotFound' });
  }
});

/*
  GET /cases/total: Returns the total number of cases
*/

router.get('/total', function (req, res) {
  FiscalSummary.totalCases()
    .then((total) => {
      res.status(200).json(total);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: err.message });
    });
});

/*
  GET /cases/fiscalSummary: Returns summary of cases by fiscal year
*/

router.get('/fiscalSummary', function (req, res) {
  CasesData.fiscalYearSummary()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: err.message });
    });
});

/*
  PUT /cases/calculateFiscalYears: Calculates fiscal year for each case and updates the database
*/

router.put('/calculateFiscalYears', function (req, res) {
  Cases.findAll()
    .then((cases) => {
      cases.forEach((_case) => {
        const date = new Date(_case.completion_date);
        const fiscalYear = calculateFiscalYear.calculateFiscalYear(date).toString();
        Cases.update(_case.id, { fiscal_year: fiscalYear })
          .then(() => {
            console.log(`Case ${_case.id} updated`);
          })
          .catch((err) => {
            console.log(err);
          });
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
