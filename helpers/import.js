// Function parses csv file using csv-parser and inserts data into database
// PATH: data/sees/assets/COW2021001887-I589Data.csv

const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const Cases = require('../api/cases/casesModel');

const _cases = [];

const csvFilePath = path.join(
  __dirname,
  '../data/seeds/assets/COW2021001887-I589Data.csv'
);

fs.createReadStream(csvFilePath) // Read csv file
  .pipe(csv()) // Parse csv file
  .on('data', (data) => _cases.push(data)) // Push data into array
  .on('end', () => {
    console.log('CSV file successfully processed');
    Cases.batchCreate(_cases).then(); // Insert data into database
  });
