const db = require('../config/db.js');

const Transaction = {
    getAll: async (user_id) => {
        return await db('transactions')
            .join('categories', 'transactions.category_id', '=', 'categories.id')
            .where('transactions.user_id', user_id)
            .select(
                'transactions.id',
                'transactions.amount',
                'transactions.description',
                'transactions.transaction_date',
                'transactions.user_id',
                'transactions.type',
                'transactions.category_id',
                'categories.name as category_name'
            );
    },
    create: (transaction) => db('transactions').insert(transaction).returning(['id','amount','description','transaction_date','category_id','user_id','type']),
    delete: (id) => db('transactions').del().where({id}),
}



module.exports = {Transaction};