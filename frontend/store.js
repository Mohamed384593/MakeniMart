const API_URL =
    "http://localhost:5000/api/products";


// =====================================
// PRODUCTS
// =====================================

let products = [];

let selectedCategory = "All";

let cart = [];


// =====================================
// LOAD PRODUCTS
// =====================================

async function loadProducts() {

    try {

        const response =
            await fetch(API_URL);


        const data =
            await response.json();


        console.log(
            "Store products:",
            data
        );


        if (!data.success) {

            showMessage(
                "Could not load products."
            );

            return;

        }


        products =
            data.products;


        createCategories();


        displayProducts();


    } catch (error) {

        console.error(
            "STORE ERROR:",
            error
        );


        showMessage(
            "Cannot connect to MakeniMart server."
        );

    }

}


// =====================================
// DISPLAY PRODUCTS
// =====================================

function displayProducts() {

    const grid =
        document.getElementById(
            "productsGrid"
        );


    const search =
        document
            .getElementById(
                "searchInput"
            )
            .value
            .toLowerCase()
            .trim();


    let filteredProducts =
        products.filter(
            function(product) {

                const matchesCategory =
                    selectedCategory === "All" ||
                    product.category ===
                        selectedCategory;


                const matchesSearch =
                    product.name
                        .toLowerCase()
                        .includes(search);


                return (
                    matchesCategory &&
                    matchesSearch
                );

            }
        );


    grid.innerHTML = "";


    if (
        filteredProducts.length === 0
    ) {

        showMessage(
            "No products found."
        );

        return;

    }


    filteredProducts.forEach(
        function(product) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "product-card";


            const imageHTML =
                product.image
                    ? `
                        <img
                            src="${product.image}"
                            alt="${product.name}"
                        >
                    `
                    : `
                        <div class="no-image">
                            No image
                        </div>
                    `;


            const isOutOfStock =
                Number(product.stock) <= 0;


            card.innerHTML = `

                <div class="product-image">

                    ${imageHTML}

                </div>


                <div class="product-info">

                    <h3>
                        ${product.name}
                    </h3>


                    <div class="category">

                        ${product.category}

                    </div>


                    <div class="description">

                        ${
                            product.description ||
                            "No description available."
                        }

                    </div>


                    <div class="price">

                        NLe
                        ${Number(
                            product.price
                        ).toFixed(2)}

                    </div>


                    <div class="stock">

                        ${
                            isOutOfStock
                                ? "Out of stock"
                                : `${product.stock} available`
                        }

                    </div>


                    <button
                        class="add-cart"
                        onclick="addToCart(${product.id})"
                        ${
                            isOutOfStock
                                ? "disabled"
                                : ""
                        }
                    >

                        ${
                            isOutOfStock
                                ? "Out of Stock"
                                : "Add to Cart"
                        }

                    </button>

                </div>

            `;


            grid.appendChild(card);

        }
    );

}


// =====================================
// CREATE CATEGORIES
// =====================================

function createCategories() {

    const container =
        document.getElementById(
            "categories"
        );


    const categories =
        [
            ...new Set(
                products.map(
                    product =>
                        product.category
                )
            )
        ];


    container.innerHTML = `

        <button
            class="category-button active"
            data-category="All"
            onclick="selectCategory('All')"
        >
            All
        </button>

    `;


    categories.forEach(
        function(category) {

            const button =
                document.createElement(
                    "button"
                );


            button.className =
                "category-button";


            button.textContent =
                category;


            button.onclick =
                function() {

                    selectCategory(
                        category
                    );

                };


            container.appendChild(
                button
            );

        }
    );

}


// =====================================
// SELECT CATEGORY
// =====================================

function selectCategory(category) {

    selectedCategory =
        category;


    const buttons =
        document.querySelectorAll(
            ".category-button"
        );


    buttons.forEach(
        function(button) {

            button.classList.remove(
                "active"
            );


            if (
                button.dataset.category ===
                category
            ) {

                button.classList.add(
                    "active"
                );

            }

        }
    );


    displayProducts();

}


// =====================================
// SEARCH
// =====================================

document
    .getElementById("searchInput")
    .addEventListener(
        "input",
        function() {

            displayProducts();

        }
    );


// =====================================
// ADD TO CART
// =====================================

function addToCart(productId) {

    const product =
        products.find(
            item =>
                item.id === productId
        );


    if (!product) {

        return;

    }


    const existing =
        cart.find(
            item =>
                item.id === productId
        );


    if (existing) {

        if (
            existing.quantity <
            Number(product.stock)
        ) {

            existing.quantity++;

        } else {

            alert(
                "You cannot add more than the available stock."
            );

            return;

        }

    } else {

        cart.push({

            id:
                product.id,

            name:
                product.name,

            price:
                Number(product.price),

            quantity:
                1

        });

    }


    updateCartCount();


    alert(
        `${product.name} added to cart!`
    );

}


// =====================================
// CART COUNT
// =====================================

function updateCartCount() {

    const count =
        cart.reduce(
            function(total, item) {

                return total +
                    item.quantity;

            },
            0
        );


    document.getElementById(
        "cartCount"
    ).textContent = count;

}


// =====================================
// OPEN CART
// =====================================

function openCart() {

    if (cart.length === 0) {

        alert(
            "Your cart is empty."
        );

        return;

    }


    let message =
        "YOUR CART\n\n";


    let total = 0;


    cart.forEach(
        function(item) {

            const subtotal =
                item.price *
                item.quantity;


            total += subtotal;


            message +=
                `${item.name} x ${item.quantity} = NLe ${subtotal.toFixed(2)}\n`;

        }
    );


    message +=
        `\nTotal: NLe ${total.toFixed(2)}`;


    alert(message);

}


// =====================================
// SHOW MESSAGE
// =====================================

function showMessage(message) {

    document.getElementById(
        "productsGrid"
    ).innerHTML = `

        <div class="message">

            ${message}

        </div>

    `;

}


// =====================================
// START STORE
// =====================================

loadProducts();