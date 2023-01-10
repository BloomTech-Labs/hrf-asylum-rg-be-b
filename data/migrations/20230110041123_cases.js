exports.up = (knex) => {
  return knex.schema
    .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    .createTable('cases', function (table) {
      table.string('id').notNullable().unique().primary();
      table.string('affirmative_case_id');
      table.string('asylum_office');
      table.string('citizenship');
      table.string('race_or_ethnicity');
      table.string('case_outcome');
      table.datetime('completion_date');
      table.datetime('data_current_as_of');
      table.timestamps(true, true);
    });
};

exports.down = (knex) => {
  return knex.schema.dropTableIfExists('cases');
};
