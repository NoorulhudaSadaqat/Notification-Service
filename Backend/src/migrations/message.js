/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("message", function (table) {
    table.increments("id").primary();
    table.string("text", 500).notNullable();
    table
      .integer("applicationId")
      .unsigned()
      .references("id")
      .inTable("application");
    table.integer("eventId").unsigned().references("id").inTable("event");
    table
      .integer("notificationTypeId")
      .unsigned()
      .references("id")
      .inTable("notificationType");
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
  return knex.schema.dropTableIfExists("message");
};
