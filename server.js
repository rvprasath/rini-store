const express = require("express");
const path = require("path");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require('multer');
const fs = require('fs');
const config = require('./config');

// Initialize express app
const app = express();
const port = process.env.PORT || 5000;

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON body
app.use(express.json());

// Set up MySQL connection
const db = mysql.createConnection({
    host: config.HOST, // MySQL server hostname
    user: config.USER, // MySQL username
    password: config.PASSWORD, // MySQL password
    database: config.DATABASE, // MySQL database name
    port: config.PORT
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error("MySQL connection error: ", err);
    } else {
        console.log("Connected to MySQL database!");
    }
});


// Ensure the external upload folder exists (create it if not)
if (!fs.existsSync(config.UPLOAD_DIR)) {
    fs.mkdirSync(config.UPLOAD_DIR, { recursive: true });
}

// Set up multer for image file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, config.UPLOAD_DIR); // Store images in UPLOAD_DIR
    },
    filename: function (req, file, cb) {
        const fileName = Date.now() + path.extname(file.originalname); // Unique filename
        cb(null, fileName);
    }
});

const upload = multer({ storage: storage });

// Middleware to parse JSON and URL encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.post("/upload", upload.array("files", 10), (req, res) => {
    let filePath;
    const { productName, description, price, strikePrice, category } = req.body;

    if (req.files.length > 0) {
        let fileNameArr = [];
        for (let i = 0; i < req.files.length; i++) {
            fileNameArr.push(req.files[i].filename);
        }
        filePath = '/s3/' + fileNameArr.join(",")
    } else {
        filePath = `/s3/${req.files[0].filename}`;
    }
    const escapedProductName = mysql.escape(productName);
    const escapedDescription = mysql.escape(description);
    const escapedFilePath = mysql.escape(filePath);
    let product;
    const query = `INSERT INTO products (product_name, description, category_id, price, strike_price, image_path) 
               VALUES (${escapedProductName}, ${escapedDescription}, ${category}, ${price}, ${strikePrice}, ${escapedFilePath})`;
    console.log(query)
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error creating product" });
        }
        res.json({ message: 'Product created successfully' });
    });
});

// API to get all products (example)
app.get('/products', (req, res) => {
    const query = `SELECT p.*,c.category_name from products as p inner join categories as c on p.category_id = c.id`;
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error fetching products" });
        }
        res.json(results);
    });
});

app.get('/product/:id', (req, res) => {
    let id = parseInt(req.params.id);
    const query = `SELECT * from products WHERE id=${id}`;
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error creating product" });
        }
        res.json(results[0]);
    });
});

app.get('/category/product/:categoryId', (req, res) => {
    let categoryId = parseInt(req.params.categoryId);
    const query = `SELECT p.*,c.category_name from products as p inner join categories as c on p.category_id = c.id WHERE p.category_id=${categoryId}`;
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error creating product" });
        }
        res.json(results);
    });
});

app.delete('/product/:id', (req, res) => {
    let id = parseInt(req.params.id);
    const query = `DELETE from products where id=${id}`;
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error deleting product" });
        }
        res.json(results);
    });
});

app.post("/addToCart", (req, res) => {
    const { userId, productId } = req.body;

    const querySelect = `SELECT count(*) as count from cart where user_id=${userId} and product_id=${productId}`;
    db.query(querySelect, (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error checking cart" });
        }
        if (results[0].count > 0) {
            return res.status(400).json({ error: "The product is already in the cart" });
        }
        const query = `INSERT INTO cart(user_id, product_id) values(${userId}, ${productId})`;
        db.query(query, (err, results) => {
            if (err) {
                return res.status(500).json({ error: "Error adding to the cart" });
            }
            res.json(results[0]);
        });
    });
});

app.get('/getCartCount', (req, res) => {
    let userId = parseInt(req.query.userId);
    const query = `SELECT count(*) as count from cart where user_id=${userId}`;
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error fetching cart products" });
        }
        res.json(results[0]);
    });
});

app.get('/getCartItems', (req, res) => {
    let userId = parseInt(req.query.userId);
    const query = `SELECT p.*,c.id as cart_id from cart as c inner join products as p on c.product_id = p.id where c.user_id=${userId}`;
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error fetching cart products" });
        }
        res.json(results);
    });
});

app.delete('/removeCart', (req, res) => {
    let cartId = parseInt(req.query.cartId);
    const query = `DELETE from cart where id=${cartId}`;
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error deleting cart" });
        }
        res.json(results);
    });
});


app.use('/s3', express.static(config.UPLOAD_DIR));

// Sample API route to fetch data from MySQL
app.post("/authenticateUser", (req, res) => {
    const { username, password } = req.body;
    const query = "SELECT * FROM user where user_name='" + username + "' and password='" + password + "'";
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Database query error" });
        }
        res.json(results[0]);
    });
});

// Serve React build in production
if (process.env.NODE_ENV === "production") {
    // Set static folder
    app.use(express.static(path.join(__dirname, "front-end", "build")));

    // Serve index.html for all non-API routes
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "front-end", "build", "index.html"));
    });
}

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
