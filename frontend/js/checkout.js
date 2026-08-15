// =====================================
// MAKENIMART CHECKOUT
// =====================================


// =====================================
// API
// =====================================

const ORDER_API_URL =
    "http://localhost:5000/api/orders";


// =====================================
// GET CART
// =====================================

function getCart() {

    const savedCart =
        localStorage.getItem(
            "makeniMartCart"
        );

    if (!savedCart) {

        return [];

    }

    try {

        return JSON.parse(
            savedCart
        );

    } catch (error) {

        console.error(
            "Could not read cart:",
            error
        );

        return [];

    }

}


// =====================================
// GET LOGGED-IN CUSTOMER
// =====================================

function getLoggedInCustomer() {

    const savedCustomer =
        localStorage.getItem(
            "makeniMartCustomer"
        );

    if (!savedCustomer) {

        return null;

    }

    try {

        return JSON.parse(
            savedCustomer
        );

    } catch (error) {

        console.error(
            "Could not read customer login:",
            error
        );

        return null;

    }

}


// =====================================
// CALCULATE PRODUCTS TOTAL
// =====================================

function calculateProductsTotal() {

    const cart =
        getCart();

    let total = 0;

    cart.forEach(function(item) {

        const price =
            Number(item.price) || 0;

        const quantity =
            Number(item.quantity) || 1;

        total +=
            price * quantity;

    });

    return total;

}


// =====================================
// GET DELIVERY FEE
// =====================================

function getDeliveryFee() {

    const location =
        document.getElementById(
            "deliveryLocation"
        );

    if (!location) {

        return 0;

    }


    // =================================
    // MAKEnI LOCATIONS
    // =================================

    const makeniLocations = [

        "Magburaka Road",

        "Teko Road",

        "Rogbaneh Road",

        "Freetown Highway",

        "Kabala Highway",

        "Azzolini Highway",

        "Station Road",

        "Kamal Street",

        "Pain Street",

        "Mummy Street",

        "Compound Street",

        "Upper John Street",

        "Upper Banana Street",

        "Wusu Street",

        "Conteh Street",

        "Manethe Street",

        "Sesay Street",

        "Soldier Street",

        "Sabu Street",

        "Ayv Drive",

        "Yiks Lane",

        "Hospital Road",

        "Kath Hill Road",

        "Ring Road",

        "Azzolini Lane",

        "Central Mosque Way",

        "Market Street",

        "Boima Street",

        "Koroma Lane",

        "Lunsar Street"

    ];


    // =================================
    // MAKEnI DELIVERY
    // =================================

    if (
        makeniLocations.includes(
            location.value
        )
    ) {

        return 30;

    }


    // =================================
    // OUTSIDE MAKENI
    // =================================

    if (
        location.value ===
        "outside-makeni"
    ) {

        return 60;

    }


    // =================================
    // DEFAULT
    // =================================

    return 0;

}

// =====================================
// UPDATE CHECKOUT SUMMARY
// =====================================

function updateCheckoutSummary() {

    const productsTotal =
        calculateProductsTotal();

    const deliveryFee =
        getDeliveryFee();

    const grandTotal =
        productsTotal +
        deliveryFee;


    // =================================
    // PRODUCTS TOTAL
    // =================================

    const productsElement =
        document.getElementById(
            "checkoutProducts"
        );

    if (productsElement) {

        productsElement.textContent =
            `NLe ${productsTotal.toFixed(2)}`;

    }


    // =================================
    // DELIVERY FEE
    // =================================

    const deliveryElement =
        document.getElementById(
            "checkoutDelivery"
        );

    if (deliveryElement) {

        deliveryElement.textContent =
            `NLe ${deliveryFee.toFixed(2)}`;

    }


    // =================================
    // GRAND TOTAL
    // =================================

    const totalElement =
        document.getElementById(
            "checkoutTotal"
        );

    if (totalElement) {

        totalElement.textContent =
            `NLe ${grandTotal.toFixed(2)}`;

    }

}


