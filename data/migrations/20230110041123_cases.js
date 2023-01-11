exports.up = (knex) => {
  return knex.schema
    .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    .createTable('cases', function (table) {
      table.increments('id').primary();
      table.string('affirmative_case_id');
      table.string('asylum_office');
      table.string('citizenship');
      table.string('race_or_ethnicity');
      table.string('case_outcome');
      table.date('completion_date');
      table.string('data_current_as_of');
      table.integer('fiscal_year');
      table.timestamps(true, true);
    });
};

exports.down = (knex) => {
  return knex.schema.dropTableIfExists('cases');
};
