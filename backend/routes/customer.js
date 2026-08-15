const express = require("express");
const bcrypt = require("bcryptjs");

const router = express.Router();
const db = require("../database");


// =====================================
// CUSTOMER REGISTRATION
// POST /api/customers/register
// =====================================

router.post("/register", async (req, res) => {

    try {

        const {
            fullName,
            username,
            phone,
            email,
            password,
            address
        } = req.body;


        // =====================================
        // VALIDATE REQUIRED FIELDS
        // =====================================

        if (
            !fullName ||
            !username ||
            !phone ||
            !password
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Full name, username, phone and password are required."

            });

        }


        // =====================================
        // VALIDATE PASSWORD
        // =====================================

        if (password.length < 6) {

            return res.status(400).json({

                success: false,

                message:
                    "Password must be at least 6 characters long."

            });

        }


        const cleanUsername = username.trim();
        const cleanPhone = phone.trim();
        const cleanEmail =
            email ? email.trim() : "";


        // =====================================
        // CHECK USERNAME
        // =====================================

        const existingUsername = db
            .prepare(`
                SELECT id
                FROM customers
                WHERE username = ?
            `)
            .get(cleanUsername);


        if (existingUsername) {

            return res.status(409).json({

                success: false,

                message:
                    "Username is already registered."

            });

        }


        // =====================================
        // CHECK PHONE
        // =====================================

        const existingPhone = db
            .prepare(`
                SELECT id
                FROM customers
                WHERE phone = ?
            `)
            .get(cleanPhone);


        if (existingPhone) {

            return res.status(409).json({

                success: false,

                message:
                    "Phone number is already registered."

            });

        }


        // =====================================
        // CHECK EMAIL
        // =====================================

        if (cleanEmail !== "") {

            const existingEmail = db
                .prepare(`
                    SELECT id
                    FROM customers
                    WHERE email = ?
                `)
                .get(cleanEmail);


            if (existingEmail) {

                return res.status(409).json({

                    success: false,

                    message:
                        "Email is already registered."

                });

            }

        }


        // =====================================
        // HASH PASSWORD
        // =====================================

        const hashedPassword =
            await bcrypt.hash(password, 10);


        // =====================================
        // CREATE CUSTOMER
        // =====================================

        const result = db
            .prepare(`
                INSERT INTO customers (
                    full_name,
                    username,
                    phone,
                    email,
                    password,
                    address
                )
                VALUES (?, ?, ?, ?, ?, ?)
            `)
            .run(

                fullName.trim(),

                cleanUsername,

                cleanPhone,

                cleanEmail,

                hashedPassword,

                address
                    ? address.trim()
                    : ""

            );


        // =====================================
        // SUCCESS
        // =====================================

        console.log(
            `New customer registered: ${cleanUsername}`
        );


        return res.status(201).json({

            success: true,

            message:
                "Customer account created successfully.",

            customer: {

                id:
                    Number(result.lastInsertRowid),

                fullName:
                    fullName.trim(),

                username:
                    cleanUsername,

                phone:
                    cleanPhone,

                email:
                    cleanEmail,

                address:
                    address
                        ? address.trim()
                        : ""

            }

        });


    } catch (error) {

        console.error(
            "CUSTOMER REGISTRATION ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Could not create customer account.",

            error:
                error.message

        });

    }

});


// =====================================
// CUSTOMER LOGIN
// POST /api/customers/login
// =====================================

router.post("/login", async (req, res) => {

    try {

        const {
            username,
            password
        } = req.body;


        // =====================================
        // VALIDATE INPUT
        // =====================================

        if (!username || !password) {

            return res.status(400).json({

                success: false,

                message:
                    "Username and password are required."

            });

        }


        const cleanUsername =
            username.trim();


        // =====================================
        // FIND CUSTOMER
        // =====================================

        const customer = db
            .prepare(`
                SELECT
                    id,
                    full_name,
                    username,
                    phone,
                    email,
                    password,
                    address
                FROM customers
                WHERE username = ?
            `)
            .get(cleanUsername);


        // =====================================
        // CUSTOMER NOT FOUND
        // =====================================

        if (!customer) {

            console.log(
                `Login failed - username not found: ${cleanUsername}`
            );

            return res.status(401).json({

                success: false,

                message:
                    "Invalid username or password."

            });

        }


        // =====================================
        // CHECK PASSWORD
        // =====================================

        const passwordMatch =
            await bcrypt.compare(
                password,
                customer.password
            );


        if (!passwordMatch) {

            console.log(
                `Login failed - wrong password: ${cleanUsername}`
            );

            return res.status(401).json({

                success: false,

                message:
                    "Invalid username or password."

            });

        }


        // =====================================
        // LOGIN SUCCESS
        // =====================================

        console.log(
            `Customer login successful: ${customer.username}`
        );


        return res.status(200).json({

            success: true,

            message:
                "Customer login successful.",

            customer: {

                id:
                    customer.id,

                fullName:
                    customer.full_name,

                username:
                    customer.username,

                phone:
                    customer.phone,

                email:
                    customer.email || "",

                address:
                    customer.address || ""

            }

        });


    } catch (error) {

        console.error(
            "CUSTOMER LOGIN ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Customer login failed.",

            error:
                error.message

        });

    }

});


module.exports = router;