/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("application", function (table) {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("code").notNullable();
    table.string("description", 500).notNullable();
    table.boolean("isActive").defaultTo(true);
    table.string("createdBy").notNullable();
    table.date("createdDate").notNullable();
    table.string("modifiedBy");
    table.date("modifiedDate");
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("application");
};
