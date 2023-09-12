/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("notificationType", function (table) {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("description").notNullable();
    table.string("templateBody", 500).notNullable();
    table.specificType("tags", "TEXT[]");
    table.string("templateSubject").notNullable();
    table.integer("eventId").unsigned().references("id").inTable("event");
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
  return knex.schema.dropTableIfExists("notificationType");
};
