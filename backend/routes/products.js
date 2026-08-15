const express = require("express");

const db = require("../database");

const router = express.Router();


// =====================================
// GET ALL PRODUCTS
// =====================================

router.get("/", (req, res) => {

    try {

        const products = db
            .prepare(`
                SELECT *
                FROM products
                ORDER BY id DESC
            `)
            .all();


        res.json({

            success: true,

            count: products.length,

            products: products

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Failed to load products."

        });

    }

});


// =====================================
// GET ONE PRODUCT
// =====================================

router.get("/:id", (req, res) => {

    try {

        const id =
            Number(req.params.id);


        const product =
            db
                .prepare(`
                    SELECT *
                    FROM products
                    WHERE id = ?
                `)
                .get(id);


        if (!product) {

            return res.status(404).json({

                success: false,

                message: "Product not found."

            });

        }


        res.json({

            success: true,

            product: product

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Failed to load product."

        });

    }

});


// =====================================
// ADD PRODUCT
// =====================================

router.post("/", (req, res) => {

    try {

        const {

            name,
            category,
            price,
            stock,
            description,
            image

        } = req.body;


        if (
            !name ||
            price === undefined ||
            stock === undefined
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Name, price and stock are required."

            });

        }


        const statement =
            db.prepare(`
                INSERT INTO products
                (
                    name,
                    category,
                    price,
                    stock,
                    description,
                    image
                )

                VALUES
                (?, ?, ?, ?, ?, ?)
            `);


        const result =
            statement.run(

                name,

                category || "General",

                Number(price),

                Number(stock),

                description || "",

                image || ""

            );


        const newProduct =
            db
                .prepare(`
                    SELECT *
                    FROM products
                    WHERE id = ?
                `)
                .get(result.lastInsertRowid);


        res.status(201).json({

            success: true,

            message:
                "Product added successfully.",

            product:
                newProduct

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message:
                "Failed to add product."

        });

    }

});


// =====================================
// UPDATE PRODUCT
// =====================================

router.put("/:id", (req, res) => {

    try {

        const id =
            Number(req.params.id);


        const existingProduct =
            db
                .prepare(`
                    SELECT *
                    FROM products
                    WHERE id = ?
                `)
                .get(id);


        if (!existingProduct) {

            return res.status(404).json({

                success: false,

                message:
                    "Product not found."

            });

        }


        const {

            name,
            category,
            price,
            stock,
            description,
            image

        } = req.body;


        const updatedName =
            name !== undefined
                ? name
                : existingProduct.name;


        const updatedCategory =
            category !== undefined
                ? category
                : existingProduct.category;


        const updatedPrice =
            price !== undefined
                ? Number(price)
                : existingProduct.price;


        const updatedStock =
            stock !== undefined
                ? Number(stock)
                : existingProduct.stock;


        const updatedDescription =
            description !== undefined
                ? description
                : existingProduct.description;


        const updatedImage =
            image !== undefined
                ? image
                : existingProduct.image;


        db.prepare(`
            UPDATE products

            SET
                name = ?,
                category = ?,
                price = ?,
                stock = ?,
                description = ?,
                image = ?

            WHERE id = ?
        `).run(

            updatedName,

            updatedCategory,

            updatedPrice,

            updatedStock,

            updatedDescription,

            updatedImage,

            id

        );


        const updatedProduct =
            db
                .prepare(`
                    SELECT *
                    FROM products
                    WHERE id = ?
                `)
                .get(id);


        res.json({

            success: true,

            message:
                "Product updated successfully.",

            product:
                updatedProduct

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message:
                "Failed to update product."

        });

    }

});


// =====================================
// DELETE PRODUCT
// =====================================

router.delete("/:id", (req, res) => {

    try {

        const id =
            Number(req.params.id);


        const product =
            db
                .prepare(`
                    SELECT *
                    FROM products
                    WHERE id = ?
                `)
                .get(id);


        if (!product) {

            return res.status(404).json({

                success: false,

                message:
                    "Product not found."

            });

        }


        db.prepare(`
            DELETE FROM products
            WHERE id = ?
        `).run(id);


        res.json({

            success: true,

            message:
                "Product deleted successfully.",

            product:
                product

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message:
                "Failed to delete product."

        });

    }

});


module.exports = router;