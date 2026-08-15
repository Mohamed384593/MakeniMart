const Database = require("better-sqlite3");

// =====================================
// CREATE / OPEN DATABASE
// =====================================

const db = new Database("makeni_mart.db");


// =====================================
// ENABLE FOREIGN KEYS
// =====================================

db.pragma("foreign_keys = ON");


// =====================================
// PRODUCTS TABLE
// =====================================

db.exec(`
    CREATE TABLE IF NOT EXISTS products (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        name TEXT NOT NULL,

        category TEXT NOT NULL,

        price REAL NOT NULL,

        stock INTEGER NOT NULL DEFAULT 0,

        description TEXT DEFAULT '',

        image TEXT DEFAULT '',

        created_at DATETIME
            DEFAULT CURRENT_TIMESTAMP

    )
`);


// =====================================
// CUSTOMERS TABLE
// =====================================
//
// Customer accounts.
//
// Customers can:
// - Create an account
// - Login
// - Save their information
// - Place orders
//
// Passwords should be hashed by the
// customer registration/login API.
// =====================================

db.exec(`
    CREATE TABLE IF NOT EXISTS customers (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        full_name TEXT NOT NULL,

        username TEXT UNIQUE NOT NULL,

        phone TEXT UNIQUE NOT NULL,

        email TEXT UNIQUE,

        password TEXT NOT NULL,

        address TEXT DEFAULT '',

        created_at DATETIME
            DEFAULT CURRENT_TIMESTAMP

    )
`);


// =====================================
// ORDERS TABLE
// =====================================

db.exec(`
    CREATE TABLE IF NOT EXISTS orders (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        customer_id INTEGER,

        customer_name TEXT NOT NULL,

        phone TEXT NOT NULL,

        email TEXT DEFAULT '',

        address TEXT NOT NULL,

        delivery_location TEXT DEFAULT '',

        payment_method TEXT DEFAULT '',

        products_total REAL NOT NULL DEFAULT 0,

        delivery_fee REAL NOT NULL DEFAULT 0,

        total REAL NOT NULL DEFAULT 0,

        status TEXT NOT NULL DEFAULT 'Pending',

        created_at DATETIME
            DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (customer_id)
            REFERENCES customers(id)
            ON DELETE SET NULL

    )
`);


// =====================================
// ADD MISSING COLUMNS SAFELY
// =====================================

function addColumnIfMissing(
    table,
    column,
    definition
) {

    const columns = db
        .prepare(`PRAGMA table_info(${table})`)
        .all();

    const exists = columns.some(
        function(columnInfo) {

            return columnInfo.name === column;

        }
    );

    if (!exists) {

        db.exec(`
            ALTER TABLE ${table}
            ADD COLUMN ${column}
            ${definition}
        `);

        console.log(
            `Added column ${table}.${column}`
        );

    }

}


// =====================================
// MAKE SURE OLD ORDERS TABLE
// HAS ALL REQUIRED COLUMNS
// =====================================

// Customer ID
addColumnIfMissing(
    "orders",
    "customer_id",
    "INTEGER"
);


// Email
addColumnIfMissing(
    "orders",
    "email",
    "TEXT DEFAULT ''"
);


// Delivery location
addColumnIfMissing(
    "orders",
    "delivery_location",
    "TEXT DEFAULT ''"
);


// Payment method
addColumnIfMissing(
    "orders",
    "payment_method",
    "TEXT DEFAULT ''"
);


// Products total
addColumnIfMissing(
    "orders",
    "products_total",
    "REAL DEFAULT 0"
);


// Delivery fee
addColumnIfMissing(
    "orders",
    "delivery_fee",
    "REAL DEFAULT 0"
);


// =====================================
// ORDER ITEMS TABLE
// =====================================

db.exec(`
    CREATE TABLE IF NOT EXISTS order_items (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        order_id INTEGER NOT NULL,

        product_id INTEGER NOT NULL,

        quantity INTEGER NOT NULL,

        price REAL NOT NULL,

        FOREIGN KEY (order_id)
            REFERENCES orders(id)
            ON DELETE CASCADE,

        FOREIGN KEY (product_id)
            REFERENCES products(id)

    )
`);


// =====================================
// ORDER NOTIFICATIONS TABLE
// =====================================

db.exec(`
    CREATE TABLE IF NOT EXISTS order_notifications (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        order_id INTEGER NOT NULL,

        message TEXT NOT NULL,

        is_read INTEGER NOT NULL DEFAULT 0,

        created_at DATETIME
            DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (order_id)
            REFERENCES orders(id)
            ON DELETE CASCADE

    )
`);


// =====================================
// ADMIN TABLE
// =====================================

db.exec(`
    CREATE TABLE IF NOT EXISTS admins (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        username TEXT UNIQUE NOT NULL,

        password TEXT NOT NULL

    )
`);


// =====================================
// CREATE DEFAULT ADMIN
// =====================================
//
// Username: admin
// Password: MakeniMart123
//
// Only creates the account if it
// does not already exist.
// =====================================

const existingAdmin = db
    .prepare(`
        SELECT id
        FROM admins
        WHERE username = ?
    `)
    .get("admin");


if (!existingAdmin) {

    db.prepare(`
        INSERT INTO admins (
            username,
            password
        )
        VALUES (?, ?)
    `).run(
        "admin",
        "MakeniMart123"
    );

    console.log(
        "Default MakeniMart admin account created."
    );

}


// =====================================
// DATABASE INDEXES
// =====================================
//
// These make customer order searches
// faster.
// =====================================

db.exec(`
    CREATE INDEX IF NOT EXISTS
    idx_orders_customer_id
    ON orders(customer_id)
`);

db.exec(`
    CREATE INDEX IF NOT EXISTS
    idx_orders_phone
    ON orders(phone)
`);

db.exec(`
    CREATE INDEX IF NOT EXISTS
    idx_orders_email
    ON orders(email)
`);

db.exec(`
    CREATE INDEX IF NOT EXISTS
    idx_order_items_order_id
    ON order_items(order_id)
`);


// =====================================
// DATABASE READY
// =====================================

console.log(
    "MakeniMart database is ready."
);


// =====================================
// EXPORT DATABASE
// =====================================

module.exports = db;