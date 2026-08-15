// =====================================
// MAKENIMART ORDER TRACKING
// =====================================

const ORDERS_API_URL =
    "http://localhost:5000/api/orders";


// =====================================
// TRACKING FORM
// =====================================

const trackingForm =
    document.getElementById("trackingForm");


if (trackingForm) {

    trackingForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const orderId =
                document
                    .getElementById("orderId")
                    .value
                    .trim();

            const phone =
                document
                    .getElementById("phone")
                    .value
                    .trim();

            const errorMessage =
                document.getElementById(
                    "errorMessage"
                );

            const orderResult =
                document.getElementById(
                    "orderResult"
                );


            // =================================
            // CLEAR OLD RESULTS
            // =================================

            if (errorMessage) {

                errorMessage.style.display =
                    "none";

                errorMessage.textContent = "";

            }


            if (orderResult) {

                orderResult.style.display =
                    "none";

            }


            // =================================
            // VALIDATE
            // =================================

            if (!orderId || !phone) {

                showError(
                    "Please enter your Order ID and phone number."
                );

                return;

            }


            try {

                // =================================
                // LOAD ORDERS
                // =================================

                const response =
                    await fetch(
                        ORDERS_API_URL
                    );


                if (!response.ok) {

                    throw new Error(
                        "Server returned HTTP " +
                        response.status
                    );

                }


                const data =
                    await response.json();


                console.log(
                    "Orders received:",
                    data
                );


                if (!data.success) {

                    showError(
                        data.message ||
                        "Could not load orders."
                    );

                    return;

                }


                const orders =
                    Array.isArray(data.orders)
                        ? data.orders
                        : [];


                // =================================
                // NORMALIZE PHONE
                // =================================

                const enteredPhone =
                    normalizePhone(phone);


                // =================================
                // FIND ORDER
                // =================================

                const order =
                    orders.find(
                        function (item) {

                            const databasePhone =
                                normalizePhone(
                                    item.phone
                                );


                            const matchingId =
                                Number(item.id) ===
                                Number(orderId);


                            const matchingPhone =
                                databasePhone ===
                                enteredPhone;


                            console.log(
                                "Checking order:",
                                item.id,
                                "ID:",
                                matchingId,
                                "Phone:",
                                matchingPhone
                            );


                            return (
                                matchingId &&
                                matchingPhone
                            );

                        }
                    );


                // =================================
                // ORDER NOT FOUND
                // =================================

                if (!order) {

                    showError(
                        "Order not found. Please check your Order ID and phone number."
                    );

                    return;

                }


                // =================================
                // DISPLAY ORDER
                // =================================

                displayOrder(order);

            }


            catch (error) {

                console.error(
                    "TRACK ORDER ERROR:",
                    error
                );


                showError(
                    "Could not connect to MakeniMart server. Make sure the server is running."
                );

            }

        }
    );

}


// =====================================
// NORMALIZE PHONE
// =====================================

function normalizePhone(phone) {

    if (
        phone === null ||
        phone === undefined
    ) {

        return "";

    }


    return String(phone)
        .replace(/\D/g, "");

}


// =====================================
// DISPLAY ORDER
// =====================================

