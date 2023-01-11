const db = require('../../data/db-config');

const findAll = async () => {
    return await db('fiscalYearSummaries');
};
  
const findBy = (filter) => {
    return db('fiscalYearSummaries').where(filter);
};
  
const findById = async (id) => {
    return db('fiscalYearSummaries').where({ id }).first().select('*');
};
  
const create = async (summary) => {
    return db('fiscalYearSummaries').insert(summary).returning('*');
};

module.exports = {
    findAll,
    findBy,
    findById,
    create
};