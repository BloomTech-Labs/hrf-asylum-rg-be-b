const db = require('../../data/db-config');

const findAll = async () => {
    return await db('cases');
  };
  
  const findBy = (filter) => {
    return db('cases').where(filter);
  };
  
  const findById = async (id) => {
    return db('cases').where({ id }).first().select('*');
  };
  
  const create = async (_case) => {
    return db('cases').insert(_case).returning('*');
  };
  
  const update = (id, _case) => {
    console.log(_case);
    return db('cases')
      .where({ id: id })
      .first()
      .update(_case)
      .returning('*');
  };
  
  const remove = async (id) => {
    return await db('cases').where({ id }).del();
  };

  module.exports = {
    findAll,
    findBy,
    findById,
    create,
    update,
    remove
  };