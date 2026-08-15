// =====================================
// MAKENIMART ORDERS ROUTES
// =====================================

const express = require("express");
const router = express.Router();
const db = require("../database");


// =====================================
// CREATE ORDER
// POST /api/orders
// =====================================

router.post("/", (req, res) => {

    try {

        const {
            customer,
            customerId,
            deliveryLocation,
            paymentMethod,
            products,
            productsTotal,
            deliveryFee,
            total
        } = req.body;


        // =====================================
        // VALIDATE CUSTOMER ID
        // =====================================

        const loggedInCustomerId =
            Number(customerId);


        if (
            !Number.isInteger(loggedInCustomerId) ||
            loggedInCustomerId <= 0
        ) {

            return res.status(401).json({

                success: false,

                message:
                    "Please login before placing an order."

            });

        }


        // =====================================
        // CHECK CUSTOMER ACCOUNT
        // =====================================

        const customerAccount =
            db.prepare(`

                SELECT
                    id,
                    full_name,
                    username,
                    phone,
                    email,
                    address

                FROM customers

                WHERE id = ?

            `).get(loggedInCustomerId);


        if (!customerAccount) {

            return res.status(401).json({

                success: false,

                message:
                    "Customer account not found. Please login again."

            });

        }


        // =====================================
        // VALIDATE CUSTOMER INFORMATION
        // =====================================

        if (
            !customer ||
            !customer.fullName ||
            !customer.phone ||
            !customer.address
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Customer information is required."

            });

        }


        // =====================================
        // VALIDATE PRODUCTS
        // =====================================

        if (
            !Array.isArray(products) ||
            products.length === 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Order must contain at least one product."

            });

        }


        // =====================================
        // CREATE ORDER TRANSACTION
        // =====================================

        const createOrder =
            db.transaction(() => {


                // =====================================
                // GET PRODUCT
                // =====================================

                const getProduct =
                    db.prepare(`

                        SELECT
                            id,
                            name,
                            price,
                            stock

                        FROM products

                        WHERE id = ?

                    `);


                // =====================================
                // CHECK STOCK
                // =====================================

                for (const product of products) {

                    const productId =
                        Number(product.id);

                    const quantity =
                        Number(product.quantity);


                    // =====================================
                    // VALIDATE PRODUCT ID
                    // =====================================

                    if (
                        !Number.isInteger(productId) ||
                        productId <= 0
                    ) {

                        throw new Error(
                            "A product is missing its database ID."
                        );

                    }


                    // =====================================
                    // VALIDATE QUANTITY
                    // =====================================

                    if (
                        !Number.isInteger(quantity) ||
                        quantity <= 0
                    ) {

                        throw new Error(
                            "Invalid product quantity."
                        );

                    }


                    // =====================================
                    // FIND PRODUCT
                    // =====================================

                    const databaseProduct =
                        getProduct.get(productId);


                    if (!databaseProduct) {

                        throw new Error(
                            `Product #${productId} was not found.`
                        );

                    }


                    // =====================================
                    // CHECK STOCK
                    // =====================================

                    const availableStock =
                        Number(databaseProduct.stock);


                    if (
                        availableStock < quantity
                    ) {

                        throw new Error(

                            `${databaseProduct.name} has only ${availableStock} item(s) in stock. You requested ${quantity}.`

                        );

                    }

                }


                // =====================================
                // CREATE ORDER
                // =====================================

                const orderResult =
                    db.prepare(`

                        INSERT INTO orders (

                            customer_id,

                            customer_name,

                            phone,

                            email,

                            address,

                            delivery_location,

                            payment_method,

                            products_total,

                            delivery_fee,

                            total,

                            status

                        )

                        VALUES (
                            ?,
                            ?,
                            ?,
                            ?,
                            ?,
                            ?,
                            ?,
                            ?,
                            ?,
                            ?,
                            ?
                        )

                    `).run(

                        loggedInCustomerId,

                        customer.fullName,

                        customer.phone,

                        customer.email || "",

                        customer.address,

                        deliveryLocation || "",

                        paymentMethod || "",

                        Number(productsTotal) || 0,

                        Number(deliveryFee) || 0,

                        Number(total) || 0,

                        "Pending"

                    );


                // =====================================
                // GET ORDER ID
                // =====================================

                const orderId =
                    Number(
                        orderResult.lastInsertRowid
                    );


                // =====================================
                // INSERT ORDER ITEMS
                // =====================================

                const insertItem =
                    db.prepare(`

                        INSERT INTO order_items (

                            order_id,

                            product_id,

                            quantity,

                            price

                        )

                        VALUES (?, ?, ?, ?)

                    `);


                // =====================================
                // UPDATE PRODUCT STOCK
                // =====================================

                const updateStock =
                    db.prepare(`

                        UPDATE products

                        SET stock = stock - ?

                        WHERE id = ?

                    `);


                // =====================================
                // SAVE ORDER ITEMS
                // =====================================

                for (const product of products) {

                    const productId =
                        Number(product.id);

                    const quantity =
                        Number(product.quantity);

                    const price =
                        Number(product.price) || 0;


                    insertItem.run(

                        orderId,

                        productId,

                        quantity,

                        price

                    );


                    updateStock.run(

                        quantity,

                        productId

                    );

                }


                // =====================================
                // CREATE ORDER NOTIFICATION
                // =====================================

                db.prepare(`

                    INSERT INTO order_notifications (

                        order_id,

                        message,

                        is_read

                    )

                    VALUES (?, ?, 0)

                `).run(

                    orderId,

                    `New order #${orderId} received.`

                );


                console.log(

                    `🔔 Order notification created for order #${orderId}`

                );


                return orderId;

            });


        // =====================================
        // RUN TRANSACTION
        // =====================================

        const orderId =
            createOrder();


        // =====================================
        // SUCCESS LOG
        // =====================================

        console.log(

            `Order #${orderId} created for customer #${loggedInCustomerId}`

        );


        // =====================================
        // SEND RESPONSE
        // =====================================

        res.status(201).json({

            success: true,

            message:
                "Order created successfully.",

            orderId:
                Number(orderId),

            customerId:
                loggedInCustomerId

        });


    } catch (error) {

        console.error(

            "CREATE ORDER ERROR:",

            error

        );


        // =====================================
        // EXPECTED ORDER ERRORS
        // =====================================

        if (
            error.message &&
            (
                error.message.includes("stock") ||
                error.message.includes("in stock") ||
                error.message.includes("was not found") ||
                error.message.includes("quantity") ||
                error.message.includes("database ID")
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    error.message

            });

        }


        // =====================================
        // SERVER ERROR
        // =====================================

        res.status(500).json({

            success: false,

            message:
                "Could not create order.",

            error:
                error.message

        });

    }

});


