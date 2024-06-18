const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

mongoose.connect("mongodb://localhost:27017/Sample", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log(err);
    });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

const productSchema = mongoose.Schema({
    name: String,
    description: String,
    price: Number,
});

const Product = mongoose.model("Product", productSchema);

// Create Product
app.post("/api/ul/product/new", async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Read Product

app.get("/api/ul/products", async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({
            success: true,
            products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Update Product
 
app.put("/api/ul/product/:id", async (req, res) => {
    try {
        let product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, useFindAndModify: true, runValidators: true }
        );
        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

//Delete Product 
app.delete("/api/ul/product/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        await product.remove();

        res.status(200).json({
            success: true,
            message: "Product is deleted"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});



app.listen(4500, () => {
    console.log("Server is working http://localhost:4500");
});
