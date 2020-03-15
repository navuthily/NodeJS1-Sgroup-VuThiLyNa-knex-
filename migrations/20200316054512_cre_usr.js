

exports.up = function(knex) {
  return knex.schema.createTable('users', function(t) {
      t.increments('id').unsigned().primary();
      t.string('name').notNull();
      t.string('email').notNull();
      t.string('password').notNull();
  });
};
exports.down = function(knex) {
  return knex.schema.dropTable('users');
};