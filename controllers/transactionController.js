const {Transaction} = require('../models/transactionModel.js');
const {Category} = require('../models/categoryModel.js');

const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${day}-${month}-${year}`;

}

const getTransactionsByUserId = async (req,res) => {
    const {user_id} = req.params;
    const error = req.session.error;
    req.session.error = null; // Clear the error after reading it

    try{
        const unformattedTransactions = await Transaction.getAll(user_id);

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
    const {amount, description, transaction_date, category_id,user_id,type} = req.body;
    const transaction = {user_id, amount, description, transaction_date, category_id, type};

    let error = null;

    if (!category_id || isNaN(category_id)) {
        error = 'Invalid category ID' ;
    }

    else if (isNaN(Number(amount))){
        error = 'Amount must be a number';
    }

    if(error){
        req.session.error = error;
        return res.redirect(`/transactions/user/${user_id}`);
    }
    
    try{
        await Transaction.create(transaction);
        res.redirect(`/transactions/user/${user_id}`);

    } catch(err){
        console.log(err);
        res.status(500).json({error: 'Error creating transaction'}) 
    }
};

const deleteTransaction = async(req,res) => {
    const {id} = req.params;
    const {user_id} = req.body;

    try{
        await Transaction.delete(id);
        res.redirect(`/transactions/user/${user_id}`);
    }catch (error) {
        res.status(500).json({ error: 'Error deleting transaction' });
    }
};


module.exports = {
    getTransactionsByUserId,
    createTransaction,
    deleteTransaction,
}