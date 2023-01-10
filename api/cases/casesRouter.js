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

module.exports = router;
