exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {
          id: 1,
          name:'An',
          email: 'nigel@email.com',
          password: 'dorwssap'
        },
        {
          id: 2,
          name:'Anh',
          email: 'nakaz@email.com',
          password: 'password1'
        },
        {
          id: 3,
          name:'Ann',
          email: 'jaywon@email.com',
          password: 'password123'
        }
      ]);
    });
};
