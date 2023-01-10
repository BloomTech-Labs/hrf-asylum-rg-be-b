const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

const _cases = [];

const csvFilePath = path.join(__dirname, 'assets/COW2021001887-I589Data.csv');

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (data) => _cases.push(data))
  .on('end', () => {
    console.log('CSV file successfully processed');
  });

exports.seed = function (knex) {
  return knex('cases')
    .truncate()
    .then(function () {
      return knex('cases').insert(_cases);
    });
};