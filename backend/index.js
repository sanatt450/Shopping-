// in this file we will write our all backend codes:
const port = 4000;
const express = require("express");

const app = express();

//initialize the mongoose package:- below
const mongoose = require("mongoose");

//initialize the json web token package:- below
const jwt = require("jsonwebtoken");

//initialize the multer package:- below
const multer = require("multer");
//img storage system:

//include path from the express server:-
const path = require("path");
//initialize the cors package:- below
const cors = require("cors");

app.use(express.json());
//with the help of this express.json whatever request we will get from response.json that will be automatically passed through json::--
app.use(cors()); //using this our react app will connect to express.js on "PORT: 4000"
//initialize the mongoDB Database:- below

//Database connection with MongoDB
mongoose.connect(
  "mongodb+srv://vishalShop:shop120@cluster0.xysehtr.mongodb.net/e-commerce"
);
//after this mongoDB is connected to our express server:-

//now we will have to create one API end point:-
app.get("/", (req, res) => {
  res.send("Express app is Running faster");
});

//Image Storage Engine:-
//Add disk storage that we will get through multer:-
const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

// as our image will be uploaded in the above end point using post method, at the same time our middleware, that is our multer diskStorage will rename that image with the new name and that image will be stored in images folder:-
//creating upload end point for images:-
app.use("/images", express.static("upload/images"));
app.post("/upload", upload.single("product"), (req, res) => {
  res.json({
    success: 1,
    image_url: `https://mern-ecom-n5bq.onrender.com/images/${req.file.filename}`,
  });
});
//After that in the above req we will get the name of our uploaded file:-
// using this name we will generate one response using that response user can access the images:-

//NOW Our Upload end point is successfully running:-

//NOW We will create one another end point : using that we will add products to our mongoDB : data base:-

//LISTEN CAREFULLY:-- Whenever we need to upload any object in mongoDB database first we need to create a schema:-

//using Mongoose Library to create a Schema for creating products::--

const Product = mongoose.model("Product", {
  // in this object we will define our product model:-
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  new_price: {
    type: Number,
    required: true,
  },
  old_price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  available: {
    type: Boolean,
    default: true,
  },
});

// we will use this product to add the product in mongoDB Database:- for that we will create an endpoint with the name of "addProduct":-

app.post("/addproduct", async (req, res) => {
  // writing a logic with which: we don't need to give id: anymore; this id will be automatically generated in the database:-

  let products = await Product.find({});
  // we will leave object empty using that we will get all the products in  one array which we can access using : products:-
  let id;
  if (products.length > 0) {
    let last_product_array = products.slice(-1);
    let last_product = last_product_array[0];
    id = last_product.id + 1;
  } else {
    id = 1;
  }
  //to create the product we will use the schema that we have created above:-
  const product = new Product({
    id: id,
    name: req.body.name,
    //image is the key:
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
  });
  console.log(product);
  //after this we will have to save this product in database so we will use "product.save": and since it will take sometime we will use await:-
  await product.save();
  console.log("product saved");
  //   now we will generate the response for the frontend:- using res.json method:
  res.json({
    success: true,
    name: req.body.name,
  });
  //now the response will be generated in json format:-
});

//Creating API for removing Products:-

app.post("/removeproduct", async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  console.log("removed from database");
  res.json({
    success: true,
    name: req.body.name,
  });
});
//Creating new end point using which we will bw able to get all the products available:
// Creating API to get all products:-
app.get("/allproducts", async (req, res) => {
  let products = await Product.find({});
  //now in the above "products" variable we will get all the products:--
  //console.log("All Products Fetched and stored in products variable:");
  //now response for the front end:-
  res.send(products);
});

//schema creation for user model:-
const Users = mongoose.model("Users", {
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  cartData: {
    type: Object,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

//Creating End point for user Registration:-

app.post("/signup", async (req, res) => {
  let check = await Users.findOne({ email: req.body.email });
  if (check) {
    return res
      .status(400)
      .json({ success: false, errors: "User Exist with same Email" });
  }
  let cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i] = 0;
  }
  const user = new Users({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
    cartData: cart,
  });
  await user.save();

  const data = {
    user: {
      id: user.id,
    },
  };

  const token = jwt.sign(data, "secret_ecom");
  res.json({ success: true, token });
});

// Creating endpoint for user login
app.post("/login", async (req, res) => {
  let user = await Users.findOne({ email: req.body.email });
  if (user) {
    //pass got from api is being compared with the pass got from user:-//
    const passCompare = req.body.password === user.password;

    if (passCompare) {
      const data = {
        user: {
          id: user.id,
        },
      };
      const token = jwt.sign(data, "secret_ecom");
      res.json({ success: true, token });
    } else {
      res.json({ success: false, errors: "Wrong Password" });
    }
  } else {
    res.json({ success: false, errors: "Wrong Email ID" });
  }
});

//creating end point for new collection data:-
app.get("/newcollections", async (req, res) => {
  let products = await Product.find({});
  let newcollection = products.slice(1).slice(-8);
  console.log("NewCollection fetched");
  res.send(newcollection);
});

// Creating end points for popular in women category:-
app.get("/popularinwomen", async (req, res) => {
  let products = await Product.find({ category: "women" });
  let popular_in_women = products.slice(0, 4);
  console.log("popular in women is fetched: ");
  res.send(popular_in_women);
});

//creating middleware to fetch user:-
const fetchUser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ errors: "Please authenticate using valid token" });
  } else {
    try {
      const data = jwt.verify(token, "secret_ecom");
      req.user = data.user;
      next();
    } catch (error) {
      res.status(401).send({ errors: "Please authenticate using valid token" });
    }
  }
};

//creating end point for adding products in cart data:-
app.post("/addtocart", fetchUser, async (req, res) => {
  console.log("Added product to your cart", req.body.itemId);
  let userData = await Users.findOne({ _id: req.user.id });
  userData.cartData[req.body.itemId] += 1;
  await Users.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );
  res.send("Added to your cart");
});
//creating end point to remove products from cart data:-
app.post("/removefromcart", fetchUser, async (req, res) => {
  console.log("Removed product from your cart", req.body.itemId);
  let userData = await Users.findOne({ _id: req.user.id });
  if (userData.cartData[req.body.itemId] > 0)
    userData.cartData[req.body.itemId] -= 1;
  await Users.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );
  res.send("Removed from your cart");
});

//get cart items:
app.post("/getcart", fetchUser, async (req, res) => {
  console.log("Get Cart");
  let userData = await Users.findOne({ _id: req.user.id });
  res.json(userData.cartData);
});
// //our express app will get started on this port :-
app.listen(port, (error) => {
  if (!error) {
    console.log("server running on port: " + port);
  } else {
    console.log("Error : " + error);
  }
});
