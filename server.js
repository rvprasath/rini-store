const express = require("express");
const path = require("path");
const mysql = require("mysql2");
const cors = require("cors");

// Initialize express app
const app = express();
const port = process.env.PORT || 5000;

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON body
app.use(express.json());

// Set up MySQL connection
const db = mysql.createConnection({
    host: "localhost", // MySQL server hostname
    user: "root", // MySQL username
    password: "admin@123", // MySQL password
    database: "rini_store", // MySQL database name
    port: 3306 
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error("MySQL connection error: ", err);
    } else {
        console.log("Connected to MySQL database!");
    }
});

// Sample API route to fetch data from MySQL
app.post("/api/user", (req, res) => {
    const {username, password} = req.body;
    console.log(username)
    const query = "SELECT * FROM user where user_name='"+username+"' and password='"+password+"'";
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