// =====================================
// GET ALL ORDERS
// ADMIN
// GET /api/orders
// =====================================

router.get("/", (req, res) => {

    try {

        const orders =
            db.prepare(`

                SELECT *

                FROM orders

                ORDER BY created_at DESC

            `).all();


        // =====================================
        // GET ORDER ITEMS
        // =====================================

        const getItems =
            db.prepare(`

                SELECT

                    oi.id,

                    oi.product_id,

                    oi.quantity,

                    oi.price,

                    p.name AS product_name

                FROM order_items oi

                LEFT JOIN products p
                    ON p.id = oi.product_id

                WHERE oi.order_id = ?

                ORDER BY oi.id ASC

            `);


        // =====================================
        // ADD ITEMS TO EACH ORDER
        // =====================================

        const ordersWithItems =
            orders.map(function(order) {

                const items =
                    getItems.all(order.id);


                return {

                    ...order,

                    items: items

                };

            });


        // =====================================
        // RESPONSE
        // =====================================

        res.json({

            success: true,

            count:
                ordersWithItems.length,

            orders:
                ordersWithItems

        });


    } catch (error) {

        console.error(

            "GET ORDERS ERROR:",

            error

        );


        res.status(500).json({

            success: false,

            message:
                "Could not load orders.",

            error:
                error.message

        });

    }

});


