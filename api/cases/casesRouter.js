const express = require('express');
const Cases = require('./casesModel');
const calculateFiscalYear = require('../../helpers/calculateFiscalYear');
const router = express.Router();

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

router.put('/calculateFiscalYears', function (req, res) {
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

router.get('/summary', function (req, res) {
  Cases.summary()
     .then((cases) => {
      res.status(200).json(cases);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: err.message });
    });
});

router.get('/countrySummary', function (req, res) {
  Cases.distinctCountrySummaries()
     .then((cases) => {
      res.status(200).json(cases);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: err.message });
    });
});

router.get('/total', function (req, res) {
  Cases.totalCases()
     .then((total) => {
      res.status(200).json(total);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: err.message });
    });
});

router.post('/', async (req, res) => {
  const cases = req.body;
  if (cases) {
    try {
      cases.forEach(async (case_) => {
        const { id } = case_;
        const caseExists = await Cases.findById(id);
        if (!caseExists) {
          await Cases.create(case_).then((case_) =>
            res
              .status(200)
              .json({ message: 'case created', case: case_[0] })
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

router.get('/asylum_office/:key', function (req, res) {
  const key = String(req.params.key).toUpperCase();
  Cases.findBy({ asylum_office: key })
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

router.get('/citizenship/:country', function (req, res) {
  const country = String(req.params.country).toUpperCase();
  Cases.findBy({ citizenship: country })
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

router.get('/race_or_ethnicity/:category', function (req, res) {
  const category = String(req.params.category).toUpperCase();
  Cases.findBy({ race_or_ethnicity: category })
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

router.get('/case_outcome/:outcome', function (req, res) {
  const outcome = String(req.params.outcome);
  Cases.findBy({ case_outcome: outcome })
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

module.exports = router;
