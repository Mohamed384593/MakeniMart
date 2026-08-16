const express = require("express");
const bcrypt = require("bcryptjs");

const router = express.Router();
const supabase = require("../supabase");

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

        if (!fullName || !username || !phone || !password) {
            return res.status(400).json({
                success: false,
                message: "Full name, username, phone and password are required."
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long."
            });
        }

        const cleanFullName = fullName.trim();
        const cleanUsername = username.trim();
        const cleanPhone = phone.trim();
        const cleanEmail = email ? email.trim() : "";
        const cleanAddress = address ? address.trim() : "";

        // =====================================
        // CHECK USERNAME
        // =====================================

        const { data: existingUsername, error: usernameError } =
            await supabase
                .from("customers")
                .select("id")
                .eq("username", cleanUsername)
                .maybeSingle();

        if (usernameError) {
            console.error("USERNAME CHECK ERROR:", usernameError);

            return res.status(500).json({
                success: false,
                message: "Could not check username."
            });
        }

        if (existingUsername) {
            return res.status(409).json({
                success: false,
                message: "Username is already registered."
            });
        }

        // =====================================
        // CHECK PHONE
        // =====================================

        const { data: existingPhone, error: phoneError } =
            await supabase
                .from("customers")
                .select("id")
                .eq("phone", cleanPhone)
                .maybeSingle();

        if (phoneError) {
            console.error("PHONE CHECK ERROR:", phoneError);

            return res.status(500).json({
                success: false,
                message: "Could not check phone number."
            });
        }

        if (existingPhone) {
            return res.status(409).json({
                success: false,
                message: "Phone number is already registered."
            });
        }

        // =====================================
        // CHECK EMAIL
        // =====================================

        if (cleanEmail !== "") {
            const { data: existingEmail, error: emailError } =
                await supabase
                    .from("customers")
                    .select("id")
                    .eq("email", cleanEmail)
                    .maybeSingle();

            if (emailError) {
                console.error("EMAIL CHECK ERROR:", emailError);

                return res.status(500).json({
                    success: false,
                    message: "Could not check email."
                });
            }

            if (existingEmail) {
                return res.status(409).json({
                    success: false,
                    message: "Email is already registered."
                });
            }
        }

        // =====================================
        // HASH PASSWORD
        // =====================================

        const hashedPassword = await bcrypt.hash(password, 10);

        // =====================================
        // CREATE CUSTOMER
        // =====================================

        const { data: customer, error: insertError } =
            await supabase
                .from("customers")
                .insert({
                    full_name: cleanFullName,
                    username: cleanUsername,
                    phone: cleanPhone,
                    email: cleanEmail,
                    password: hashedPassword,
                    address: cleanAddress
                })
                .select("id, full_name, username, phone, email, address, created_at")
                .single();

        if (insertError) {
            console.error("CUSTOMER INSERT ERROR:", insertError);

            return res.status(500).json({
                success: false,
                message: "Could not create customer account.",
                error: insertError.message
            });
        }

        console.log(`New customer registered: ${cleanUsername}`);

        return res.status(201).json({
            success: true,
            message: "Customer account created successfully.",
            customer: {
                id: customer.id,
                fullName: customer.full_name,
                username: customer.username,
                phone: customer.phone,
                email: customer.email || "",
                address: customer.address || ""
            }
        });

    } catch (error) {
        console.error("CUSTOMER REGISTRATION ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Could not create customer account.",
            error: error.message
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

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Username and password are required."
            });
        }

        const cleanUsername = username.trim();

        // =====================================
        // FIND CUSTOMER
        // =====================================

        const { data: customer, error: customerError } =
            await supabase
                .from("customers")
                .select("id, full_name, username, phone, email, password, address")
                .eq("username", cleanUsername)
                .maybeSingle();

        if (customerError) {
            console.error("CUSTOMER LOOKUP ERROR:", customerError);

            return res.status(500).json({
                success: false,
                message: "Could not find customer."
            });
        }

        if (!customer) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password."
            });
        }

        // =====================================
        // CHECK PASSWORD
        // =====================================

        const passwordMatch = await bcrypt.compare(
            password,
            customer.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password."
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
            message: "Customer login successful.",
            customer: {
                id: customer.id,
                fullName: customer.full_name,
                username: customer.username,
                phone: customer.phone,
                email: customer.email || "",
                address: customer.address || ""
            }
        });

    } catch (error) {
        console.error("CUSTOMER LOGIN ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Customer login failed.",
            error: error.message
        });
    }
});


// =====================================
// EXPORT ROUTER
// =====================================

module.exports = router;