function displayOrder(order) {

    // =================================
    // BASIC INFORMATION
    // =================================

    setText(
        "resultOrderId",
        "#" + order.id
    );


    setText(
        "resultCustomer",
        order.customer_name || "-"
    );


    setText(
        "resultPhone",
        order.phone || "-"
    );


    setText(
        "resultAddress",
        order.address || "-"
    );


    // =================================
    // DELIVERY LOCATION
    // =================================

    const deliveryLocation =
        order.delivery_location ||
        order.address ||
        "-";


    setText(
        "resultDeliveryLocation",
        deliveryLocation
    );


    // =================================
    // PAYMENT
    // =================================

    setText(
        "resultPayment",
        formatPayment(
            order.payment_method
        )
    );


    // =================================
    // PRODUCTS TOTAL
    // =================================

    setText(
        "resultProductsTotal",
        formatMoney(
            order.products_total
        )
    );


    // =================================
    // DELIVERY FEE
    // =================================

    setText(
        "resultDeliveryFee",
        formatMoney(
            order.delivery_fee
        )
    );


    // =================================
    // GRAND TOTAL
    // =================================

    setText(
        "resultTotal",
        formatMoney(
            order.total
        )
    );


    // =================================
    // STATUS
    // =================================

    const statusElement =
        document.getElementById(
            "resultStatus"
        );


    if (statusElement) {

        const status =
            order.status ||
            "Pending";


        statusElement.textContent =
            status;


        statusElement.className =
            "status";


        const statusLower =
            status.toLowerCase();


        if (
            statusLower ===
            "processing"
        ) {

            statusElement.classList.add(
                "processing"
            );

        }


        else if (
            statusLower ===
            "delivered"
        ) {

            statusElement.classList.add(
                "delivered"
            );

        }


        else if (
            statusLower ===
            "cancelled"
        ) {

            statusElement.classList.add(
                "cancelled"
            );

        }


        else {

            statusElement.classList.add(
                "pending"
            );

        }

    }


    // =================================
    // DATE
    // =================================

    setText(
        "resultDate",
        formatDate(
            order.created_at
        )
    );


    // =================================
    // DISPLAY ORDER ITEMS
    // =================================

    displayOrderItems(order);


    // =================================
    // SHOW RESULT
    // =================================

    const orderResult =
        document.getElementById(
            "orderResult"
        );


    if (orderResult) {

        orderResult.style.display =
            "block";

        orderResult.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

}


// =====================================
// DISPLAY ORDER PRODUCTS
// =====================================

function displayOrderItems(order) {

    /*
        Your orders API returns:

        order.items

        Each item contains:

        product_id
        product_name
        quantity
        price
    */


    const items =
        Array.isArray(order.items)
            ? order.items
            : [];


    // =================================
    // FIND ITEMS CONTAINER
    // =================================

    let container =
        document.getElementById(
            "orderItems"
        );


    /*
        If your HTML already contains
        #orderItems, use it.

        Otherwise the function will
        create the container automatically.
    */


    if (!container) {

        const orderResult =
            document.getElementById(
                "orderResult"
            );


        if (!orderResult) {

            return;

        }


        container =
            document.createElement(
                "div"
            );


        container.id =
            "orderItems";


        container.className =
            "order-items";


        orderResult.appendChild(
            container
        );

    }


    // =================================
    // NO ITEMS
    // =================================

    if (items.length === 0) {

        container.innerHTML = `

            <div class="order-items-empty">

                <p>
                    No product details available for this order.
                </p>

            </div>

        `;

        return;

    }


    // =================================
    // CREATE ITEMS
    // =================================

    let html = `

        <div class="order-items-title">

            Products Ordered

        </div>

    `;


    items.forEach(
        function (item) {

            const productName =
                item.product_name ||
                "Product";


            const quantity =
                Number(
                    item.quantity
                ) || 0;


            const price =
                Number(
                    item.price
                ) || 0;


            const subtotal =
                quantity * price;


            html += `

                <div class="tracking-order-item">

                    <div class="tracking-item-info">

                        <div class="tracking-item-name">

                            ${escapeHTML(
                                productName
                            )}

                        </div>

                        <div class="tracking-item-details">

                            Quantity:
                            ${quantity}

                            ×

                            ${formatMoney(
                                price
                            )}

                        </div>

                    </div>


                    <div class="tracking-item-total">

                        ${formatMoney(
                            subtotal
                        )}

                    </div>

                </div>

            `;

        }
    );


    container.innerHTML =
        html;

}


// =====================================
// SET TEXT SAFELY
// =====================================

function setText(
    elementId,
    value
) {

    const element =
        document.getElementById(
            elementId
        );


    if (element) {

        element.textContent =
            value;

    }

}


// =====================================
// FORMAT MONEY
// =====================================

function formatMoney(amount) {

    const value =
        Number(amount) || 0;


    return "NLe " +
        value.toLocaleString(
            "en-SL",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

}


// =====================================
// PAYMENT FORMAT
// =====================================

function formatPayment(payment) {

    if (!payment) {

        return "Not specified";

    }


    const value =
        String(payment)
            .trim()
            .toLowerCase();


    if (
        value ===
        "mobile-money"
    ) {

        return "Mobile Money";

    }


    if (
        value ===
        "cash"
    ) {

        return "Cash on Delivery";

    }


    if (
        value ===
        "cash-on-delivery"
    ) {

        return "Cash on Delivery";

    }


    return payment;

}


// =====================================
// DATE FORMAT
// =====================================

function formatDate(dateValue) {

    if (!dateValue) {

        return "N/A";

    }


    const date =
        new Date(
            String(dateValue)
                .replace(" ", "T")
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return String(dateValue);

    }


    return date.toLocaleString(
        "en-SL",
        {
            dateStyle: "medium",
            timeStyle: "short"
        }
    );

}


// =====================================
// SHOW ERROR
// =====================================

function showError(errorText) {

    const errorMessage =
        document.getElementById(
            "errorMessage"
        );


    if (!errorMessage) {

        console.error(
            errorText
        );

        return;

    }


    errorMessage.textContent =
        errorText;


    errorMessage.style.display =
        "block";


    errorMessage.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


// =====================================
// ESCAPE HTML
// =====================================

function escapeHTML(value) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        String(
            value ?? ""
        );


    return div.innerHTML;

}