const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const db = require('../../data/db-config');

const _cases = [];

const csvFilePath = path.join(
  __dirname,
  'assets/COW2021001887-I589Data (1).csv'
);

// fs.createReadStream(csvFilePath)
//   .pipe(csv())
//   .on('data', (data) => _cases.push(data))
//   .on('end', () => {
//     console.log('CSV file successfully processed');
//     console.log(_cases.length);
//   });

exports.seed = function () {
  return db('cases')
    .truncate()
    .then(async function () {
      fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (data) => _cases.push(data))
        .on('end', () => {
          console.log('CSV file successfully processed');
          console.log(_cases.length);
        });
      return await db.batchInsert('cases', _cases, 5000).returning('*');
    });
};
