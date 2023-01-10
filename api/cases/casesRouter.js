const express = require('express');
const Cases = require('./casesModel');
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
