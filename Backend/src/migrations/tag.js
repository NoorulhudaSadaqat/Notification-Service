/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("tag", function (table) {
    table.increments("id").primary();
    table.string("label").notNullable();
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
  return knex.schema.dropTableIfExists("tag");
};