// =====================================
// GET CUSTOMER ORDERS
// GET /api/orders/customer/:customerId
// =====================================

router.get(
    "/customer/:customerId",
    (req, res) => {

        try {

            const customerId =
                Number(
                    req.params.customerId
                );


            // =====================================
            // VALIDATE CUSTOMER ID
            // =====================================

            if (
                !Number.isInteger(customerId) ||
                customerId <= 0
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid customer ID."

                });

            }


            // =====================================
            // CHECK CUSTOMER
            // =====================================

            const customer =
                db.prepare(`

                    SELECT

                        id,

                        full_name,

                        username,

                        phone,

                        email,

                        address

                    FROM customers

                    WHERE id = ?

                `).get(customerId);


            if (!customer) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Customer not found."

                });

            }


            // =====================================
            // GET CUSTOMER ORDERS
            // =====================================

            const orders =
                db.prepare(`

                    SELECT *

                    FROM orders

                    WHERE customer_id = ?

                    ORDER BY created_at DESC

                `).all(customerId);


            // =====================================
            // GET ITEMS
            // =====================================

            const getItems =
                db.prepare(`

                    SELECT

                        oi.id,

                        oi.product_id,

                        oi.quantity,

                        oi.price,

                        p.name AS product_name

                    FROM order_items oi

                    LEFT JOIN products p

                        ON p.id = oi.product_id

                    WHERE oi.order_id = ?

                    ORDER BY oi.id ASC

                `);


            // =====================================
            // ADD ITEMS
            // =====================================

            const ordersWithItems =
                orders.map(function(order) {

                    return {

                        ...order,

                        items:
                            getItems.all(order.id)

                    };

                });


            // =====================================
            // RESPONSE
            // =====================================

            res.json({

                success: true,

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

                },

                count:
                    ordersWithItems.length,

                orders:
                    ordersWithItems

            });


        } catch (error) {

            console.error(

                "GET CUSTOMER ORDERS ERROR:",

                error

            );


            res.status(500).json({

                success: false,

                message:
                    "Could not load customer orders.",

                error:
                    error.message

            });

        }

    }
);


// =====================================
// GET ALL ORDER NOTIFICATIONS
// GET /api/orders/notifications
// =====================================

router.get(
    "/notifications",
    (req, res) => {

        try {

            const notifications =
                db.prepare(`

                    SELECT

                        id,

                        order_id,

                        message,

                        is_read,

                        created_at

                    FROM order_notifications

                    ORDER BY created_at DESC

                `).all();


            res.json({

                success: true,

                count:
                    notifications.length,

                notifications:
                    notifications

            });


        } catch (error) {

            console.error(

                "GET NOTIFICATIONS ERROR:",

                error

            );


            res.status(500).json({

                success: false,

                message:
                    "Could not load notifications.",

                error:
                    error.message

            });

        }

    }
);


// =====================================
// GET UNREAD NOTIFICATIONS
// GET /api/orders/notifications/unread
// =====================================

router.get(
    "/notifications/unread",
    (req, res) => {

        try {

            const notifications =
                db.prepare(`

                    SELECT

                        id,

                        order_id,

                        message,

                        is_read,

                        created_at

                    FROM order_notifications

                    WHERE is_read = 0

                    ORDER BY created_at DESC

                `).all();


            res.json({

                success: true,

                count:
                    notifications.length,

                notifications:
                    notifications

            });


        } catch (error) {

            console.error(

                "GET UNREAD NOTIFICATIONS ERROR:",

                error

            );


            res.status(500).json({

                success: false,

                message:
                    "Could not load unread notifications.",

                error:
                    error.message

            });

        }

    }
);


