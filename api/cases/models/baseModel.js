const db = require('../../../data/db-config');
const calculateFiscalYear = require('../../../helpers/calculateFiscalYear');

/*
  Find operations for cases
*/

const findAll = async () => {
  return await db('cases');
};

const findBy = (filter) => {
  return db('cases').where(filter);
};

const findById = async (id) => {
  return db('cases').where({ id }).first().select('*');
};

/*
  CRUD operations for cases
*/

const create = async (_case) => {
  return db('cases').insert(_case).returning('*');
};

const batchCreate = async (_cases) => {
  return await db.batchInsert('cases', _cases, 1000).returning('*');
};

const update = (id, _case) => {
  console.log(_case);
  return db('cases').where({ id: id }).update(_case).returning('*');
};

const batchUpdate = (cases) => {
  return db.transaction((trx) => {
    const queries = [];
    cases.forEach((_case) => {
      const date = new Date(_case.completion_date);
      const fiscalYear = calculateFiscalYear.calculateFiscalYear(date);
      const query = db('cases')
        .where({ id: _case.id })
        .update({ fiscal_year: fiscalYear }) //update fiscal_year here
        .transacting(trx);
      queries.push(query);
    });

    Promise.all(queries).then(trx.commit).catch(trx.rollback);
  });
};

const remove = async (id) => {
  return await db('cases').where({ id }).del();
};

module.exports = {
  findAll,
  findBy,
  findById,
  create,
  batchCreate,
  update,
  batchUpdate,
  remove,
};
