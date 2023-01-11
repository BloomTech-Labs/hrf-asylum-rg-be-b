exports.up = (knex) => {
    return knex.schema
      .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
      .createTable('fiscalYearSummaries', function (table) {
        table.increments('id').primary();
        table.integer('fiscal_year').notNullable();
        table.float('granted');
        table.float('adminClosed');
        table.float('denied');
        table.float('closedNacaraGrant');
        table.float('asylumTerminated');
        table.integer('totalCases');
        table.timestamps(true, true);
      });
  };
  
  exports.down = (knex) => {
    return knex.schema.dropTableIfExists('fiscalYearSummaries');
  };
  