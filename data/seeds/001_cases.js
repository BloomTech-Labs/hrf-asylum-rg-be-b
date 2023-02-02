const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const db = require('../../data/db-config');

const _cases = [];

const csvFilePath = path.join(__dirname, 'assets/COW2021001887-I589Data.csv');

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (data) => _cases.push(data))
  .on('end', () => {
    console.log('CSV file successfully processed');
  });

exports.seed = function () {
  return db('cases')
    .truncate()
    .then(function () {
      return db.batchInsert('cases', _cases, 1000).returning('*');
    });
};
