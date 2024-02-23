const { Router } = require("express");
const router = Router();
require("dotenv").config();

// controllers
const fetchDataFromThirdPartyAPI = require("../controllers/initializeDatabase.controller.js");
const { transactionsData, statisticalData, barChartData, pieChartData, combinedData } = require("../controllers/product.controller.js");

router.get('/initialize',fetchDataFromThirdPartyAPI);

router.get('/transactions/:month',transactionsData);

router.get('/statistics/:month',statisticalData);

router.get('/bar-chart-data/:month',barChartData);

router.get('/pie-chart-data/:month',pieChartData);

router.get('/combined-data/:month',combinedData);

module.exports =router;
