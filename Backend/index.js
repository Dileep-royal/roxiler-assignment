const express = require("express");
const productRoute = require("./routes/product.route.js");
require("dotenv").config();

// creates express application
const app = express();

// middlewares
app.use(express.json());

// routes
app.use('/api/products',productRoute);

app.get('/',(req,res)=>{
  res.status(200).json( { message:" Succesfully hits the main route" })
})

app.all("*",(req,res)=>{
  res.status(404).json(" 404 Not Found !");
})

app.listen(process.env.PORT || 3000,(req,res)=>{
    console.log(`App is listening on port ${ process.env.PORT || 3000 } ~ http://localhost:${ process.env.PORT || 3000 }`);
})