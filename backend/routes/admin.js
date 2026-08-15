const express = require("express");

const router = express.Router();


// =====================================
// TEMPORARY ADMIN LOGIN
// =====================================

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "MakeniMart123";


// =====================================
// ADMIN LOGIN
// POST /api/admin/login
// =====================================

router.post("/login", (req, res) => {

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


        // =====================================
        // CHECK ADMIN LOGIN
        // =====================================

        if (
            username === ADMIN_USERNAME &&
            password === ADMIN_PASSWORD
        ) {

            console.log(
                `Admin login successful: ${username}`
            );


            return res.json({

                success: true,

                message:
                    "Admin login successful."

            });

        }


        // =====================================
        // INVALID LOGIN
        // =====================================

        console.log(
            `Failed admin login attempt: ${username}`
        );


        return res.status(401).json({

            success: false,

            message:
                "Invalid username or password."

        });

    } catch (error) {

        console.error(
            "ADMIN LOGIN ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Admin login failed.",

            error:
                error.message

        });

    }

});


module.exports = router;