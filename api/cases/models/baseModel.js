const db = require('../../../data/db-config');
// const calculateFiscalYear = require('../../../helpers/calculateFiscalYear');

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

const findByYear = (year) => {
  return db
    .from('cases')
    .whereRaw(
      `completion_date::date BETWEEN '${year}-01-01' AND '${year}-12-31'`
    )
    .select('id', 'completion_date', 'fiscal_year');
};

const findByOffice = (office) => {
  return db('cases').where({ asylum_office: office }).select('*');
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
  return db('cases').where({ id: id }).update(_case).returning('*');
};

const batchUpdateYears = (cases, year) => {
  return db.transaction((trx) => {
    const queries = [];
    cases.forEach((_case) => {
      const query = db('cases')
        .where({ id: _case.id })
        .update({ fiscal_year: year }) //update fiscal_year here
        .transacting(trx);
      queries.push(query);
    });

    Promise.all(queries).then(trx.commit).catch(trx.rollback);
  });
};

const batchUpdateOffices = (cases, office) => {
  return db.transaction((trx) => {
    const queries = [];
    cases.forEach((_case) => {
      const query = db('cases')
        .where({ id: _case.id })
        .update({ asylum_office: office }) //update fiscal_year here
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
  findByYear,
  findByOffice,
  create,
  batchCreate,
  update,
  batchUpdateYears,
  batchUpdateOffices,
  remove,
};
