const {Transaction} = require('../models/transactionModel.js');
const {Category} = require('../models/categoryModel.js');
const {formatDate} = require('../utils/transactionUtils.js')

const getTransactionsByUserId = async (req,res) => {
    const {user_id} = req.params;
    const {sort_by, sort_order} = req.query;
    const error = req.session.error;
    req.session.error = null; // Clear the error after reading it

    try{
        const unformattedTransactions = await Transaction.getAll(user_id,sort_by, sort_order);

        const transactions = unformattedTransactions.map(transaction => {
            return {...transaction, transaction_date: formatDate(transaction.transaction_date)}
        });
        const categories = await Category.getAll(user_id);
        res.render('viewTransactions',{
            title: 'View Transactions',
            user_id,
            transactions,
            categories,
            error,
        });
    } catch(err){
        console.log(err);
        res.status(500).json({error: 'Error fetching transactions'}) 
    }
};

const createTransaction = async (req,res) => {
    const {amount, description, transaction_date, category_id,type, user_id} = req.body;
    const transaction = {
        amount, 
        description, 
        transaction_date, 
        category_id, 
        type,
        user_id,
    };
    
    try{
        const unupdatedTransaction = await Transaction.create(transaction);
        const categoryResult = await Category.getCategoryNameById(unupdatedTransaction[0].category_id);
        const categoryName = categoryResult.name
        const newTransaction = [{
            ...unupdatedTransaction[0], 
            category_name: categoryName, 
            transaction_date: formatDate(unupdatedTransaction[0].transaction_date)
        }];
        
        res.status(200).json({success: true, transaction: newTransaction});

    } catch(err){
        console.log('Error adding transaction:', err);
        res.status(500).json({success: false, error: 'Error adding transaction'}) 
    }
};

const deleteTransaction = async(req,res) => {
    const {id} = req.params;

    try{
        await Transaction.delete(id);
        res.status(200).json({success: true, id});
    }catch (error) {
        res.status(500).json({ error: 'Error deleting transaction' });
    }
};


module.exports = {
    getTransactionsByUserId,
    createTransaction,
    deleteTransaction,
}