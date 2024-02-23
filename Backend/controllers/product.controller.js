const { Transaction } = require("../models/mongo.model.js");

async function transactionsData(req,res){
    const pageNumber = parseInt(req.query.pageNumber);
    const pageSize = parseInt(req.query.pageSize);
    const searchText = req.query.searchText;
    const month = req.params.month.toLowerCase();

    try{
    // fetch all documents
    let products = await fetchAllDocuments();
    
    // filter transactions based on specified month
    products = filterDocuments(products,month);
   
    // filter transactions based on search text
    let filteredProducts = products;
    if (searchText) {
        const searchTextLower = searchText.toLowerCase();
        filteredProducts = products.filter(product =>
            product.title.toLowerCase().includes(searchTextLower) ||
            product.description.toLowerCase().includes(searchTextLower) ||
            product.price.toString().includes(searchTextLower)
    )}

    let paginatedProducts=filteredProducts;

    // Implement pagination
    if(pageNumber && pageSize){
        const startIndex = (pageNumber - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    }
    // send response
    res.status(200).json({ products : paginatedProducts });
    }
    catch(error){
        return res.status(500).json({ message:`Internal Server error: ${error.message}` });
    }
}

async function statisticalData(req,res){
    const month = req.params.month.toLowerCase();

    try{
    let products =await fetchAllDocuments();
    
    // filter transactions based on dateOfSale monthS
    products = filterDocuments(products,month);

    totalAvailableProducts = products.length;
    const soldProducts = products.filter(product => product.sold===true);
    const soldProductsCount = soldProducts.length;
    const UnsoldProductsCount = soldProductsCount>0? totalAvailableProducts -soldProductsCount : 0;
    let totalSalesAmount =0;
    if(soldProductsCount>0) soldProducts.forEach(product => totalSalesAmount+=product.price);

    // send response
    res.status(200).json(
        { 
         totalSalesAmount,
         soldProductsCount,
         UnsoldProductsCount
        });
    }
    catch(error){
        res.status(500).json({ message:`Internal Server error: ${error.message}` });
    }   
}

async function barChartData(req,res){
    const month = req.params.month.toLowerCase();
    const barchart={ 
        "0-100": 0, "101-200": 0, "201-300": 0, "301-400": 0, "401-500": 0, 
        "501-600": 0, "601-700": 0, "701-800": 0, "801-900": 0, "901-above": 0,
    };

    try{
    let products = await fetchAllDocuments();
    
    // filtering transactions based on dateOfSale month
    filteredProducts = filterDocuments(products,month);
    
    // Calculate the number of items in each price range
    const priceRanges = [
        { range: '0 - 100', count: countItemsInRange(filteredProducts, 0, 100) },
        { range: '101 - 200', count: countItemsInRange(filteredProducts, 101, 200) },
        { range: '201 - 300', count: countItemsInRange(filteredProducts, 201, 300) },
        { range: '301 - 400', count: countItemsInRange(filteredProducts, 301, 400) },
        { range: '401 - 500', count: countItemsInRange(filteredProducts, 401, 500) },
        { range: '501 - 600', count: countItemsInRange(filteredProducts, 501, 600) },
        { range: '601 - 700', count: countItemsInRange(filteredProducts, 601, 700) },
        { range: '701 - 800', count: countItemsInRange(filteredProducts, 701, 800) },
        { range: '801 - 900', count: countItemsInRange(filteredProducts, 801, 900) },
        { range: '901 - above', count: countItemsInRangeAbove(filteredProducts, 901) }
    ];

    // send response
    res.status(200).json(priceRanges);

    }
    catch(error){
        res.status(500).json({ message:`Internal Server error: ${error.message}` });
    }   
}

async function pieChartData(req,res){
    const month = req.params.month.toLowerCase();
    try{
    let products =await fetchAllDocuments();

    // filter products based on month
    const filteredProducts = filterDocuments(products,month);
    const categoryList={};
    filteredProducts.forEach(product => {
        if(categoryList.hasOwnProperty(product.category)) categoryList[product.category]+=1;
        else categoryList[product.category]=1;
    });
    res.status(200).json(categoryList);
    }
    catch(error){
        res.status(500).json({ message:`Internal Server error: ${error.message}` });
    }   
}

async function combinedData(req,res){
    const month = req.params.month.toLowerCase();
    try{
    endpoints=[
        `http://localhost:3000/api/products/statistics/`,
        `http://localhost:3000/api/products/bar-chart-data/`,
        `http://localhost:3000/api/products/pie-chart-data/`
    ]
    
    // we can do this using multiple approaches
    const responses = await Promise.all(endpoints.map(endpoint => fetch(endpoint+month)));
    const finalData = await Promise.all(responses.map(response=> response.json()));
    res.status(200).json(finalData);
    }
    catch(error){
        res.status(500).json({ message:`Internal Server error: ${error.message}` });
    }   
}

// Function to get the numeric value of the month
function getMonthNumber(month){
    const monthMap = {
        "january": 0, "february": 1, "march": 2, "april": 3, "may": 4, "june": 5,
        "july": 6, "august": 7, "september": 8, "october": 9, "november": 10, "december": 11
    };
    return monthMap[month];
}

// Function to get the number of items in the specified price range
function countItemsInRange(products, minPrice, maxPrice) {
    return products.filter(product => product.price >= minPrice && product.price <= maxPrice).length;
}

// Function to get the number of items with price above the specified value
function countItemsInRangeAbove(products, minPrice) {
    return products.filter(product => product.price >= minPrice).length;
}

async function fetchAllDocuments(){
    return Transaction.find({});
    
};

function filterDocuments(products,month){
    
    return products.filter(product => product.dateOfSale.getMonth()===getMonthNumber(month));
};
module.exports={
    transactionsData,
    statisticalData,
    barChartData,
    pieChartData,
    combinedData
}