// =====================================
// MAKENIMART CUSTOMER AUTHENTICATION
// =====================================


// =====================================
// CHECK CUSTOMER LOGIN
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
// PROTECT CUSTOMER PAGE
// =====================================

function requireCustomerLogin() {

    if (!isCustomerLoggedIn()) {

        alert(
            "Please create an account or login before viewing MakeniMart."
        );

        window.location.href =
            "customer-login.html";

        return false;

    }

    return true;

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
        "customer-login.html";

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


    // =================================
    // CUSTOMER LOGGED IN
    // =================================

    if (loggedIn) {

        const customer =
            getCustomer();


        const customerName =
            customer &&
            customer.fullName
                ? customer.fullName
                : "Customer";


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
                <a
                    href="#"
                    id="customerLogout"
                >
                    Logout
                </a>
            </li>

        `;


        const logoutButton =
            document.getElementById(
                "customerLogout"
            );


        if (logoutButton) {

            logoutButton.addEventListener(
                "click",
                function(event) {

                    event.preventDefault();

                    customerLogout();

                }
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

        updateCustomerNavigation();

    }
);