// =====================================
// MARK NOTIFICATION AS READ
// PUT /api/orders/notifications/:id/read
// =====================================

router.put(
    "/notifications/:id/read",
    (req, res) => {

        try {

            const notificationId =
                Number(
                    req.params.id
                );


            // =====================================
            // VALIDATE ID
            // =====================================

            if (
                !Number.isInteger(notificationId) ||
                notificationId <= 0
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid notification ID."

                });

            }


            // =====================================
            // CHECK NOTIFICATION
            // =====================================

            const notification =
                db.prepare(`

                    SELECT id

                    FROM order_notifications

                    WHERE id = ?

                `).get(notificationId);


            if (!notification) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Notification not found."

                });

            }


            // =====================================
            // MARK AS READ
            // =====================================

            db.prepare(`

                UPDATE order_notifications

                SET is_read = 1

                WHERE id = ?

            `).run(notificationId);


            res.json({

                success: true,

                message:
                    "Notification marked as read.",

                notificationId:
                    notificationId

            });


        } catch (error) {

            console.error(

                "MARK NOTIFICATION READ ERROR:",

                error

            );


            res.status(500).json({

                success: false,

                message:
                    "Could not update notification.",

                error:
                    error.message

            });

        }

    }
);


// =====================================
// DELETE NOTIFICATION
// DELETE /api/orders/notifications/:id
// =====================================

router.delete(
    "/notifications/:id",
    (req, res) => {

        try {

            const notificationId =
                Number(
                    req.params.id
                );


            // =====================================
            // VALIDATE ID
            // =====================================

            if (
                !Number.isInteger(notificationId) ||
                notificationId <= 0
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid notification ID."

                });

            }


            // =====================================
            // CHECK NOTIFICATION
            // =====================================

            const notification =
                db.prepare(`

                    SELECT id

                    FROM order_notifications

                    WHERE id = ?

                `).get(notificationId);


            if (!notification) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Notification not found."

                });

            }


            // =====================================
            // DELETE
            // =====================================

            db.prepare(`

                DELETE FROM order_notifications

                WHERE id = ?

            `).run(notificationId);


            console.log(

                `🗑 Notification #${notificationId} deleted.`

            );


            res.json({

                success: true,

                message:
                    "Notification deleted successfully.",

                notificationId:
                    notificationId

            });


        } catch (error) {

            console.error(

                "DELETE NOTIFICATION ERROR:",

                error

            );


            res.status(500).json({

                success: false,

                message:
                    "Could not delete notification.",

                error:
                    error.message

            });

        }

    }
);


// =====================================
// UPDATE ORDER STATUS
// PUT /api/orders/:id/status
// =====================================

router.put(
    "/:id/status",
    (req, res) => {

        try {

            const orderId =
                Number(
                    req.params.id
                );


            const {
                status
            } = req.body;


            // =====================================
            // VALIDATE ORDER ID
            // =====================================

            if (
                !Number.isInteger(orderId) ||
                orderId <= 0
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid order ID."

                });

            }


            // =====================================
            // ALLOWED STATUSES
            // =====================================

            const allowedStatuses = [

                "Pending",

                "Processing",

                "Delivered",

                "Cancelled"

            ];


            if (
                !allowedStatuses.includes(status)
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid order status."

                });

            }


            // =====================================
            // CHECK ORDER
            // =====================================

            const existingOrder =
                db.prepare(`

                    SELECT id

                    FROM orders

                    WHERE id = ?

                `).get(orderId);


            if (!existingOrder) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Order not found."

                });

            }


            // =====================================
            // UPDATE STATUS
            // =====================================

            db.prepare(`

                UPDATE orders

                SET status = ?

                WHERE id = ?

            `).run(

                status,

                orderId

            );


            console.log(

                `Order #${orderId} status changed to ${status}`

            );


            res.json({

                success: true,

                message:
                    "Order status updated successfully.",

                orderId:
                    orderId,

                status:
                    status

            });


        } catch (error) {

            console.error(

                "UPDATE ORDER STATUS ERROR:",

                error

            );


            res.status(500).json({

                success: false,

                message:
                    "Could not update order status.",

                error:
                    error.message

            });

        }

    }
);