// =====================================
// SUBMIT ORDER TO DATABASE
// =====================================

async function submitOrder() {


    // =================================
    // GET CART
    // =================================

    const cart =
        getCart();


    // =================================
    // CHECK CART
    // =================================

    if (cart.length === 0) {

        alert(
            "Your cart is empty."
        );

        return;

    }


    // =================================
    // GET LOGGED-IN CUSTOMER
    // =================================

    const loggedInCustomer =
        getLoggedInCustomer();


    if (!loggedInCustomer) {

        alert(
            "Please login before placing an order."
        );

        window.location.href =
            "customer-login.html";

        return;

    }


    // =================================
    // GET CUSTOMER ID
    // =================================

    const customerId =
        Number(
            loggedInCustomer.id
        );


    console.log(
        "Logged-in customer:",
        loggedInCustomer
    );


    console.log(
        "Logged-in customer ID:",
        customerId
    );


    // =================================
    // VALIDATE CUSTOMER ID
    // =================================

    if (
        !Number.isInteger(customerId) ||
        customerId <= 0
    ) {

        console.error(
            "Invalid customer ID:",
            loggedInCustomer
        );


        alert(
            "Your customer login is invalid. Please login again."
        );


        localStorage.removeItem(
            "makeniMartCustomer"
        );


        localStorage.removeItem(
            "makeniMartCustomerLoggedIn"
        );


        window.location.href =
            "customer-login.html";


        return;

    }


    // =================================
    // GET CUSTOMER INFORMATION
    // =================================

    const fullName =
        document.getElementById(
            "fullName"
        ).value.trim();


    const phone =
        document.getElementById(
            "phone"
        ).value.trim();


    const email =
        document.getElementById(
            "email"
        ).value.trim();


    const address =
        document.getElementById(
            "address"
        ).value.trim();


    const deliveryLocation =
        document.getElementById(
            "deliveryLocation"
        ).value;


    const paymentMethod =
        document.getElementById(
            "payment"
        ).value;


    // =================================
    // VALIDATE FORM
    // =================================

    if (
        !fullName ||
        !phone ||
        !email ||
        !address ||
        !deliveryLocation ||
        !paymentMethod
    ) {

        alert(
            "Please complete all required fields."
        );

        return;

    }


    // =================================
    // CALCULATE TOTALS
    // =================================

    const productsTotal =
        calculateProductsTotal();


    const deliveryFee =
        getDeliveryFee();


    const total =
        productsTotal +
        deliveryFee;


    // =================================
    // PREPARE PRODUCTS
    // =================================

    const orderProducts =
        cart.map(function(item) {

            return {

                id:
                    Number(item.id),

                quantity:
                    Number(item.quantity),

                price:
                    Number(item.price) || 0

            };

        });


    // =================================
    // VALIDATE PRODUCT IDS
    // =================================

    for (
        const product of orderProducts
    ) {

        if (
            !Number.isInteger(
                product.id
            ) ||
            product.id <= 0
        ) {

            console.error(
                "Invalid product:",
                product
            );


            alert(
                "One of the products in your cart has an invalid database ID. Please remove it from your cart and add it again."
            );


            return;

        }


        if (
            !Number.isInteger(
                product.quantity
            ) ||
            product.quantity <= 0
        ) {

            console.error(
                "Invalid product quantity:",
                product
            );


            alert(
                "One of the products has an invalid quantity."
            );


            return;

        }

    }


    // =================================
    // CREATE ORDER DATA
    // =================================

    const orderData = {

        // Customer database ID
        customerId:
            customerId,


        // Customer information
        customer: {

            fullName:
                fullName,

            phone:
                phone,

            email:
                email,

            address:
                address

        },


        // Delivery
        deliveryLocation:
            deliveryLocation,


        // Payment
        paymentMethod:
            paymentMethod,


        // Products
        products:
            orderProducts,


        // Totals
        productsTotal:
            productsTotal,

        deliveryFee:
            deliveryFee,

        total:
            total

    };


    // =================================
    // DEBUG ORDER
    // =================================

    console.log(
        "====================================="
    );

    console.log(
        "Sending order:"
    );

    console.log(
        orderData
    );

    console.log(
        "Customer ID:",
        orderData.customerId
    );

    console.log(
        "Products:",
        orderData.products
    );

    console.log(
        "Products total:",
        orderData.productsTotal
    );

    console.log(
        "Delivery fee:",
        orderData.deliveryFee
    );

    console.log(
        "Total:",
        orderData.total
    );

    console.log(
        "====================================="
    );


    // =================================
    // SEND ORDER TO NODE.JS
    // =================================

    try {

        const response =
            await fetch(
                ORDER_API_URL,
                {

                    method:
                        "POST",


                    headers: {

                        "Content-Type":
                            "application/json"

                    },


                    body:
                        JSON.stringify(
                            orderData
                        )

                }
            );


        // =================================
        // READ API RESPONSE
        // =================================

        const data =
            await response.json();


        console.log(
            "API response:",
            data
        );


        // =================================
        // CHECK RESPONSE
        // =================================

        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(

                data.message ||
                "Could not place order."

            );

        }


        // =================================
        // ORDER SUCCESS
        // =================================

        console.log(
            "Order created successfully."
        );


        console.log(
            "Order ID:",
            data.orderId
        );


        console.log(
            "Customer ID:",
            data.customerId
        );


        // =================================
        // SAVE LAST ORDER ID
        // =================================

        localStorage.setItem(

            "makeniMartLastOrderId",

            data.orderId

        );


        // =================================
        // CLEAR CART
        // =================================

        localStorage.removeItem(
            "makeniMartCart"
        );


        // =================================
        // GO TO SUCCESS PAGE
        // =================================

        window.location.href =
            "order-success.html";


    } catch (error) {

        // =================================
        // ORDER ERROR
        // =================================

        console.error(
            "Order error:",
            error
        );


        alert(

            "Could not place the order. " +
            error.message

        );

    }

}


