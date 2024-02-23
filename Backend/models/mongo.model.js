const db = require("mongoose");

// connecting to mongoDB NOSQL Database
db.connect(process.env.MONGO_CONNECTION_STRING);

const TransactionSchema = new db.Schema({
    id : Number,
    title : String,
    price : Number,
    description : String,
    category : String,
    image : String,
    sold : Boolean,
    dateOfSale : Date
});

const Transaction = db.model('Transaction',TransactionSchema);

module.exports ={
    Transaction
}