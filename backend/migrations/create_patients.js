exports.up = function (knex) {
  return knex.schema.createTable('patients', (table) => {
    table.increments('id').primary();
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.date('date_of_birth');
    table.string('phone');
    table.text('symptoms');
    table.string('queue_number').notNullable().unique();
    // Link to the rooms table
    table.integer('room_id').references('id').inTable('rooms').onDelete('SET NULL');
    // Vital Signs from Raspberry Pi
    table.decimal('temp', 4, 1).nullable(); // e.g. 36.5
    table.integer('spo2').nullable();       // e.g. 98
    table.integer('hr').nullable();         // e.g. 75
    table.integer('eta_minutes').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('patients');
};