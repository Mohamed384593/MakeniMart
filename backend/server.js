require("dotenv").config();

const express = require("express");
const cors = require("cors");

const db = require("./database");
const customerRoutes = require("./routes/customer");
const productRoutes = require("./routes/products");
const adminRoutes = require("./routes/admin");
const orderRoutes = require("./routes/orders");

const app = express();

// =====================================
// SERVER PORT
// =====================================

const PORT = process.env.PORT || 5000;


// =====================================
// MIDDLEWARE
// =====================================

app.use(cors());

app.use(express.json());


// =====================================
// HOME / API STATUS
// =====================================

app.get("/", (req, res) => {

    res.json({

        success: true,

        message: "MakeniMart API is running!",

        database: "connected",

        port: PORT

    });

});


// =====================================
// PRODUCTS API
// =====================================

app.use(
    "/api/products",
    productRoutes
);


// =====================================
// ADMIN API
// =====================================

app.use(
    "/api/admin",
    adminRoutes
);


// =====================================
// CUSTOMER API
// =====================================

app.use(
    "/api/customers",
    customerRoutes
);


// =====================================
// ORDERS API
// =====================================

app.use(
    "/api/orders",
    orderRoutes
);


// =====================================
// 404 API HANDLER
// =====================================

app.use((req, res) => {

    res.status(404).json({

        success: false,

        message:
            `API route not found: ${req.method} ${req.originalUrl}`

    });

});


// =====================================
// ERROR HANDLER
// =====================================

app.use((err, req, res, next) => {

    console.error(
        "SERVER ERROR:",
        err
    );

    res.status(500).json({

        success: false,

        message:
            "Internal server error.",

        error:
            err.message

    });

});


// =====================================
// START SERVER
// =====================================

app.listen(PORT, "0.0.0.0", () => {

    console.log(
        "====================================="
    );

    console.log(
        "MakeniMart database is ready."
    );

    console.log(
        `MakeniMart API running on port ${PORT}`
    );

    console.log(
        "====================================="

    );

});
