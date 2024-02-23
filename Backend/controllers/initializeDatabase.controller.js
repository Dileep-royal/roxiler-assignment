const { Transaction } = require("../models/mongo.model.js");

async function fetchDataFromThirdPartyAPI(req,res){
    try{
    const response = await fetch("https://s3.amazonaws.com/roxiler.com/product_transaction.json")
    const jsonData = await response.json();
    await Transaction.insertMany(jsonData);
    res.status(200).json({ message : "Database Intialization is Successful " })
}
catch(error){
    return res.status(500).json({ message:`Internal Server error ${error.message}` });
}
}

module.exports = fetchDataFromThirdPartyAPI ;