// =====================================
// START CHECKOUT
// =====================================

document.addEventListener(

    "DOMContentLoaded",

    function() {


        // =================================
        // GET CART
        // =================================

        const cart =
            getCart();


        // =================================
        // CHECK CART
        // =================================

        if (
            cart.length === 0
        ) {

            alert(
                "Your cart is empty."
            );


            window.location.href =
                "products.html";


            return;

        }


        // =================================
        // CHECK CUSTOMER LOGIN
        // =================================

        const loggedInCustomer =
            getLoggedInCustomer();


        if (
            !loggedInCustomer
        ) {

            alert(
                "Please login before checkout."
            );


            window.location.href =
                "customer-login.html";


            return;

        }


        // =================================
        // CHECK CUSTOMER ID
        // =================================

        const customerId =
            Number(
                loggedInCustomer.id
            );


        if (
            !Number.isInteger(
                customerId
            ) ||
            customerId <= 0
        ) {

            console.error(
                "Invalid logged-in customer:",
                loggedInCustomer
            );


            alert(
                "Your customer session is invalid. Please login again."
            );


            localStorage.removeItem(
                "makeniMartCustomer"
            );


            localStorage.removeItem(
                "makeniMartCustomerLoggedIn"
            );


            window.location.href =
                "customer-login.html";


            return;

        }


        console.log(
            "Checkout customer ID:",
            customerId
        );


        // =================================
        // DELIVERY SELECTION
        // =================================

        const deliveryLocation =
            document.getElementById(
                "deliveryLocation"
            );


        if (
            deliveryLocation
        ) {

            deliveryLocation.addEventListener(

                "change",

                updateCheckoutSummary

            );

        }


        // =================================
        // CHECKOUT FORM
        // =================================

        const form =
            document.getElementById(
                "checkoutForm"
            );


        if (
            form
        ) {

            form.addEventListener(

                "submit",

                function(event) {

                    event.preventDefault();


                    submitOrder();

                }

            );

        }


        // =================================
        // INITIAL SUMMARY
        // =================================

        updateCheckoutSummary();

    }

);