// =====================================
// DELETE ORDER
// DELETE /api/orders/:id
// =====================================

router.delete(
    "/:id",
    (req, res) => {

        try {

            const orderId =
                Number(
                    req.params.id
                );


            // =====================================
            // VALIDATE ORDER ID
            // =====================================

            if (
                !Number.isInteger(orderId) ||
                orderId <= 0
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid order ID."

                });

            }


            // =====================================
            // DELETE ORDER TRANSACTION
            // =====================================

            const deleteOrder =
                db.transaction(() => {


                    // =====================================
                    // CHECK ORDER
                    // =====================================

                    const order =
                        db.prepare(`

                            SELECT id

                            FROM orders

                            WHERE id = ?

                        `).get(orderId);


                    if (!order) {

                        throw new Error(
                            "ORDER_NOT_FOUND"
                        );

                    }


                    // =====================================
                    // GET ORDER ITEMS
                    // =====================================

                    const items =
                        db.prepare(`

                            SELECT

                                product_id,

                                quantity

                            FROM order_items

                            WHERE order_id = ?

                        `).all(orderId);


                    // =====================================
                    // RESTORE STOCK
                    // =====================================

                    const restoreStock =
                        db.prepare(`

                            UPDATE products

                            SET stock = stock + ?

                            WHERE id = ?

                        `);


                    for (const item of items) {

                        restoreStock.run(

                            Number(item.quantity) || 0,

                            Number(item.product_id)

                        );

                    }


                    // =====================================
                    // DELETE ORDER ITEMS
                    // =====================================

                    db.prepare(`

                        DELETE FROM order_items

                        WHERE order_id = ?

                    `).run(orderId);


                    // =====================================
                    // DELETE NOTIFICATIONS
                    // =====================================

                    db.prepare(`

                        DELETE FROM order_notifications

                        WHERE order_id = ?

                    `).run(orderId);


                    // =====================================
                    // DELETE ORDER
                    // =====================================

                    db.prepare(`

                        DELETE FROM orders

                        WHERE id = ?

                    `).run(orderId);


                    // =====================================
                    // CHECK REMAINING ORDERS
                    // =====================================

                    const remainingOrders =
                        db.prepare(`

                            SELECT COUNT(*) AS count

                            FROM orders

                        `).get();


                    // =====================================
                    // RESET ORDER NUMBER
                    // =====================================

                    if (
                        Number(
                            remainingOrders.count
                        ) === 0
                    ) {

                        db.prepare(`

                            DELETE FROM sqlite_sequence

                            WHERE name = 'orders'

                        `).run();


                        console.log(

                            "🔄 All orders deleted. Order numbering reset to #1."

                        );

                    }

                });


            // =====================================
            // RUN DELETE
            // =====================================

            deleteOrder();


            console.log(

                `🗑 Order #${orderId} deleted successfully.`

            );


            // =====================================
            // RESPONSE
            // =====================================

            res.json({

                success: true,

                message:
                    `Order #${orderId} deleted successfully.`,

                orderId:
                    orderId

            });


        } catch (error) {

            console.error(

                "DELETE ORDER ERROR:",

                error

            );


            // =====================================
            // ORDER NOT FOUND
            // =====================================

            if (
                error.message ===
                "ORDER_NOT_FOUND"
            ) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Order not found."

                });

            }


            // =====================================
            // SERVER ERROR
            // =====================================

            res.status(500).json({

                success: false,

                message:
                    "Could not delete order.",

                error:
                    error.message

            });

        }

    }
);


// =====================================
// EXPORT ROUTER
// =====================================

module.exports = router;