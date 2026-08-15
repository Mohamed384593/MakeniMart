// =====================================
// MAKENIMART CUSTOMER APP
// =====================================


// =====================================
// CUSTOMER LOGIN CHECK
// =====================================

function isCustomerLoggedIn() {

    return (
        localStorage.getItem(
            "makeniMartCustomerLoggedIn"
        ) === "true"
    );

}


// =====================================
// GET CUSTOMER INFORMATION
// =====================================

function getCustomer() {

    const customer =
        localStorage.getItem(
            "makeniMartCustomer"
        );

    if (!customer) {

        return null;

    }

    try {

        return JSON.parse(customer);

    } catch (error) {

        console.error(
            "CUSTOMER DATA ERROR:",
            error
        );

        return null;

    }

}


// =====================================
// CUSTOMER LOGOUT
// =====================================

function customerLogout() {

    localStorage.removeItem(
        "makeniMartCustomerLoggedIn"
    );

    localStorage.removeItem(
        "makeniMartCustomer"
    );

    window.location.href =
        "index.html";

}


// =====================================
// UPDATE NAVIGATION
// =====================================

function updateCustomerNavigation() {

    const navLinks =
        document.querySelector(
            ".nav-links"
        );


    if (!navLinks) {

        return;

    }


    const loggedIn =
        isCustomerLoggedIn();


    const customer =
        getCustomer();


    // =================================
    // CUSTOMER LOGGED IN
    // =================================

    if (loggedIn) {

        navLinks.innerHTML = `

            <li>
                <a href="index.html">
                    Home
                </a>
            </li>

            <li>
                <a href="products.html">
                    Products
                </a>
            </li>

            <li>
                <a href="cart.html">
                    Cart
                </a>
            </li>

            <li>
                <a href="account.html">
                    My Account
                </a>
            </li>

            <li>
                <a href="#" id="logoutLink">
                    Logout
                </a>
            </li>

        `;


        // ==============================
        // LOGOUT BUTTON
        // ==============================

        const logoutLink =
            document.getElementById(
                "logoutLink"
            );


        if (logoutLink) {

            logoutLink.addEventListener(
                "click",
                function(event) {

                    event.preventDefault();

                    customerLogout();

                }
            );

        }


        // ==============================
        // OPTIONAL CUSTOMER NAME
        // ==============================

        if (customer) {

            console.log(
                "Logged in customer:",
                customer
            );

        }

    }


    // =================================
    // CUSTOMER NOT LOGGED IN
    // =================================

    else {

        navLinks.innerHTML = `

            <li>
                <a href="index.html">
                    Home
                </a>
            </li>

            <li>
                <a href="products.html">
                    Products
                </a>
            </li>

            <li>
                <a href="cart.html">
                    Cart
                </a>
            </li>

            <li>
                <a href="customer-login.html">
                    Login
                </a>
            </li>

            <li>
                <a href="customer-register.html">
                    Create Account
                </a>
            </li>

        `;

    }

}


// =====================================
// PAGE READY
// =====================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        console.log(
            "MakeniMart customer app loaded."
        );

        updateCustomerNavigation();

    }
);