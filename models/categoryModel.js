const db = require('../config/db.js');

const Category = {
    getAll: (userId) => db('categories').where({ user_id: userId }).select('id', 'name', 'user_id'),
    getById: (id) => db('categories').where({ id }).select('id', 'name', 'user_id').first(),
    create: (category) => db('categories').insert(category).returning('id', 'name', 'user_id'),
    delete: (id) => db('categories').del().where({ id }),
};

module.exports = { Category };